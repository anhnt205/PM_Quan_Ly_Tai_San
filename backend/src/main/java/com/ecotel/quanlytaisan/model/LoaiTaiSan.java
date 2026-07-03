package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

@Data
public class LoaiTaiSan {
    private String id;
    private String tenLoaiTaiSan;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public static LoaiTaiSan mapToLoaiTaiSan(String[] row) {
        LoaiTaiSan lts = new LoaiTaiSan();
        lts.setId(row[0]);
        lts.setTenLoaiTaiSan(row[1]);
        lts.setIdCongTy(row[2]);
        lts.setNgayTao(row[3] != null && !row[3].isEmpty() ? String.valueOf(row[3]) : null);
        lts.setNgayCapNhat(row[4] != null && !row[4].isEmpty() ? String.valueOf(row[4]) : null);
        lts.setNguoiTao(row[5]);
        lts.setNguoiCapNhat(row[6]);
        lts.setIsActive(row[7] != null && Boolean.parseBoolean(row[7]));
        return lts;
    }

    public static LoaiTaiSan mapToLoaiTaiSan(Row row) {
        LoaiTaiSan lts = new LoaiTaiSan();
        lts.setId(getCellStringValue(row.getCell(0)));
        lts.setTenLoaiTaiSan(getCellStringValue(row.getCell(1)));
        lts.setIdCongTy(getCellStringValue(row.getCell(2)));
        lts.setNgayTao(row.getCell(3) != null ? String.valueOf(row.getCell(3).getLocalDateTimeCellValue()) : null);
        lts.setNgayCapNhat(row.getCell(4) != null ? String.valueOf(row.getCell(4).getLocalDateTimeCellValue()) : null);
        lts.setNguoiTao(getCellStringValue(row.getCell(5)));
        lts.setNguoiCapNhat(getCellStringValue(row.getCell(6)));
        lts.setIsActive(getCellBooleanValue(row.getCell(7)));
        return lts;
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

}
