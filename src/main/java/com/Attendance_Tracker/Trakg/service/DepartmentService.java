package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.DepartmentRequest;
import com.Attendance_Tracker.Trakg.entity.AcademicSession;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.repository.AcademicSessionRepository;
import com.Attendance_Tracker.Trakg.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final AcademicSessionRepository academicSessionRepository;

    @Transactional
    public Department createDepartment(DepartmentRequest request){
        AcademicSession session = academicSessionRepository.findById(request.getAcademicSessionId())
                .orElseThrow(()->new IllegalArgumentException("Academic session not found"));
        if(departmentRepository.existsByDepartmentCodeAndAcademicSessionId
                (request.getDepartmentCode(), session.getId())) {
            throw new IllegalArgumentException(
                    "Department code already exists in this academic session.");
        }
        if (departmentRepository.existsByDepartmentNameAndAcademicSessionId
                (request.getDepartmentName(), session.getId())){
            throw new IllegalArgumentException(
                    "Department code already exists in this academic session.");
        }
        Department department = Department.builder()
                .departmentCode(request.getDepartmentCode())
                .departmentName(request.getDepartmentName())
                .academicSession(session)
                .build();

        return departmentRepository.save(department);

    }
    public Department getDepartment(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Department not found."));
    }
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    public List<Department> getDepartmentsByAcademicSession(Long sessionId) {
        return departmentRepository.findByAcademicSessionId(sessionId);
    }
}
