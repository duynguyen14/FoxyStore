package com.example.back.security;

import com.example.back.dto.response.APIResponse;
import com.example.back.enums.ErrorCodes;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

public class JWTAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        ErrorCodes errorCodes = ErrorCodes.UNAUTHENTICATED;
        response.setStatus(errorCodes.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        APIResponse<?> apiResponse =APIResponse.builder()
                .code(errorCodes.getCode())
                .message(errorCodes.getMessage())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        response.flushBuffer();
    }
}
