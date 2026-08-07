package com.Attendance_Tracker.Trakg.service.excel;

import com.Attendance_Tracker.Trakg.dto.excel.ImportError;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.entity.Subject;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.entity.TeacherSubjectAssignment;
import com.Attendance_Tracker.Trakg.exception.BadRequestException;
import com.Attendance_Tracker.Trakg.exception.ResourceNotFoundException;
import com.Attendance_Tracker.Trakg.repository.ClassSectionRepository;
import com.Attendance_Tracker.Trakg.repository.SubjectRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherSubjectAssignmentRepository;
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
public class TeacherSubjectAssignmentImportService {

    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSectionRepository classSectionRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;

    public ImportResponse importTeacherSubjectAssignment(MultipartFile file) {
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
                if (processTeacherSubjectAssignmentRow(row, errors)) {
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

    private boolean processTeacherSubjectAssignmentRow(Row row,
                                         List<ImportError> errors) {

        try {
            Long teacherId = ExcelReader.getLong(row, 0);
            Long subjectId = ExcelReader.getLong(row, 1);
            Long classSectionId = ExcelReader.getLong(row, 2);
            if (teacherId == null
                    || subjectId == null
                    || classSectionId == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Missing required fields.")
                                .build()
                );
                return false;
            }
            Teacher teacher = teacherRepository
                    .findById(teacherId)
                    .orElse(null);
            if (teacher == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Invalid Teacher ID.")
                                .build()
                );
                return false;
            }
            Subject subject = subjectRepository
                    .findById(subjectId)
                    .orElse(null);
            if (subject == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Invalid Subject ID.")
                                .build()
                );
                return false;
            }
            ClassSection classSection = classSectionRepository
                    .findById(classSectionId)
                    .orElse(null);
            if (classSection == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Invalid Class Section ID.")
                                .build()
                );
                return false;
            }
            if (assignmentRepository.existsByTeacherAndSubjectAndClassSection(
                    teacher,
                    subject,
                    classSection)) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Assignment already exists.")
                                .build()
                );
                return false;
            }
            TeacherSubjectAssignment assignment =
                    TeacherSubjectAssignment.builder()
                            .teacher(teacher)
                            .subject(subject)
                            .classSection(classSection)
                            .build();
            assignmentRepository.save(assignment);
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
