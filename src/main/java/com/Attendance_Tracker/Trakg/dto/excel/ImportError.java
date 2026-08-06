package com.Attendance_Tracker.Trakg.dto.excel;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportError {

    private int row;
    private String message;

}
