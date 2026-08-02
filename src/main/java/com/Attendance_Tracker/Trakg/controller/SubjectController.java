package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.SubjectRequest;
import com.Attendance_Tracker.Trakg.entity.Subject;
import com.Attendance_Tracker.Trakg.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subjectService.createSubject(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubject(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                subjectService.getSubject(id)
        );
    }
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(
                subjectService.getAllSubjects()
        );
    }
    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<Subject>> getSubjectsBySemester(
            @PathVariable Long semesterId) {
        return ResponseEntity.ok(
                subjectService.getSubjectsBySemester(semesterId)
        );
    }
}
