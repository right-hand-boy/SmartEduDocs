package com.smartedudocs.backend.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartedudocs.backend.model.Documents;
import com.smartedudocs.backend.service.DocumentService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // Add a new document
    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> addDocument(
            @RequestPart("document") MultipartFile file,
            @RequestPart("metadata") String metadataJson) {

        try {
            // Parse metadata JSON into the Documents object
            ObjectMapper objectMapper = new ObjectMapper();
            Documents documentMetadata = objectMapper.readValue(metadataJson, Documents.class);

            // Validate input
            if (file.isEmpty() || documentMetadata == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "File or metadata is missing", null));
            }

            // Allowed MIME types for documents
            List<String> allowedMimeTypes = Arrays.asList(
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            );

            // Validate file type
            String contentType = file.getContentType();
            if (!allowedMimeTypes.contains(contentType)) {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                        .body(new ApiResponse(false, "Unsupported file type: " + contentType, null));
            }

            // Save the document
            Map<String, Object> savedDocument = documentService.storeDocument(documentMetadata, file);

            // Respond with success
            return ResponseEntity.ok(new ApiResponse(true, "Document uploaded successfully", savedDocument));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to upload document: " + e.getMessage(), null));
        }
    }


    // Update an existing document
    @PatchMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateDocument(
            @PathVariable("id") String documentId,
            @RequestPart(value = "document", required = false) MultipartFile file,
            @RequestPart("metadata") String metadataJson) {
        try {
            // Parse metadata JSON into the Documents object
            ObjectMapper objectMapper = new ObjectMapper();
            Documents documentMetadata = objectMapper.readValue(metadataJson, Documents.class);
            documentMetadata.setId(new ObjectId(documentId));

            // Validate input
            // if (documentMetadata == null || file.isEmpty()) {
            //     return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            //             .body(new ApiResponse(false, "Invalid metadata or file", null));
            // }

            Map<String, Object> updatedDocument = documentService.updateDocument(documentMetadata, file);
            return updatedDocument != null ? 
                ResponseEntity.ok(new ApiResponse(true, "Document updated successfully", updatedDocument)) :
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Document not found", null));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to update document: " + e.getMessage(), null));
        }
    }

    // Delete a document by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteDocument(@PathVariable("id") String documentId) {
        boolean isDeleted = documentService.deleteDocument(new ObjectId(documentId));
        return isDeleted ? ResponseEntity.ok(new ApiResponse(true, "Document deleted successfully", null)) :
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Document not found", null));
    }
    

    // Get all documents
    @GetMapping("/get/all")
    public ResponseEntity<ApiResponse> documents() {
        List<Map<String, Object>> documents = documentService.findAllDocuments();
        return documents.isEmpty() ? 
                ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body(new ApiResponse(false, "No documents found", null)) :
                ResponseEntity.ok(new ApiResponse(true, "Documents retrieved successfully", documents));
    }
    @GetMapping("/get/instructor_documents/{instructorId}")
    public ResponseEntity<ApiResponse> getInstructorDocuments(@PathVariable("instructorId") String instrutorId) {
        List<Map<String, Object>> documents = documentService.getInstructorDocuments(instrutorId);
        
        if (documents.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(false, "No documents found", new ArrayList<>()));
        }

        return ResponseEntity.ok(new ApiResponse(true, "Documents retrieved successfully", documents));
    }
    @GetMapping("/get/faculy_documents/{facultyId}")
    public ResponseEntity<ApiResponse> getFacultyDocuments(@PathVariable("facultyId") String facultyId) {
        List<Map<String, Object>> documents = documentService.getFacultyDocuments(new ObjectId(facultyId));
        
        if (documents.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(false, "No documents found", new ArrayList<>()));
        }

        return ResponseEntity.ok(new ApiResponse(true, "Documents retrieved successfully", documents));
    }

    // Get a document by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse> getDocumentById(@PathVariable("id") String documentId) {
        Map<String, Object> document = documentService.getDocumentDetail(documentId);
        
        if (document.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(false, "No document found", null));
        }

        return ResponseEntity.ok(new ApiResponse(true, "Documents retrieved successfully", document));
    }

}