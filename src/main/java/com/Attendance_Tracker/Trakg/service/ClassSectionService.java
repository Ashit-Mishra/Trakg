package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.ClassSectionRequest;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.entity.Semester;
import com.Attendance_Tracker.Trakg.repository.ClassSectionRepository;
import com.Attendance_Tracker.Trakg.repository.SemesterRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassSectionService {

    private final ClassSectionRepository classSectionRepository;
    private final SemesterRepository semesterRepository;
    @Transactional
    public ClassSection createClassSection(ClassSectionRequest request) {
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Semester not found."));
        if (classSectionRepository.existsBySectionNameAndSemesterId(
                request.getSectionName(),
                semester.getId())) {
            throw new IllegalArgumentException(
                    "Section already exists for this semester.");
        }
        ClassSection classSection = ClassSection.builder()
                .sectionName(request.getSectionName())
                .semester(semester)
                .build();
        return classSectionRepository.save(classSection);
    }
    public ClassSection getClassSection(Long id) {
        return classSectionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Class section not found."));
    }
    public List<ClassSection> getAllClassSections() {
        return classSectionRepository.findAll();
    }
    public List<ClassSection> getClassSectionsBySemester(Long semesterId) {
        return classSectionRepository.findBySemesterId(semesterId);
    }

}