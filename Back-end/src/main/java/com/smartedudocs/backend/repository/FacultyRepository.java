package com.smartedudocs.backend.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartedudocs.backend.model.Faculty;

public interface FacultyRepository extends MongoRepository<Faculty, String> {
    // Optional<Faculty> getAllFaculties();
    List<Faculty> findAll();
}


