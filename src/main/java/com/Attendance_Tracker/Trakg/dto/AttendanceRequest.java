package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequest {

    @NotNull
    private Long assignmentId;

    @NotNull
    private LocalDate attendanceDate;

    @NotEmpty
    private List<StudentAttendanceRequest> students;
}