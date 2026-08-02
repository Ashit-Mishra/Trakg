package com.Attendance_Tracker.Trakg.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignTeacherRequest {

    @NotNull
    private Long teacherId;
    @NotNull
    private Long subjectId;
    @NotNull
    private Long classSectionId;
}