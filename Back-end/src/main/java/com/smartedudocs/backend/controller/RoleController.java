package com.smartedudocs.backend.controller;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedudocs.backend.model.UserAccount;
import com.smartedudocs.backend.service.RoleService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController

@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse> getAllStudents() {
        List<Map<String, Object>> students = roleService.getAllStudents();       
        return ResponseEntity.ok(new ApiResponse(true, "All students retrieved successfully.", students));
    }


    @GetMapping("/faculties")
    public ResponseEntity<ApiResponse> getFaculty() {
        List<Map<String, Object>> faculties = roleService.getAllFaculties();
        return ResponseEntity.ok(new ApiResponse(true, "Faculty retrieved successfully.", faculties));
    }

    @PutMapping("/demote/faculty/{facultyId}")
    public ResponseEntity<ApiResponse> demoteFacultyToStudent(@PathVariable String facultyId) {
        boolean success = roleService.demoteFacultyToStudent(facultyId);
        if (success) {
            return ResponseEntity.ok(new ApiResponse(true, "Faculty member demoted to student successfully.", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Faculty member not found or cannot be demoted.", null));
    }
    @PatchMapping("/edit/faculty/{facultyId}")
    public ResponseEntity<ApiResponse> editFaculty(@RequestBody UserAccount editingFaculty, @PathVariable String facultyId) {
        System.out.println(editingFaculty+facultyId);
        boolean success = roleService.editFaculty(editingFaculty, facultyId);
        if (success) {
            return ResponseEntity.ok(new ApiResponse(true, "Faculty member updated successfully.", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Faculty member not found or cannot be demoted.", null));
    }
    @PutMapping("/demote/instructor") 
    public ResponseEntity<ApiResponse> demoteInstructorToStudent(@RequestBody Map<String, String> request) {
        String courseId=request.get("courseId");
        String instructorId=request.get("instructorId");
        boolean success = roleService.demoteInstructorToStudent(instructorId, courseId);
        if (success) {
            return ResponseEntity.ok(new ApiResponse(true, "Instructoe demoted to student successfully.", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Instructor not found or cannot be demoted.", null));
    }
    @GetMapping("/get/instructores/{facultyId}")
    public ResponseEntity<ApiResponse> getInstructorsInFaculty(@PathVariable String facultyId) {
         List<Map<String, Object>>  instructors = roleService.getAllInstructorsInfaculty(facultyId);
        if (!instructors.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(true, "Faculty instructors retrieved successfully.", instructors));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Faculty instructors not found", null));
    }

    @DeleteMapping("/ban/{studentId}")
    public ResponseEntity<ApiResponse> banStudent(@PathVariable String studentId) {
        boolean success = roleService.banStudent(studentId);
        if (success) {
            return ResponseEntity.ok(new ApiResponse(true, "Student banned successfully.", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Student not found or cannot be banned.", null));
    }

    @PostMapping("/add/instructor")
    public ResponseEntity<ApiResponse> addInstructor(@RequestBody Map<String, Object> payload) {
        String facultyId = (String) payload.get("facultyId");
        String courseId = (String) payload.get("courseId");
        String departmentId = (String) payload.get("departmentId");
        String name = (String) payload.get("name");
        String email = (String) payload.get("email");
        UserAccount newFaculty = new UserAccount();
        newFaculty.setEmail(email);
        newFaculty.setName(name);

        String defaultPassword = newFaculty.getName().replace(" ", "_") + "#1234";
        boolean success = roleService.addInstructor(newFaculty, defaultPassword, departmentId, courseId, facultyId);
        if (success) {
            return ResponseEntity.ok(new ApiResponse(true, "Instructor added successfully.", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to add Instructor.", null));
    }
    
    @PostMapping("/add/faculty")
    public ResponseEntity<ApiResponse> addFaculty(@RequestBody Map<String, Object> payload) {
        String facultyId = (String) payload.get("facultyId");
        String name = (String) payload.get("name");
        String email = (String) payload.get("email");
        UserAccount newFaculty = new UserAccount();
        newFaculty.setEmail(email);
        newFaculty.setName(name);

        String defaultPassword = newFaculty.getName().replace(" ", "_") + "#1234";
        boolean success = roleService.addFaculty(newFaculty, defaultPassword,facultyId);
        if (success) {
            return ResponseEntity.ok(new ApiResponse(true, "Faculty member added successfully.", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to add faculty member.", null));
    }
}
