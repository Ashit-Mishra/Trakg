package com.Attendance_Tracker.Trakg.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OverallAttendanceResponse {

    private long presentClasses;
    private long totalClasses;
    private double attendancePercentage;
    private List<SubjectAttendanceResponse> subjects;

}
