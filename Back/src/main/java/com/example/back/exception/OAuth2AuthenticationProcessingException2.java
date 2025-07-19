package com.example.back.exception;

import org.springframework.security.core.AuthenticationException;


public class OAuth2AuthenticationProcessingException2 extends AuthenticationException {
    public OAuth2AuthenticationProcessingException2(String msg) {
        super(msg);
    }
}
