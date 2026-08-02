package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {

    boolean existsBySemesterNumberAndDepartmentId(
            Integer semesterNumber,
            Long departmentId
    );
    List<Semester> findByDepartmentId(Long departmentId);
}