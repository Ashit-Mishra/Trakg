package com.Attendance_Tracker.Trakg.service.excel;

import com.Attendance_Tracker.Trakg.dto.excel.ImportError;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.entity.Semester;
import com.Attendance_Tracker.Trakg.exception.BadRequestException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.repository.ClassSectionRepository;
import com.Attendance_Tracker.Trakg.repository.DepartmentRepository;
import com.Attendance_Tracker.Trakg.repository.SemesterRepository;
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
public class ClassSectionImportService {

    private final ClassSectionRepository classSectionRepository;
    private final DepartmentRepository departmentRepository;
    private final SemesterRepository semesterRepository;

    public ImportResponse importClassSection(MultipartFile file) {
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
                if (processClassSectionRow(row, errors)) {
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

    private boolean processClassSectionRow(Row row,
                                           List<ImportError> errors) {

        try {
            String sectionName = ExcelReader.getString(row, 0);
            String departmentCode = ExcelReader.getString(row, 1);
            Long semesterId = ExcelReader.getLong(row, 2);
            if (sectionName.isBlank()
                    || departmentCode.isBlank()
                    || semesterId == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Missing required fields.")
                                .build()
                );
                return false;
            }
            if (classSectionRepository.existsBySectionName(sectionName)) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Section already exists.")
                                .build()
                );
                return false;
            }
            Department department =
                    departmentRepository.findByDepartmentCode(departmentCode)
                    ;
            if (department == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Invalid Department Code.")
                                .build()
                );
                return false;
            }
            Semester semester =
                    semesterRepository.findById(semesterId)
                            .orElse(null);
            if (semester == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Invalid Semester ID.")
                                .build()
                );
                return false;
            }
            ClassSection classSection = ClassSection.builder()
                    .sectionName(sectionName)
                    .department(department)
                    .semester(semester)
                    .build();
            classSectionRepository.save(classSection);
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
