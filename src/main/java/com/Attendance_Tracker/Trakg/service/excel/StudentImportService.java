package com.Attendance_Tracker.Trakg.service.excel;

import com.Attendance_Tracker.Trakg.dto.excel.ImportError;
import com.Attendance_Tracker.Trakg.dto.excel.ImportResponse;
import com.Attendance_Tracker.Trakg.entity.ClassSection;
import com.Attendance_Tracker.Trakg.entity.Student;
import com.Attendance_Tracker.Trakg.entity.User;
import com.Attendance_Tracker.Trakg.enums.Role;
import com.Attendance_Tracker.Trakg.repository.ClassSectionRepository;
import com.Attendance_Tracker.Trakg.repository.StudentRepository;
import com.Attendance_Tracker.Trakg.repository.UserRepository;
import com.Attendance_Tracker.Trakg.util.ExcelReader;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentImportService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ClassSectionRepository classSectionRepository;
    private final PasswordEncoder passwordEncoder;


    public  ImportResponse importStudents(MultipartFile file) {
        List<ImportError> errors = new ArrayList<>();
        int totalRows = 0;
        int importedRows = 0;
        int failedRows = 0;
        try (
                Workbook workbook = WorkbookFactory.create(file.getInputStream())
        ) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0 || ExcelReader.isRowEmpty(row)) {
                    continue;
                }
                totalRows++;
                if (processStudentRow(row, errors)) {
                    importedRows++;
                } else {
                    failedRows++;
                }
            }
        }
        catch (IOException e) {
            throw new RuntimeException("Unable to read Excel file.", e);
        }
        return ImportResponse.builder()
                .totalRows(totalRows)
                .importedRows(importedRows)
                .failedRows(failedRows)
                .errors(errors)
                .build();
    }

        private boolean processStudentRow(Row row, List<ImportError> errors) {

            try {
                // Skip header
                if (row.getRowNum() == 0) {
                    return false;
                }
                // Skip empty row
                if (ExcelReader.isRowEmpty(row)) {
                    return false;
                }
                // Read values
                String userId = ExcelReader.getString(row, 0);
                String name = ExcelReader.getString(row, 1);
                String email = ExcelReader.getString(row, 2);
                String rollNumber = ExcelReader.getString(row, 3);
                Long classSectionId = ExcelReader.getLong(row, 4);
                // Required field validation
                if (userId.isBlank()
                        || name.isBlank()
                        || email.isBlank()
                        || rollNumber.isBlank()
                        || classSectionId == null) {
                    errors.add(
                            ImportError.builder()
                                    .row(row.getRowNum() + 1)
                                    .message("Missing required fields.")
                                    .build()
                    );
                    return false;
                }
                // Duplicate User ID
                if (userRepository.existsByUserId(userId)) {
                    errors.add(
                            ImportError.builder()
                                    .row(row.getRowNum() + 1)
                                    .message("User ID already exists.")
                                    .build()
                    );
                    return false;
                }
                // Duplicate Email
                if (userRepository.existsByEmail(email)) {
                    errors.add(
                            ImportError.builder()
                                    .row(row.getRowNum() + 1)
                                    .message("Email already exists.")
                                    .build()
                    );
                    return false;
                }
                // Duplicate Roll Number
                if (studentRepository.existsByRollNumber(rollNumber)) {
                    errors.add(
                            ImportError.builder()
                                    .row(row.getRowNum() + 1)
                                    .message("Roll Number already exists.")
                                    .build()
                    );
                    return false;
                }
                // Class Section
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
                // Create User
                User user = User.builder()
                        .userId(userId)
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.STUDENT)
                        .enabled(true)
                        .build();
                userRepository.save(user);
                // Create Student
                Student student = Student.builder()
                        .user(user)
                        .rollNumber(rollNumber)
                        .classSection(classSection)
                        .build();
                studentRepository.save(student);
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