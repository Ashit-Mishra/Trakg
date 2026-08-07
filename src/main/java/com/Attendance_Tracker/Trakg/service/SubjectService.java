package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.SubjectRequest;
import com.Attendance_Tracker.Trakg.entity.Semester;
import com.Attendance_Tracker.Trakg.entity.Subject;
import com.Attendance_Tracker.Trakg.exception.DuplicateResourceException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.repository.SemesterRepository;
import com.Attendance_Tracker.Trakg.repository.SubjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final SemesterRepository semesterRepository;

    @Transactional
    public Subject createSubject(SubjectRequest request) {

        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Semester not found."));
        if (subjectRepository.existsBySubjectCodeAndSemesterId(
                request.getSubjectCode(),
                semester.getId())) {
            throw new DuplicateResourceException(
                    "Subject code already exists in this semester.");
        }
        Subject subject = Subject.builder()
                .subjectCode(request.getSubjectCode())
                .subjectName(request.getSubjectName())
                .semester(semester)
                .build();
        return subjectRepository.save(subject);
    }
    public Subject getSubject(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Subject not found."));
    }
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
    public List<Subject> getSubjectsBySemester(Long semesterId) {
        return subjectRepository.findBySemesterId(semesterId);
    }
}
