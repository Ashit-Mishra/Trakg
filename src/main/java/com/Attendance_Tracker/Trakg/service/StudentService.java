package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.StudentRequest;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.entity.Student;
import com.Attendance_Tracker.Trakg.entity.User;
import com.Attendance_Tracker.Trakg.enums.Role;
import com.Attendance_Tracker.Trakg.repository.ClassSectionRepository;
import com.Attendance_Tracker.Trakg.repository.StudentRepository;
import com.Attendance_Tracker.Trakg.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ClassSectionRepository classSectionRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Student createStudent(StudentRequest request) {

        if (userRepository.existsByUserId(request.getUserId())) {
            throw new IllegalArgumentException("User ID already exists.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new IllegalArgumentException("Roll number already exists.");
        }
        ClassSection classSection = classSectionRepository
                .findById(request.getClassSectionId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Class section not found."));
        User user = User.builder()
                .userId(request.getUserId())
                .password(passwordEncoder.encode("Password@123"))
                .name(request.getName())
                .email(request.getEmail())
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        userRepository.save(user);
        Student student = Student.builder()
                .user(user)
                .rollNumber(request.getRollNumber())
                .classSection(classSection)
                .build();
        return studentRepository.save(student);
    }
    public Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));
    }
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    public List<Student> getStudentsByClassSection(Long classSectionId) {
        return studentRepository.findByClassSectionId(classSectionId);
    }

}