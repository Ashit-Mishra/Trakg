package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    boolean existsByDepartmentCodeAndAcademicSessionId(String departmentCode, Long academicSessionId);

    boolean existsByDepartmentNameAndAcademicSessionId(String departmentName, Long academicSessionId);

    List<Department> findByAcademicSessionId(Long academicSessionId);
    boolean existsByDepartmentName(String departmentName);
}