package com.smartedudocs.backend.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartedudocs.backend.model.FacultyAdminDetails;

@Repository
public interface FacultyAdminDetailsRepository extends MongoRepository<FacultyAdminDetails, ObjectId> {
    Optional<FacultyAdminDetails> findByUserId(ObjectId id);
}
