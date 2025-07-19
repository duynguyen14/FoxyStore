package com.example.back.security;

import com.example.back.dto.response.APIResponse;
import com.example.back.enums.ErrorCodes;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

//@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        APIResponse<?> apiResponse =APIResponse.builder()
                .code(ErrorCodes.UNAUTHORIZED.getCode())
                .message(ErrorCodes.UNAUTHORIZED.getMessage())
                .build();

        response.setStatus(ErrorCodes.UNAUTHORIZED.getStatus().value());
        response.setContentType("application/json;charset=UTF-8");
        ObjectMapper objectMapper =new ObjectMapper();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        response.flushBuffer();

    }
}
