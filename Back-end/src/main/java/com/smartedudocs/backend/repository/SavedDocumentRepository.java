package com.smartedudocs.backend.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartedudocs.backend.model.SavedDocument;

@Repository
public interface SavedDocumentRepository extends MongoRepository<SavedDocument, ObjectId> {
    
    // Custom query to find all documents by userId
    List<SavedDocument> findByUserId(ObjectId userId);
    
    Optional<SavedDocument> findByUserIdAndDocumentId(ObjectId userId, ObjectId documentId);

    // Find documents created after a specific date
    List<SavedDocument> findByCreatedDateAfter(Date createdDate);
}
