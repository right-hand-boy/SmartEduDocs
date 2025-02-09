package com.smartedudocs.backend.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFPictureData;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.smartedudocs.backend.model.Course;
import com.smartedudocs.backend.model.Department;
import com.smartedudocs.backend.model.Documents;
import com.smartedudocs.backend.model.UserAccount;
import com.smartedudocs.backend.repository.CourseRepository;
import com.smartedudocs.backend.repository.DepartmentRepository;
import com.smartedudocs.backend.repository.DocumentRepository;
import com.smartedudocs.backend.repository.UserAccountRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final Cloudinary cloudinary;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository, Cloudinary cloudinary,
            CourseRepository courseRepository, DepartmentRepository departmentRepository,
            UserAccountRepository userAccountRepository) {
        this.documentRepository = documentRepository;
        this.cloudinary = cloudinary;
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
        this.userAccountRepository = userAccountRepository;
    }

    // Add or update a document with file upload (PDF, DOCX, PPT, etc.)
    public Map<String, Object> storeDocument(Documents document, MultipartFile file) throws IOException {
        // Set metadata attributes
        document.setLastModifiedDate(document.getLastModifiedDate());
        document.setTitle(document.getTitle()); // Set title from the metadata
        document.setDescription(document.getDescription()); // Set description
        document.setUploadedBy(document.getUploadedBy()); // Set author name
        document.setUserId(document.getUserId());

        // Validate courseId, departmentId, and facultyId relationship
        Optional<Course> newReferedCourse = courseRepository.findById(document.getCourseId().toString());
        if (!newReferedCourse.isPresent()) {
            throw new IllegalArgumentException("Invalid courseId provided.");
        }

        Course courseEntity = newReferedCourse.get();
        if (!courseEntity.getDepartmentId().equals(document.getDepartmentId()) ||
                !courseEntity.getFacultyId().equals(document.getFacultyId())) {
            throw new IllegalArgumentException("Course does not belong to the specified department or faculty.");
        }

        // Increase book count for the new course
        courseEntity.setBookCount(courseEntity.getBookCount() + 1);
        document.setCourseId(document.getCourseId()); // Set courseId
        document.setFacultyId(document.getFacultyId()); // Set facultyId
        document.setDepartmentId(document.getDepartmentId()); // Set departmentId

        // Handle document upload (store the file and save metadata)
        if (file != null && !file.isEmpty()) {

            // Extract cover image
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String coverImageUrl = null;
            System.out.println("file" + fileExtension);

            if (fileExtension.equalsIgnoreCase("pptx")) {
                try {
                    coverImageUrl = extractPPTCover(file);
                } catch (Exception e) {
                    System.out.println("Failed to extract PPT cover: " + e.getMessage());
                }
            } else if (fileExtension.equalsIgnoreCase("docx")) {
                try {
                    coverImageUrl = extractDocxCover(file);
                } catch (Exception e) {
                    System.out.println("Failed to extract DOCX cover: " + e.getMessage());
                }
            } else if (fileExtension.equalsIgnoreCase("pdf")) {
                try {
                    coverImageUrl = extractPDFCover(file);
                } catch (Exception e) {
                    System.out.println("Failed to extract PDF cover: " + e.getMessage());
                }
            }

            if (coverImageUrl != null) {
                document.setCoverImageUrl(coverImageUrl);
            }
            String documentUrl = uploadFile(file, "documents");
            document.setDocument(documentUrl);
            document.setSize(formatFileSize(file.getSize()));

        }

        // Save the updated course and document
        courseRepository.save(courseEntity);
        Documents savedDocument = documentRepository.save(document);

        // Prepare the response with document details
        Map<String, Object> documentInfo = new HashMap<>();
        Optional<Department> department = departmentRepository.findById(savedDocument.getDepartmentId().toString());
        Optional<Course> savedCourse = courseRepository.findById(savedDocument.getCourseId().toString());

        documentInfo.put("id", savedDocument.getId().toString());
        documentInfo.put("title", savedDocument.getTitle());
        documentInfo.put("size", savedDocument.getSize());
        documentInfo.put("description", savedDocument.getDescription());
        documentInfo.put("courseName", savedCourse.map(Course::getName).orElse("Unknown"));
        documentInfo.put("departmentName", department.map(Department::getName).orElse("Unknown"));
        documentInfo.put("uploadedBy", savedDocument.getUploadedBy());
        documentInfo.put("url", savedDocument.getDocument());

        return documentInfo;
    }

    // Method to upload cover image to Cloudinary under the "coverImage" folder
    private String uploadCoverImage(File file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file,
                ObjectUtils.asMap("folder", "coverImage"));
        return (String) uploadResult.get("secure_url"); // Return the secure URL of the uploaded file
    }

    // Extract cover image from PDF
    private String extractPDFCover(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFRenderer renderer = new PDFRenderer(document);
            BufferedImage img = renderer.renderImage(0);
            File coverFile = new File("cover_pdf.jpg");
            ImageIO.write(img, "jpg", coverFile);
            return uploadCoverImage(coverFile);
        }
    }

    public String extractDocxCover(MultipartFile file) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
            for (XWPFPictureData picData : doc.getAllPictures()) {
                byte[] imgBytes = picData.getData();
                File coverFile = new File("docx_cover.jpg");

                try (FileOutputStream fos = new FileOutputStream(coverFile)) {
                    fos.write(imgBytes);
                }

                return uploadCoverImage(coverFile); // Now accepts File
            }
            return null;
        }
    }

    public String extractPPTCover(MultipartFile file) throws IOException {
        try (XMLSlideShow ppt = new XMLSlideShow(file.getInputStream())) {
            XSLFSlide slide = ppt.getSlides().get(0); // First slide
            BufferedImage img = new BufferedImage(800, 600, BufferedImage.TYPE_INT_RGB);
            slide.draw(img.createGraphics());

            File coverFile = new File("ppt_cover.jpg");
            ImageIO.write(img, "jpg", coverFile);

            return uploadCoverImage(coverFile); // Now accepts File
        }
    }

    // Method to upload file to Cloudinary
    // private String uploadFile(MultipartFile file, String folder) throws IOException {
    //     Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
    //             com.cloudinary.utils.ObjectUtils.asMap("folder", folder)); // Explicitly qualify Cloudinary's ObjectUtils
    //     return (String) uploadResult.get("secure_url"); // Return the secure URL of the uploaded file
    // }
    private String uploadFile(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                com.cloudinary.utils.ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "raw" // Ensure support for non-image files like PPT and DOC
                ));
        return (String) uploadResult.get("secure_url");
    }

    // Helper method to format the file size (e.g., 1.2 MB)
    private String formatFileSize(long sizeInBytes) {
        double sizeInMB = sizeInBytes / (1024.0 * 1024.0);
        return String.format("%.2f MB", sizeInMB); // Return formatted size
    }

    // Update an existing document
    public Map<String, Object> updateDocument(Documents document, MultipartFile file) throws IOException {
        Optional<Documents> existingDocumentOpt = documentRepository.findById(document.getId().toString());
        if (existingDocumentOpt.isPresent()) {
            Documents existingDocument = existingDocumentOpt.get();

            // Handle document file update
            if (file != null && !file.isEmpty()) {

                // Extract cover image
                String fileExtension = getFileExtension(file.getOriginalFilename());
                String coverImageUrl = null;

                if (fileExtension.equalsIgnoreCase("pptx")) {
                    coverImageUrl = "https://res.cloudinary.com/dyvmsyecq/image/upload/v1738836385/default/rtomael4byuyhveewo5f.jpg";
                } else if (fileExtension.equalsIgnoreCase("docx")) {
                    coverImageUrl = "https://res.cloudinary.com/dyvmsyecq/image/upload/v1738836385/default/mnw5ls6rmnnyuaty7oy9.jpg";
                } else if (fileExtension.equalsIgnoreCase("pdf")) {
                    coverImageUrl = extractPDFCover(file);
                }

                if (coverImageUrl != null) {
                    existingDocument.setCoverImageUrl(coverImageUrl);
                }
                String documentUrl = uploadFile(file, "documents");
                existingDocument.setDocument(documentUrl);
                existingDocument.setSize(formatFileSize(file.getSize()));

            }

            // Update other document fields
            existingDocument.setTitle(document.getTitle());
            existingDocument.setDescription(document.getDescription());
            existingDocument.setUploadedBy(document.getUploadedBy());

            // Handle course validation and update
            Optional<Course> referedCourse = courseRepository.findById(document.getCourseId().toString());
            if (referedCourse.isPresent()) {
                Course course = referedCourse.get();

                // Check if course belongs to the specified department and faculty
                if (!course.getDepartmentId().equals(document.getDepartmentId()) ||
                        !course.getFacultyId().equals(document.getFacultyId())) {
                    throw new IllegalArgumentException(
                            "Course does not belong to the specified department or faculty.");
                }

                // Handle book count update for the old and new course
                if (!existingDocument.getCourseId().equals(document.getCourseId())) {
                    // Decrease book count for the old course
                    Optional<Course> oldCourseOpt = courseRepository
                            .findById(existingDocument.getCourseId().toString());
                    oldCourseOpt.ifPresent(oldCourse -> {
                        oldCourse.setBookCount(oldCourse.getBookCount() - 1);
                        courseRepository.save(oldCourse);
                    });

                    // Increase book count for the new course
                    course.setBookCount(course.getBookCount() + 1);
                    courseRepository.save(course);
                }
            } else {
                throw new IllegalArgumentException("Invalid courseId provided.");
            }

            // Update course, faculty, and department IDs in the document
            existingDocument.setCourseId(document.getCourseId());
            existingDocument.setFacultyId(document.getFacultyId());
            existingDocument.setDepartmentId(document.getDepartmentId());

            // Save the updated document
            Documents updatedDocument = documentRepository.save(existingDocument);

            // Prepare the response with document details
            Map<String, Object> documentInfo = new HashMap<>();
            Optional<Department> department = departmentRepository
                    .findById(updatedDocument.getDepartmentId().toString());
            Optional<Course> course = courseRepository.findById(updatedDocument.getCourseId().toString());

            documentInfo.put("id", updatedDocument.getId().toString());
            documentInfo.put("title", updatedDocument.getTitle());
            documentInfo.put("size", updatedDocument.getSize());
            documentInfo.put("description", updatedDocument.getDescription());
            documentInfo.put("courseName", course.map(Course::getName).orElse("Unknown"));
            documentInfo.put("departmentName", department.map(Department::getName).orElse("Unknown"));
            documentInfo.put("uploadedBy", updatedDocument.getUploadedBy());
            documentInfo.put("url", updatedDocument.getDocument());

            return documentInfo;
        }
        return null; // Return null if document not found
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex >= 0) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }

    // Delete a document by ID
    public boolean deleteDocument(ObjectId documentId) {
        Optional<Documents> documentOpt = documentRepository.findById(documentId.toString());
        if (documentOpt.isPresent()) {
            Documents document = documentOpt.get();

            // Retrieve the associated course and decrease its book count
            Optional<Course> referedCourse = courseRepository.findById(document.getCourseId().toString());
            if (referedCourse.isPresent()) {
                Course course = referedCourse.get();
                course.setBookCount(course.getBookCount() - 1); // Decrease book count
                courseRepository.save(course); // Save the updated course
            } else {
                throw new IllegalArgumentException("Course not found for the document.");
            }

            // Delete the document
            documentRepository.delete(document);
            return true; // Document deleted successfully
        }
        return false; // Return false if document not found
    }

    // Get a document by ID
    public Optional<Documents> getDocumentById(ObjectId documentId) {
        return documentRepository.findById(documentId.toString());
    }

    public List<Map<String, Object>> findAllDocuments() {
        List<Documents> documents = documentRepository.findAll();
        List<Map<String, Object>> documentList = new ArrayList<>();

        for (Documents document : documents) {
            Optional<Department> department = departmentRepository.findById(document.getDepartmentId().toString());
            Optional<Course> course = courseRepository.findById(document.getCourseId().toString());

            Map<String, Object> documentInfo = new HashMap<>();
            documentInfo.put("id", document.getId().toString());
            documentInfo.put("title", document.getTitle());
            documentInfo.put("size", document.getSize());
            documentInfo.put("description", document.getDescription());
            documentInfo.put("courseName", course.map(Course::getName).orElse("Unknown"));
            documentInfo.put("courseId", course.get().getId().toString());
            documentInfo.put("departmentName", department.map(Department::getName).orElse("Unknown"));
            documentInfo.put("uploadedBy", document.getUploadedBy());
            documentInfo.put("coverImageUrl", document.getCoverImageUrl());
            documentInfo.put("url", document.getDocument());

            documentList.add(documentInfo);
        }

        return documentList;
    }

    public List<Map<String, Object>> getFacultyDocuments(ObjectId facultyId) {
        List<Documents> documents = documentRepository.findByFacultyId(facultyId);
        List<Map<String, Object>> documentList = new ArrayList<>();

        for (Documents document : documents) {
            Optional<Department> department = departmentRepository.findById(document.getDepartmentId().toString());
            Optional<Course> course = courseRepository.findById(document.getCourseId().toString());

            Map<String, Object> documentInfo = new HashMap<>();
            documentInfo.put("id", document.getId().toString());
            documentInfo.put("title", document.getTitle());
            documentInfo.put("size", document.getSize());
            documentInfo.put("description", document.getDescription());
            documentInfo.put("courseName", course.map(Course::getName).orElse("Unknown"));
            documentInfo.put("courseId", course.get().getId().toString());
            documentInfo.put("departmentName", department.map(Department::getName).orElse("Unknown"));
            documentInfo.put("uploadedBy", document.getUploadedBy());
            documentInfo.put("url", document.getDocument());
            documentInfo.put("coverImageUrl", document.getCoverImageUrl());
            documentList.add(documentInfo);
        }

        return documentList;
    }

    public List<Map<String, Object>> getInstructorDocuments(String instructorId) {
        Optional<UserAccount> instructor = userAccountRepository.findById(instructorId);
        if (instructor.isPresent()) {
            List<Documents> documents = documentRepository.findByUserId(instructor.get().getId());

            List<Map<String, Object>> documentList = new ArrayList<>();

            for (Documents document : documents) {
                Optional<Department> department = departmentRepository.findById(document.getDepartmentId().toString());
                Optional<Course> course = courseRepository.findById(document.getCourseId().toString());

                Map<String, Object> documentInfo = new HashMap<>();
                documentInfo.put("id", document.getId().toString());
                documentInfo.put("title", document.getTitle());
                documentInfo.put("size", document.getSize());
                documentInfo.put("description", document.getDescription());
                documentInfo.put("courseName", course.map(Course::getName).orElse("Unknown"));
                documentInfo.put("courseId", course.get().getId().toString());
                documentInfo.put("departmentName", department.map(Department::getName).orElse("Unknown"));
                documentInfo.put("uploadedBy", document.getUploadedBy());
                documentInfo.put("url", document.getDocument());
                documentInfo.put("coverImageUrl", document.getCoverImageUrl());
                documentList.add(documentInfo);
            }

            return documentList;
        }
        return null;

    }

    public Map<String, Object> getDocumentDetail(String facultyId) {
        Optional<Documents> document = documentRepository.findById(facultyId);

        Optional<Department> department = departmentRepository.findById(document.get().getDepartmentId().toString());
        Optional<Course> course = courseRepository.findById(document.get().getCourseId().toString());

        Map<String, Object> documentInfo = new HashMap<>();
        documentInfo.put("id", document.get().getId().toString());
        documentInfo.put("lastModifiedDate", document.get().getLastModifiedDate());
        documentInfo.put("title", document.get().getTitle());
        documentInfo.put("size", document.get().getSize());
        documentInfo.put("description", document.get().getDescription());
        documentInfo.put("courseName", course.map(Course::getName).orElse("Unknown"));
        documentInfo.put("departmentName", department.map(Department::getName).orElse("Unknown"));
        documentInfo.put("uploadedBy", document.get().getUploadedBy());
        documentInfo.put("coverImageUrl", document.get().getCoverImageUrl());
        documentInfo.put("url", document.get().getDocument());

        return documentInfo;
    }

}
