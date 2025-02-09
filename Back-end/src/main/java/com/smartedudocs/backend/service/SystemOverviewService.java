package com.smartedudocs.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartedudocs.backend.repository.CourseRepository;
import com.smartedudocs.backend.repository.DepartmentRepository;
import com.smartedudocs.backend.repository.DocumentRepository;
import com.smartedudocs.backend.repository.FacultyRepository;
import com.smartedudocs.backend.repository.UserAccountRepository;

@Service
public class SystemOverviewService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DocumentRepository documentRepository;

    public long getTotalUsers() {
        return userAccountRepository.count();
    }

    public long getTotalFaculties() {
        return facultyRepository.count();
    }

    public long getTotalStudents() {
        return userAccountRepository.countByUserRole("student");
    }
    public long getTotalFaculty() {
        return userAccountRepository.countByUserRole("faculty");
    }
    public long getTotalInstructors() {
        return userAccountRepository.countByUserRole("instructor");
    }

    public long getTotalDepartments() {
        return departmentRepository.count();
    }

    public long getTotalCourses() {
        return courseRepository.count();
    }

    public long getTotalUploadedDocuments() {
        return documentRepository.count();
    }
    public Map<String, Long> getSystemOverview() {
        Map<String, Long> overview = new HashMap<>();
        overview.put("totalUsers", getTotalUsers());
        overview.put("totalFacultyHead", getTotalFaculty());
        overview.put("totalInstrucors", getTotalInstructors());
        overview.put("totalStudents", getTotalStudents());
        overview.put("totalDepartments", getTotalDepartments());
        overview.put("totalFaculties", getTotalFaculties());
        overview.put("totalCourses", getTotalCourses());
        overview.put("totalUploadedDocuments", getTotalUploadedDocuments());
 
        return overview;
    }

}
