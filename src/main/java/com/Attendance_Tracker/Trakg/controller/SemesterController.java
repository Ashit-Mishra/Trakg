package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.SemesterRequest;
import com.Attendance_Tracker.Trakg.entity.Semester;
import com.Attendance_Tracker.Trakg.service.SemesterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/semesters")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SemesterController {

    private final SemesterService semesterService;

    @PostMapping
    public ResponseEntity<Semester> createSemester(
            @Valid @RequestBody SemesterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(semesterService.createSemester(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Semester> getSemester(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                semesterService.getSemester(id)
        );
    }
    @GetMapping
    public ResponseEntity<List<Semester>> getAllSemesters() {
        return ResponseEntity.ok(
                semesterService.getAllSemesters()
        );
    }
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Semester>> getSemestersByDepartment(
            @PathVariable Long departmentId) {
        return ResponseEntity.ok(
                semesterService.getSemestersByDepartment(departmentId)
        );
    }
}