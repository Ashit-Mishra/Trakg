package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.dto.StudentRequest;
import com.Attendance_Tracker.Trakg.entity.Student;
import com.Attendance_Tracker.Trakg.service.excel.StudentImportService;
import com.Attendance_Tracker.Trakg.service.StudentService;
import com.Attendance_Tracker.Trakg.service.excel.TemplateService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class StudentController {

    private final StudentService studentService;
    private final StudentImportService studentImportService;
    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<Student> createStudent(
            @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentService.createStudent(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                studentService.getStudent(id)
        );
    }
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }
    @GetMapping("/class-section/{classSectionId}")
    public ResponseEntity<List<Student>> getStudentsByClassSection(
            @PathVariable Long classSectionId) {
        return ResponseEntity.ok(
                studentService.getStudentsByClassSection(classSectionId)
        );
    }
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importStudents(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                studentImportService.importStudents(file)
        );
    }
    @GetMapping("/template")
    public ResponseEntity<InputStreamResource> downloadStudentTemplate()
            throws IOException {
        InputStreamResource resource =
                new InputStreamResource(
                        templateService.generateStudentTemplate());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=students-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}