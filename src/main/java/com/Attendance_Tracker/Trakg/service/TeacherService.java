package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.TeacherRequest;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.entity.User;
import com.Attendance_Tracker.Trakg.enums.Role;
import com.Attendance_Tracker.Trakg.exception.DuplicateResourceException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.repository.DepartmentRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherRepository;
import com.Attendance_Tracker.Trakg.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Teacher createTeacher(TeacherRequest request) {

        if (userRepository.existsByUserId(request.getUserId())) {
            throw new DuplicateResourceException("User ID already exists.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists.");
        }
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found."));

        User user = User.builder()
                .userId(request.getUserId())
                .password(passwordEncoder.encode("Password@123"))
                .name(request.getName())
                .email(request.getEmail())
                .role(Role.TEACHER)
                .enabled(true)
                .build();
        userRepository.save(user);
        Teacher teacher = Teacher.builder()
                .user(user)
                .department(department)
                .designation(request.getDesignation())
                .build();
        return teacherRepository.save(teacher);
    }
    public Teacher getTeacher(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found."));
    }
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }
    public List<Teacher> getTeachersByDepartment(Long departmentId) {
        return teacherRepository.findByDepartmentId(departmentId);
    }

}