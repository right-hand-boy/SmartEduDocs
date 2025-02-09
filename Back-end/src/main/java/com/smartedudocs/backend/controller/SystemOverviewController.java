package com.smartedudocs.backend.controller;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedudocs.backend.service.SystemOverviewService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController

public class SystemOverviewController {

    @Autowired
    private SystemOverviewService systemOverviewService;

    @GetMapping("/api/system-overview")
    public ResponseEntity<ApiResponse> getSystemOverview() {
        try{
            Map<String,Long> overview=systemOverviewService.getSystemOverview();
            return ResponseEntity.ok(new ApiResponse(true, "System overview successfully.", overview));
         }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }  
    }
}
