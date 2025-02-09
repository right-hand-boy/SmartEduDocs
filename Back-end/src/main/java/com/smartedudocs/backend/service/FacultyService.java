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
public class FacultyService {
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final DocumentRepository documentRepository;
    private final DepartmentRepository departmentRepository;
    public FacultyService(FacultyRepository facultyRepository,DocumentRepository documentRepository,CourseRepository courseRepository,DepartmentRepository departmentRepository) {
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.documentRepository = documentRepository;
        this.departmentRepository = departmentRepository;
    }

    // Get all faculties
    public List<Map<String, Object>> getAllFaculties() {
        List<Faculty> facultiesList = facultyRepository.findAll();
            if (facultiesList.isEmpty()) {
                return new ArrayList<>();
            }

            // Prepare list of mapped faculties
            List<Map<String, Object>> faculties = facultiesList.stream().map(faculty -> {
                Map<String, Object> facultyMap = new HashMap<>();
                facultyMap.put("id", faculty.getId().toString());
                facultyMap.put("name", faculty.getName());
                facultyMap.put("description", faculty.getDescription());
                facultyMap.put("departmentCount", faculty.getDepartmentCount());
                return facultyMap;
            }).toList();
        return faculties;
    }

    // Edit an existing faculty
    public Map<String, Object> editFaculty(Faculty faculty) {
        if (faculty.getId() == null) {
            throw new IllegalArgumentException("Faculty ID must not be null");
        }

        // Fetch existing faculty by ObjectId
        return facultyRepository.findById(faculty.getId().toString()).map(existingFaculty -> {
            existingFaculty.setName(faculty.getName());
            existingFaculty.setDescription(faculty.getDescription());
          
            
            Faculty editedFaculty =   facultyRepository.save(existingFaculty);
            Map<String, Object> modifiedFacultyMap = new HashMap<>();
            modifiedFacultyMap.put("id", editedFaculty.getId().toString());
            modifiedFacultyMap.put("name", editedFaculty.getName());
            modifiedFacultyMap.put("description", editedFaculty.getDescription());

            return modifiedFacultyMap;

        }).orElseThrow(() -> new RuntimeException("Faculty not found"));
    }

    // Add a new faculty
    public Map<String, Object> addFaculty(Faculty faculty) {
        faculty.setDepartmentCount(0);
        Faculty newFaculty = facultyRepository.save(faculty);
        Map<String, Object> addedFaculty = new HashMap<>();
        addedFaculty.put("id", newFaculty.getId().toString());
        addedFaculty.put("name", newFaculty.getName());
        addedFaculty.put("description", newFaculty.getDescription());
        addedFaculty.put("departmentCount", newFaculty.getDepartmentCount());
        
        return addedFaculty;
    }

    // Find faculty by ID and delete
    public boolean findByidAndDelete(ObjectId id) {
        Optional<Faculty> faculty = facultyRepository.findById(id.toString());
        if (faculty.isPresent()) {
            List<Department> departments = departmentRepository.findByFacultyId(faculty.get().getId());
                for (Department department : departments) {
                    List<Course> courses = courseRepository.findByDepartmentId(department.getId());
                    for (Course course : courses) {
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
                }
                facultyRepository.delete(faculty.get());
                return true;
            }
        return false;
    }
}
