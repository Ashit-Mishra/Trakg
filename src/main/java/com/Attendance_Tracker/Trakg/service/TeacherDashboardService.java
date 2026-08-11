package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.AttendanceRecordResponse;
import com.Attendance_Tracker.Trakg.dto.TeacherAssignmentResponse;
import com.Attendance_Tracker.Trakg.dto.TeacherProfileResponse;
import com.Attendance_Tracker.Trakg.dto.UpdateAttendanceRequest;
import com.Attendance_Tracker.Trakg.entity.Attendance;
import com.Attendance_Tracker.Trakg.entity.Student;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.exception.UnauthorizedException;
import com.Attendance_Tracker.Trakg.repository.AttendanceRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherSubjectAssignmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherDashboardService {

    private final TeacherRepository teacherRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;

    public TeacherProfileResponse getProfile() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        Teacher teacher = teacherRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found."));

        return TeacherProfileResponse.builder()
                .userId(teacher.getUser().getUserId())
                .name(teacher.getUser().getName())
                .email(teacher.getUser().getEmail())
                .designation(teacher.getDesignation())
                .department(teacher.getDepartment().getDepartmentName())
                .build();
    }
    public List<TeacherAssignmentResponse> getAssignments() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Teacher teacher = teacherRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found."));

        List<TeacherSubjectAssignment> assignments =
                assignmentRepository.findByTeacherId(teacher.getId());

        return assignments.stream()
                .map(assignment ->
                        TeacherAssignmentResponse.builder()
                                .assignmentId(assignment.getId())
                                .subjectCode(assignment.getSubject().getSubjectCode())
                                .subjectName(assignment.getSubject().getSubjectName())
                                .semester(assignment.getSubject()
                                        .getSemester()
                                        .getSemesterNumber())
                                .classSection(assignment.getClassSection().getSectionName())
                                .build())
                .toList();
    }

    public List<AttendanceRecordResponse> getAttendanceHistory(
            Long assignmentId,
            LocalDate date) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Teacher teacher = teacherRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found."));
        TeacherSubjectAssignment assignment = assignmentRepository
                .findById(assignmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Assignment not found."));
        // Authorization check
        if (!assignment.getTeacher().getId().equals(teacher.getId())) {
            throw new UnauthorizedException(
                    "You are not authorized to view this attendance.");
        }
        List<Attendance> attendanceList =
                attendanceRepository.findByAssignmentIdAndAttendanceDate(
                        assignmentId,
                        date
                );
        return attendanceList.stream()
                .map(attendance ->
                        AttendanceRecordResponse.builder()
                                .attendanceId(attendance.getId())
                                .studentName(attendance.getStudent()
                                        .getUser()
                                        .getName())
                                .rollNumber(attendance.getStudent()
                                        .getRollNumber())
                                .status(attendance.getStatus())
                                .attendanceDate(attendance.getAttendanceDate())
                                .build())
                .toList();
    }
    @Transactional
    public AttendanceRecordResponse updateAttendance(
            Long attendanceId,
            UpdateAttendanceRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Teacher teacher = teacherRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found."));
        Attendance attendance = attendanceRepository
                .findById(attendanceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Attendance not found."));
        TeacherSubjectAssignment assignment =
                attendance.getAssignment();
        if (!assignment.getTeacher().getId().equals(teacher.getId())) {

            throw new UnauthorizedException(
                    "You are not authorized to edit this attendance.");
        }
        attendance.setStatus(request.getStatus());
        Attendance updatedAttendance =
                attendanceRepository.save(attendance);
        return AttendanceRecordResponse.builder()
                .attendanceId(updatedAttendance.getId())
                .studentName(updatedAttendance.getStudent()
                        .getUser()
                        .getName())
                .rollNumber(updatedAttendance.getStudent()
                        .getRollNumber())
                .status(updatedAttendance.getStatus())
                .attendanceDate(updatedAttendance.getAttendanceDate())
                .build();
    }

    public List<Student> getAssignmentStudents(Long assignmentId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        Teacher teacher = teacherRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found."));

        TeacherSubjectAssignment assignment =
                assignmentRepository.findById(assignmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assignment not found."));

        // Make sure this assignment belongs to the logged-in teacher
        if (!assignment.getTeacher().getId().equals(teacher.getId())) {
            throw new UnauthorizedException(
                    "You are not authorized to access this assignment.");
        }

        return assignment.getClassSection()
                .getStudents();
    }
}
