package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.AttendanceRequest;
import com.Attendance_Tracker.Trakg.entity.Attendance;
import com.Attendance_Tracker.Trakg.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> markAttendance(
            @Valid @RequestBody AttendanceRequest request){
        attendanceService.markAttendance(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN','STUDENT')")
    public ResponseEntity<List<Attendance>> getStudentAttendance(
            @PathVariable Long studentId){
        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudent(studentId)
        );
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<List<Attendance>> getAssignmentAttendance(
            @PathVariable Long assignmentId){
        return ResponseEntity.ok(
                attendanceService.getAttendanceByAssignment(assignmentId)
        );
    }
}