package com.smartedudocs.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartedudocs.backend.model.UserAccount;
import com.smartedudocs.backend.service.AuthService;
import com.smartedudocs.backend.utils.ApiResponse;
import com.smartedudocs.backend.utils.JwtService;

import jakarta.validation.Valid;

// Marks this class as a REST controller for handling HTTP requests
@RestController

// Sets the base path for all endpoints in this controller to "/auth"
@RequestMapping("/api/auth")
public class AuthController {
    // Dependency for handling authentication-related logic
    private final AuthService authService;

    // Dependency for generating and validating JSON Web Tokens (JWTs)
    private final JwtService jwtService;

    // Constructor for injecting dependencies
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    // Endpoint to handle userAccount signup
    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@Valid @RequestBody UserAccount userAccount) {
        try {
            // Call the signup method in AuthService to register the userAccount
             Map<String, Object> newUserAccount = authService.signup(userAccount);
            // Create a map to hold userAccount details
           
            // Return a successful response with the registered userAccount's details
            return ResponseEntity.ok(new ApiResponse(true, "Signup successful", newUserAccount));
        } catch (RuntimeException e) {
            // Handle exceptions, such as duplicate email
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            // Return a bad request response with the error details
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Signup failed", errorResponse));
        }
    }

    // Endpoint to handle userAccount login
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody UserAccount userAccount,
            @RequestParam(value = "rememberMe", required = false, defaultValue = "false") boolean rememberMe) {
        try {
            // Attempt to log in with the provided email and password
            Map<String, Object> loggedInUserAccount = authService.login(userAccount.getEmail(), userAccount.getPassword(),rememberMe);
            // Return a successful response with userAccount details and the token
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", loggedInUserAccount));
        } catch (RuntimeException e) {
            // Handle login errors, such as invalid credentials
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());

            // Return an unauthorized response with error details
            return ResponseEntity.status(401).body(new ApiResponse(false, "Login failed", errorResponse));
        }
    }

    // Endpoint to validate the provided JWT token
    @GetMapping("/validate-token")
    public ResponseEntity<Object> validateToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        try {
            // Check if the Authorization header contains a Bearer token
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                // Extract the token from the header
                String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

                Map<String, Object> userAccountDetails = authService.validateToken(token);

                // Return a successful response with userAccount details
                return ResponseEntity.ok(new ApiResponse(true, "Token is valid", userAccountDetails));
            } else {
                // Handle missing or invalid Authorization header
                return ResponseEntity.status(400).body(new ApiResponse(false, "Authorization header is missing or invalid", null));
            }
        } catch (Exception e) {
            // Handle exceptions, such as invalid or expired token
            return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid or expired token", null));
        }
    }
}
