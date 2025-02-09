
package com.smartedudocs.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedudocs.backend.model.UserAccount;
import com.smartedudocs.backend.service.ProfileSettingService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController

@RequestMapping("/api/profile/edit")
public class ProfileSettingController {

    private final ProfileSettingService profileSettingService;

    public ProfileSettingController(ProfileSettingService profileSettingService) {
        this.profileSettingService = profileSettingService;
    }

    @PutMapping("/name")
    public ResponseEntity<ApiResponse> modifyUserName(@RequestBody UserAccount user) {
        try {
            boolean isModified = profileSettingService.modifyUserName(user);

            if (isModified) {
                return ResponseEntity.ok(new ApiResponse(true, "User name successfully updated", null));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found", null));
            }

        } catch (Exception e) {
            Map<String, String> errorDetails = new HashMap<>();
            errorDetails.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to update user name", errorDetails));
        }
    }

    @PutMapping("/info")
    public ResponseEntity<ApiResponse> modifyUserInfo(@RequestBody Map<String, Object> payload) {
        try {
            // Extract fields from payload
            String id = (String) payload.get("id");
            String name = (String) payload.get("name");
            String email = (String) payload.get("email");
            String password = (String) payload.get("oldPassword");
            String newPassword = (String) payload.get("newPassword");

            // Create a UserAccount object for processing
            UserAccount user = new UserAccount();
            user.setId(new ObjectId(id));
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);

            // Call the service method
            boolean isModified = profileSettingService.modifyUserInfo(user, newPassword);

            if (isModified) {
                return ResponseEntity.ok(new ApiResponse(true, "User information successfully updated", null));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found", null));
            }

        } catch (IllegalArgumentException e) {
            Map<String, String> errorDetails = new HashMap<>();
            errorDetails.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), errorDetails));

        } catch (Exception e) {
            Map<String, String> errorDetails = new HashMap<>();
            errorDetails.put("error", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update user information", errorDetails));
        }
    }
}
