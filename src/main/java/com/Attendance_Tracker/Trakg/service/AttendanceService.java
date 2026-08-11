package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.*;
import com.Attendance_Tracker.Trakg.entity.*;
import com.Attendance_Tracker.Trakg.enums.AttendanceStatus;
import com.Attendance_Tracker.Trakg.exception.DuplicateResourceException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.exception.UnauthorizedException;
import com.Attendance_Tracker.Trakg.repository.AttendanceRepository;
import com.Attendance_Tracker.Trakg.repository.StudentRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherSubjectAssignmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    @Transactional
    public void markAttendance(AttendanceRequest request) {

        // Get logged-in user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        // Find logged-in teacher
        Teacher loggedInTeacher = teacherRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found."));

        // Find assignment
        TeacherSubjectAssignment assignment =
                assignmentRepository.findById(request.getAssignmentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Assignment not found."));

        // Authorization Check
        if (!assignment.getTeacher().getId()
                .equals(loggedInTeacher.getId())) {

            throw new UnauthorizedException(
                    "You are not allowed to mark attendance for this assignment.");
        }

        // Mark attendance for every student
        for (StudentAttendanceRequest studentRequest : request.getStudents()) {

            Student student = studentRepository.findById(studentRequest.getStudentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Student not found: " + studentRequest.getStudentId()));

            // Student must belong to the same class section
            if (!student.getClassSection().getId()
                    .equals(assignment.getClassSection().getId())) {

                throw new ResourceNotFoundException(
                        "Student does not belong to the assigned class section.");
            }

            // Attendance already marked?
            if (attendanceRepository
                    .existsByStudentIdAndAssignmentIdAndAttendanceDate(
                            student.getId(),
                            assignment.getId(),
                            request.getAttendanceDate())) {

                throw new DuplicateResourceException(
                        "Attendance already marked for student: "
                                + student.getRollNumber());
            }

            Attendance attendance = Attendance.builder()
                    .student(student)
                    .assignment(assignment)
                    .attendanceDate(request.getAttendanceDate())
                    .status(studentRequest.getStatus())
                    .build();

            attendanceRepository.save(attendance);
        }
    }
    public List<Attendance> getAttendanceByStudent(Long studentId){
        return attendanceRepository.findByStudentId(studentId);
    }
    public List<Attendance> getAttendanceByAssignment(Long assignmentId){
        return attendanceRepository.findByAssignmentId(assignmentId);
    }
    public OverallAttendanceResponse getOverallAttendance() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        Student student = studentRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));

        long totalClasses = attendanceRepository.countByStudentId(student.getId());

        long presentClasses = attendanceRepository.countByStudentIdAndStatus(
                student.getId(),
                AttendanceStatus.PRESENT);

        double attendancePercentage = 0.0;

        if (totalClasses > 0) {
            attendancePercentage =
                    (presentClasses * 100.0) / totalClasses;
        }

        return OverallAttendanceResponse.builder()
                .presentClasses(presentClasses)
                .totalClasses(totalClasses)
                .attendancePercentage(attendancePercentage)
                .build();
    }
    public List<SubjectAttendanceResponse> getSubjectWiseAttendance() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Student student = studentRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));
        List<Attendance> attendanceList =
                attendanceRepository.findByStudentId(student.getId());
        Map<Subject, List<Attendance>> groupedAttendance =
                attendanceList.stream()
                        .collect(Collectors.groupingBy(
                                attendance ->
                                        attendance.getAssignment().getSubject()
                        ));
        List<SubjectAttendanceResponse> response = new ArrayList<>();
        for (Map.Entry<Subject, List<Attendance>> entry : groupedAttendance.entrySet()) {

            Subject subject = entry.getKey();
            List<Attendance> records = entry.getValue();
            long totalClasses = records.size();
            long presentClasses = records.stream()
                    .filter(attendance ->
                            attendance.getStatus() == AttendanceStatus.PRESENT)
                    .count();
            double percentage = totalClasses == 0
                    ? 0
                    : (presentClasses * 100.0) / totalClasses;
            response.add(
                    SubjectAttendanceResponse.builder()
                            .subjectCode(subject.getSubjectCode())
                            .subjectName(subject.getSubjectName())
                            .presentClasses(presentClasses)
                            .totalClasses(totalClasses)
                            .attendancePercentage(percentage)
                            .build()
            );
        }
        return response;
    }
    public List<AttendanceRecordResponse> getMyAttendance() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        Student student = studentRepository
                .findByUserUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found."));

        List<Attendance> attendanceList =
                attendanceRepository.findByStudentId(student.getId());

        return attendanceList.stream()
                .map(attendance ->
                        AttendanceRecordResponse.builder()
                                .attendanceId(attendance.getId())

                                .studentName(
                                        attendance.getStudent()
                                                .getUser()
                                                .getName()
                                )

                                .rollNumber(
                                        attendance.getStudent()
                                                .getRollNumber()
                                )

                                .subjectCode(
                                        attendance.getAssignment()
                                                .getSubject()
                                                .getSubjectCode()
                                )

                                .subjectName(
                                        attendance.getAssignment()
                                                .getSubject()
                                                .getSubjectName()
                                )

                                .teacherName(
                                        attendance.getAssignment()
                                                .getTeacher()
                                                .getUser()
                                                .getName()
                                )

                                .status(
                                        attendance.getStatus()
                                )

                                .attendanceDate(
                                        attendance.getAttendanceDate()
                                )

                                .build()
                )
                .toList();
    }
}