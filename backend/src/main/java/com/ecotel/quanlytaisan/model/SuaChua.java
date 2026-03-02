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
public class SuaChua {
    private String id;
    private String idCongTy;
    private String maSuaChua;
    private String tenSuaChua;
    private String mucDoSuCo;          // 'NANG', 'TRUNG_BINH', 'NHE'
    private String mucDoUuTien;        // 'CAP_BACH', 'CAO', 'TRUNG_BINH', 'THAP'
    private String idDonViGiao;         // Đơn vị giao
    private String idDonViNhan;         // Đơn vị nhận
    private String idNguoiKyNhay;        // Danh sách người ký nháy (JSON)
    private Boolean trangThaiKyNhay;     // Trạng thái ký nháy tổng thể
    private Boolean nguoiLapPhieuKyNhay; // Người lập phiếu đã ký nháy chưa

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThucDuKien;

    private String idTrinhDuyetCapPhong;      // ID người duyệt cấp phòng
    private Boolean trinhDuyetCapPhongXacNhan; // Xác nhận của cấp phòng

    private String idTrinhDuyetGiamDoc;        // ID giám đốc
    private Boolean trinhDuyetGiamDocXacNhan;   // Xác nhận của giám đốc

    private String idDonViDeNghi;               // Đơn vị đề nghị (có thể JSON)

    private String duongDanFile;
    private String tenFile;
    private String taiLieuBanGhi;
    private Boolean byStep;
    private String soQuyetDinh;
    private String nguoiTao;
    private Boolean share;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    private Boolean daBanGiao;
    private Boolean coPhieuBanGiao;
    private String taiLieuCuoi;
    private Integer loai;                        // Loại phiếu

    // Các trường hiển thị (được gán từ join)
    private String tenDonViGiao;
    private String tenDonViNhan;
    private String tenDonViDeNghi;
    private String tenNguoiKyNhay;                // Có thể parse từ JSON
    private String tenTrinhDuyetCapPhong;
    private String tenTrinhDuyetGiamDoc;

    private Integer trangThai; // 0: nháp, 1: chờ duyệt, 2: hủy, 3: hoàn thành

    // Custom getters for null safety
    public Boolean getTrangThaiKyNhay() {
        return trangThaiKyNhay != null ? trangThaiKyNhay : false;
    }

    public Boolean getNguoiLapPhieuKyNhay() {
        return nguoiLapPhieuKyNhay != null ? nguoiLapPhieuKyNhay : false;
    }

    public Boolean getTrinhDuyetCapPhongXacNhan() {
        return trinhDuyetCapPhongXacNhan != null ? trinhDuyetCapPhongXacNhan : false;
    }

    public Boolean getTrinhDuyetGiamDocXacNhan() {
        return trinhDuyetGiamDocXacNhan != null ? trinhDuyetGiamDocXacNhan : false;
    }

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getDaBanGiao() {
        return daBanGiao != null ? daBanGiao : false;
    }

    public Boolean getCoPhieuBanGiao() {
        return coPhieuBanGiao != null ? coPhieuBanGiao : false;
    }

    // Map từ mảng String (import CSV)
    public static SuaChua mapToSuaChua(String[] row) {
        SuaChua sc = new SuaChua();
        sc.setId(safeGet(row, 0));
        sc.setIdCongTy(safeGet(row, 1));
        sc.setMaSuaChua(safeGet(row, 2));
        sc.setTenSuaChua(safeGet(row, 3));
        sc.setMucDoSuCo(safeGet(row, 4));
        sc.setMucDoUuTien(safeGet(row, 5));
        sc.setIdDonViGiao(safeGet(row, 6));
        sc.setIdDonViNhan(safeGet(row, 7));
        sc.setIdNguoiKyNhay(safeGet(row, 8));
        sc.setTrangThaiKyNhay(parseBoolean(safeGet(row, 9)));
        sc.setNguoiLapPhieuKyNhay(parseBoolean(safeGet(row, 10)));
        sc.setNgayKetThucDuKien(parseDate(safeGet(row, 11), "yyyy-MM-dd"));
        sc.setIdTrinhDuyetCapPhong(safeGet(row, 12));
        sc.setTrinhDuyetCapPhongXacNhan(parseBoolean(safeGet(row, 13)));
        sc.setIdTrinhDuyetGiamDoc(safeGet(row, 14));
        sc.setTrinhDuyetGiamDocXacNhan(parseBoolean(safeGet(row, 15)));
        sc.setIdDonViDeNghi(safeGet(row, 16));
        sc.setDuongDanFile(safeGet(row, 17));
        sc.setTenFile(safeGet(row, 18));
        sc.setTaiLieuBanGhi(safeGet(row, 19));
        sc.setByStep(parseBoolean(safeGet(row, 20)));
        sc.setSoQuyetDinh(safeGet(row, 21));
        sc.setNguoiTao(safeGet(row, 22));
        sc.setShare(parseBoolean(safeGet(row, 23)));
        sc.setNgayTao(parseDate(safeGet(row, 24), "yyyy-MM-dd HH:mm:ss"));
        sc.setDaBanGiao(parseBoolean(safeGet(row, 25)));
        sc.setCoPhieuBanGiao(parseBoolean(safeGet(row, 26)));
        sc.setTaiLieuCuoi(safeGet(row, 27));
        sc.setLoai(parseInt(safeGet(row, 28)));
        return sc;
    }

