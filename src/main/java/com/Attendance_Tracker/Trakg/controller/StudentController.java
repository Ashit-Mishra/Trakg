package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.StudentRequest;
import com.Attendance_Tracker.Trakg.entity.Student;
import com.Attendance_Tracker.Trakg.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class StudentController {

    private final StudentService studentService;

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
}