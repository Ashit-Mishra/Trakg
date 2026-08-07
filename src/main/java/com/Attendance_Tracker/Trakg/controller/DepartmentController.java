package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.DepartmentRequest;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.service.DepartmentService;
import com.Attendance_Tracker.Trakg.service.excel.DepartmentImportService;
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
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DepartmentImportService departmentImportService;
    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<Department> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departmentService.createDepartment(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                departmentService.getDepartment(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments()
        );
    }

    @GetMapping("/academic-session/{sessionId}")
    public ResponseEntity<List<Department>> getDepartmentsByAcademicSession(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                departmentService.getDepartmentsByAcademicSession(sessionId)
        );
    }
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importDepartments(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                departmentImportService.importDepartments(file)
        );
    }
    @GetMapping("/template")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> downloadTemplate()
            throws IOException {

        InputStreamResource resource =
                new InputStreamResource(
                        templateService.generateDepartmentTemplate());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=departments-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}