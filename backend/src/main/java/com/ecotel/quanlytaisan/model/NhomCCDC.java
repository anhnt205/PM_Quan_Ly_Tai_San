package com.ecotel.quanlytaisan.model;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import lombok.Data;

@Data
public class NhomCCDC {
    private String id;
    private String ten;
    private Boolean hieuLuc;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    public static NhomCCDC mapToNhomCCDC(String[] row) {
        NhomCCDC nccdc = new NhomCCDC();
        nccdc.setId(row[0]);
        nccdc.setTen(row[1]);
        nccdc.setHieuLuc(row[2] != null ? Boolean.parseBoolean(row[2]) : false);
        nccdc.setIdCongTy(row[3]);
        nccdc.setNgayTao(row[4] != null && !row[4].isEmpty() ? String.valueOf(row[4]) : null);
        nccdc.setNgayCapNhat(row[5] != null && !row[5].isEmpty() ? String.valueOf(row[5]) : null);
        nccdc.setNguoiTao(row[6]);
        nccdc.setNguoiCapNhat(row[7]);
        return nccdc;
    }
    public static NhomCCDC mapToNhomCCDC(Row row) {
        NhomCCDC nccdc = new NhomCCDC();
        nccdc.setId(getCellStringValue(row.getCell(0)));
        nccdc.setTen(getCellStringValue(row.getCell(1)));
        nccdc.setHieuLuc(row.getCell(2) != null && row.getCell(2).getBooleanCellValue());
        nccdc.setIdCongTy(getCellStringValue(row.getCell(3)));
        nccdc.setNgayTao(row.getCell(4) != null ? String.valueOf(row.getCell(4).getLocalDateTimeCellValue()) : null);
        nccdc.setNgayCapNhat(row.getCell(5) != null ? String.valueOf(row.getCell(5).getLocalDateTimeCellValue()) : null);
        nccdc.setNguoiTao(getCellStringValue(row.getCell(6)));
        nccdc.setNguoiCapNhat(getCellStringValue(row.getCell(7)));
        return nccdc;
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
