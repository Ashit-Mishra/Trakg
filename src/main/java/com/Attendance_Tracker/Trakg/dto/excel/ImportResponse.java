package com.Attendance_Tracker.Trakg.dto.excel;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportResponse {

    private int totalRows;
    private int importedRows;
    private int failedRows;
    private List<ImportError> errors;
}
