package com.smartedudocs.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedudocs.backend.model.Faculty;
import com.smartedudocs.backend.service.FacultyService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController
@RequestMapping("/api")
public class FacultyController {
    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping("/faculties")
    public ResponseEntity<ApiResponse> getAllFaculties() {
        try {
           List<Map<String, Object>> facultiesList = facultyService.getAllFaculties();
            if (facultiesList.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(true, "No faculties found", null));
            }
            List<Map<String, Object>> faculties=facultyService.getAllFaculties();
            return ResponseEntity.ok(new ApiResponse(true, "Faculties retrieved successfully", faculties));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve faculties", errorResponse));
        }
    }

    @PostMapping("/faculty")
    public ResponseEntity<ApiResponse> addFaculty(@RequestBody Faculty faculty) {
        if (faculty.getName() == null || faculty.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Name must not be null or empty", null));
        }
        if (faculty.getDescription() == null || faculty.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Description must not be null or empty", null));
        }
        try {
            Map<String, Object> newFaculty = facultyService.addFaculty(faculty);

            return ResponseEntity.ok(new ApiResponse(true, "Faculty added successfully", newFaculty));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to add faculty", errorResponse));
        }
    }

    @PatchMapping("/faculty")
    public ResponseEntity<ApiResponse> editFaculty(@RequestBody Faculty faculty) {
        if (faculty.getName() == null || faculty.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Name must not be null or empty", null));
        }
        if (faculty.getDescription() == null || faculty.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Description must not be null or empty", null));
        }
        try {
            if (faculty.getId() == null) {
                throw new IllegalArgumentException("Faculty ID must not be null");
            }

            Map<String, Object> editedFaculty = facultyService.editFaculty(faculty);
           
            return ResponseEntity.ok(new ApiResponse(true, "Faculty edited successfully", editedFaculty));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to edit faculty", errorResponse));
        }
    }

    @DeleteMapping("/faculty")
    public ResponseEntity<ApiResponse> deleteFaculty(@RequestBody Map<String, String> request) {
        try {
            String idString = request.get("id");
            if (idString == null || idString.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Faculty ID must not be null or empty", null));
            }
            ObjectId id = new ObjectId(idString);  // Convert string to ObjectId
            boolean isDeleted = facultyService.findByidAndDelete(id);

            if (!isDeleted) {
                return ResponseEntity.ok(new ApiResponse(true, "No faculty found", null));
            }

            return ResponseEntity.ok(new ApiResponse(true, "Faculty deleted successfully", null));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to delete faculty", errorResponse));
        }
    }
}
