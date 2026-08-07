package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.SemesterRequest;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.entity.Semester;
import com.Attendance_Tracker.Trakg.exception.DuplicateResourceException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.repository.DepartmentRepository;
import com.Attendance_Tracker.Trakg.repository.SemesterRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SemesterService {
    private final SemesterRepository semesterRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public Semester createSemester(SemesterRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found."));
        if (semesterRepository.existsBySemesterNumberAndDepartmentId(
                request.getSemesterNumber(),
                department.getId())) {
            throw new DuplicateResourceException(
                    "Semester already exists for this department.");
        }
        Semester semester = Semester.builder()
                .semesterNumber(request.getSemesterNumber())
                .department(department)
                .build();
        return semesterRepository.save(semester);
    }
    public Semester getSemester(Long id) {
        return semesterRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Semester not found."));
    }
    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }
    public List<Semester> getSemestersByDepartment(Long departmentId) {
        return semesterRepository.findByDepartmentId(departmentId);
    }
}
