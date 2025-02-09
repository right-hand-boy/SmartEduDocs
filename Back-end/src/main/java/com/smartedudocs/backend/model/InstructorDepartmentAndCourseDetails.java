package com.smartedudocs.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Instructor_department_course_details")
public class InstructorDepartmentAndCourseDetails {
    // @Field("user_id")
    @Id
    private ObjectId id;
    private ObjectId userId;
    private ObjectId courseId;
    private ObjectId departmentId;
    private ObjectId facultyId;


    public InstructorDepartmentAndCourseDetails() {}
    
    public InstructorDepartmentAndCourseDetails(ObjectId userId, ObjectId courseId, ObjectId departmentId, ObjectId facultyId) {
        this.userId = userId;
        this.courseId = courseId;
        this.departmentId = departmentId;
        this.facultyId = facultyId;
    }

    public ObjectId getId() {
        return id;
    }
    public ObjectId getUserId() {
        return userId;
    }
    public ObjectId getCourseId() {
        return courseId;
    }
    public void setUserId(ObjectId userId) {
        this.userId=userId;
    }

    public void setCourseId(ObjectId courseId) {
        this.courseId = courseId;
    }
    public ObjectId getDepartmentId() {
        return departmentId;
    }
    public void setDepartmentId(ObjectId departmentId) {
        this.departmentId=departmentId;
    }
    public ObjectId getFacultyId() {
        return facultyId;
    }
    public void setFacultyId(ObjectId facultyId) {
        this.facultyId=facultyId;
    }
     
}
