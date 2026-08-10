package com.Attendance_Tracker.Trakg.util;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;

public class ExcelReader {

    private ExcelReader() {
    }

    public static String getString(Row row, int cellIndex) {

        Cell cell = row.getCell(cellIndex);

        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {

            case STRING:
                return cell.getStringCellValue().trim();

            case NUMERIC:
                double value = cell.getNumericCellValue();

                if (value == Math.floor(value)) {
                    return String.valueOf((long) value);
                }

                return String.valueOf(value);

            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());

            case FORMULA:
                return cell.getCellFormula();

            default:
                return "";
        }
    }

    public static Long getLong(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return null;
        }
        return (long) cell.getNumericCellValue();
    }

    public static Integer getInteger(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return null;
        }
        return (int) cell.getNumericCellValue();
    }

    public static boolean isRowEmpty(Row row) {
        if (row == null) {
            return true;
        }
        for (Cell cell : row) {
            if (cell != null &&
                    cell.getCellType() != CellType.BLANK &&
                    !cell.toString().trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

}
