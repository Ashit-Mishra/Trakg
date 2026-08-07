package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.AssignTeacherRequest;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import com.Attendance_Tracker.Trakg.service.TeacherSubjectAssignmentService;
import com.Attendance_Tracker.Trakg.service.excel.TeacherSubjectAssignmentImportService;
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
@RequestMapping("/api/admin/teacher-subject-assignments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TeacherSubjectAssignmentController {

    private final TeacherSubjectAssignmentService assignmentService;
    private final TeacherSubjectAssignmentImportService teacherSubjectAssignmentImportService;
    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<TeacherSubjectAssignment> assignTeacher(
            @Valid @RequestBody AssignTeacherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assignmentService.assignTeacher(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<TeacherSubjectAssignment> getAssignment(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                assignmentService.getAssignment(id)
        );
    }
    @GetMapping
    public ResponseEntity<List<TeacherSubjectAssignment>> getAllAssignments() {
        return ResponseEntity.ok(
                assignmentService.getAllAssignments()
        );
    }
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<TeacherSubjectAssignment>> getAssignmentsByTeacher(
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(
                assignmentService.getAssignmentsByTeacher(teacherId)
        );
    }
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<TeacherSubjectAssignment>> getAssignmentsBySubject(
            @PathVariable Long subjectId) {
        return ResponseEntity.ok(
                assignmentService.getAssignmentsBySubject(subjectId)
        );
    }
    @GetMapping("/class-section/{classSectionId}")
    public ResponseEntity<List<TeacherSubjectAssignment>> getAssignmentsByClassSection(
            @PathVariable Long classSectionId) {
        return ResponseEntity.ok(
                assignmentService.getAssignmentsByClassSection(classSectionId)
        );
    }
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importTeacherSubjectAssignment(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(
                teacherSubjectAssignmentImportService.importTeacherSubjectAssignment(file)
        );
    }
    @GetMapping("/template")
    public ResponseEntity<InputStreamResource> downloadTemplate()
            throws IOException {
        InputStreamResource resource =
                new InputStreamResource(
                        templateService.generateTeacherSubjectAssignmentTemplate());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=assignments-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}