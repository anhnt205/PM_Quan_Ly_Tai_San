package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

@Data
public class NguoiKy {
    private String id, idTaiLieu, idNguoiKy;
    private String tenNguoiKy;
    private String idPhongBan;
    private Integer trangThai;

    public static NguoiKy mapToNguoiKy(String[] row) {
        NguoiKy nk = new NguoiKy();
        nk.setId(row[0]);
        nk.setIdTaiLieu(row[1]);
        nk.setIdNguoiKy(row[2]);
        nk.setTenNguoiKy(row[3]);
        nk.setIdPhongBan(row[4]);
        nk.setTrangThai(row[5] != null && !row[5].isEmpty() ? Integer.parseInt(row[5]) : 0);
        return nk;
    }

    public static NguoiKy mapToNguoiKy(Row row) {
        NguoiKy nk = new NguoiKy();
        nk.setId(getCellStringValue(row.getCell(0)));
        nk.setIdTaiLieu(getCellStringValue(row.getCell(1)));
        nk.setIdNguoiKy(getCellStringValue(row.getCell(2)));
        nk.setTenNguoiKy(getCellStringValue(row.getCell(3)));
        nk.setIdPhongBan(getCellStringValue(row.getCell(4)));
        nk.setTrangThai(row.getCell(5) != null ? (int) row.getCell(5).getNumericCellValue() : 0);
        return nk;
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
