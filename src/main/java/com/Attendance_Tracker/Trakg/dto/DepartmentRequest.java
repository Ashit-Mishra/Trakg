package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentRequest {
    @NotBlank(message = "Department code is required")
    private String departmentCode;
    @NotBlank(message = "Department code is required")
    private String departmentName;
    @NotNull(message = "Department code is required")
    private Long academicSessionId;
}
