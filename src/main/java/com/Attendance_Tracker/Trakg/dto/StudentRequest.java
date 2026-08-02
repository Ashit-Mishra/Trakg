package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRequest {

    @NotBlank
    @Size(min = 4, max = 30)
    private String userId;
    @NotBlank
    @Size(min = 3, max = 100)
    private String name;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String rollNumber;
    @NotNull
    private Long classSectionId;
}