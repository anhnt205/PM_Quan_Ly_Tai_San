package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.apache.poi.ss.usermodel.Row;
import java.util.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
@Getter
@Setter
public class KeHoachChiTietSuaChua {
    private String id;
    private String idKeHoach;
    private String idChiTietCCDC;
    private String idTaiSan;          // NULL nếu là CCDC
    private String idCCDC;             // NULL nếu là Tài sản
    private String ghiChu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    // Các trường hiển thị (được gán từ join)
    private String tenTaiSan;
    private String tenCCDC;

    // Map từ mảng String (import CSV)
    public static KeHoachChiTietSuaChua mapToKeHoachChiTietSuaChua(String[] row) {
        KeHoachChiTietSuaChua ct = new KeHoachChiTietSuaChua();
        ct.setId(safeGet(row, 0));
        ct.setIdKeHoach(safeGet(row, 1));
        ct.setIdTaiSan(safeGet(row, 2));
        ct.setIdCCDC(safeGet(row, 3));
        ct.setGhiChu(safeGet(row, 4));
        ct.setNgayTao(parseDate(safeGet(row, 5), "yyyy-MM-dd HH:mm:ss"));
        ct.setNgayCapNhat(parseDate(safeGet(row, 6), "yyyy-MM-dd HH:mm:ss"));
        ct.setIdChiTietCCDC(safeGet(row, 7));
        return ct;
    }

    // Map từ Row của Apache POI (import Excel)
    public static KeHoachChiTietSuaChua mapToKeHoachChiTietSuaChua(Row row) {
        KeHoachChiTietSuaChua ct = new KeHoachChiTietSuaChua();
        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setIdKeHoach(getCellStringValue(row.getCell(1)));
        ct.setIdTaiSan(getCellStringValue(row.getCell(2)));
        ct.setIdCCDC(getCellStringValue(row.getCell(3)));
        ct.setGhiChu(getCellStringValue(row.getCell(4)));

        LocalDateTime ngayTao = getCellDate(row.getCell(5));
        ct.setNgayTao(ngayTao != null ? Date.from(ngayTao.atZone(ZoneId.systemDefault()).toInstant()) : null);

        LocalDateTime ngayCapNhat = getCellDate(row.getCell(6));
        ct.setNgayCapNhat(ngayCapNhat != null ? Date.from(ngayCapNhat.atZone(ZoneId.systemDefault()).toInstant()) : null);

        ct.setIdChiTietCCDC(getCellStringValue(row.getCell(7)));

        return ct;
    }

    // Helper methods
    private static String safeGet(String[] arr, int index) {
        return (arr != null && index < arr.length) ? arr[index] : null;
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