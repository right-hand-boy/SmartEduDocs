package com.smartedudocs.backend.service;
// Specifies the package for the service layer, responsible for business logic.

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartedudocs.backend.model.UserAccount;
import com.smartedudocs.backend.repository.FacultyAdminDetailsRepository;
import com.smartedudocs.backend.repository.UserAccountRepository;
import com.smartedudocs.backend.utils.JwtService;
// Imports UserAccountRepository, used to interact with the database for userAccountUserAccount-related operations.

@Service
// Indicates that this class is a Spring service component.
public class AuthService {
    private final UserAccountRepository userAccountRepository; // Repository for userAccountUserAccount data access.
    private final PasswordEncoder passwordEncoder; // Encoder for password encryption and verification.
    private final FacultyAdminDetailsRepository facultyAdminDetailsRepository;
    private final JwtService jwtService;

    // Constructor for dependency injection of UserAccountRepository and PasswordEncoder.
    public AuthService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder,FacultyAdminDetailsRepository facultyAdminDetailsRepository,JwtService jwtService) {
        this.userAccountRepository = userAccountRepository; // Initializes the UserAccountRepository dependency.
        this.passwordEncoder = passwordEncoder; // Initializes the PasswordEncoder dependency.
        this.facultyAdminDetailsRepository = facultyAdminDetailsRepository;
        this.jwtService = jwtService;
    }

    public  Map<String, Object> signup(UserAccount userAccountUserAccount) {
        // Check if userAccountUserAccount already exists
        Optional<UserAccount> existingUserAccount = userAccountRepository.findByEmail(userAccountUserAccount.getEmail());
        if (existingUserAccount.isPresent()) {
            // If a userAccountUserAccount with the provided email exists, throw an exception.
            throw new RuntimeException("UserAccount with this email already exists");
        }

        // Set the userAccountUserAccount's name to the part of their email before the '@' symbol.
        userAccountUserAccount.setName(userAccountUserAccount.getEmail().split("@")[0]);

        // Encrypt the userAccountUserAccount's password before saving it to the database.
        userAccountUserAccount.setPassword(passwordEncoder.encode(userAccountUserAccount.getPassword()));
        userAccountUserAccount.setUserRole("student");
        // Save the new userAccountUserAccount to the database and return the saved userAccountUserAccount.
        UserAccount newUserAccount = userAccountRepository.save(userAccountUserAccount);
        Map<String, Object> userAccountDetails = new HashMap<>();
        userAccountDetails.put("email", newUserAccount.getEmail());
        userAccountDetails.put("name", newUserAccount.getName());
        userAccountDetails.put("id", newUserAccount.getId().toString());
        userAccountDetails.put("role", newUserAccount.getUserRole());

        return userAccountDetails;
    }

    public Map<String, Object> login(String email, String password, boolean rememberMe) {
        // Find the userAccountUserAccount by email. If not found, throw an exception with "Invalid credentials".
        UserAccount userAccountUserAccount = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        // Check if the provided password matches the stored hashed password.
        if (!passwordEncoder.matches(password, userAccountUserAccount.getPassword())) {
            // If the password is incorrect, throw an exception with "Invalid credentials".
            throw new RuntimeException("Invalid credentials");
        }

        // If the credentials are valid, return the userAccountUserAccount.
        UserAccount loggedInUserAccount = userAccountUserAccount;

        Map<String, Object> userAccountDetails = new HashMap<>();
        userAccountDetails.put("email", loggedInUserAccount.getEmail());
        userAccountDetails.put("name", loggedInUserAccount.getName());
        userAccountDetails.put("id", loggedInUserAccount.getId().toString());
        userAccountDetails.put("role", loggedInUserAccount.getUserRole());

        if ("faculty".equals(loggedInUserAccount.getUserRole())) {
            String facultyId = facultyAdminDetailsRepository.findByUserId(loggedInUserAccount.getId())
                    .map(facultyAdmin -> {
                        return facultyAdmin.getFacultyId().toString();
                    })
                    .orElseThrow(() -> new IllegalArgumentException("Invalid faculty admin ID"));
            userAccountDetails.put("facultyId", facultyId);
        }
        // Generate a JWT token if "rememberMe" is true
        if (rememberMe) {
            String token = jwtService.generateTokenWithExpiry(loggedInUserAccount, 60 * 60); // 1 hour in seconds
            userAccountDetails.put("token", token);
        }

        return userAccountDetails;
    }
    
    public Map<String, Object> validateToken(String token) {
        // Get the email from the token and fetch userAccount details
            String email = jwtService.getSubjectFromToken(token);
            UserAccount userAccount = getUserAccountByEmail(email);

            // Create a map to hold userAccount details
            Map<String, Object> userAccountDetails = new HashMap<>();
            userAccountDetails.put("email", userAccount.getEmail());
            userAccountDetails.put("name", userAccount.getName());
            userAccountDetails.put("id", userAccount.getId().toString());
            userAccountDetails.put("role", userAccount.getUserRole());
            if ("faculty".equals(userAccount.getUserRole())) {
                String facultyId = facultyAdminDetailsRepository.findByUserId(userAccount.getId())
                        .map(facultyAdmin -> {
                            return facultyAdmin.getFacultyId().toString();
                        })
                        .orElseThrow(() -> new IllegalArgumentException("Invalid faculty admin ID"));
                userAccountDetails.put("facultyId", facultyId);
            }
            
            return userAccountDetails;
    }
   
    public UserAccount getUserAccountByEmail(String email) {
        // Retrieve the userAccountUserAccount by email. If not found, throw an exception with "UserAccount not found".
        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("UserAccount not found with email: " + email));
    }

}
