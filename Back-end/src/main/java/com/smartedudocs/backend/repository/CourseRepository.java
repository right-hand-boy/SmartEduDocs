package com.smartedudocs.backend.repository;


import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartedudocs.backend.model.Course;

public interface CourseRepository extends MongoRepository<Course, String> {
     List<Course> findByFacultyId(ObjectId facultyId);
     List<Course> findByDepartmentId(ObjectId departmentId);
}

