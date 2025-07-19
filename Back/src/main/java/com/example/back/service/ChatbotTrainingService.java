package com.example.back.service;

import com.example.back.entity.Product;
import com.example.back.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatbotTrainingService {
    OpenAiService openAiService;
    QdrantService qdrantService;
    ProductRepository productRepository;
    JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public void trainWithProductData() {
        log.info("Starting enhanced chatbot training with product data...");

        List<Product> products = productRepository.findAll();

        if (products.isEmpty()) {
            log.warn("No products found for training");
            return;
        }

        int successCount = 0;
        int errorCount = 0;

        for (Product product : products) {
            try {
                if (product.getName() == null || product.getName().trim().isEmpty()) {
                    log.warn("Skipping product {} - missing name", product.getProductId());
                    continue;
                }

                // Lấy thông tin đầy đủ từ database
                Map<String, Object> enrichedData = getEnrichedProductData(product.getProductId());

                // Tạo payload với thông tin đầy đủ
                Map<String, Object> payload = createEnhancedProductPayload(product, enrichedData);

                // Tạo text mô tả phong phú cho embedding
                String productInfo = buildEnhancedProductInfo(product, enrichedData);

                // Tạo embedding
                List<Float> embedding = openAiService.createEmbedding(productInfo);

                // Lưu vào Qdrant
                qdrantService.upsertPoint("foxystore", product.getProductId(), embedding, payload);

                successCount++;

                if (successCount % 20 == 0) {
                    log.info("Processed {} products...", successCount);
                }

            } catch (Exception e) {
                errorCount++;
                log.error("Error processing product {}: {}", product.getProductId(), e.getMessage(), e);
            }
        }

        log.info("Enhanced training completed. Success: {}, Errors: {}", successCount, errorCount);
    }

    private Map<String, Object> getEnrichedProductData(Integer productId) {
        Map<String, Object> data = new HashMap<>();

        // Lấy thông tin review và rating
        String reviewQuery = """
                SELECT
                    AVG(r.rating) AS avg_rating,
                    COUNT(r.review_id) AS review_count,
                    GROUP_CONCAT(r.comment ORDER BY r.review_id DESC SEPARATOR '; ') AS recent_comments
                FROM review r
                WHERE r.product_id = ?
                GROUP BY r.product_id
            """;

        List<Map<String, Object>> reviewData = jdbcTemplate.queryForList(reviewQuery, productId);
        if (!reviewData.isEmpty()) {
            Map<String, Object> review = reviewData.get(0);
            data.put("avg_rating", review.get("avg_rating"));
            data.put("review_count", review.get("review_count"));
            data.put("recent_comments", review.get("recent_comments"));
        } else {
            data.put("avg_rating", 0.0);
            data.put("review_count", 0);
            data.put("recent_comments", "");
        }

        // Lấy thông tin category và catalog
        String categoryQuery = """
                SELECT
                    category.name AS category_name,
                    catalog.name AS catalog_name
                FROM product p
                JOIN category category ON p.category_id = category.category_id
                JOIN catalog catalog ON category.catalog_id = catalog.catalog_id
                WHERE p.product_id = ?
            """;

        List<Map<String, Object>> categoryData = jdbcTemplate.queryForList(categoryQuery, productId);
        if (!categoryData.isEmpty()) {
            Map<String, Object> category = categoryData.get(0);
            data.put("category_name", category.get("category_name"));
            data.put("catalog_name", category.get("catalog_name"));
        }

        // Lấy thông tin size
        String sizeQuery = """
                SELECT s.size_name
                FROM product_size ps
                JOIN size s ON ps.size_id = s.size_id
                WHERE ps.product_id = ?
            """;

        List<String> sizes = jdbcTemplate.queryForList(sizeQuery, String.class, productId);
        data.put("available_sizes", sizes);

        // Thống kê bán hàng
        String salesQuery = """
                SELECT
                    COALESCE(SUM(bd.quantity), 0) AS total_sold,
                    COUNT(DISTINCT bd.bill_id) AS order_count
                FROM billdetail bd
                JOIN bill b ON bd.bill_id = b.bill_id
                JOIN product_size ps ON bd.product_size_id = ps.product_size_id
                 WHERE ps.product_id = ? AND b.status = 'COMPLETED'
            """;

        List<Map<String, Object>> salesData = jdbcTemplate.queryForList(salesQuery, productId);
        if (!salesData.isEmpty()) {
            Map<String, Object> sales = salesData.get(0);
            data.put("total_sold", sales.get("total_sold"));
            data.put("order_count", sales.get("order_count"));
        }

        return data;
    }

    private Map<String, Object> createEnhancedProductPayload(Product product, Map<String, Object> enrichedData) {
        Map<String, Object> payload = new HashMap<>();

        // Thông tin cơ bản
        payload.put("product_id", product.getProductId());
        payload.put("name", product.getName());
        payload.put("price", product.getPrice());
        payload.put("quantity", product.getQuantity());
        payload.put("description", product.getDescription());

        // Thông tin danh mục
        payload.put("category_name", enrichedData.get("category_name"));
        payload.put("catalog_name", enrichedData.get("catalog_name"));

        // Thông tin đánh giá
        payload.put("avg_rating", enrichedData.get("avg_rating"));
        payload.put("review_count", enrichedData.get("review_count"));

        // Thông tin bán hàng
        payload.put("total_sold", enrichedData.get("total_sold"));
        payload.put("order_count", enrichedData.get("order_count"));

        // Size available
        payload.put("available_sizes", enrichedData.get("available_sizes"));

        // Trạng thái sản phẩm
        payload.put("stock_status", determineStockStatus(product.getQuantity()));

        Integer totalSold = ((Number) enrichedData.getOrDefault("total_sold", 0)).intValue();
        Double avgRating = ((Number) enrichedData.getOrDefault("avg_rating", 0.0)).doubleValue();
        payload.put("popularity", determinePopularity(totalSold, avgRating));
        return payload;
    }

    private String buildEnhancedProductInfo(Product product, Map<String, Object> enrichedData) {
        StringBuilder info = new StringBuilder();

        // Tên và danh mục
        info.append("Sản phẩm: ").append(product.getName());
        if (enrichedData.get("category_name") != null) {
            info.append(" thuộc danh mục ").append(enrichedData.get("category_name"));
        }
        if (enrichedData.get("catalog_name") != null) {
            info.append(" trong nhóm ").append(enrichedData.get("catalog_name"));
        }

        // Giá cả
        info.append(". Giá: ").append(String.format("%.0f", product.getPrice())).append(" VND");

        // Tình trạng kho
        info.append(". Tình trạng kho: ");
        if (product.getQuantity() <= 0) {
            info.append("Hết hàng");
        } else if (product.getQuantity() <= 5) {
            info.append("Sắp hết hàng (còn ").append(product.getQuantity()).append(" sản phẩm)");
        } else {
            info.append("Còn hàng (").append(product.getQuantity()).append(" sản phẩm)");
        }

        // Thông tin đánh giá
        Double avgRating = ((Number) enrichedData.getOrDefault("avg_rating", 0.0)).doubleValue();
        Integer reviewCount = ((Number) enrichedData.getOrDefault("review_count", 0)).intValue();
        if (reviewCount > 0) {
            info.append(". Đánh giá: ").append(String.format("%.1f", avgRating))
                    .append("/5 sao từ ").append(reviewCount).append(" khách hàng");
        } else {
            info.append(". Chưa có đánh giá");
        }

        // Thông tin bán hàng
        Integer totalSold = ((Number) enrichedData.getOrDefault("total_sold", 0)).intValue();
        if (totalSold > 0) {
            info.append(". Đã bán: ").append(totalSold).append(" sản phẩm");
        }

        // Size có sẵn
        @SuppressWarnings("unchecked")
        List<String> sizes = (List<String>) enrichedData.get("available_sizes");
        if (sizes != null && !sizes.isEmpty()) {
            info.append(". Kích thước có sẵn: ").append(String.join(", ", sizes));
        }

        // Mô tả sản phẩm
        if (product.getDescription() != null && !product.getDescription().trim().isEmpty()) {
            info.append(". Mô tả: ").append(product.getDescription());
        }

        // Comments từ khách hàng (nếu có)
        String recentComments = (String) enrichedData.get("recent_comments");
        if (recentComments != null && !recentComments.trim().isEmpty()) {
            String comments = recentComments.length() > 200 ?
                    recentComments.substring(0, 200) + "..." : recentComments;
            info.append(". Nhận xét từ khách hàng: ").append(comments);
        }

        return info.toString();
    }

    private String determineStockStatus(Integer quantity) {
        if (quantity == null || quantity <= 0) return "out_of_stock";
        if (quantity <= 5) return "low_stock";
        if (quantity <= 20) return "limited_stock";
        return "in_stock";
    }

    private String determinePopularity(Integer totalSold, Double avgRating) {
        if (totalSold == null) totalSold = 0;
        if (avgRating == null) avgRating = 0.0;

        if (totalSold > 100 && avgRating >= 4.5) return "bestseller";
        if (totalSold > 50 && avgRating >= 4.0) return "popular";
        if (avgRating >= 4.5) return "highly_rated";
        if (totalSold > 20) return "selling_well";
        return "new_product";
    }

    public void trainSingleProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        try {
            Map<String, Object> enrichedData = getEnrichedProductData(productId);
            Map<String, Object> payload = createEnhancedProductPayload(product, enrichedData);
            String productInfo = buildEnhancedProductInfo(product, enrichedData);
            List<Float> embedding = openAiService.createEmbedding(productInfo);

            qdrantService.upsertPoint("foxystore", productId, embedding, payload);
            log.info("Successfully trained product: {}", productId);
        } catch (Exception e) {
            log.error("Error training product {}: {}", productId, e.getMessage(), e);
            throw new RuntimeException("Failed to train product: " + productId, e);
        }
    }
}