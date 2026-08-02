package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.AssignTeacherRequest;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.entity.Subject;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import com.Attendance_Tracker.Trakg.repository.ClassSectionRepository;
import com.Attendance_Tracker.Trakg.repository.SubjectRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherSubjectAssignmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherSubjectAssignmentService {

    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSectionRepository classSectionRepository;

    @Transactional
    public TeacherSubjectAssignment assignTeacher(
            AssignTeacherRequest request) {

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Teacher not found."));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Subject not found."));
        ClassSection classSection = classSectionRepository.findById(request.getClassSectionId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Class Section not found."));
        if (assignmentRepository.existsByTeacherIdAndSubjectIdAndClassSectionId(
                teacher.getId(),
                subject.getId(),
                classSection.getId())) {
            throw new IllegalArgumentException(
                    "Assignment already exists.");
        }
        // Teacher and Subject must belong to same department
        if (!teacher.getDepartment().getId().equals(
                subject.getSemester().getDepartment().getId())) {
            throw new IllegalArgumentException(
                    "Teacher and Subject belong to different departments.");
        }
        // Subject and Class Section must belong to same semester
        if (!subject.getSemester().getId().equals(
                classSection.getSemester().getId())) {
            throw new IllegalArgumentException(
                    "Subject and Class Section belong to different semesters.");
        }
        TeacherSubjectAssignment assignment =
                TeacherSubjectAssignment.builder()
                        .teacher(teacher)
                        .subject(subject)
                        .classSection(classSection)
                        .build();

        return assignmentRepository.save(assignment);
    }
    public TeacherSubjectAssignment getAssignment(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Assignment not found."));
    }
    public List<TeacherSubjectAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }
    public List<TeacherSubjectAssignment> getAssignmentsByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId);
    }
    public List<TeacherSubjectAssignment> getAssignmentsBySubject(Long subjectId) {
        return assignmentRepository.findBySubjectId(subjectId);
    }
    public List<TeacherSubjectAssignment> getAssignmentsByClassSection(Long classSectionId) {
        return assignmentRepository.findByClassSectionId(classSectionId);
    }

}
