package com.smartedudocs.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.smartedudocs.backend.model.Course;
import com.smartedudocs.backend.model.Department;
import com.smartedudocs.backend.model.Documents;
import com.smartedudocs.backend.model.Faculty;
import com.smartedudocs.backend.repository.CourseRepository;
import com.smartedudocs.backend.repository.DepartmentRepository;
import com.smartedudocs.backend.repository.DocumentRepository;
import com.smartedudocs.backend.repository.FacultyRepository;

@Service
public class CourseService {


    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final DocumentRepository documentRepository;
    public CourseService(CourseRepository courseRepository,DepartmentRepository departmentRepository,FacultyRepository facultyRepository, DocumentRepository documentRepository) {
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
        this.documentRepository=documentRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<Map<String, Object>> getAllCourses() {
        List<Course> coursesList = courseRepository.findAll();
        List<Map<String, Object>> courses = coursesList.stream().map(course -> {
                String departmentName = departmentRepository.findById(course.getDepartmentId().toString()).map(Department::getName).orElse("Unknown Departmnt");
                Map<String, Object> courseMap = new HashMap<>();
                courseMap.put("id", course.getId().toString());
                courseMap.put("name", course.getName());
                courseMap.put("description", course.getDescription());
                courseMap.put("bookCount", course.getBookCount());
                courseMap.put("courseCode", course.getCourseCode());
                courseMap.put("departmentName", departmentName);
                return courseMap;
         }).toList();
         return courses;
    }
    // Add a new course
    public Map<String, Object> addCourse(Course course) {
    // Check if the department exists
        return departmentRepository.findById(course.getDepartmentId().toString()).map(department -> {
            // Validate if the department belongs to the specified faculty
            if (!department.getFacultyId().toString().equals(course.getFacultyId().toString())) {
                throw new RuntimeException("Invalid department and faculty combination.");
            }
            
            // Check if the faculty exists
            return facultyRepository.findById(course.getFacultyId().toString()).map(faculty -> {
                // Set the initial bookCount to 0
                course.setBookCount(0);
                department.setCourseCount(department.getCourseCount() + 1);
                departmentRepository.save(department);
                // Save and return the course
                Course newCourse= courseRepository.save(course);
                Optional<Department> dept = departmentRepository.findById(course.getDepartmentId().toString());
           
                Map<String, Object> addedCourse = new HashMap<>();
                addedCourse.put("id", newCourse.getId().toString());
                addedCourse.put("departmentName", dept.get().getName());
                addedCourse.put("name", newCourse.getName());
                addedCourse.put("courseCode", newCourse.getCourseCode());
                addedCourse.put("description", newCourse.getDescription());
                
                return addedCourse;
                
            }).orElseThrow(() -> new RuntimeException("Faculty not found for ID: " + course.getFacultyId()));
                
        }).orElseThrow(() -> new RuntimeException("Department not found for ID: " + course.getDepartmentId()));
    }

    public Map<String, Object> editCourse(Course course) {
        // Fetch existing course
        Optional<Course> existingCourseOpt = courseRepository.findById(course.getId().toString());
        if (!existingCourseOpt.isPresent()) {
            return null; // Course doesn't exist
        }

        // Fetch the department and validate it
        Department newDepartment = departmentRepository.findById(course.getDepartmentId().toString())
                .orElseThrow(() -> new RuntimeException("Department not found for ID: " + course.getDepartmentId()));
        
        // Check if department belongs to the specified faculty
        if (!newDepartment.getFacultyId().toString().equals(course.getFacultyId().toString())) {
            throw new RuntimeException("Invalid department and faculty combination.");
        }

        // Fetch faculty to validate it
        Faculty faculty = facultyRepository.findById(course.getFacultyId().toString())
                .orElseThrow(() -> new RuntimeException("Faculty not found for ID: " + course.getFacultyId()));

        // Update course count in the old and new departments
        Course existingCourse = existingCourseOpt.get();
        String oldCourseDepartmentId = existingCourse.getDepartmentId().toString();
        Department oldDepartment = departmentRepository.findById(oldCourseDepartmentId)
                .orElseThrow(() -> new RuntimeException("Old department not found for ID: " + oldCourseDepartmentId));

        updateCourseCount(oldDepartment, newDepartment);

        // Update course details
        existingCourse.setName(course.getName());
        existingCourse.setCourseCode(course.getCourseCode());
        existingCourse.setDescription(course.getDescription());
        existingCourse.setFacultyId(course.getFacultyId());
        existingCourse.setDepartmentId(course.getDepartmentId());

        // Save updated course and departments
        departmentRepository.save(oldDepartment);
        departmentRepository.save(newDepartment);
        Course editedCourse = courseRepository.save(existingCourse);

        Optional<Department> dept = departmentRepository.findById(course.getDepartmentId().toString());
        Map<String, Object> updatedCourse = new HashMap<>();
        updatedCourse.put("id", editedCourse.getId().toString());
        updatedCourse.put("name", editedCourse.getName());
        updatedCourse.put("departmentName", dept.get().getName());
        updatedCourse.put("courseCode", editedCourse.getCourseCode());
        updatedCourse.put("description", editedCourse.getDescription());
            
        return updatedCourse;
    }

    // Helper method to update course count
    private void updateCourseCount(Department oldDepartment, Department newDepartment) {
        oldDepartment.setCourseCount(oldDepartment.getCourseCount() - 1);
        newDepartment.setCourseCount(newDepartment.getCourseCount() + 1);
    }
    
    public Map<String, Object> getCourseDetail(String courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (!course.isPresent()) {
            return null; // If course doesn't exist, return null
        }
        
        Optional<Department> department = departmentRepository.findById(course.get().getDepartmentId().toString());
        List<Documents> documents = documentRepository.findByCourseId(course.get().getId());

        Map<String, Object> courseInfo = new HashMap<>();
        courseInfo.put("id", course.get().getId().toString());
        courseInfo.put("departmentName", department.map(Department::getName).orElse("Unknown"));
        courseInfo.put("description", course.get().getDescription());
        courseInfo.put("courseName", course.get().getName());
        courseInfo.put("courseCode", course.get().getCourseCode());
        courseInfo.put("bookCount", course.get().getBookCount());

        List<Map<String, Object>> documentsList = new ArrayList<>();
        for (Documents document : documents) {
            Map<String, Object> documentInfo = new HashMap<>();
            documentInfo.put("id", document.getId().toString());
            documentInfo.put("title", document.getTitle());
            documentInfo.put("description", document.getDescription());
            documentInfo.put("size", document.getSize());
            documentInfo.put("url", document.getDocument());
            documentInfo.put("coverImageUrl", document.getCoverImageUrl());
            documentsList.add(documentInfo);
        }
        courseInfo.put("documents", documentsList);

        return courseInfo;
    }

    public Map<String, Object> getCoursesNameByFaculty(Faculty faculty) {
            List<Course> courses = courseRepository.findByFacultyId(faculty.getId());

            List<Map<String, Object>> courseList = new ArrayList<>();
            for (Course course : courses) {
                Optional<Department> department = departmentRepository.findById(course.getDepartmentId().toString());
                Map<String, Object> courseInfo = new HashMap<>();
                courseInfo.put("id", course.getId().toString());
                courseInfo.put("departmentId", department.get().getId().toString());
                courseInfo.put("courseName", course.getName());
                courseList.add(courseInfo);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("facultyName", faculty.getName());
            response.put("courses", courseList);
            return response;
        }

    public List<Map<String, Object>> getCoursesByDepartment(ObjectId departmentId) {
            List<Course> courses = courseRepository.findByDepartmentId(departmentId);

            List<Map<String, Object>> courseList = new ArrayList<>();
            for (Course course : courses) {
                Optional<Department> department = departmentRepository.findById(course.getDepartmentId().toString());
                Map<String, Object> courseInfo = new HashMap<>();
                courseInfo.put("id", course.getId().toString());
                courseInfo.put("name", course.getName());
                courseInfo.put("courseCode", course.getCourseCode());
                courseInfo.put("departmentId", course.getDepartmentId());
                courseInfo.put("departmentName", department.get().getName());
                courseInfo.put("description", course.getDescription());
                courseInfo.put("bookCount", course.getBookCount());
                courseList.add(courseInfo);
            }

            return courseList;
        }
    public Map<String, Object> getCoursesByFaculty(Faculty faculty) {
            List<Course> courses = courseRepository.findByFacultyId(faculty.getId());

            List<Map<String, Object>> courseList = new ArrayList<>();
            for (Course course : courses) {
                Optional<Department> department = departmentRepository.findById(course.getDepartmentId().toString());
                Map<String, Object> courseInfo = new HashMap<>();
                courseInfo.put("id", course.getId().toString());
                courseInfo.put("name", course.getName());
                courseInfo.put("courseCode", course.getCourseCode());
                courseInfo.put("departmentId", course.getDepartmentId());
                courseInfo.put("departmentName", department.get().getName());
                courseInfo.put("description", course.getDescription());
                courseInfo.put("bookCount", course.getBookCount());
                courseList.add(courseInfo);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("facultyName", faculty.getName());
            response.put("courses", courseList);
            return response;
        }

    // Delete a course by its ID
    public boolean deleteCourse(ObjectId courseId) {
        return courseRepository.findById(courseId.toString()).map(course -> {
            Optional<Department> department = departmentRepository.findById(course.getDepartmentId().toString());
            List<Documents> documents = documentRepository.findByCourseId(courseId);
            
            for (Documents doc : documents) {
                documentRepository.delete(doc);
            }
            
            if (department.isPresent()) {
                department.get().setCourseCount(department.get().getCourseCount() - 1);
                departmentRepository.save(department.get());
            }
            courseRepository.delete(course);
            return true;
        }).orElse(false);  // Return false if the course does not exist
    }

}
