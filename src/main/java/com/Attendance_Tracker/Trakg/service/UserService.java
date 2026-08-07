package com.Attendance_Tracker.Trakg.service;

import com.Attendance_Tracker.Trakg.dto.UserResponse;
import com.Attendance_Tracker.Trakg.entity.User;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }
    public UserResponse getUser(String userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
        return mapToUserResponse(user);
    }
    @Transactional
    public UserResponse disableUser(String userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
        user.setEnabled(false);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }
    @Transactional
    public UserResponse enableUser(String userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
        user.setEnabled(true);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }
    private UserResponse mapToUserResponse(User user) {

        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build();
    }

}
