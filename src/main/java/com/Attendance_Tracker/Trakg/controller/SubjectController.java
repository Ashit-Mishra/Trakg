package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.SubjectRequest;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.Subject;
import com.Attendance_Tracker.Trakg.service.SubjectService;
import com.Attendance_Tracker.Trakg.service.excel.SubjectImportService;
import com.Attendance_Tracker.Trakg.service.excel.TemplateService;
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
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SubjectController {

    private final SubjectService subjectService;
    private final SubjectImportService subjectImportService;
    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subjectService.createSubject(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubject(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                subjectService.getSubject(id)
        );
    }
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(
                subjectService.getAllSubjects()
        );
    }
    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<Subject>> getSubjectsBySemester(
            @PathVariable Long semesterId) {
        return ResponseEntity.ok(
                subjectService.getSubjectsBySemester(semesterId)
        );
    }
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importSubjects(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                subjectImportService.importSubjects(file)
        );
    }
    @GetMapping("/template")
    public ResponseEntity<InputStreamResource> downloadTemplate()
            throws IOException {
        InputStreamResource resource =
                new InputStreamResource(
                        templateService.generateSubjectTemplate());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=subjects-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
