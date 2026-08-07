package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.ClassSectionRequest;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.service.ClassSectionService;
import com.Attendance_Tracker.Trakg.service.excel.ClassSectionImportService;
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
@RequestMapping("/api/admin/class-sections")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ClassSectionController {

    private final ClassSectionService classSectionService;
    private final ClassSectionImportService classSectionImportService;
    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<ClassSection> createClassSection(
            @Valid @RequestBody ClassSectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(classSectionService.createClassSection(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ClassSection> getClassSection(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                classSectionService.getClassSection(id)
        );
    }
    @GetMapping
    public ResponseEntity<List<ClassSection>> getAllClassSections() {
        return ResponseEntity.ok(
                classSectionService.getAllClassSections()
        );
    }
    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<ClassSection>> getClassSectionsBySemester(
            @PathVariable Long semesterId) {
        return ResponseEntity.ok(
                classSectionService.getClassSectionsBySemester(semesterId)
        );
    }
    @PostMapping("/import")
    public ResponseEntity<ImportResponse> importSubjects(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(
                classSectionImportService.importClassSection(file)
        );
    }
    @GetMapping("/template")
    public ResponseEntity<InputStreamResource> downloadTemplate()
            throws IOException {
        InputStreamResource resource =
                new InputStreamResource(
                        templateService.generateClassSectionTemplate());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=class-sections-template.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}