package com.smartedudocs.backend.model;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "saved_document")
public class SavedDocument {
    @Id
    private ObjectId id;
    private Date createdDate;
    private ObjectId userId;
    private ObjectId documentId;

    // Default constructor
    public  SavedDocument() {
    }

    // Parameterized constructor
    public SavedDocument(ObjectId id, ObjectId userId,ObjectId documentId) {
        this.id = id;
        this.createdDate = new Date();
        this.userId = userId;
        this.documentId = documentId;
    }

    // Getters and Setters
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }
    public ObjectId getDocumentId() {
        return documentId;
    }

    public void setDocumnetId(ObjectId documentId) {
        this.documentId = documentId;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public ObjectId getUserId() {
        return userId;
    }

    public void setUserId(ObjectId userId) {
        this.userId = userId;
    }

}
