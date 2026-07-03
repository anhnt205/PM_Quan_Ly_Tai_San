package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

@Data
public class NguonKinhPhi {
    private String id;
    private String ten;
    private String note;

    public static NguonKinhPhi mapToNguonKinhPhi(String[] row) {
        NguonKinhPhi nkp = new NguonKinhPhi();
        nkp.setId(row[0]);
        nkp.setTen(row[1]);
        nkp.setNote(row[2]);
        return nkp;
    }

    public static NguonKinhPhi mapToNguonKinhPhi(Row row) {
        NguonKinhPhi nkp = new NguonKinhPhi();
        nkp.setId(getCellStringValue(row.getCell(0)));
        nkp.setTen(getCellStringValue(row.getCell(1)));
        nkp.setNote(getCellStringValue(row.getCell(2)));
        return nkp;
    }

    @Override
    public String toString() {
        return "NguonKinhPhi{" +
                "id='" + id + '\'' +
                ", ten='" + ten + '\'' +
                ", note='" + note + '\'' +
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
