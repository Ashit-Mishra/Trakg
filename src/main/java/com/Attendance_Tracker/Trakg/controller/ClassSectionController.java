package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.ClassSectionRequest;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.service.ClassSectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/class-sections")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ClassSectionController {

    private final ClassSectionService classSectionService;

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
}