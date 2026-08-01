package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.ClassSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassSectionRepository extends JpaRepository<ClassSection, Long> {
    Optional<ClassSection> findByName(String name);

}
