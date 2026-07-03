package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.ChatRequest;
import com.ecotel.quanlytaisan.model.ChatResponse;
import com.ecotel.quanlytaisan.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/query")
    public ApiResponse<ChatResponse> query(@RequestBody ChatRequest request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ApiResponse.failure("Vui long nhap cau hoi", 0);
            }

            ChatResponse response = chatbotService.processQuery(request.getMessage());
            int rowCount = response.getData() != null ? response.getData().size() : 0;

            return ApiResponse.success("Query thanh cong", response, rowCount);

        } catch (IllegalArgumentException e) {
            return ApiResponse.failure(e.getMessage(), 0);
        } catch (Exception e) {
            return ApiResponse.failure("Loi xu ly: " + e.getMessage(), 0);
        }
    }
}
