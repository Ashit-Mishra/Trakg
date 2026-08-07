package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.TeacherRequest;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.service.TeacherService;
import com.Attendance_Tracker.Trakg.service.excel.TeacherImportService;
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
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TeacherController {

    private final TeacherService teacherService;
    private final TeacherImportService teacherImportService;
    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<Teacher> createTeacher(
            @Valid @RequestBody TeacherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teacherService.createTeacher(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacher(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                teacherService.getTeacher(id)
        );
    }
    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(
                teacherService.getAllTeachers()
        );
    }
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Teacher>> getTeachersByDepartment(
            @PathVariable Long departmentId) {
        return ResponseEntity.ok(
                teacherService.getTeachersByDepartment(departmentId)
        );
    }
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importTeachers(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(
                teacherImportService.importTeachers(file)
        );
    }
    @GetMapping("/template")
    public ResponseEntity<InputStreamResource> downloadTemplate()
            throws IOException {
        InputStreamResource resource =
                new InputStreamResource(
                        templateService.generateTeacherTemplate());
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=teachers-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
