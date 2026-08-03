package com.Attendance_Tracker.Trakg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherAssignmentResponse {

    private Long assignmentId;
    private String subjectCode;
    private String subjectName;
    private Integer semester;
    private String classSection;
}
