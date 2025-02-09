package com.smartedudocs.backend.model;

// Imports the annotations and classes for MongoDB document mapping and validation
import org.bson.types.ObjectId; // Annotation to specify the primary key
import org.springframework.data.annotation.Id; // Annotation to map the class to a MongoDB collection
import org.springframework.data.mongodb.core.mapping.Document; // Import ObjectId for default MongoDB ID generation

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull; // Validation annotation for non-empty fields

@Document(collection = "user_accounts") // Specifies the MongoDB collection name to store documents of this type
public class UserAccount {
    @Id
    private ObjectId id;       // Specifies this field as the primary key for the MongoDB document, using ObjectId

    private String name;       // Stores the user's name
    
    @NotNull(message = "Email is required") // Ensures the email field cannot be null
    @NotEmpty(message = "Email cannot be empty") // Ensures the email field cannot be empty
    private String email;      // Stores the user's email address

    @NotNull(message = "Password is required") // Ensures the password field cannot be null
    @NotEmpty(message = "Password cannot be empty") // Ensures the password field cannot be empty
    private String password;   // Stores the user's password

    private String userRole;   // Stores the user's role (e.g., "student", "admin")

    // Default constructor
    public UserAccount() {}

    // Parameterized constructor to initialize the user object with specific values
    public UserAccount(String name, String email, String password) {
        this.name = name;           // Assigns the provided name to the name field
        this.email = email;         // Assigns the provided email to the email field
        this.password = password;   // Assigns the provided password to the password field
        this.userRole = "student";  // Assigns a default role as "student"
    }

    // Getters and Setters
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
}
