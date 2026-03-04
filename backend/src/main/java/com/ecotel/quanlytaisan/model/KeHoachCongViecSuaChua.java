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
public class KeHoachCongViecSuaChua {
    private String id;
    private String idKeHoach;
    private String tenCongViec;
    private String moTa;
    private Integer thoiGianDuKien;       // phút
    private String nguoiThucHien;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayThucHien;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private Integer trangThai;             // 0: Chưa TH, 1: Đang TH, 2: Hoàn thành, 3: Hủy

    // Custom getters
    public Integer getThoiGianDuKien() {
        return thoiGianDuKien != null ? thoiGianDuKien : 0;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }

    // Map từ mảng String (import CSV)
    public static KeHoachCongViecSuaChua mapToKeHoachCongViecSuaChua(String[] row) {
        KeHoachCongViecSuaChua cv = new KeHoachCongViecSuaChua();
        cv.setId(safeGet(row, 0));
        cv.setIdKeHoach(safeGet(row, 1));
        cv.setTenCongViec(safeGet(row, 2));
        cv.setMoTa(safeGet(row, 3));
        cv.setThoiGianDuKien(parseInt(safeGet(row, 4)));
        cv.setNgayThucHien(parseDate(safeGet(row, 5), "yyyy-MM-dd"));
        cv.setNgayTao(parseDate(safeGet(row, 6), "yyyy-MM-dd HH:mm:ss"));
        cv.setNgayCapNhat(parseDate(safeGet(row, 7), "yyyy-MM-dd HH:mm:ss"));
        cv.setTrangThai(parseInt(safeGet(row, 8)));
        cv.setNguoiThucHien(safeGet(row, 9));
        return cv;
    }

    // Map từ Row của Apache POI (import Excel)
    public static KeHoachCongViecSuaChua mapToKeHoachCongViecSuaChua(Row row) {
        KeHoachCongViecSuaChua cv = new KeHoachCongViecSuaChua();
        cv.setId(getCellStringValue(row.getCell(0)));
        cv.setIdKeHoach(getCellStringValue(row.getCell(1)));
        cv.setTenCongViec(getCellStringValue(row.getCell(2)));
        cv.setMoTa(getCellStringValue(row.getCell(3)));
        cv.setThoiGianDuKien(parseInt(getCellStringValue(row.getCell(4))));

        LocalDateTime ngayTH = getCellDate(row.getCell(5));
        cv.setNgayThucHien(ngayTH != null ? Date.from(ngayTH.atZone(ZoneId.systemDefault()).toInstant()) : null);

        LocalDateTime ngayTao = getCellDate(row.getCell(6));
        cv.setNgayTao(ngayTao != null ? Date.from(ngayTao.atZone(ZoneId.systemDefault()).toInstant()) : null);

        LocalDateTime ngayCapNhat = getCellDate(row.getCell(7));
        cv.setNgayCapNhat(ngayCapNhat != null ? Date.from(ngayCapNhat.atZone(ZoneId.systemDefault()).toInstant()) : null);

        cv.setTrangThai(parseInt(getCellStringValue(row.getCell(8))));
        cv.setNguoiThucHien(getCellStringValue(row.getCell(9)));
        return cv;
    }

    // Helper methods
    private static String safeGet(String[] arr, int index) {
        return (arr != null && index < arr.length) ? arr[index] : null;
    }

    private static Integer parseInt(String val) {
        try {
            return val != null ? Integer.parseInt(val) : 0;
        } catch (NumberFormatException e) {
            return 0;
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