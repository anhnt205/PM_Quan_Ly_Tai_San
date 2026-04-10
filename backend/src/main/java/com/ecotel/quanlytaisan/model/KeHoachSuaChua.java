package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

/**
 * Kế hoạch sửa chữa – mirror DieuDongTaiSan với workflow ký duyệt đầy đủ.
 * TrangThai: 0=Nháp | 1=Chờ duyệt | 2=Đã hủy | 3=Đã duyệt/Hoàn thành
 */
@Data
public class KeHoachSuaChua {
    private String id;
    private String idCongTy;

    // Thông tin cơ bản
    private String soKeHoach;
    private String tenKeHoach;
    private String idLoaiKeHoach;
    private String idLoaiSuaChua;
    private Integer nam;

    // Đơn vị (tương tự idDonViGiao / idDonViNhan)
    private String idDonViLap;
    private String idDonViThucHien;

    // Người lập phiếu ký nháy
    private String idNguoiKyNhay;
    private Boolean trangThaiKyNhay;
    private Boolean nguoiLapPhieuKyNhay;

    // Trình duyệt cấp phòng
    private String idTrinhDuyetCapPhong;
    private Boolean trinhDuyetCapPhongXacNhan;

    // Trình duyệt giám đốc
    private String idTrinhDuyetGiamDoc;
    private Boolean trinhDuyetGiamDocXacNhan;

    // Phòng ban xem phiếu
    private String idPhongBanXemPhieu;

    // Ngày thực hiện
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayBatDau;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThuc;

    // Thông tin chung
    private Integer trangThai;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;

    // File / nội dung
    private String ghiChu;
    private String trichYeu;
    private String duongDanFile;
    private String tenFile;
    private String ngayKy;

    // Workflow flags
    private Boolean share;
    private Boolean byStep;

    // Custom getters for null safety
    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }

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

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }
}