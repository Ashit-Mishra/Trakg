package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    boolean existsBySubjectCodeAndSemesterId(
            String subjectCode,
            Long semesterId
    );
    List<Subject> findBySemesterId(Long semesterId);

    boolean existsBySubjectCode(String subjectCode);
}
