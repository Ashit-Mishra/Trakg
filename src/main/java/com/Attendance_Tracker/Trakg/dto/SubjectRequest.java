package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.sql.Driver;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectRequest {

    @NotBlank
    private String subjectCode;
    @NotBlank
    private String subjectName;
    @NotNull
    private Long semesterId;
    @NotNull
    private Integer semesterNumber;
    @NotBlank
    private String departmentCode;
}