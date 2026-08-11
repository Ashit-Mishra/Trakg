package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.AttendanceRecordResponse;
import com.Attendance_Tracker.Trakg.dto.TeacherAssignmentResponse;
import com.Attendance_Tracker.Trakg.dto.TeacherProfileResponse;
import com.Attendance_Tracker.Trakg.dto.UpdateAttendanceRequest;
import com.Attendance_Tracker.Trakg.entity.Student;
import com.Attendance_Tracker.Trakg.service.TeacherDashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherDashboardController {

    private final TeacherDashboardService teacherDashboardService;

    @GetMapping("/profile")
    public ResponseEntity<TeacherProfileResponse> getProfile(){
        return ResponseEntity.ok(
                teacherDashboardService.getProfile()
        );
    }
    @GetMapping("/assignments")
    public ResponseEntity<List<TeacherAssignmentResponse>> getAssignments() {

        return ResponseEntity.ok(
                teacherDashboardService.getAssignments()
        );
    }
    @GetMapping("/assignments/{assignmentId}/attendance")
    public ResponseEntity<List<AttendanceRecordResponse>>
    getAttendanceHistory(@PathVariable Long assignmentId, @RequestParam LocalDate date){

        return ResponseEntity.ok(
                teacherDashboardService.getAttendanceHistory(assignmentId, date)
        );
    }
    @PutMapping("/attendance/{attendanceId}")
    public ResponseEntity<AttendanceRecordResponse> updateAttendance(
            @PathVariable Long attendanceId,
            @Valid @RequestBody UpdateAttendanceRequest request) {
        return ResponseEntity.ok(
                teacherDashboardService.updateAttendance(
                        attendanceId,
                        request
                )
        );
    }
    @GetMapping("/assignments/{assignmentId}/students")
    public ResponseEntity<List<Student>> getAssignmentStudents(
            @PathVariable Long assignmentId) {

        return ResponseEntity.ok(
                teacherDashboardService.getAssignmentStudents(assignmentId)
        );
    }

}
