package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellStringValue;
@Data
public class KyTaiLieu {
    private String id, idTaiLieu;
    private Integer loaiKy;
    private Float x, y;
    private String idNguoiKy;
    private String chuKySo;
    private String ngayKy;
    private Integer stt;
    private String chuKyNhay;
    private String chuKyThuong;
    private Float scale;
    private Float width;

    public static KyTaiLieu mapToKyTaiLieu(String[] row) {
        KyTaiLieu ktl = new KyTaiLieu();
        ktl.setId(row[0]);
        ktl.setIdTaiLieu(row[1]);
        ktl.setLoaiKy(row[2] != null && !row[2].isEmpty() ? Integer.parseInt(row[2]) : 0);
        ktl.setX(row[3] != null && !row[3].isEmpty() ? Float.parseFloat(row[3]) : 0f);
        ktl.setY(row[4] != null && !row[4].isEmpty() ? Float.parseFloat(row[4]) : 0f);
        ktl.setIdNguoiKy(row[5]);
        ktl.setChuKySo(row[6]);
        ktl.setNgayKy(row[7]);
        ktl.setStt(row[8] != null && !row[8].isEmpty() ? Integer.parseInt(row[8]) : 0);
        return ktl;
    }

    public static KyTaiLieu mapToKyTaiLieu(Row row) {
        KyTaiLieu ktl = new KyTaiLieu();
        ktl.setId(getCellStringValue(row.getCell(0)));
        ktl.setIdTaiLieu(getCellStringValue(row.getCell(1)));
        ktl.setLoaiKy(row.getCell(2) != null ? (int) row.getCell(2).getNumericCellValue() : 0);
        ktl.setX(row.getCell(3) != null ? (float) row.getCell(3).getNumericCellValue() : 0f);
        ktl.setY(row.getCell(4) != null ? (float) row.getCell(4).getNumericCellValue() : 0f);
        ktl.setIdNguoiKy(getCellStringValue(row.getCell(5)));
        ktl.setChuKySo(getCellStringValue(row.getCell(6)));
        ktl.setNgayKy(getCellStringValue(row.getCell(7)));
        ktl.setStt(row.getCell(8) != null ? (int) row.getCell(8).getNumericCellValue() : 0);
        return ktl;
    }


}
