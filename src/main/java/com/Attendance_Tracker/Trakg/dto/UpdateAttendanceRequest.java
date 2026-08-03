package com.Attendance_Tracker.Trakg.dto;

import com.Attendance_Tracker.Trakg.enums.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAttendanceRequest {

    @NotNull
    private AttendanceStatus status;

}
