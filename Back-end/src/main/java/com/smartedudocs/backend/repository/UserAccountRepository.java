package com.smartedudocs.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import com.smartedudocs.backend.model.UserAccount;

public interface UserAccountRepository extends MongoRepository<UserAccount, String> {
    List<UserAccount> findByUserRole(String role); // Find users by role

    Optional<UserAccount> findByEmail(String email); // Find a user by email
    long countByUserRole(@Param("role") String role);
}
