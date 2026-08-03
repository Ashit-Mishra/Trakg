package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.Attendance;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    List<Teacher> findByDepartmentId(Long departmentId);
    boolean existsByUserUserId(String userId);
    boolean existsByUserEmail(String email);
    Optional<Teacher> findByUserUserId(String userId);
}