package com.example.back.security;

import com.example.back.security.user.UserPrincipal;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class JWTUntil {
    @Value("${jwt.signerKey}")
    String signerKey;
    @Value("${jwt.expiration}")
    int expiration;


    public String GenerateAccessToken(UserPrincipal user){
//        header
//        System.out.println("kieu "+ expiration);
        JWSHeader jwsHeader =new JWSHeader(JWSAlgorithm.HS256);
//      payload
        JWTClaimsSet jwtClaimsSet =new JWTClaimsSet.Builder()
                .subject(user.getId().toString())
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(expiration, ChronoUnit.MINUTES)))
//                .claim("roles",user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList()))
                .claim("scope",buildScope(user))
                .build();
        SignedJWT  signedJWT=new SignedJWT(jwsHeader,jwtClaimsSet);
        try{
            signedJWT.sign(new MACSigner(signerKey.getBytes()));
            return signedJWT.serialize();
        }
        catch (Exception e){
            System.out.println("Loi khi tao token"+e);
            throw new RuntimeException();
        }

    }
    public JWTClaimsSet extractAllClaimsSet(String token){
        try{
            SignedJWT signedJWT =SignedJWT.parse(token);
            return  signedJWT.getJWTClaimsSet();
        }
        catch (ParseException e){
            System.out.println("Loi "+e);
            throw new RuntimeException();
        }
    }
    public String extractUserId(String token){
        return extractAllClaimsSet(token).getSubject();
    }
    public Date extractDate(String token){
        return extractAllClaimsSet(token).getExpirationTime();
    }
    public boolean checkToken(String token){
        return new Date().before(extractDate(token));
    }
    public List<String> buildScope(UserPrincipal user){
        List<String> roles=null;
        if(!CollectionUtils.isEmpty(user.getAuthorities())){
            roles= user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        }
        return roles;
    }
}
