package com.smartedudocs.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartedudocs.backend.model.Course;
import com.smartedudocs.backend.model.Department;
import com.smartedudocs.backend.model.Faculty;
import com.smartedudocs.backend.model.FacultyAdminDetails;
import com.smartedudocs.backend.model.InstructorDepartmentAndCourseDetails;
import com.smartedudocs.backend.model.UserAccount;
import com.smartedudocs.backend.repository.CourseRepository;
import com.smartedudocs.backend.repository.DepartmentRepository;
import com.smartedudocs.backend.repository.FacultyAdminDetailsRepository;
import com.smartedudocs.backend.repository.FacultyRepository;
import com.smartedudocs.backend.repository.InstructorDepartmentAndCourseDetailsRepository;
import com.smartedudocs.backend.repository.UserAccountRepository;
@Service
public class RoleService {
    private final UserAccountRepository userAccountRepository;
    private final FacultyAdminDetailsRepository facultyAdminDetailsRepository;
    private final InstructorDepartmentAndCourseDetailsRepository instructorDepartmentAndCourseDetailsRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    public RoleService(UserAccountRepository userAccountRepository,PasswordEncoder passwordEncoder,FacultyAdminDetailsRepository facultyAdminDetailsRepository,FacultyRepository facultyRepository, InstructorDepartmentAndCourseDetailsRepository instructorDepartmentAndCourseDetails,CourseRepository courseRepository,DepartmentRepository departmentRepository) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.facultyAdminDetailsRepository = facultyAdminDetailsRepository;
        this.facultyRepository = facultyRepository;
        this.instructorDepartmentAndCourseDetailsRepository = instructorDepartmentAndCourseDetails;
        this.departmentRepository = departmentRepository;
        this.courseRepository =courseRepository;
    }

    public  List<Map<String, Object>> getAllStudents() {
        List<UserAccount> studentsList = userAccountRepository.findByUserRole("student");

        // Transform the list of UserAccount into a list of maps
        List<Map<String, Object>> students = studentsList.stream().map(student -> {
            Map<String, Object> studentMap = new HashMap<>();
            studentMap.put("id", student.getId().toString());
            studentMap.put("name", student.getName());
            studentMap.put("email", student.getEmail());
            studentMap.put("role", student.getUserRole());
            return studentMap; // Return the transformed map
        }).toList();
        return students;
    }

    public List<Map<String, Object>> getAllFaculties() {
        // Fetch all faculty admins from userAccountRepository
        List<UserAccount> facultyAdmins = userAccountRepository.findByUserRole("faculty");

        // Map each faculty admin to their details and collect into a list
        return facultyAdmins.stream()
                .map(admin -> {
                    // Find facultyId using facultyAdminDetailsRepository
                    Optional<FacultyAdminDetails> adminDetails = facultyAdminDetailsRepository
                            .findByUserId(admin.getId());

                    // If admin details exist, fetch faculty name
                    if (adminDetails.isPresent()) {
                        Optional<Faculty> faculty = facultyRepository
                                .findById(adminDetails.get().getFacultyId().toString());
                        if (faculty.isPresent()) {
                            // Prepare the faculty details map
                            Map<String, Object> facultyDetails = new HashMap<>();
                            facultyDetails.put("id", admin.getId().toString());
                            facultyDetails.put("name", admin.getName());
                            facultyDetails.put("email", admin.getEmail());
                            facultyDetails.put("role", admin.getUserRole());
                            facultyDetails.put("facultyName", faculty.get().getName());
                            return facultyDetails; // Return the details map
                        }
                    }
                    return null; // Return null if faculty details are not found
                })
                .filter(Objects::nonNull) // Remove null entries
                .toList(); // Collect as a list
    }
   
    public List<Map<String, Object>> getAllInstructorsInfaculty(String facultyId) {
        // Fetch all faculty admins from userAccountRepository
        Optional<Faculty>faculty = facultyRepository.findById(facultyId);

        // Map each faculty admin to their details and collect into a lists
       
        if (faculty.isPresent()) {
            List<InstructorDepartmentAndCourseDetails> instructors = instructorDepartmentAndCourseDetailsRepository
                    .findByFacultyId(faculty.get().getId());

            return instructors.stream()
                    .map(instructor -> {
                        // Find facultyId using facultyAdminDetailsRepository

                        // If admin details exist, fetch faculty name
                        Optional<Department> department = departmentRepository
                                .findById(instructor.getDepartmentId().toString());
                        Optional<Course> course = courseRepository.findById(instructor.getCourseId().toString());
                        Optional<UserAccount> user = userAccountRepository.findById(instructor.getUserId().toString());
                        // Prepare the faculty details map
                        Map<String, Object> instructorDetails = new HashMap<>();
                        instructorDetails.put("id", user.get().getId().toString());
                        instructorDetails.put("name", user.get().getName());
                        instructorDetails.put("email", user.get().getEmail());
                        instructorDetails.put("role", user.get().getUserRole());
                        instructorDetails.put("facultyName", faculty.get().getName());
                        instructorDetails.put("departmentName", department.get().getName());
                        instructorDetails.put("courseName", course.get().getName());
                        instructorDetails.put("courseId", course.get().getId().toString());
                        return instructorDetails; // Return the details map
                    })
                    .filter(Objects::nonNull) // Remove null entries
                    .toList(); // Collect as a list
        }
        return null;
    }


    public boolean demoteFacultyToStudent(String facultyId) {
        // Find the faculty account by ID
        UserAccount facultyAccount = userAccountRepository.findById(facultyId).orElse(null);

        // Check if the user exists and is a faculty
        if (facultyAccount != null && "faculty".equalsIgnoreCase(facultyAccount.getUserRole())) {
            System.out.println("sd" + facultyAccount.getId().toString());
            // Delete the faculty's details from the FacultyAdminDetails repository
            Optional<FacultyAdminDetails> facultyDetails = facultyAdminDetailsRepository
                    .findByUserId(facultyAccount.getId());
            if (facultyDetails.isPresent()) {
                System.out.println(" n c" + facultyDetails.get());
                facultyAdminDetailsRepository.delete(facultyDetails.get());
            }

            // Update the user role to "student"
            facultyAccount.setUserRole("student");
            userAccountRepository.save(facultyAccount); // Persist changes

            return true;
        }

        // Return false if faculty not found or already demoted
        return false;
    }
   
    public boolean demoteInstructorToStudent(String instructorId,String courseId) {
        // Find the faculty account by ID
        UserAccount facultyAccount = userAccountRepository.findById(instructorId).orElse(null);

        // Check if the user exists and is a faculty
        if (facultyAccount != null && "faculty".equalsIgnoreCase(facultyAccount.getUserRole())) {
            // Delete the faculty's details from the FacultyAdminDetails repository
            Optional<InstructorDepartmentAndCourseDetails> facultyDetails = instructorDepartmentAndCourseDetailsRepository.findByUserIdAndCourseId(facultyAccount.getId(),new ObjectId(courseId));
            if (facultyDetails.isPresent()) {
                instructorDepartmentAndCourseDetailsRepository.delete(facultyDetails.get());
            }   

            // Update the user role to "student"
            facultyAccount.setUserRole("student");
            userAccountRepository.save(facultyAccount); // Persist changes

            return true;
        }

        // Return false if faculty not found or already demoted
        return false;
    }


    public boolean banStudent(String studentId) {
        UserAccount studentAccount = userAccountRepository.findById(studentId).orElse(null);

        if (studentAccount != null && "student".equalsIgnoreCase(studentAccount.getUserRole())) {
            userAccountRepository.delete(studentAccount); // Remove student from database
            return true;
        }

        return false; // Student not found or not a student
    }

    
    public boolean addFaculty(UserAccount newFaculty, String defaultPassword, String facultyId) {
        if (newFaculty != null && newFaculty.getName() != null && !newFaculty.getName().isEmpty()) {
            if (userAccountRepository.findById(newFaculty.getEmail()).isPresent()) {
                return false; // Email already in use
            }
            newFaculty.setUserRole("faculty"); // Assign the "faculty" role
            newFaculty.setPassword(passwordEncoder.encode(defaultPassword)); // Set the default password
            UserAccount addedFaculty = userAccountRepository.save(newFaculty); // Persist the new faculty member
            FacultyAdminDetails newFacultyAdmin = new FacultyAdminDetails();
            newFacultyAdmin.setFacultyId(new ObjectId(facultyId));
            newFacultyAdmin.setUserId(addedFaculty.getId());
            facultyAdminDetailsRepository.save(newFacultyAdmin);
            return true;
        }

        return false;
    }
    
    public boolean editFaculty(UserAccount editingFaculty, String facultyId) {
        if (editingFaculty != null && editingFaculty.getEmail() != null && !editingFaculty.getEmail().isEmpty()) {
            Optional<UserAccount> facultyHeadUserAccount = userAccountRepository.findById(editingFaculty.getEmail());
            if (facultyHeadUserAccount.isPresent()) {
                facultyHeadUserAccount.get().setEmail(editingFaculty.getEmail());
                facultyHeadUserAccount.get().setName(editingFaculty.getName());
                userAccountRepository.save(facultyHeadUserAccount.get());
                Optional<FacultyAdminDetails> facultyAdmin = facultyAdminDetailsRepository
                        .findByUserId(facultyHeadUserAccount.get().getId());
                Optional<Faculty> faculty = facultyRepository.findById(facultyId);
                if (faculty.isPresent()) {
                    facultyAdmin.get().setFacultyId(faculty.get().getId());
                    facultyAdminDetailsRepository.save(facultyAdmin.get());
                }
                return false; // Email already in use
            }
            
            return false;
        }

        return false;
    }
    public boolean addInstructor(UserAccount newFaculty, String defaultPassword, String departmentId,String courseId,String facultyId) {
        if (newFaculty != null && newFaculty.getName() != null && !newFaculty.getName().isEmpty()) {
            if (userAccountRepository.findById(newFaculty.getEmail()).isPresent()) {
                return false; // Email already in use
            }
            newFaculty.setUserRole("instructor"); // Assign the "faculty" role
            newFaculty.setPassword(passwordEncoder.encode(defaultPassword)); // Set the default password
            UserAccount addedInstructor = userAccountRepository.save(newFaculty); // Persist the new faculty member
            InstructorDepartmentAndCourseDetails newInstructorDepartmentAndCourseDetails = new InstructorDepartmentAndCourseDetails();
            newInstructorDepartmentAndCourseDetails.setCourseId(new ObjectId(courseId));
            newInstructorDepartmentAndCourseDetails.setDepartmentId(new ObjectId(departmentId));
            newInstructorDepartmentAndCourseDetails.setUserId(addedInstructor.getId());
            newInstructorDepartmentAndCourseDetails.setFacultyId(new ObjectId(facultyId));

            instructorDepartmentAndCourseDetailsRepository.save(newInstructorDepartmentAndCourseDetails);
            // facultyAdminDetailsRepository.save(newFacultyAdmin);
            return true;
        }

        return false;
    }
   
}
