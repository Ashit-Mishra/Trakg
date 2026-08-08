package com.Attendance_Tracker.Trakg.service.excel;

import com.Attendance_Tracker.Trakg.dto.excel.ImportError;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.exception.BadRequestException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.repository.AcademicSessionRepository;
import com.Attendance_Tracker.Trakg.repository.DepartmentRepository;
import com.Attendance_Tracker.Trakg.util.ExcelReader;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentImportService {

    private final DepartmentRepository departmentRepository;
    private final AcademicSessionRepository academicSessionRepository;
    
    public ImportResponse importDepartments(MultipartFile file){
        if (file.isEmpty()) {
            throw new ResourceNotFoundException("Please upload an Excel file.");
        }
        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.endsWith(".xlsx")) {
            throw new BadRequestException("Only .xlsx files are supported.");
        }
        List<ImportError> errors = new ArrayList<>();

        int totalRows = 0;
        int importedRows = 0;
        int failedRows = 0;

        try (Workbook workbook =
                     WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0 || ExcelReader.isRowEmpty(row)) {
                    continue;
                }
                totalRows++;
                if (processDepartmentRow(row, errors)) {
                    importedRows++;
                } else {
                    failedRows++;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Unable to read Excel file.", e);
        }
        return ImportResponse.builder()
                .totalRows(totalRows)
                .importedRows(importedRows)
                .failedRows(failedRows)
                .errors(errors)
                .build();
    }

    private boolean processDepartmentRow(
            Row row,
            List<ImportError> errors) {

        try {

            // Column 0 → Department Code
            String departmentCode =
                    ExcelReader.getString(row, 0);

            // Column 1 → Department Name
            String departmentName =
                    ExcelReader.getString(row, 1);

            // Column 2 → Academic Session ID
            String academicSessionIdValue =
                    ExcelReader.getString(row, 2);

            // =========================
            // VALIDATION
            // =========================

            if (departmentCode == null ||
                    departmentCode.isBlank()) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message(
                                        "Department code is required."
                                )
                                .build()
                );

                return false;
            }

            if (departmentName == null ||
                    departmentName.isBlank()) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message(
                                        "Department name is required."
                                )
                                .build()
                );

                return false;
            }

            if (academicSessionIdValue == null ||
                    academicSessionIdValue.isBlank()) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message(
                                        "Academic session ID is required."
                                )
                                .build()
                );

                return false;
            }

            String academicSessionName;

            try {

                academicSessionName =
                                academicSessionIdValue.trim()
                        ;

            } catch (NumberFormatException ex) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message(
                                        "Academic session must be a valid."
                                )
                                .build()
                );

                return false;
            }

            // =========================
            // DUPLICATE CHECK
            // =========================
            if (departmentRepository
                    .existsByDepartmentCode(departmentCode)) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message(
                                        "Department code already exists."
                                )
                                .build()
                );

                return false;
            }
            if (departmentRepository
                    .existsByDepartmentName(departmentName)) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message(
                                        "Department already exists."
                                )
                                .build()
                );

                return false;
            }

            // =========================
            // FIND ACADEMIC SESSION
            // =========================

            var academicSession =
                    academicSessionRepository
                            .findBySessionName(academicSessionName)
                            ;

            if (academicSession == null) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message(
                                        "Academic session"
                                                + academicSessionName
                                                + " not found."
                                )
                                .build()
                );

                return false;
            }

            // =========================
            // CREATE DEPARTMENT
            // =========================

            Department department =
                    Department.builder()
                            .departmentCode(
                                    departmentCode.trim()
                            )
                            .departmentName(
                                    departmentName.trim()
                            )
                            .academicSession(
                                    academicSession
                            )
                            .build();

            departmentRepository.save(department);

            return true;

        } catch (Exception ex) {

            errors.add(
                    ImportError.builder()
                            .row(row.getRowNum() + 1)
                            .message(
                                    ex.getMessage() != null
                                            ? ex.getMessage()
                                            : "Unknown error occurred."
                            )
                            .build()
            );

            return false;
        }
    }
}