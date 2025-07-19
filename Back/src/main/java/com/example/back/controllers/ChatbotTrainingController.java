package com.example.back.controllers;

import com.example.back.dto.response.APIResponse;
import com.example.back.service.ChatbotTrainingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.key}/chatbot/training")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatbotTrainingController {
    ChatbotTrainingService chatbotTrainingService;

    @PostMapping("/retrain")
    public APIResponse<?> retrainProducts() {
        try {
            chatbotTrainingService.trainWithProductData();

            return APIResponse.success("Training completed successfully");
        } catch (Exception e) {
            return APIResponse.<String>builder()
                    .code(500)
                    .message("Training failed: " + e.getMessage())
                    .result(null)
                    .build();
        }
    }
}