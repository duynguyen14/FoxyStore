package com.example.back.controllers;

import com.example.back.dto.response.APIResponse;
import com.example.back.service.OpenAiService;
import com.example.back.service.QdrantService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("${api.key}/openai")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OpenAiController {
    OpenAiService openAIService;
    QdrantService qdrantService;

    // Lưu trữ context của các session
    private final Map<String, ChatSession> chatSessions = new ConcurrentHashMap<>();

    // Class để lưu trữ thông tin session
    private static class ChatSession {
        private final List<ChatMessage> messages = new ArrayList<>();
        private long lastActivity = System.currentTimeMillis();
        private String currentTopic = "";
        private List<Map<String, Object>> lastSearchResults = new ArrayList<>();

        public void addMessage(String role, String content) {
            messages.add(new ChatMessage(role, content));
            lastActivity = System.currentTimeMillis();

            // Giới hạn số lượng tin nhắn để tránh token quá dài
            if (messages.size() > 20) {
                messages.subList(0, messages.size() - 15).clear();
            }
        }

        public List<ChatMessage> getMessages() {
            return new ArrayList<>(messages);
        }

        public boolean isExpired() {
            // Session hết hạn sau 30 phút không hoạt động
            return System.currentTimeMillis() - lastActivity > 30 * 60 * 1000;
        }
    }

    private static class ChatMessage {
        private final String role;
        private final String content;
        private final long timestamp;

        public ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
            this.timestamp = System.currentTimeMillis();
        }

        public String getRole() { return role; }
        public String getContent() { return content; }
        public long getTimestamp() { return timestamp; }
    }

    @PostMapping("/ask")
    public APIResponse<?> chat(@RequestBody Map<String, String> request) {
        String message = request.get("question");
        String sessionId = request.get("sessionId");

        // Tự động tạo session mới nếu không có hoặc session đã hết hạn
        if (sessionId == null || sessionId.trim().isEmpty() ||
                !chatSessions.containsKey(sessionId) ||
                chatSessions.get(sessionId).isExpired()) {
            sessionId = generateSessionId();
        }

        // Validation
        if (message == null || message.trim().isEmpty()) {
            return APIResponse.<String>builder()
                    .code(400)
                    .message("Message must not be empty!")
                    .result(null)
                    .build();
        }

        try {
            // Làm sạch session cũ
            cleanExpiredSessions();

            // Lấy hoặc tạo session
            ChatSession session = chatSessions.computeIfAbsent(sessionId, k -> new ChatSession());

            // Thêm tin nhắn của user vào session
            session.addMessage("user", message);

            // Phân loại intent của tin nhắn
            MessageIntent intent = classifyIntent(message, session);

            String response;
            List<Map<String, Object>> searchResults = new ArrayList<>();

            switch (intent.getType()) {
                case GREETING -> response = handleGreeting(message, session);
                case PRODUCT_INQUIRY -> {
                    var productResponse = handleProductInquiry(message, session);
                    response = (String)productResponse.get("answer");
                    searchResults = (List<Map<String, Object>>) productResponse.getOrDefault("results", new ArrayList<>());
                }
                case FOLLOW_UP -> response = handleFollowUp(message, session);
                case GENERAL_CHAT -> response = handleGeneralChat(message, session);
                case GOODBYE -> response = handleGoodbye(message, session);
                default -> response = handleDefault(message, session);
            }

            // Thêm phản hồi vào session
            session.addMessage("assistant", response);

            return APIResponse.success(Map.of(
                    "answer", response,
                    "sessionId", sessionId,
                    "products_found", searchResults.size(),
                    "intent", intent.getType().toString(),
                    "isNewSession", sessionId.equals(request.get("sessionId")) ? false : true
            ));

        } catch (Exception e) {
            log.error("Error processing message: {}", message, e);
            return APIResponse.<String>builder()
                    .code(500)
                    .message("Đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại.")
                    .result(null)
                    .build();
        }
    }

    private enum IntentType {
        GREETING, PRODUCT_INQUIRY, FOLLOW_UP, GENERAL_CHAT, GOODBYE, UNKNOWN
    }

    private static class MessageIntent {
        private final IntentType type;
        private final double confidence;

        public MessageIntent(IntentType type, double confidence) {
            this.type = type;
            this.confidence = confidence;
        }

        public IntentType getType() { return type; }
        public double getConfidence() { return confidence; }
    }

    private MessageIntent classifyIntent(String message, ChatSession session) {
        String lowerMessage = message.toLowerCase().trim();

        // Patterns cho các intent khác nhau
        String[] greetingPatterns = {"xin chào", "chào", "hello", "hi", "hế lô", "chào bạn"};
        String[] goodbyePatterns = {"tạm biệt", "bye", "cảm ơn", "thank"};
        String[] productPatterns = {"sản phẩm", "mua", "giá", "bao nhiêu", "có không", "tìm", "cần", "muốn"};
        String[] followUpPatterns = {"còn", "thêm", "khác", "nữa", "tiếp", "về", "cái đó", "sản phẩm này"};

        // Kiểm tra greeting
        if (Arrays.stream(greetingPatterns).anyMatch(lowerMessage::contains)) {
            return new MessageIntent(IntentType.GREETING, 0.9);
        }

        // Kiểm tra goodbye
        if (Arrays.stream(goodbyePatterns).anyMatch(lowerMessage::contains)) {
            return new MessageIntent(IntentType.GOODBYE, 0.9);
        }

        // Kiểm tra product inquiry
        if (Arrays.stream(productPatterns).anyMatch(lowerMessage::contains)) {
            return new MessageIntent(IntentType.PRODUCT_INQUIRY, 0.8);
        }

        // Kiểm tra follow-up (dựa trên context)
        if (!session.getMessages().isEmpty() &&
                Arrays.stream(followUpPatterns).anyMatch(lowerMessage::contains)) {
            return new MessageIntent(IntentType.FOLLOW_UP, 0.7);
        }

        // Nếu có context trước đó về sản phẩm
        if (!session.lastSearchResults.isEmpty()) {
            return new MessageIntent(IntentType.FOLLOW_UP, 0.6);
        }

        return new MessageIntent(IntentType.GENERAL_CHAT, 0.5);
    }

    private String handleGreeting(String message, ChatSession session) {
        session.currentTopic = "greeting";

        List<String> greetingResponses = Arrays.asList(
                "Xin chào! Tôi là FoxyBot - trợ lý mua sắm của FoxyStore. Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn lựa chọn phù hợp, hoặc trả lời mọi câu hỏi về cửa hàng. Bạn đang tìm kiếm gì hôm nay?",
                "Chào bạn! Rất vui được hỗ trợ bạn. Tôi là FoxyBot và tôi có thể giúp bạn khám phá các sản phẩm tuyệt vời tại FoxyStore. Bạn có sản phẩm nào quan tâm không?",
                "Hello! Chào mừng bạn đến với FoxyStore! Tôi có thể giúp bạn tìm sản phẩm ưng ý, so sánh giá cả, hoặc tư vấn lựa chọn tốt nhất. Hãy cho tôi biết bạn cần gì nhé!"
        );

        return greetingResponses.get(new Random().nextInt(greetingResponses.size()));
    }

    private Map<String, Object> handleProductInquiry(String message, ChatSession session) throws Exception {
        session.currentTopic = "product_inquiry";

        // Tạo embedding cho câu hỏi
        List<Float> questionEmbedding = openAIService.createEmbedding(message);

        // Tìm kiếm trong Qdrant
        var results = qdrantService.search("foxystore", questionEmbedding, 5);
        session.lastSearchResults = results;

        if (results.isEmpty()) {
            return Map.of("answer",
                    "Hmm, tôi không tìm thấy sản phẩm phù hợp với yêu cầu của bạn. " +
                            "Bạn có thể mô tả cụ thể hơn hoặc thử tìm kiếm danh mục khác không? " +
                            "Ví dụ: 'áo thun nam', 'giày nữ', 'túi xách'...");
        }

        // Tạo context với lịch sử hội thoại
        String context = buildEnhancedContext(results);
        String conversationHistory = buildConversationHistory(session);

        // Tạo prompt thông minh với context
        String prompt = buildContextualPrompt(message, context, conversationHistory);

        // Lấy câu trả lời từ OpenAI
        String answer = openAIService.chatCompletion(prompt);

        return Map.of(
                "answer", answer,
                "results", results
        );
    }

    private String handleFollowUp(String message, ChatSession session) throws Exception {
        // Sử dụng lại kết quả tìm kiếm trước đó hoặc tìm kiếm mới
        List<Map<String, Object>> results = session.lastSearchResults;

        if (results.isEmpty()) {
            // Nếu không có context, thực hiện tìm kiếm mới
            List<Float> questionEmbedding = openAIService.createEmbedding(message);
            results = qdrantService.search("foxystore", questionEmbedding, 3);
            session.lastSearchResults = results;
        }

        String context = buildEnhancedContext(results);
        String conversationHistory = buildConversationHistory(session);

        String prompt = String.format("""
            Bạn đang tiếp tục cuộc hội thoại với khách hàng về sản phẩm.
            
            LỊCH SỬ HỘI THOẠI:
            %s
            
            CÂU HỎI TIẾP THEO: %s
            
            THÔNG TIN SẢN PHẨM:
            %s
            
            Hãy trả lời dựa trên ngữ cảnh cuộc hội thoại và thông tin sản phẩm.
            Nếu khách hàng hỏi về sản phẩm đã đề cập trước đó, hãy tham chiếu lại.
            """, conversationHistory, message, context);

        return openAIService.chatCompletion(prompt);
    }

    private String handleGeneralChat(String message, ChatSession session) throws Exception {
        String conversationHistory = buildConversationHistory(session);

        String prompt = String.format("""
            Bạn là FoxyBot - trợ lý thân thiện của FoxyStore.
            
            LỊCH SỬ HỘI THOẠI:
            %s
            
            TIN NHẮN: %s
            
            Hãy trả lời một cách tự nhiên và thân thiện. Nếu có thể, hãy hướng cuộc trò chuyện 
            về sản phẩm hoặc dịch vụ của FoxyStore một cách tự nhiên.
            """, conversationHistory, message);

        return openAIService.chatCompletion(prompt);
    }

    private String handleGoodbye(String message, ChatSession session) {
        List<String> goodbyeResponses = Arrays.asList(
                "Cảm ơn bạn đã ghé thăm FoxyStore! Hy vọng tôi đã giúp bạn tìm được sản phẩm ưng ý. Hẹn gặp lại bạn sớm nhé! 🛍️",
                "Rất vui được hỗ trợ bạn hôm nay! Chúc bạn có những trải nghiệm mua sắm tuyệt vời tại FoxyStore. Tạm biệt! 👋",
                "Cảm ơn bạn! Nếu có bất kỳ câu hỏi nào khác về sản phẩm, đừng ngần ngại quay lại nhé. Chúc bạn một ngày tốt lành! 😊"
        );

        return goodbyeResponses.get(new Random().nextInt(goodbyeResponses.size()));
    }

    private String handleDefault(String message, ChatSession session) throws Exception {
        return handleGeneralChat(message, session);
    }

    private String buildConversationHistory(ChatSession session) {
        StringBuilder history = new StringBuilder();
        List<ChatMessage> messages = session.getMessages();

        // Chỉ lấy 6 tin nhắn gần nhất để tránh quá dài
        int start = Math.max(0, messages.size() - 6);

        for (int i = start; i < messages.size(); i++) {
            ChatMessage msg = messages.get(i);
            history.append(msg.getRole().equals("user") ? "Khách hàng: " : "FoxyBot: ")
                    .append(msg.getContent())
                    .append("\n");
        }

        return history.toString();
    }

    private String buildContextualPrompt(String question, String context, String conversationHistory) {
        return String.format("""
            Bạn là FoxyBot - trợ lý mua sắm thông minh của FoxyStore với khả năng ghi nhớ cuộc hội thoại.
            
            LỊCH SỬ HỘI THOẠI:
            %s
            
            NHIỆM VỤ: Tư vấn sản phẩm dựa trên ngữ cảnh cuộc hội thoại và thông tin sản phẩm.
            
            NGUYÊN TắC:
            1. Tham chiếu lại các sản phẩm/chủ đề đã đề cập trước đó khi phù hợp
            2. Đưa ra lời khuyên dựa trên thông tin cụ thể
            3. So sánh sản phẩm khi có nhiều lựa chọn
            4. Thông báo tình trạng kho và khuyến khích mua nếu cần
            5. Hỏi thêm thông tin để tư vấn tốt hơn
            
            CÂU HỎI HIỆN TẠI: %s
            
            THÔNG TIN SẢN PHẨM:
            %s
            
            Trả lời một cách tự nhiên, như đang tiếp tục cuộc hội thoại.
            """, conversationHistory, question, context);
    }

    private String generateSessionId() {
        return "session_" + System.currentTimeMillis() + "_" + new Random().nextInt(10000);
    }

    // Endpoint cho cuộc hội thoại mới (không cần sessionId)
    @PostMapping("/new-chat")
    public APIResponse<?> newChat(@RequestBody Map<String, String> request) {
        String message = request.get("message");

        // Validation
        if (message == null || message.trim().isEmpty()) {
            return APIResponse.<String>builder()
                    .code(400)
                    .message("Message must not be empty!")
                    .result(null)
                    .build();
        }

        try {
            // Tạo session mới
            String sessionId = generateSessionId();
            ChatSession session = new ChatSession();
            chatSessions.put(sessionId, session);

            // Xử lý tin nhắn đầu tiên
            session.addMessage("user", message);

            // Phân loại intent
            MessageIntent intent = classifyIntent(message, session);

            String response;
            List<Map<String, Object>> searchResults = new ArrayList<>();

            switch (intent.getType()) {
                case GREETING -> response = handleGreeting(message, session);
                case PRODUCT_INQUIRY -> {
                    var productResponse = handleProductInquiry(message, session);
                    response =(String)productResponse.get("answer");
                    searchResults = (List<Map<String, Object>>) productResponse.getOrDefault("results", new ArrayList<>());
                }
                case GENERAL_CHAT -> response = handleGeneralChat(message, session);
                case GOODBYE -> response = handleGoodbye(message, session);
                default -> response = handleDefault(message, session);
            }

            // Thêm phản hồi vào session
            session.addMessage("assistant", response);

            return APIResponse.success(Map.of(
                    "answer", response,
                    "sessionId", sessionId,
                    "products_found", searchResults.size(),
                    "intent", intent.getType().toString(),
                    "isNewSession", true
            ));

        } catch (Exception e) {
            log.error("Error processing new chat message: {}", message, e);
            return APIResponse.<String>builder()
                    .code(500)
                    .message("Đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại.")
                    .result(null)
                    .build();
        }
    }

    private void cleanExpiredSessions() {
        chatSessions.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }

    // Giữ nguyên các method cũ để tương thích
    private String buildEnhancedContext(List<Map<String, Object>> results) {
        StringBuilder context = new StringBuilder();

        for (int i = 0; i < results.size(); i++) {
            Map<String, Object> point = results.get(i);
            Map<String, Object> payload = (Map<String, Object>) point.get("payload");

            // Thông tin cơ bản
            String name = (String) payload.get("name");
            String description = (String) payload.get("description");
            Object priceObj = payload.get("price");
            Double price = priceObj instanceof Number ? ((Number) priceObj).doubleValue() : null;
            Integer quantity = (Integer) payload.get("quantity");

            // Thông tin danh mục
            String categoryName = (String) payload.getOrDefault("category_name", "Không xác định");
            String catalogName = (String) payload.getOrDefault("catalog_name", "");

            // Thông tin đánh giá
            Object avgRatingObj = payload.get("avg_rating");
            Double avgRating = avgRatingObj instanceof Number ? ((Number) avgRatingObj).doubleValue() : 0.0;
            Integer reviewCount = (Integer) payload.getOrDefault("review_count", 0);

            // Thông tin bán hàng
            Integer totalSold = (Integer) payload.getOrDefault("total_sold", 0);
            String stockStatus = (String) payload.getOrDefault("stock_status", "unknown");
            String popularity = (String) payload.getOrDefault("popularity", "new_product");

            // Size available
            @SuppressWarnings("unchecked")
            List<String> sizes = (List<String>) payload.get("available_sizes");

            // Xây dựng thông tin sản phẩm
            context.append("=== SẢN PHẨM ").append(i + 1).append(" ===\n");
            context.append("Tên: ").append(name).append("\n");
            context.append("Giá: ").append(price != null ? String.format("%.0f VND", price) : "Chưa cập nhật").append("\n");
            context.append("Danh mục: ").append(categoryName);
            if (!catalogName.isEmpty()) {
                context.append(" (").append(catalogName).append(")");
            }
            context.append("\n");

            // Tình trạng kho
            context.append("Tình trạng: ");
            switch (stockStatus) {
                case "out_of_stock" -> context.append("Hết hàng");
                case "low_stock" -> context.append("Sắp hết hàng (còn ").append(quantity).append(" sản phẩm)");
                case "limited_stock" -> context.append("Số lượng có hạn (còn ").append(quantity).append(" sản phẩm)");
                default -> context.append("Còn hàng (").append(quantity).append(" sản phẩm)");
            }
            context.append("\n");

            // Đánh giá và độ phổ biến
            if (reviewCount > 0) {
                context.append("Đánh giá: ").append(String.format("%.1f/5 sao", avgRating))
                        .append(" (").append(reviewCount).append(" đánh giá)\n");
            }

            if (totalSold > 0) {
                context.append("Đã bán: ").append(totalSold).append(" sản phẩm\n");
            }

            // Độ phổ biến
            String popularityText = switch (popularity) {
                case "bestseller" -> "Sản phẩm bán chạy nhất";
                case "popular" -> "Sản phẩm phổ biến";
                case "highly_rated" -> "Sản phẩm được đánh giá cao";
                case "selling_well" -> "Sản phẩm bán tốt";
                default -> "Sản phẩm mới";
            };
            context.append("Trạng thái: ").append(popularityText).append("\n");

            // Size
            if (sizes != null && !sizes.isEmpty()) {
                context.append("Kích thước có sẵn: ").append(String.join(", ", sizes)).append("\n");
            }

            // Mô tả
            if (description != null && !description.trim().isEmpty()) {
                context.append("Mô tả: ").append(description).append("\n");
            }

            context.append("\n");
        }

        return context.toString();
    }

    // Endpoint để xóa session (nếu cần)
    @DeleteMapping("/session/{sessionId}")
    public APIResponse<?> clearSession(@PathVariable String sessionId) {
        chatSessions.remove(sessionId);
        return APIResponse.success("Session cleared successfully");
    }

    // Endpoint để lấy thông tin session (cho debug)
    @GetMapping("/session/{sessionId}")
    public APIResponse<?> getSession(@PathVariable String sessionId) {
        ChatSession session = chatSessions.get(sessionId);
        if (session == null) {
            return APIResponse.<String>builder()
                    .code(404)
                    .message("Session not found")
                    .build();
        }

        return APIResponse.success(Map.of(
                "messageCount", session.getMessages().size(),
                "currentTopic", session.currentTopic,
                "lastActivity", session.lastActivity
        ));
    }
}