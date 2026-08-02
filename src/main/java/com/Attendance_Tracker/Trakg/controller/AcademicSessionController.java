package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.AcademicSessionRequest;
import com.Attendance_Tracker.Trakg.entity.AcademicSession;
import com.Attendance_Tracker.Trakg.service.AcademicSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/academic-sessions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AcademicSessionController {
    private final AcademicSessionService academicSessionService;

    @PostMapping
    public ResponseEntity<AcademicSession> createSession(@Valid @RequestBody AcademicSessionRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(academicSessionService.createSession(request));
    }
    @PutMapping("/{id}/activate")
    public ResponseEntity<AcademicSession> activateSession(@PathVariable Long id){
        return ResponseEntity.ok(academicSessionService.activateSession(id));
    }
    @GetMapping("/active")
    public ResponseEntity<AcademicSession> getActiveSession(){
        return ResponseEntity.ok(academicSessionService.getActiveSession());
    }
    @GetMapping
    public ResponseEntity<List<AcademicSession>> getAllSessions(){
        return ResponseEntity.ok(academicSessionService.getAllSessions());
    }
}
