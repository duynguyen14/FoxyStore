package com.example.back.security.user;

import com.example.back.security.JWTUntil;
import com.example.back.security.jwtToken.AppProperties;
import com.example.back.security.jwtToken.TokenProvider;
import com.example.back.exception.BadRequestException;
import jakarta.servlet.http.HttpServletRequest;
import com.example.back.security.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final TokenProvider tokenProvider;
    private final AppProperties appProperties;
    private final JWTUntil jwtUntil;
    private static final String REDIRECT_URI_PARAM_COOKIE_NAME = "redirect_uri";
    private static final String REDIRECT_URI_PARAM_QUERY_NAME = "redirect_uri";
    @Autowired
    public OAuth2AuthenticationSuccessHandler(TokenProvider tokenProvider, AppProperties appProperties,JWTUntil jwtUntil) {
        this.tokenProvider = tokenProvider;
        this.appProperties = appProperties;
        this.jwtUntil =jwtUntil;
    }
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }
        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // Ưu tiên lấy redirect_uri từ cookie
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);
        System.out.println("✅ redirect_uri from cookie = " + redirectUri);
        // Nếu không có cookie, thử lấy từ query param
        if (redirectUri.isEmpty()) {
            String redirectFromParam = request.getParameter(REDIRECT_URI_PARAM_QUERY_NAME);
            if (redirectFromParam != null && !redirectFromParam.isEmpty()) {
                redirectUri = Optional.of(redirectFromParam);
            }
        }
        System.out.println("✅ redirect_uri: " + redirectUri.orElse("null"));

        if (redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new BadRequestException("Unauthorized Redirect URI: " + redirectUri.get());
        }

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtUntil.GenerateAccessToken(userPrincipal);

        System.out.println("✅ Generated token: " + token);
        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", token)
                .build().toUriString();
    }
    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        CookieUtils.deleteCookie(request, response, REDIRECT_URI_PARAM_COOKIE_NAME);
    }
    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);
        return appProperties.getOauth2().getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirect -> {
                    URI authorizedURI = URI.create(authorizedRedirect);
                    return authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                            && authorizedURI.getPort() == clientRedirectUri.getPort();
                });
    }
}