    // Map từ Row của Apache POI (import Excel)
    public static SuaChua mapToSuaChua(Row row) {
        SuaChua sc = new SuaChua();
        sc.setId(getCellStringValue(row.getCell(0)));
        sc.setIdCongTy(getCellStringValue(row.getCell(1)));
        sc.setMaSuaChua(getCellStringValue(row.getCell(2)));
        sc.setTenSuaChua(getCellStringValue(row.getCell(3)));
        sc.setMucDoSuCo(getCellStringValue(row.getCell(4)));
        sc.setMucDoUuTien(getCellStringValue(row.getCell(5)));
        sc.setIdDonViGiao(getCellStringValue(row.getCell(6)));
        sc.setIdDonViNhan(getCellStringValue(row.getCell(7)));
        sc.setIdNguoiKyNhay(getCellStringValue(row.getCell(8)));
        sc.setTrangThaiKyNhay(getCellBooleanValue(row.getCell(9)));
        sc.setNguoiLapPhieuKyNhay(getCellBooleanValue(row.getCell(10)));

        LocalDateTime ngayKetThuc = getCellDate(row.getCell(11));
        sc.setNgayKetThucDuKien(ngayKetThuc != null ? Date.from(ngayKetThuc.atZone(ZoneId.systemDefault()).toInstant()) : null);

        sc.setIdTrinhDuyetCapPhong(getCellStringValue(row.getCell(12)));
        sc.setTrinhDuyetCapPhongXacNhan(getCellBooleanValue(row.getCell(13)));
        sc.setIdTrinhDuyetGiamDoc(getCellStringValue(row.getCell(14)));
        sc.setTrinhDuyetGiamDocXacNhan(getCellBooleanValue(row.getCell(15)));
        sc.setIdDonViDeNghi(getCellStringValue(row.getCell(16)));
        sc.setDuongDanFile(getCellStringValue(row.getCell(17)));
        sc.setTenFile(getCellStringValue(row.getCell(18)));
        sc.setTaiLieuBanGhi(getCellStringValue(row.getCell(19)));
        sc.setByStep(getCellBooleanValue(row.getCell(20)));
        sc.setSoQuyetDinh(getCellStringValue(row.getCell(21)));
        sc.setNguoiTao(getCellStringValue(row.getCell(22)));
        sc.setShare(getCellBooleanValue(row.getCell(23)));

        LocalDateTime ngayTao = getCellDate(row.getCell(24));
        sc.setNgayTao(ngayTao != null ? Date.from(ngayTao.atZone(ZoneId.systemDefault()).toInstant()) : null);

        sc.setDaBanGiao(getCellBooleanValue(row.getCell(25)));
        sc.setCoPhieuBanGiao(getCellBooleanValue(row.getCell(26)));
        sc.setTaiLieuCuoi(getCellStringValue(row.getCell(27)));
        sc.setLoai((int) parseDouble(getCellStringValue(row.getCell(28))));
        return sc;
    }

    // Helper methods
    private static String safeGet(String[] arr, int index) {
        return (arr != null && index < arr.length) ? arr[index] : null;
    }

    private static Boolean parseBoolean(String val) {
        return val != null ? Boolean.parseBoolean(val) : false;
    }

    private static Integer parseInt(String val) {
        try {
            return val != null ? Integer.parseInt(val) : 0;
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private static double parseDouble(String val) {
        try {
            return val != null ? Double.parseDouble(val) : 0.0;
        } catch (NumberFormatException e) {
            return 0.0;
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