package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.AttendanceRequest;
import com.Attendance_Tracker.Trakg.dto.StudentAttendanceRequest;
import com.Attendance_Tracker.Trakg.entity.Attendance;
import com.Attendance_Tracker.Trakg.entity.Student;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import com.Attendance_Tracker.Trakg.repository.AttendanceRepository;
import com.Attendance_Tracker.Trakg.repository.StudentRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherSubjectAssignmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

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
                        new IllegalArgumentException("Teacher not found."));

        // Find assignment
        TeacherSubjectAssignment assignment =
                assignmentRepository.findById(request.getAssignmentId())
                        .orElseThrow(() ->
                                new IllegalArgumentException("Assignment not found."));

        // Authorization Check
        if (!assignment.getTeacher().getId()
                .equals(loggedInTeacher.getId())) {

            throw new AccessDeniedException(
                    "You are not allowed to mark attendance for this assignment.");
        }

        // Mark attendance for every student
        for (StudentAttendanceRequest studentRequest : request.getStudents()) {

            Student student = studentRepository.findById(studentRequest.getStudentId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Student not found: " + studentRequest.getStudentId()));

            // Student must belong to the same class section
            if (!student.getClassSection().getId()
                    .equals(assignment.getClassSection().getId())) {

                throw new IllegalArgumentException(
                        "Student does not belong to the assigned class section.");
            }

            // Attendance already marked?
            if (attendanceRepository
                    .existsByStudentIdAndAssignmentIdAndAttendanceDate(
                            student.getId(),
                            assignment.getId(),
                            request.getAttendanceDate())) {

                throw new IllegalArgumentException(
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


}