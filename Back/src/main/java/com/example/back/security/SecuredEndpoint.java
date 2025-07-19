package com.example.back.security;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpMethod;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class SecuredEndpoint {
    private final String url;
    private final HttpMethod httpMethod;
}
