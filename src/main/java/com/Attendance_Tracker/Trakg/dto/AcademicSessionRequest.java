package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicSessionRequest {

    @NotBlank(message = "Session name is required")
    private String sessionName;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;
}