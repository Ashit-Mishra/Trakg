package com.Attendance_Tracker.Trakg.service.excel;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class TemplateService {

    public ByteArrayInputStream generateStudentTemplate() throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Students");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("User ID");
        header.createCell(1).setCellValue("Name");
        header.createCell(2).setCellValue("Email");
        header.createCell(3).setCellValue("Roll Number");
        header.createCell(4).setCellValue("Class Section");
        for (int i = 0; i < 5; i++) {
            sheet.autoSizeColumn(i);
        }
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(outputStream.toByteArray());

    }
    public ByteArrayInputStream generateTeacherTemplate() throws IOException {

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Teachers");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("User ID");
        header.createCell(1).setCellValue("Name");
        header.createCell(2).setCellValue("Email");
        header.createCell(3).setCellValue("Department");
        header.createCell(4).setCellValue("Designation");
        for (int i = 0; i < 5; i++) {
            sheet.autoSizeColumn(i);
        }
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(outputStream.toByteArray());
    }
    public ByteArrayInputStream generateDepartmentTemplate()
            throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Departments");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Department Code");
        header.createCell(1).setCellValue("Department Name");
        header.createCell(2).setCellValue("Academic Session");
        for (int i = 0; i < 3; i++) {
            sheet.autoSizeColumn(i);
        }
        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(
                outputStream.toByteArray()
        );
    }
    public ByteArrayInputStream generateSubjectTemplate() throws IOException{
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Subjects");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Subject Code");
        header.createCell(1).setCellValue("Subject Name");
        header.createCell(2).setCellValue("Semester");
        header.createCell(3).setCellValue("Department");
        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
        }
        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(
                outputStream.toByteArray());
    }
    public ByteArrayInputStream generateClassSectionTemplate() throws IOException{
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("ClassSections");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Section Name");
        header.createCell(1).setCellValue("Department");
        header.createCell(2).setCellValue("Semester");
        for (int i = 0; i < 3; i++) {
            sheet.autoSizeColumn(i);
        }
        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(
                outputStream.toByteArray());
    }
    public ByteArrayInputStream generateTeacherSubjectAssignmentTemplate() throws IOException{
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Assignments");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Teacher Id");
        header.createCell(1).setCellValue("Subject Code");
        header.createCell(2).setCellValue("Class Section");
        for (int i = 0; i < 3; i++) {
            sheet.autoSizeColumn(i);
        }
        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(
                outputStream.toByteArray());
    }
}
