package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.TeacherRequest;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TeacherController {

    private final TeacherService teacherService;

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
}
