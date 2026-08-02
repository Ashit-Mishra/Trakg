package com.Attendance_Tracker.Trakg.repository;

import com.Attendance_Tracker.Trakg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findByUserId(String userId);
    boolean existsByUserId(String userId);
    boolean existsByEmail(String email);
}
