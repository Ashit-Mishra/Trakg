package com.Attendance_Tracker.Trakg.dto;

import com.Attendance_Tracker.Trakg.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private String userId;
    private String name;
    private String email;
    private Role role;
    private boolean enabled;
}
