package com.Attendance_Tracker.Trakg.service.excel;
import com.Attendance_Tracker.Trakg.dto.excel.ImportError;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.Department;
import com.Attendance_Tracker.Trakg.entity.Teacher;
import com.Attendance_Tracker.Trakg.entity.User;
import com.Attendance_Tracker.Trakg.enums.Role;
import com.Attendance_Tracker.Trakg.repository.DepartmentRepository;
import com.Attendance_Tracker.Trakg.repository.TeacherRepository;
import com.Attendance_Tracker.Trakg.repository.UserRepository;
import com.Attendance_Tracker.Trakg.util.ExcelReader;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherImportService {

    private static final Logger logger =
            LoggerFactory.getLogger(TeacherImportService.class);

    private static final String DEFAULT_PASSWORD = "Password@123";
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public ImportResponse importTeachers(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Please upload an Excel file.");
        }
        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.endsWith(".xlsx")) {
            throw new IllegalArgumentException("Only .xlsx files are supported.");
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
                if (processTeacherRow(row, errors)) {
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

    private boolean processTeacherRow(Row row,
                                      List<ImportError> errors) {
        try {
            String userId = ExcelReader.getString(row, 0);
            String name = ExcelReader.getString(row, 1);
            String email = ExcelReader.getString(row, 2);
            Long departmentId = ExcelReader.getLong(row, 3);
            String designation = ExcelReader.getString(row, 4);
            if (userId.isBlank()
                    || name.isBlank()
                    || email.isBlank()
                    || designation.isBlank()
                    || departmentId == null) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Missing required fields.")
                                .build()
                );
                return false;
            }
            if (userRepository.existsByUserId(userId)) {
                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("User ID already exists.")
                                .build()
                );
                return false;
            }
            if (userRepository.existsByEmail(email)) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Email already exists.")
                                .build()
                );

                return false;
            }
            Department department =
                    departmentRepository.findById(departmentId)
                            .orElse(null);
            if (department == null) {

                errors.add(
                        ImportError.builder()
                                .row(row.getRowNum() + 1)
                                .message("Invalid Department ID.")
                                .build()
                );

                return false;
            }
            User user = User.builder()
                    .userId(userId)
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                    .role(Role.TEACHER)
                    .enabled(true)
                    .build();

            userRepository.save(user);
            Teacher teacher = Teacher.builder()
                    .user(user)
                    .department(department)
                    .designation(designation)
                    .build();

            teacherRepository.save(teacher);
            return true;
        } catch (Exception ex) {
            logger.error("Failed to import teacher at row {}",
                    row.getRowNum() + 1,
                    ex);
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