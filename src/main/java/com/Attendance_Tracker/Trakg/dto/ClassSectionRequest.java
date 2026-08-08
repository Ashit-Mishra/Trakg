package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSectionRequest {

    @NotBlank
    private String sectionName;
    @NotNull(message = "Department id is required")
    private Long departmentId;
    @NotNull
    private Long semesterId;
}