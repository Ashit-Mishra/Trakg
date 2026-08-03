package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    boolean existsByStudentIdAndAssignmentIdAndAttendanceDate(
            Long studentId,
            Long assignmentId,
            LocalDate attendanceDate
    );
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByAssignmentId(Long assignmentId);
}