package com.smartedudocs.backend.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.smartedudocs.backend.model.Documents;
import com.smartedudocs.backend.model.SavedDocument;
import com.smartedudocs.backend.repository.DocumentRepository;
import com.smartedudocs.backend.repository.SavedDocumentRepository;
import com.smartedudocs.backend.repository.UserAccountRepository;

@Service
public class SavedDocumentService {

    private final SavedDocumentRepository savedDocumentRepository;
    
    private final UserAccountRepository userAccountRepository;
    
    private final DocumentRepository documentRepository;

    // Constructor Injection (can also be done without @Autowired if it's only one constructor)
    public SavedDocumentService(SavedDocumentRepository savedDocumentRepository,UserAccountRepository userAccountRepository,DocumentRepository documentRepository) {
        this.savedDocumentRepository = savedDocumentRepository;
        this.userAccountRepository = userAccountRepository;
        this.documentRepository = documentRepository;
    }

    public boolean addSavedDocument(SavedDocument savedDocument) {
        // Check if userId and documentId are valid
        if (savedDocument.getUserId() == null || savedDocument.getDocumentId() == null) {
            throw new IllegalArgumentException("User ID and Document ID must not be null.");
        }

        // Check if the user exists
        boolean userExists = userAccountRepository.findById(savedDocument.getUserId().toString()).isPresent();
        if (!userExists) {
            throw new IllegalArgumentException("User does not exist.");
        }

        // Check if the document exists
        boolean documentExists = documentRepository.findById(savedDocument.getDocumentId().toString()).isPresent();
        if (!documentExists) {
            throw new IllegalArgumentException("Document does not exist.");
        }
        Optional<SavedDocument> isExist = savedDocumentRepository.findByUserIdAndDocumentId(savedDocument.getUserId(),savedDocument.getDocumentId());
        if (isExist.isPresent()) {
            return true;
        }

        
        // Set the creation date
        savedDocument.setCreatedDate(new Date());

        // Save the document
        SavedDocument result = savedDocumentRepository.save(savedDocument);
        return result != null; // Return true if the document is successfully saved
    }

    // Delete a saved document by ID
    public boolean deleteSavedDocument(ObjectId documentId) {
        Optional<SavedDocument> savedDocument = savedDocumentRepository.findById(documentId);
        
        if (savedDocument.isPresent()) {
            savedDocumentRepository.delete(savedDocument.get());
            return true; 
        }
        
        return false; 
    }


    // Get saved documents by user ID
    public List<Map<String, Object>> getSavedDocumentsByUserId(ObjectId userId) {
        // Fetch saved documents from the repository
        List<SavedDocument> savedDocuments = savedDocumentRepository.findByUserId(userId);
        List<Map<String, Object>> savedDocumentList = new ArrayList<>();

        for (SavedDocument savedDocument : savedDocuments) {
            Optional<Documents> document = documentRepository.findById(savedDocument.getDocumentId().toString());
          
            Map<String, Object> savedDocumentInfo = new HashMap<>();
            savedDocumentInfo.put("id", savedDocument.getId().toString());
            savedDocumentInfo.put("documentId", document.get().getId().toString());
            savedDocumentInfo.put("title", document.get().getTitle());
            savedDocumentInfo.put("description", document.get().getDescription());
            savedDocumentInfo.put("courseId", document.get().getCourseId().toString());
            savedDocumentInfo.put("size", document.get().getSize());
            savedDocumentInfo.put("uploadedBy", document.get().getUploadedBy());
            savedDocumentInfo.put("url", document.get().getDocument());
            savedDocumentInfo.put("coverImageUrl", document.get().getCoverImageUrl());
        savedDocumentList.add(savedDocumentInfo);
        }
        
        return savedDocumentList;
    }
}
