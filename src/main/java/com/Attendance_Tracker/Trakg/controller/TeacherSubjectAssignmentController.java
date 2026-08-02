package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.AssignTeacherRequest;
import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import com.Attendance_Tracker.Trakg.service.TeacherSubjectAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/teacher-subject-assignments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TeacherSubjectAssignmentController {

    private final TeacherSubjectAssignmentService assignmentService;

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
}