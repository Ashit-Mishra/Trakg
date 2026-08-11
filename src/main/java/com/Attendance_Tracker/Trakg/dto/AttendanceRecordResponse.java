package com.Attendance_Tracker.Trakg.dto;

import com.Attendance_Tracker.Trakg.enums.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRecordResponse {

    private Long attendanceId;
    private String studentName;
    private String rollNumber;
    private AttendanceStatus status;
    private LocalDate attendanceDate;
    private String subjectCode;
    private String subjectName;
    private String teacherName;
}