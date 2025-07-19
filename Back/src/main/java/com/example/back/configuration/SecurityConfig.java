package com.example.back.configuration;

import com.example.back.security.CustomAccessDeniedHandler;
import com.example.back.security.EndpointConfig;
import com.example.back.security.HttpCookieOAuth2AuthorizationRequestRepository;
import com.example.back.security.JWTAuthenticationEntryPoint;
import com.example.back.security.jwtToken.TokenAuthenticationFilter;
import com.example.back.security.user.OAuth2AuthenticationSuccessHandler;
import com.example.back.service.CustomOAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Value("${jwt.signerKey}")
    String signerKey;

    // xử lý thông tin user trả về từ Google khi đăng nhập.
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    // xử lý logic sau khi đăng nhập thành công (ví dụ: tạo JWT, redirect, v.v.).
    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private TokenAuthenticationFilter tokenAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .csrf(csrf -> csrf.disable())

//                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> {
                    // PUBLIC ENDPOINTS từ EndpointConfig
                    EndpointConfig.PUBLIC_ENDPOINTS.forEach(endpoint ->
                            auth.requestMatchers(endpoint.getHttpMethod(), endpoint.getUrl()).permitAll());


                    // USER ENDPOINTS từ EndpointConfig
                    EndpointConfig.USER_ENDPOINTS.forEach(endpoint ->
                            auth.requestMatchers(endpoint.getHttpMethod(), endpoint.getUrl()).hasRole("USER"));

                    // ADMIN ENDPOINTS từ EndpointConfig
                    EndpointConfig.ADMIN_ENDPOINTS.forEach(endpoint ->
                            auth.requestMatchers(endpoint.getHttpMethod(), endpoint.getUrl()).hasRole("ADMIN"));
                    // Các static resources
                    auth.requestMatchers("/resources/**", "/static/**", "/public/**", "/images/**","/dist/**", "/css/**", "/js/**", "/favicon.ico").permitAll();
                    // OAuth2 endpoints
                    auth.requestMatchers(
                            "/",
                            "/index.html",
                            "/assets/**",
                            "/vite.svg",
                            "/favicon.ico",
                            "/videos/**"
                    ).permitAll();
                    auth.requestMatchers("/auth/**", "/oauth2/**").permitAll();
//                    web socket
                    auth.requestMatchers("/ws/**").permitAll()
                            .requestMatchers("/ws/**/**").permitAll()
                                    .requestMatchers("/ws/**/**/**").permitAll();

//                    auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    // Cuối cùng, yêu cầu xác thực cho tất cả các request còn lại
                    auth.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwtConfigurer ->
                                        jwtConfigurer.decoder(jwtDecoder())
                                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                                )
                                .authenticationEntryPoint(new JWTAuthenticationEntryPoint())
                )
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(new CustomAccessDeniedHandler())
                        .authenticationEntryPoint(new JWTAuthenticationEntryPoint())
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authEndpoint -> authEndpoint
                                .baseUri("/oauth2/authorize")
                                .authorizationRequestRepository(cookieAuthorizationRequestRepository())
                        )
                        .redirectionEndpoint(redirect -> redirect
                                .baseUri("/oauth2/callback/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                );

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:5173"));  // địa chỉ frontend
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS256");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }
}