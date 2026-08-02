package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SemesterRequest {

    @NotNull(message = "Semester number is required")
    @Min(1)
    @Max(8)
    private Integer semesterNumber;

    @NotNull(message = "Department is required")
    private Long departmentId;
}