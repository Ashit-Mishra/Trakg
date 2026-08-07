package com.Attendance_Tracker.Trakg.service.excel;

import com.Attendance_Tracker.Trakg.dto.excel.ImportError;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.exception.BadRequestException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
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

    private boolean processDepartmentRow(Row row,
                                         List<ImportError> errors) {
        try {
            String departmentName =
                    ExcelReader.getString(row, 0);
            if (departmentName.isBlank()) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Department name is required.")
                                .build()
                );
                return false;
            }
            if (departmentRepository.existsByDepartmentName(departmentName)) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Department already exists.")
                                .build()
                );
                return false;
            }
            Department department = Department.builder()
                    .departmentName(departmentName)
                    .build();
            departmentRepository.save(department);
            return true;
        } catch (Exception ex) {
            errors.add(
                    ImportError.builder()
                            .row(row.getRowNum() + 1)
                            .message(ex.getMessage())
                            .build()
            );
            return false;
        }
    }
}