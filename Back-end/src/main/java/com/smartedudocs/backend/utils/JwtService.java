package com.smartedudocs.backend.utils;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.smartedudocs.backend.model.UserAccount;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final Key signingKey;

    // Load secret key from application.properties
    public JwtService(@Value("${jwt.secret}") String secretKey) {
        if (secretKey == null || secretKey.length() < 32) { // HS256 requires a 256-bit key (32 bytes)
            throw new IllegalArgumentException("JWT secret key must be at least 256 bits (32 characters) long");
        }
        this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateTokenWithExpiry(UserAccount userAccount, int expiryInSeconds) {
        if (userAccount == null || userAccount.getEmail() == null || userAccount.getName() == null) {
            throw new IllegalArgumentException("UserAccount details cannot be null");
        }

        return Jwts.builder()
                .setSubject(userAccount.getEmail())
                .claim("name", userAccount.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiryInSeconds * 1000L))
                .signWith(signingKey, SignatureAlgorithm.HS256) // Use the secure Key object
                .compact();
    }

    // Method to extract the subject (email) from the token
    public String getSubjectFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey) // Use the same signing key for validation
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject(); // Returns the subject (userAccount email)
    }

    // Method to check if the token is expired
    public boolean isTokenExpired(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getExpiration().before(new Date());
    }
}
