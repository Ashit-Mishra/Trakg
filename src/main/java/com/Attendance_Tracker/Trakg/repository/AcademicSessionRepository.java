package com.Attendance_Tracker.Trakg.repository;


import com.Attendance_Tracker.Trakg.entity.AcademicSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicSessionRepository
        extends JpaRepository<AcademicSession, Long> {

    Optional<AcademicSession> findByActiveTrue();

    boolean existsBySessionName(String sessionName);

    AcademicSession findBySessionName(String sessionName);
}
