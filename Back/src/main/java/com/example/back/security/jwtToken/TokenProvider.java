package com.example.back.security.jwtToken;
import com.example.back.security.user.UserPrincipal;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class TokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    @Autowired
    private AppProperties appProperties;

    // Phương thức để tạo SecretKey đủ mạnh
    private SecretKey getSigningKey() {
        byte[] keyBytes = appProperties.getAuth().getTokenSecret().getBytes(StandardCharsets.UTF_8);

        // Đảm bảo khóa có độ dài ít nhất 32 bytes (256 bits)
        if (keyBytes.length < 32) {
            byte[] paddedKeyBytes = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKeyBytes, 0, keyBytes.length);
            // Padding thêm bytes nếu cần
            for (int i = keyBytes.length; i < 32; i++) {
                paddedKeyBytes[i] = (byte) i;
            }
            return Keys.hmacShaKeyFor(paddedKeyBytes);
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String createToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

        // Sử dụng phương thức getSigningKey() để lấy key
        SecretKey key = getSigningKey();

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        // Sử dụng phương thức getSigningKey() để lấy key
        SecretKey key = getSigningKey();

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            // Sử dụng phương thức getSigningKey() để lấy key
            SecretKey key = getSigningKey();
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }
}