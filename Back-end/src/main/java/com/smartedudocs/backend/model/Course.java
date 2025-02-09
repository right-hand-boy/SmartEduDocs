package com.smartedudocs.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "courses")
public class Course {
    
    @Id
    private ObjectId id;
    private String name;
    private String courseCode;
    private String description;
    private ObjectId facultyId;
    private ObjectId departmentId;
    private Integer bookCount;

    // Getter and setter for course ID
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    // Getter and setter for course name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and setter for course code
    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    // Getter and setter for course description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Getter and setter for faculty ID (MongoDB ObjectId)
    public ObjectId getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(ObjectId facultyId) {
        this.facultyId = facultyId;
    }

    // Getter and setter for department ID (MongoDB ObjectId)
    public ObjectId getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(ObjectId departmentId) {
        this.departmentId = departmentId;
    }
    public Integer getBookCount() {
        return bookCount;
    }
    public void setBookCount(Integer bookCount) {
        this.bookCount = bookCount;
    }


}
