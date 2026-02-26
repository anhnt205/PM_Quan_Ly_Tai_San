package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

@Data
public class SetNguonKinhPhi {
    private String id;
    private String idTaiSan;
    private String idNguonKinhPhi;
    private String tenNguonKinhPhi;

    public static SetNguonKinhPhi mapToSetNguonKinhPhi(String[] row) {
        SetNguonKinhPhi snkp = new SetNguonKinhPhi();
        snkp.setId(row[0]);
        snkp.setIdTaiSan(row[1]);
        snkp.setIdNguonKinhPhi(row[2]);
        snkp.setTenNguonKinhPhi(row[3]);
        return snkp;
    }

    public static SetNguonKinhPhi mapToSetNguonKinhPhi(Row row) {
        SetNguonKinhPhi snkp = new SetNguonKinhPhi();
        snkp.setId(getCellStringValue(row.getCell(0)));
        snkp.setIdTaiSan(getCellStringValue(row.getCell(1)));
        snkp.setIdNguonKinhPhi(getCellStringValue(row.getCell(2)));
        snkp.setTenNguonKinhPhi(getCellStringValue(row.getCell(3)));
        return snkp;
    }

    @Override
    public String toString() {
        return "SetNguonKinhPhi{" +
                "id='" + id + '\'' +
                ", idTaiSan='" + idTaiSan + '\'' +
                ", idNguonKinhPhi='" + idNguonKinhPhi + '\'' +
                ", tenNguonKinhPhi='" + tenNguonKinhPhi + '\'' +
                '}';
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
}
