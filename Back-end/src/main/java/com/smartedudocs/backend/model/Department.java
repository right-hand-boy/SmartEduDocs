package com.smartedudocs.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "department")
public class Department {
    @Id
    private ObjectId id;  // Change the type to ObjectId for MongoDB compatibility
    private String name;
    private String description;
    private ObjectId facultyId;  // Use ObjectId to link to the Faculty model
    private Integer courseCount;
    // Default constructor
    public Department() {}

    // Parameterized constructor
    public Department(String name, String description, ObjectId facultyId) {
        this.name = name;
        this.description = description;
        this.facultyId = facultyId;
    }

    // Getter and Setter for id
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    // Getter and Setter for name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and Setter for description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Getter and Setter for facultyId
    public ObjectId getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(ObjectId facultyId) {
        this.facultyId = facultyId;
    }
    public Integer getCourseCount() {
        return courseCount;
    }
    public void setCourseCount(Integer courseCount) {
        this.courseCount = courseCount;
    }
}
