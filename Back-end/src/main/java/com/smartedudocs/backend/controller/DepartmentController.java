package com.smartedudocs.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedudocs.backend.model.Department;
import com.smartedudocs.backend.model.Faculty;
import com.smartedudocs.backend.repository.FacultyRepository;
import com.smartedudocs.backend.service.DepartmentService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController
@RequestMapping("/api")

public class DepartmentController {

    private final DepartmentService departmentService;
    private final FacultyRepository facultyRepository;

    public DepartmentController(DepartmentService departmentService, FacultyRepository facultyRepository) {
        this.departmentService = departmentService;
        this.facultyRepository = facultyRepository;
    }

    // Get all departments with faculty details
    @GetMapping("/departments_with_faculty")
    public ResponseEntity<ApiResponse> getAllDepartmentsWithFaculty() {
        try{
            List<Map<String, Object>> departments = departmentService.getAllDepartmentsWithFaculty();
            return ResponseEntity.ok(new ApiResponse(true, "Departments with faculty retrieved successfully", departments));
        }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }

    // Get all departments
    @GetMapping("/departments")
    public ResponseEntity<ApiResponse> getAllDepartments() {
        
        try{
            List<Map<String, Object>> departments = departmentService.getAllDepartments();
            
            if (departments.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(true, "No Department found", null));
            }
                        
            return ResponseEntity.ok(new ApiResponse(true, "Departments retrieved successfully", departments));
   
         }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }

    // Get departments in a specific faculty
    @GetMapping("/departments/{facultyId}")
    public ResponseEntity<ApiResponse> getDepartmentsInFaculty(@PathVariable String facultyId) {
        try{
            Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
            if (faculty == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Faculty not found", null));
            }

            Map<String, Object> response = departmentService.getDepartmentsByFaculty(faculty);
            return ResponseEntity.ok(new ApiResponse(true, "Departments in faculty retrieved successfully", response));
    
        }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }
    @GetMapping("/departments_name/{facultyId}")
    public ResponseEntity<ApiResponse> getDepartmentsNameInFaculty(@PathVariable String facultyId) {
       try{ 
            Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
            if (faculty == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Faculty not found", null));
            }

            Map<String, Object> response = departmentService.getDepartmentsNameByFaculty(faculty);
            return ResponseEntity.ok(new ApiResponse(true, "Departments in faculty retrieved successfully", response));
    
       }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }
    @GetMapping("/departments_names")
    public ResponseEntity<ApiResponse> getDepartmentsName() {
        try{
           List<Map<String, Object>> response = departmentService.getDepartmentsNames();
           return ResponseEntity.ok(new ApiResponse(true, "Departments in faculty retrieved successfully", response));
        }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        } 
    }
    // Add a new department
    @PostMapping("/department")
    public ResponseEntity<ApiResponse> addDepartment(@RequestBody Department department) {
        try{
            Map<String, Object> newDepatment = departmentService.addDepartment(department);
            return ResponseEntity.ok(new ApiResponse(true, "Department addded successfully", newDepatment));
        }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to add departments", errorResponse));
        }
    }

    // Edit an existing department
    @PatchMapping("/department")
    public ResponseEntity<ApiResponse> editDepartment(@RequestBody Department department) {
        try{
            Map<String, Object> updatedDepartment = departmentService.editDepartment(department);
            return ResponseEntity.ok(new ApiResponse(true, "Department addded successfully", updatedDepartment));
        }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }
    
    // Delete a department
    @DeleteMapping("/department")
    public ResponseEntity<ApiResponse> deleteDepartment(@RequestBody Map<String, String> request) {
        try{
            String id = request.get("id");
            if (id == null || id.isEmpty()) {
                return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Department ID cannot be null or empty", null));
            }
            boolean isDeleted = departmentService.deleteDepartment(id);
            return ResponseEntity.ok(new ApiResponse(true, "Department deleted successfully", isDeleted));        
        }catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }
}
