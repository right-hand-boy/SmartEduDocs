package com.smartedudocs.backend.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartedudocs.backend.model.Department;

public interface DepartmentRepository extends MongoRepository<Department, String> {
     List<Department> findByFacultyId(ObjectId facultyId);
}
