package com.smartedudocs.backend.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartedudocs.backend.model.InstructorDepartmentAndCourseDetails;

@Repository
public interface InstructorDepartmentAndCourseDetailsRepository extends MongoRepository<InstructorDepartmentAndCourseDetails, ObjectId> {
    Optional<InstructorDepartmentAndCourseDetails> findByUserIdAndCourseId(ObjectId userId,ObjectId courseId);
    List<InstructorDepartmentAndCourseDetails> findByUserId(ObjectId userId);
    List<InstructorDepartmentAndCourseDetails> findByFacultyId(ObjectId facultyId);
}
