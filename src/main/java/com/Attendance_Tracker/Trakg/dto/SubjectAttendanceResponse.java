package com.Attendance_Tracker.Trakg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectAttendanceResponse {

    private String subjectCode;
    private String subjectName;
    private long presentClasses;
    private long totalClasses;
    private double attendancePercentage;

}
