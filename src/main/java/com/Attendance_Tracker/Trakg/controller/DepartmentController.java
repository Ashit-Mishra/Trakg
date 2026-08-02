package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.DepartmentRequest;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController {

    private final DepartmentService departmentService;

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
}