package com.smartedudocs.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
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

import com.smartedudocs.backend.model.Course;
import com.smartedudocs.backend.model.Department;
import com.smartedudocs.backend.model.Faculty;
import com.smartedudocs.backend.repository.DepartmentRepository;
import com.smartedudocs.backend.repository.FacultyRepository;
import com.smartedudocs.backend.service.CourseService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController
@RequestMapping("/api")

public class CourseController {

    
    private final CourseService courseService ;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;

    public CourseController(CourseService courseServicen, DepartmentRepository departmentRepository,FacultyRepository facultyRepository) {
        this.courseService = courseServicen;
        this.departmentRepository = departmentRepository;
        this.facultyRepository = facultyRepository;
        
    }
    @GetMapping("/courses_with_departments")
    public ResponseEntity<ApiResponse> getAllCoursesWithDepartment() {
        try {
           List<Map<String, Object>> courses = courseService.getAllCourses();
            if (courses.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(true, "No courses found", null));
            }
            // Prepare list of mapped facultie           

            return ResponseEntity.ok(new ApiResponse(true, "Courses retrieved successfully", courses));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse> getCourseDetail(@PathVariable String courseId) {
        try {
            Map<String, Object> courseDetail = courseService.getCourseDetail(courseId);
            
            if (courseDetail == null) {
                return ResponseEntity.ok(new ApiResponse(true, "No courses found", null));
            }
            
            return ResponseEntity.ok(new ApiResponse(true, "Courses retrieved successfully", courseDetail));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }
    @GetMapping("/courses")
    public ResponseEntity<ApiResponse> getAllCourses() {
        try {
            List<Map<String,Object>> courses = courseService.getAllCourses();
            if (courses.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(true, "No courses found", null));
            }
            
            return ResponseEntity.ok(new ApiResponse(true, "Courses retrieved successfully", courses));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to retrieve courses", errorResponse));
        }
    }

    @GetMapping("/courses_name/{facultyId}")
    public ResponseEntity<ApiResponse> getCoursesNameInFaculty(@PathVariable String facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Faculty not found", null));
        }
        Map<String, Object> response = courseService.getCoursesNameByFaculty(faculty);
        return ResponseEntity.ok(new ApiResponse(true, "course in faculty retrieved successfully", response));
    }
    @GetMapping("/courses_in_department/{departmentId}")
    public ResponseEntity<ApiResponse> getCoursesInDepartment(@PathVariable String departmentId) {
        Department department = departmentRepository.findById(departmentId).orElse(null);
        if (department == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Department not found", null));
        }

        List<Map<String, Object>> response = courseService.getCoursesByDepartment(new ObjectId(departmentId));
        return ResponseEntity.ok(new ApiResponse(true, "Courses in department retrieved successfully", response));
    }
    @GetMapping("/courses_in_faculty/{facultyId}")
    public ResponseEntity<ApiResponse> getCoursesInFaculty(@PathVariable String facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Faculty not found", null));
        }

        Map<String, Object> response = courseService.getCoursesByFaculty(faculty);
        return ResponseEntity.ok(new ApiResponse(true, "Courses in faculty retrieved successfully", response));
    }

    // Endpoint to add a new course
    @PostMapping("/course")
    public ResponseEntity<ApiResponse> addCourse(@RequestBody Course course) {
        if (course.getName() == null || course.getCourseCode() == null || course.getDescription() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Name, courseCode, and description must not be null", null));
        }
        try {
            Map<String, Object> newCourse = courseService.addCourse(course);
            return ResponseEntity.ok(new ApiResponse(true, "Course added successfully", newCourse));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to add course", errorResponse));
        }
    }

    // Endpoint to edit an existing course
    @PatchMapping("/course")
    public ResponseEntity<ApiResponse> editCourse(@RequestBody Course course) {
        if (course.getId() == null || course.getName() == null || course.getCourseCode() == null || course.getDescription() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "ID, Name, courseCode, and description must not be null", null));
        }
        try {
            Map<String, Object> editedCourse = courseService.editCourse(course);
            if (editedCourse == null) {
                return ResponseEntity.ok(new ApiResponse(false, "Course not found", null));
            }

            return ResponseEntity.ok(new ApiResponse(true, "Course edited successfully", editedCourse));
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage()); // Pass the exact exception message
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), errorResponse));
        }

    }

    // Endpoint to delete a course by its ID
    @DeleteMapping("/course")
    public ResponseEntity<ApiResponse> deleteCourse(@RequestBody Map<String, String> request) {
        String idString = request.get("id");
        try {
            ObjectId id = new ObjectId(idString);  // Convert string ID to ObjectId
            boolean isDeleted = courseService.deleteCourse(id);
            if (!isDeleted) {
                return ResponseEntity.ok(new ApiResponse(false, "Course not found", null));
            }
            return ResponseEntity.ok(new ApiResponse(true, "Course deleted successfully", null));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to delete course", errorResponse));
        }
    }
}
