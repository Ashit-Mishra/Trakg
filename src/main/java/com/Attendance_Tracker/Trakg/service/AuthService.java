package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.LoginRequest;
import com.Attendance_Tracker.Trakg.dto.LoginResponse;
import com.Attendance_Tracker.Trakg.security.CustomUserDetails;
import com.Attendance_Tracker.Trakg.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUserId(),
                                request.getPassword()
                        )
                );
        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        return LoginResponse.builder()
                .token(token)
                .build();
    }
}
