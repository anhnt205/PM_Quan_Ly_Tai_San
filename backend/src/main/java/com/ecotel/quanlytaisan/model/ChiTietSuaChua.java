package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.poi.ss.usermodel.Row;
import java.util.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class ChiTietSuaChua {
    private String id;
    private String idSuaChua;
    private String idTaiSan;
    private String idCCDC;
    private String idChiTietCCDC;
    private Integer soLuong;           // INT DEFAULT 1
    private String hienTrang;
    private String moTa;
    private String ghiChu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Custom getters
    public Integer getSoLuong() {
        return soLuong != null ? soLuong : 1;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : false;
    }

    public static ChiTietSuaChua mapToChiTietSuaChua(String[] row) {
        ChiTietSuaChua ct = new ChiTietSuaChua();
        ct.setId(safeGet(row, 0));
        ct.setIdSuaChua(safeGet(row, 1));
        ct.setIdTaiSan(safeGet(row, 2));
        ct.setIdCCDC(safeGet(row, 3));
        ct.setIdChiTietCCDC(safeGet(row, 4));
        ct.setSoLuong(parseInt(safeGet(row, 5)));
        ct.setHienTrang(safeGet(row, 6));
        ct.setMoTa(safeGet(row, 7));
        ct.setGhiChu(safeGet(row, 8));
        ct.setNgayTao(parseDate(safeGet(row, 9), "yyyy-MM-dd HH:mm:ss"));
        ct.setNgayCapNhat(parseDate(safeGet(row, 10), "yyyy-MM-dd HH:mm:ss"));
        ct.setNguoiTao(safeGet(row, 11));
        ct.setNguoiCapNhat(safeGet(row, 12));
        ct.setIsActive(parseBoolean(safeGet(row, 13)));
        return ct;
    }

    public static ChiTietSuaChua mapToChiTietSuaChua(Row row) {
        ChiTietSuaChua ct = new ChiTietSuaChua();
        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setIdSuaChua(getCellStringValue(row.getCell(1)));
        ct.setIdTaiSan(getCellStringValue(row.getCell(2)));
        ct.setIdCCDC(getCellStringValue(row.getCell(3)));
        ct.setIdChiTietCCDC(getCellStringValue(row.getCell(4)));
        ct.setSoLuong((int) parseDouble(getCellStringValue(row.getCell(5))));
        ct.setHienTrang(getCellStringValue(row.getCell(6)));
        ct.setMoTa(getCellStringValue(row.getCell(7)));
        ct.setGhiChu(getCellStringValue(row.getCell(8)));

        LocalDateTime ngayTao = getCellDate(row.getCell(9));
        ct.setNgayTao(ngayTao != null ? Date.from(ngayTao.atZone(ZoneId.systemDefault()).toInstant()) : null);

        LocalDateTime ngayCapNhat = getCellDate(row.getCell(10));
        ct.setNgayCapNhat(ngayCapNhat != null ? Date.from(ngayCapNhat.atZone(ZoneId.systemDefault()).toInstant()) : null);

        ct.setNguoiTao(getCellStringValue(row.getCell(11)));
        ct.setNguoiCapNhat(getCellStringValue(row.getCell(12)));
        ct.setIsActive(getCellBooleanValue(row.getCell(13)));
        return ct;
    }

    private static String safeGet(String[] arr, int index) {
        return (arr != null && index < arr.length) ? arr[index] : null;
    }

    private static Boolean parseBoolean(String val) {
        return val != null ? Boolean.parseBoolean(val) : false;
    }

    private static Integer parseInt(String val) {
        try {
            return val != null ? Integer.parseInt(val) : 1;
        } catch (NumberFormatException e) {
            return 1;
        }
    }

    private static double parseDouble(String val) {
        try {
            return val != null ? Double.parseDouble(val) : 1.0;
        } catch (NumberFormatException e) {
            return 1.0;
        }
    }

    private static Date parseDate(String val, String pattern) {
        if (val == null || val.isEmpty()) return null;
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat(pattern);
            return sdf.parse(val);
        } catch (Exception e) {
            return null;
        }
    }
}