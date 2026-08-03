package com.Attendance_Tracker.Trakg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherProfileResponse {

    private String userId;
    private String name;
    private String email;
    private String designation;
    private String department;
}
