package com.smartedudocs.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection="faculty_admin_details")
public class FacultyAdminDetails {
    // @Field("user_id")
    @Id
    private ObjectId id;
    private ObjectId userId;
    // @Field("faculty_id")
    private  ObjectId facultyId;

    public FacultyAdminDetails() {}
    
    public FacultyAdminDetails(ObjectId userId, ObjectId facultyId) {
        this.userId = userId;
        this.facultyId = facultyId;
    }

    public ObjectId getId() {
        return id;
    }
    public ObjectId getUserId() {
        return userId;
    }
    public ObjectId getFacultyId() {
        return facultyId;
    }
    public void setUserId(ObjectId userId) {
        this.userId=userId;
    }
    public void setFacultyId(ObjectId facultyId) {
        this.facultyId=facultyId;
    }
    

}
