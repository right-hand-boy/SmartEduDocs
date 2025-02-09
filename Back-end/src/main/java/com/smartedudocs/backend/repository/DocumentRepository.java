package com.smartedudocs.backend.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartedudocs.backend.model.Documents;

public interface DocumentRepository extends MongoRepository<Documents, String> {
    List<Documents> findByFacultyId(ObjectId facultyId);
    List<Documents> findByCourseId(ObjectId courseId);
    List<Documents> findByUserId(ObjectId userId);
}

