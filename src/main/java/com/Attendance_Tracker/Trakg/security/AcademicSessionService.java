package com.Attendance_Tracker.Trakg.security;

import com.Attendance_Tracker.Trakg.dto.AcademicSessionRequest;
import com.Attendance_Tracker.Trakg.entity.AcademicSession;
import com.Attendance_Tracker.Trakg.repository.AcademicSessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicSessionService {
    private final AcademicSessionRepository repository;

    @Transactional
    public AcademicSession createSession(
            AcademicSessionRequest request) {

        if (repository.existsBySessionName(request.getSessionName())) {
            throw new IllegalArgumentException(
                    "Academic session already exists."
            );
        }
        AcademicSession session = AcademicSession.builder()
                .sessionName(request.getSessionName())
                .startDate(request.getStartDate())
                .active(false)
                .build();

        return repository.save(session);
    }
    @Transactional
    public AcademicSession activateSession(Long sessionId) {

        AcademicSession session = repository.findById(sessionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Academic session not found."));
        if (session.isActive()) {
            return session;
        }
        repository.findByActiveTrue()
                .ifPresent(activeSession -> {
                    activeSession.setActive(false);
                    repository.save(activeSession);
                });
        session.setActive(true);
        return repository.save(session);
    }
    public AcademicSession getActiveSession(){
        return repository.findByActiveTrue()
                .orElseThrow(()-> new IllegalStateException("No active academic session"));
    }
    public List<AcademicSession> getAllSessions(){
        return repository.findAll();
    }
}
