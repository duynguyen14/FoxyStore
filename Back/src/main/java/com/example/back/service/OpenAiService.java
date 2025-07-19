package com.example.back.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OpenAiService {

    final RestTemplate restTemplate;
    @Value("${openai.api.key}")
    String openAiApiKey;

    @Value("${openai.api.embedding.url}")
    String embeddingUrl;

    @Value("${openai.api.embedding.model}")
    String embeddingModel;

    @Value("${openai.api.chat.url}")
    String chatCompletionUrl;

    @Value("${openai.api.chat.model}")
    String chatModel;


    public List<Float> createEmbedding(String input) {
        log.info("Calling OpenAI API to create embedding for input: {}", input);
        // Tạo body gửi lên API
        Map<String, Object> body = Map.of(
                "input", input,
                "model", embeddingModel
        );

        try {
            // Gửi request

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, createHeaders());
            var response = restTemplate.postForEntity(embeddingUrl, request, Map.class);

            // Xử lý response
            Map<String, Object> responseBody = response.getBody();
            log.debug("OpenAI Embedding response: {}", responseBody);

            // Trích xuất embedding
            var data = (List<Map<String, Object>>) responseBody.get("data");
            List<Float> embedding = (List<Float>) data.get(0).get("embedding");
            return embedding;

        } catch (HttpClientErrorException e) {
            log.error("Failed to create embedding: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Error creating embedding: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while creating embedding", e);
            throw new RuntimeException("Unexpected error: " + e.getMessage());
        }
    }

    public String chatCompletion(String prompt) {
        log.info("Calling OpenAI API chat completion for prompt: {}", prompt);

        // Tạo dữ liệu body gửi đến API
        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> body = Map.of(
                "model", chatModel,
                "messages", List.of(message)
        );

        try {
            // Gửi request
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, createHeaders());
            var response = restTemplate.postForEntity(chatCompletionUrl, request, Map.class);

            // Xử lý response
            Map<String, Object> responseBody = response.getBody();
            log.debug("OpenAI Chat Completion response: {}", responseBody);

            var choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> messageResponse = (Map<String, Object>) firstChoice.get("message");
            String answer = (String) messageResponse.get("content");

            return answer;

        } catch (HttpClientErrorException e) {
            log.error("Failed to complete chat: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Error completing chat: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while completing chat", e);
            throw new RuntimeException("Unexpected error: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openAiApiKey); // Thêm Bearer token header
        headers.set("Content-Type", "application/json"); // Thêm Content-Type
        return headers;
    }
}