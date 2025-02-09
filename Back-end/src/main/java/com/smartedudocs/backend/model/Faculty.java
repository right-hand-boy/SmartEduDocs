package com.smartedudocs.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "faculty")
public class Faculty {
    
    @Id
    private ObjectId id;  // Changed type to ObjectId to work with MongoDB

    private String name;
    private String description;
    private Integer departmentCount;

    // Default constructor
    public Faculty() {}

    // Parameterized constructor to initialize the Faculty object
    public Faculty(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    
    // Get the faculty's unique ObjectId
    public ObjectId getId() {
        return id;
    }

    // Get the faculty's name
    public String getName() {
        return name;
    }

    // Set the faculty's name
    public void setName(String name) {
        this.name = name;
    }

    // Get the faculty's description
    public String getDescription() {
        return description;
    }

    // Set the faculty's description
    public void setDescription(String description) {
        this.description = description;
    }
    // get the faculty's no of departments
    public Integer getDepartmentCount() {
        return departmentCount;
    }
    // set the faculty's no of departments
    public void setDepartmentCount(Integer departmentCount) {
        this.departmentCount = departmentCount;
    }
}
