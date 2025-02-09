package com.smartedudocs.backend.controller;

import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartedudocs.backend.model.SavedDocument;
import com.smartedudocs.backend.service.SavedDocumentService;
import com.smartedudocs.backend.utils.ApiResponse;

@RestController

@RequestMapping("/api")
public class SavedDocumentController {

    @Autowired
    private SavedDocumentService savedDocumentService;

    // Add a new saved document
    @PostMapping("/save/document")
    public ResponseEntity<ApiResponse> addSavedDocument(@RequestBody SavedDocument savedDocument) {
        try {
            if (savedDocument.getUserId() == null || savedDocument.getDocumentId() == null) {
                throw new IllegalArgumentException("User ID and Document ID must not be null.");
            }
            boolean isCreated = savedDocumentService.addSavedDocument(savedDocument);
            if (!isCreated) {
                return ResponseEntity.badRequest().body( new ApiResponse(false, "Faled to save document", null));
            }
            return ResponseEntity.ok().body(new ApiResponse(true, "Document saved successfully", null));
        } catch (IllegalArgumentException e) {
            ApiResponse response = new ApiResponse(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "An error occurred while saving the document. " + e.getMessage(), null);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Delete a saved document by ID
    @DeleteMapping("/saved-document/{id}")
    public ResponseEntity<ApiResponse> deleteSavedDocument(@PathVariable("id") String id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new IllegalArgumentException("Invalid Document ID format.");
            }

            boolean isDeleted = savedDocumentService.deleteSavedDocument(new ObjectId(id));
            if (isDeleted) {
                return ResponseEntity.ok(new ApiResponse(true, "Document deleted successfully", null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Document not found or already deleted", null));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "An error occurred while deleting the document.", null));
        }
    }


    // Get saved documents by user ID
    @GetMapping("/user/saved-documents/{userId}")
    public ResponseEntity<ApiResponse> getSavedDocumentsByUserId(@PathVariable("userId") String userId) {
        try {
            if (!ObjectId.isValid(userId)) {
                throw new IllegalArgumentException("Invalid User ID format.");
            }

             List<Map<String, Object>> documents = savedDocumentService.getSavedDocumentsByUserId(new ObjectId(userId));
            if (documents.isEmpty()) {
                ApiResponse response = new ApiResponse(true, "No documents found for the given User ID.", documents);
                return ResponseEntity.ok(response);
            }

            ApiResponse response = new ApiResponse(true, "Documents retrieved successfully", documents);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            ApiResponse response = new ApiResponse(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "An error occurred while retrieving the documents.", null);
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
