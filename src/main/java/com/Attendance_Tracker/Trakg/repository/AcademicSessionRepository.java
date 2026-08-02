package com.Attendance_Tracker.Trakg.repository;


import com.Attendance_Tracker.Trakg.entity.AcademicSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AcademicSessionRepository
        extends JpaRepository<AcademicSession, Long> {

    Optional<AcademicSession> findByActiveTrue();

    boolean existsBySessionName(String sessionName);
}
