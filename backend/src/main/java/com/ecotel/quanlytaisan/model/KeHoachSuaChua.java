package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.poi.ss.usermodel.Row;
import java.util.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class KeHoachSuaChua {
    private String id;
    private String idCongTy;
    private String tenKeHoach;
    private String idLoaiKeHoach;
    private String idDonViThucHien;
    private String idDonViGiao;
    private String idNguoiPhuTrach;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayBatDau;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThuc;

    private String loaiDoiTuong;          // 'TAI_SAN', 'CCDC'

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String ghiChu;
    private String trangThai;

    // Các trường hiển thị (được gán từ join)
    private String tenDonViThucHien;
    private String tenNguoiPhuTrach;

    // Custom getters for null safety
    public String getTrangThai() {
        return trangThai != null ? trangThai : "CHUA_THUC_HIEN";
    }

    // Map từ mảng String (import CSV)
    public static KeHoachSuaChua mapToKeHoachSuaChua(String[] row) {
        KeHoachSuaChua kh = new KeHoachSuaChua();
        kh.setId(safeGet(row, 0));
        kh.setIdCongTy(safeGet(row, 1));
        kh.setTenKeHoach(safeGet(row, 2));
        kh.setIdLoaiKeHoach(safeGet(row, 3));
        kh.setIdDonViGiao(safeGet(row, 4));
        kh.setIdDonViThucHien(safeGet(row, 5));
        kh.setIdNguoiPhuTrach(safeGet(row, 6));
        kh.setNgayBatDau(parseDate(safeGet(row, 7), "yyyy-MM-dd"));
        kh.setNgayKetThuc(parseDate(safeGet(row, 8), "yyyy-MM-dd"));
        kh.setLoaiDoiTuong(safeGet(row, 9));
        kh.setNgayTao(parseDate(safeGet(row, 10), "yyyy-MM-dd HH:mm:ss"));
        kh.setNgayCapNhat(parseDate(safeGet(row, 11), "yyyy-MM-dd HH:mm:ss"));
        kh.setGhiChu(safeGet(row, 12));
        kh.setTrangThai(safeGet(row, 13));
        return kh;
    }

    // Map từ Row của Apache POI (import Excel)
    public static KeHoachSuaChua mapToKeHoachSuaChua(Row row) {
        KeHoachSuaChua kh = new KeHoachSuaChua();
        kh.setId(getCellStringValue(row.getCell(0)));
        kh.setIdCongTy(getCellStringValue(row.getCell(1)));
        kh.setTenKeHoach(getCellStringValue(row.getCell(2)));
        kh.setIdLoaiKeHoach(getCellStringValue(row.getCell(3)));
        kh.setIdDonViGiao(getCellStringValue(row.getCell(4)));
        kh.setIdDonViThucHien(getCellStringValue(row.getCell(5)));
        kh.setIdNguoiPhuTrach(getCellStringValue(row.getCell(6)));

        LocalDateTime ngayBD = getCellDate(row.getCell(7));
        kh.setNgayBatDau(ngayBD != null ? Date.from(ngayBD.atZone(ZoneId.systemDefault()).toInstant()) : null);

        LocalDateTime ngayKT = getCellDate(row.getCell(8));
        kh.setNgayKetThuc(ngayKT != null ? Date.from(ngayKT.atZone(ZoneId.systemDefault()).toInstant()) : null);

        kh.setLoaiDoiTuong(getCellStringValue(row.getCell(9)));

        LocalDateTime ngayTao = getCellDate(row.getCell(10));
        kh.setNgayTao(ngayTao != null ? Date.from(ngayTao.atZone(ZoneId.systemDefault()).toInstant()) : null);

        LocalDateTime ngayCapNhat = getCellDate(row.getCell(11));
        kh.setNgayCapNhat(ngayCapNhat != null ? Date.from(ngayCapNhat.atZone(ZoneId.systemDefault()).toInstant()) : null);

        kh.setGhiChu(getCellStringValue(row.getCell(12)));
        kh.setTrangThai(getCellStringValue(row.getCell(13)));
        return kh;
    }

    // Helper methods (giống các model khác)
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