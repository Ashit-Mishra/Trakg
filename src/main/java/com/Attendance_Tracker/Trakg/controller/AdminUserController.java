package com.Attendance_Tracker.Trakg.controller;

import com.Attendance_Tracker.Trakg.dto.UserResponse;
import com.Attendance_Tracker.Trakg.entity.User;
import com.Attendance_Tracker.Trakg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable String userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }
    @PutMapping("/{userId}/disable")
    public ResponseEntity<UserResponse> disableUser(
            @PathVariable String userId) {
        return ResponseEntity.ok(userService.disableUser(userId));
    }
    @PutMapping("/{userId}/enable")
    public ResponseEntity<UserResponse> enableUser(
            @PathVariable String userId) {
        return ResponseEntity.ok(userService.enableUser(userId));
    }
}