package com.ecotel.quanlytaisan.model;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import lombok.Data;

@Data
public class Kho {
    private String id;
    private String tenKho;
    private String idQuanLy;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public static Kho mapToKho(String[] row) {
        Kho kho = new Kho();
        kho.setId(row[0]);
        kho.setTenKho(row[1]);
        kho.setIdQuanLy(row[2]);
        kho.setIdCongTy(row[3]);
        kho.setNgayTao(row[4] != null && !row[4].isEmpty() ? String.valueOf(row[4]) : null);
        kho.setNgayCapNhat(row[5] != null && !row[5].isEmpty() ? String.valueOf(row[5]) : null);
        kho.setNguoiTao(row[6]);
        kho.setNguoiCapNhat(row[7]);
        kho.setIsActive(row[8] != null ? Boolean.parseBoolean(row[8]) : true);
        return kho;
    }

    public static Kho mapToKho(Row row) {
        Kho kho = new Kho();
        kho.setId(getCellStringValue(row.getCell(0)));
        kho.setTenKho(getCellStringValue(row.getCell(1)));
        kho.setIdQuanLy(getCellStringValue(row.getCell(2)));
        kho.setIdCongTy(getCellStringValue(row.getCell(3)));
        kho.setNgayTao(row.getCell(4) != null ? String.valueOf(row.getCell(4).getLocalDateTimeCellValue()) : null);
        kho.setNgayCapNhat(row.getCell(5) != null ? String.valueOf(row.getCell(5).getLocalDateTimeCellValue()) : null);
        kho.setNguoiTao(getCellStringValue(row.getCell(6)));
        kho.setNguoiCapNhat(getCellStringValue(row.getCell(7)));
        kho.setIsActive(row.getCell(8) != null && row.getCell(8).getBooleanCellValue());
        return kho;
    }

    // helper
    public static String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return null;
        }
    }
}

