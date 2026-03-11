package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.poi.ss.usermodel.Row;

import java.util.Date;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class ChiTietKetQuaSuaChua {

    private String id;
    private String idKetQuaSuaChua;
    private String idTaiSan;
    private String idCCDC;
    private String idChiTietCCDC;

    private Integer soLuong;
    private String hienTrang;
    private String moTa;
    private String danhGia;
    private String vatTuSuDung;
    private String ghiChu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Default value safety
    public Integer getSoLuong() {
        return soLuong != null ? soLuong : 1;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : false;
    }

    /**
     * Map từ CSV (String[])
     */
    public static ChiTietKetQuaSuaChua mapToChiTietKetQuaSuaChua(String[] row) {

        ChiTietKetQuaSuaChua ct = new ChiTietKetQuaSuaChua();

        ct.setId(safeGet(row, 0));
        ct.setIdKetQuaSuaChua(safeGet(row, 1));
        ct.setIdTaiSan(safeGet(row, 2));
        ct.setIdCCDC(safeGet(row, 3));
        ct.setIdChiTietCCDC(safeGet(row, 4));
        ct.setSoLuong(parseInt(safeGet(row, 5)));
        ct.setHienTrang(safeGet(row, 6));
        ct.setMoTa(safeGet(row, 7));
        ct.setDanhGia(safeGet(row, 8));
        ct.setVatTuSuDung(safeGet(row, 9));
        ct.setGhiChu(safeGet(row, 10));

        return ct;
    }

    /**
     * Map từ Excel Row
     */
    public static ChiTietKetQuaSuaChua mapToChiTietKetQuaSuaChua(Row row) {

        ChiTietKetQuaSuaChua ct = new ChiTietKetQuaSuaChua();

        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setIdKetQuaSuaChua(getCellStringValue(row.getCell(1)));
        ct.setIdTaiSan(getCellStringValue(row.getCell(2)));
        ct.setIdCCDC(getCellStringValue(row.getCell(3)));
        ct.setIdChiTietCCDC(getCellStringValue(row.getCell(4)));
        ct.setSoLuong(getCellIntegerValue(row.getCell(5)));
        ct.setHienTrang(getCellStringValue(row.getCell(6)));
        ct.setMoTa(getCellStringValue(row.getCell(7)));
        ct.setDanhGia(getCellStringValue(row.getCell(8)));
        ct.setVatTuSuDung(getCellStringValue(row.getCell(9)));
        ct.setGhiChu(getCellStringValue(row.getCell(10)));

        return ct;
    }

    /**
     * Safe get cho CSV
     */
    private static String safeGet(String[] arr, int index) {
        return (arr != null && index < arr.length) ? arr[index] : null;
    }

    private static Integer parseInt(String val) {
        try {
            return val != null ? Integer.parseInt(val) : null;
        } catch (Exception e) {
            return null;
        }
    }
}