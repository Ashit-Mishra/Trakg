package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherSubjectAssignmentRepository
        extends JpaRepository<TeacherSubjectAssignment, Long> {
}
