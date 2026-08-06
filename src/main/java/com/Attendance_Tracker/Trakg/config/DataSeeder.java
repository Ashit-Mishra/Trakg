package com.Attendance_Tracker.Trakg.config;

import com.Attendance_Tracker.Trakg.entity.User;
import com.Attendance_Tracker.Trakg.enums.Role;
import com.Attendance_Tracker.Trakg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.findByUserId("admin").isEmpty()) {

            User admin = User.builder()
                    .userId("admin")
                    .name("Administrator")
                    .email("admin@trakg.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
        }
    }
}
