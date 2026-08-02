package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherSubjectAssignmentRepository
        extends JpaRepository<TeacherSubjectAssignment, Long> {

    boolean existsByTeacherIdAndSubjectIdAndClassSectionId(
            Long teacherId,
            Long subjectId,
            Long classSectionId
    );
    List<TeacherSubjectAssignment> findByTeacherId(Long teacherId);
    List<TeacherSubjectAssignment> findBySubjectId(Long subjectId);
    List<TeacherSubjectAssignment> findByClassSectionId(Long classSectionId);
    Optional<TeacherSubjectAssignment>
    findBySubjectIdAndClassSectionId(Long subjectId, Long classSectionId);
    List<TeacherSubjectAssignment>
    findByTeacherIdAndClassSectionId(Long teacherId, Long classSectionId);
}
