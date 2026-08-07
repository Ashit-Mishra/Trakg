package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.ClassSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassSectionRepository
        extends JpaRepository<ClassSection, Long> {
    boolean existsBySectionNameAndSemesterId(
            String sectionName,
            Long semesterId
    );
    List<ClassSection> findBySemesterId(Long semesterId);
    boolean existsBySectionName(String sectionName);
}