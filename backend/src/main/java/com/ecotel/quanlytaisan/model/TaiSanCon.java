package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

@Data
public class TaiSanCon {
    private String id,idTaiSanCon,tenTaiSan,idTaiSanCha,ngayTao,ngayCapNhat,nguoiTao,nguoiCapNhat,isActive;
    private TaiSanCon mapToTaiSanCon(String[] row) {
        TaiSanCon ts = new TaiSanCon();
        ts.setId(row[0]);
        ts.setIdTaiSanCon(row[1]);
        ts.setIdTaiSanCha(row[2]);
        ts.setNgayTao(row[3] != null && !row[3].isEmpty() ? String.valueOf(row[3]) : null);
        ts.setNgayCapNhat(row[4] != null && !row[4].isEmpty() ? String.valueOf(row[4]) : null);
        ts.setNguoiTao(row[5]);
        ts.setNguoiCapNhat(row[6]);
        ts.setIsActive(String.valueOf(row[7] != null ? Boolean.parseBoolean(row[7]) : null));
        return ts;
    }
    private TaiSanCon mapToTaiSanCon(Row row) {
        TaiSanCon ts = new TaiSanCon();
        ts.setId(getCellStringValue(row.getCell(0)));
        ts.setIdTaiSanCon(getCellStringValue(row.getCell(1)));
        ts.setIdTaiSanCha(getCellStringValue(row.getCell(2)));
        ts.setNgayTao(row.getCell(3) != null ? String.valueOf(row.getCell(3).getLocalDateTimeCellValue()) : null);
        ts.setNgayCapNhat(row.getCell(4) != null ? String.valueOf(row.getCell(4).getLocalDateTimeCellValue()) : null);
        ts.setNguoiTao(getCellStringValue(row.getCell(5)));
        ts.setNguoiCapNhat(getCellStringValue(row.getCell(6)));
        ts.setIsActive(String.valueOf(row.getCell(7) != null ? row.getCell(7).getBooleanCellValue() : null));
        return ts;
    }

    private String getCellStringValue(Cell cell) {
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
