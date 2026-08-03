package com.Attendance_Tracker.Trakg.dto;

import com.Attendance_Tracker.Trakg.enums.AttendanceStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAttendanceRequest {

    private Long studentId;
    private AttendanceStatus status;
}