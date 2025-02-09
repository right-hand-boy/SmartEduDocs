package com.smartedudocs.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final DocumentRepository documentRepository;
    public DepartmentService(DepartmentRepository departmentRepository, FacultyRepository facultyRepository,DocumentRepository documentRepository,CourseRepository courseRepository) {
        this.departmentRepository = departmentRepository;
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.documentRepository = documentRepository;
    }

    // Get all departments with faculty details
    public List<Map<String, Object>> getAllDepartmentsWithFaculty() {
        List<Department> departmentsList = departmentRepository.findAll();

        return departmentsList.stream().map(department -> {
            String facultyName = facultyRepository.findById(department.getFacultyId().toString())
                .map(Faculty::getName)
                .orElse("Unknown Faculty");

            Map<String, Object> departmentMap = new HashMap<>();
            departmentMap.put("id", department.getId().toString());
            departmentMap.put("departmentName", department.getName());
            departmentMap.put("description", department.getDescription());
            departmentMap.put("courseCount", department.getCourseCount());
            departmentMap.put("facultyName", facultyName);

            return departmentMap;
        }).toList();
    }

    // Get all departments
    public List<Map<String, Object>> getAllDepartments() {
        List<Department> departmentsList=departmentRepository.findAll();
        List<Map<String, Object>> departments = departmentsList.stream().map(department -> {
            Map<String, Object> departmentMap = new HashMap<>();
            departmentMap.put("id", department.getId().toString());
            departmentMap.put("name", department.getName());
            departmentMap.put("description", department.getDescription());
            departmentMap.put("courseCount", department.getCourseCount());
            departmentMap.put("facultyId", department.getFacultyId().toString());
            return departmentMap;
        }).toList();
        return departments;
    }

    // Get departments by faculty
    public Map<String, Object> getDepartmentsByFaculty(Faculty faculty) {
        List<Department> departments = departmentRepository.findByFacultyId(faculty.getId());

        List<Map<String, Object>> departmentList = new ArrayList<>();
        for (Department department : departments) {
            Map<String, Object> departmentInfo = new HashMap<>();
            departmentInfo.put("id", department.getId().toString());
            departmentInfo.put("departmentName", department.getName());
            departmentInfo.put("description", department.getDescription());
            departmentInfo.put("courseCount", department.getCourseCount());
            departmentList.add(departmentInfo);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("facultyName", faculty.getName());
        response.put("departments", departmentList);
        return response;
    }
    public Map<String, Object> getDepartmentsNameByFaculty(Faculty faculty) {
        List<Department> departments = departmentRepository.findByFacultyId(faculty.getId());

        List<Map<String, Object>> departmentList = new ArrayList<>();
        for (Department department : departments) {
            Map<String, Object> departmentInfo = new HashMap<>();
            departmentInfo.put("id", department.getId().toString());
            departmentInfo.put("departmentName", department.getName());
            departmentList.add(departmentInfo);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("facultyName", faculty.getName());
        response.put("departments", departmentList);
        return response;
    }
    public List<Map<String, Object>> getDepartmentsNames() {
        List<Department> departments = departmentRepository.findAll();

        List<Map<String, Object>> departmentList = new ArrayList<>();
        for (Department department : departments) {
            Map<String, Object> departmentInfo = new HashMap<>();
            departmentInfo.put("id", department.getId().toString());
            departmentInfo.put("departmentName", department.getName());
            departmentList.add(departmentInfo);
        }

        return departmentList;
    }

    // Add a new department
    public Map<String, Object> addDepartment(Department department) {
        return facultyRepository.findById(department.getFacultyId().toString())
            .map(faculty -> {
                faculty.setDepartmentCount(faculty.getDepartmentCount() + 1);
                facultyRepository.save(faculty);

                department.setCourseCount(0);
                Department savedDepartment = departmentRepository.save(department);
                Map<String, Object> departmentInfo = new HashMap<>();
                departmentInfo.put("id", savedDepartment.getId().toString());
                departmentInfo.put("facultyName", faculty.getName());
                departmentInfo.put("departmentName", savedDepartment.getName());
                departmentInfo.put("description", savedDepartment.getDescription());
                departmentInfo.put("courseCount", savedDepartment.getCourseCount());

                return departmentInfo;
            }).orElse(null);
    }

    // Edit an existing department
    public Map<String, Object> editDepartment(Department department) {
        return facultyRepository.findById(department.getFacultyId().toString()).map(newFaculty -> {
            Optional<Department> dept = departmentRepository.findById(department.getId().toString());
           
            if (!department.getId().toString().equals(dept.get().getId().toString())) {
                Optional<Faculty> oldfaculty = facultyRepository.findById(dept.get().getFacultyId().toString());
                newFaculty.setDepartmentCount(newFaculty.getDepartmentCount() + 1);
                oldfaculty.get().setDepartmentCount(oldfaculty.get().getDepartmentCount() - 1);
                facultyRepository.save(newFaculty);
                facultyRepository.save(oldfaculty.get());
            }
            dept.get().setName(department.getName());
            dept.get().setDescription(department.getDescription());
            dept.get().setFacultyId(department.getFacultyId());
            Department updatedDepartment = departmentRepository.save(dept.get());
            Map<String, Object> departmentInfo = new HashMap<>();
            departmentInfo.put("id", updatedDepartment.getId().toString());
            departmentInfo.put("departmentName", updatedDepartment.getName());
            departmentInfo.put("facultyName", newFaculty.getName());
            departmentInfo.put("description", updatedDepartment.getDescription());
            departmentInfo.put("courseCount", updatedDepartment.getCourseCount());
            return departmentInfo;
        }).orElse(null);
    }

    // Delete a department
    public boolean deleteDepartment(String id) {
        return departmentRepository.findById(id).map(department -> {
            Optional<Faculty> faculty = facultyRepository.findById(department.getFacultyId().toString());
            List<Course> courses = courseRepository.findByDepartmentId(department.getId());
            for(Course course:courses){
                List<Documents> documents = documentRepository.findByCourseId(course.getId());
                for (Documents doc : documents) {
                    documentRepository.delete(doc);
                }
                courseRepository.delete(course);
            }
            if (faculty.isPresent()) {
                faculty.get().setDepartmentCount(faculty.get().getDepartmentCount() - 1);
                facultyRepository.save(faculty.get());
            }
            departmentRepository.delete(department);
            return true;
        }).orElse(false);
    }
}
