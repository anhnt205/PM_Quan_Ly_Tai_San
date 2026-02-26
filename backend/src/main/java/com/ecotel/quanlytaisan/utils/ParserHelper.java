package com.ecotel.quanlytaisan.utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.Date;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.*;

public class ParserHelper {
    private static final DateTimeFormatter FLEXIBLE_FORMATTER = new DateTimeFormatterBuilder()
            // yyyy-MM-dd
            .appendPattern("yyyy-MM-dd")
            // cho phép có 'T' hoặc ' ' (space) giữa ngày và giờ
            .optionalStart()
            .appendPattern("'T'HH:mm:ss")
            .optionalEnd()
            .optionalStart()
            .appendPattern(" HH:mm:ss")
            .optionalEnd()
            // milliseconds (3 chữ số) hoặc microseconds (6 chữ số)
            .optionalStart()
            .appendFraction(ChronoField.NANO_OF_SECOND, 1, 6, true)
            .optionalEnd()
            // nếu không có giờ thì mặc định 00:00:00
            .parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
            .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter();

    // Standard ISO 8601 formatter for consistent date-time formatting
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    
    // Helper method to format LocalDateTime to ISO 8601 string
    public static String formatToISO(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(ISO_FORMATTER);
    }
    
    // Helper method to format Timestamp to ISO 8601 string
    public static String formatToISO(Timestamp timestamp) {
        if (timestamp == null) return null;
        return timestamp.toLocalDateTime().format(ISO_FORMATTER);
    }
    
    // Helper method to format String timestamp to ISO 8601 string
    public static String formatToISO(String timestamp) {
        if (timestamp == null) return null;
        try {
            LocalDateTime ldt = parseDate(timestamp);
            return ldt != null ? ldt.format(ISO_FORMATTER) : timestamp;
        } catch (Exception e) {
            return timestamp; // Return original if conversion fails
        }
    }
    
    // Helper method to format Date to ISO 8601 string
    public static String formatToISO(Date date) {
        if (date == null) return null;
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime().format(ISO_FORMATTER);
    }

    public static LocalDateTime parseDateTime(String input) {
        // nếu input chỉ có yyyy-MM-dd thì vẫn parse được (giờ = 00:00:00)
        if (input.length() == 10) {
            return LocalDate.parse(input, FLEXIBLE_FORMATTER).atStartOfDay();
        }
        return LocalDateTime.parse(input, FLEXIBLE_FORMATTER);
    }
    public static Float parseFloat(String s) {
        try { return (s == null || s.isEmpty()) ? null : Float.parseFloat(s); }
        catch (Exception e) { return null; }
    }
    public static Double parseDouble(String s) {
        try { return (s == null || s.isEmpty()) ? null : Double.parseDouble(s); }
        catch (Exception e) { return null; }
    }

    public static  Integer parseInteger(String s) {
        try { return (s == null || s.isEmpty()) ? null : Integer.parseInt(s); }
        catch (Exception e) { return null; }
    }

    public static  int parseInt(String s) {
        try { return Integer.parseInt(s); }
        catch (Exception e) { return 0; }
    }

    public static LocalDateTime parseDate(String s) {
        try {
            if (s == null || s.isEmpty()) return null;
            // Try ISO format first (with 'T')
            return LocalDateTime.parse(s, ISO_FORMATTER);
        } catch (Exception e) {
            try {
                // Fallback to MySQL format (with space)
                return LocalDateTime.parse(s, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            } catch (Exception ex) {
                return null;
            }
        }
    }

    public static  Boolean parseBoolean(String s) {
        if (s == null) return null;
        return s.equalsIgnoreCase("true") || s.equals("1") || s.equalsIgnoreCase("yes");
    }

    public static  String getCellString(Cell cell) {
        if (cell == null) return null;
        return cell.getCellType() == CellType.STRING ? cell.getStringCellValue()
                : cell.getCellType() == CellType.NUMERIC ? String.valueOf(cell.getNumericCellValue())
                : null;
    }

    public static  Float getCellFloat(Cell cell) {
        if (cell == null) return null;
        return (float) cell.getNumericCellValue();
    }

    public static  Integer getCellInteger(Cell cell) {
        if (cell == null) return null;
        return (int) cell.getNumericCellValue();
    }

    public static  int getCellInt(Cell cell) {
        if (cell == null) return 0;
        return (int) cell.getNumericCellValue();
    }

    public static  LocalDateTime getCellDate(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue();
        }
        return parseDate(getCellString(cell));
    }

    public static  Boolean getCellBoolean(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.BOOLEAN) return cell.getBooleanCellValue();
        return parseBoolean(getCellString(cell));
    }
    public static Timestamp parseTimestamp(String input) {
        if (input == null || input.isEmpty()) return null;
        try {
            return Timestamp.valueOf(input); // nếu đúng định dạng yyyy-MM-dd HH:mm:ss
        } catch (IllegalArgumentException e) {
            // thử parse format ISO 8601 chuẩn
            LocalDateTime ldt = LocalDateTime.parse(input, ISO_FORMATTER);
            return Timestamp.valueOf(ldt);
        }
    }

    public static String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }

    public static boolean getCellBooleanValue(Cell cell) {
        if (cell == null) return false;
        switch (cell.getCellType()) {
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case STRING:
                return Boolean.parseBoolean(cell.getStringCellValue());
            case NUMERIC:
                return cell.getNumericCellValue() != 0;
            default:
                return false;
        }
    }
    public static BigDecimal toBigDecimal(String val) {
        return (val != null && !val.isEmpty()) ? new BigDecimal(val) : BigDecimal.ZERO;
    }
    public static Date getCellDateValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        switch (cell.getCellType()) {
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue(); // Excel lưu dạng date
                } else {
                    return null;
                }
            case STRING:
                String val = cell.getStringCellValue().trim();
                if (!val.isEmpty()) {
                    try {
                        // Parse as ISO 8601 format and convert to Date
                        LocalDateTime ldt = LocalDateTime.parse(val + "T00:00:00", ISO_FORMATTER);
                        return Date.from(ldt.atZone(ZoneId.systemDefault()).toInstant());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                return null;
            default:
                return null;
        }
    }

    public static void exportJsonListToExcel(List<Map<String, Object>> jsonList, String sheetName, OutputStream out) throws Exception {
        if (jsonList == null || jsonList.isEmpty()) return;

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(sheetName != null ? sheetName : "Sheet1");

        // Lấy tất cả key để làm header
        Set<String> headerSet = new LinkedHashSet<>();
        for (Map<String, Object> map : jsonList) {
            headerSet.addAll(map.keySet());
        }
        List<String> headers = new ArrayList<>(headerSet);

        // Header row
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.size(); i++) {
            headerRow.createCell(i).setCellValue(headers.get(i));
        }

        // Data
        int rowIdx = 1;
        for (Map<String, Object> map : jsonList) {
            Row row = sheet.createRow(rowIdx++);
            for (int i = 0; i < headers.size(); i++) {
                Object value = map.get(headers.get(i));
                Cell cell = row.createCell(i);
                if (value != null) {
                    if (value instanceof Number) {
                        cell.setCellValue(((Number) value).doubleValue());
                    } else if (value instanceof Boolean) {
                        cell.setCellValue((Boolean) value);
                    } else {
                        cell.setCellValue(value.toString());
                    }
                } else {
                    cell.setCellValue("");
                }
            }
        }

        // Auto size
        for (int i = 0; i < headers.size(); i++) {
            sheet.autoSizeColumn(i);
        }

        workbook.write(out);
        workbook.close();
    }
}
