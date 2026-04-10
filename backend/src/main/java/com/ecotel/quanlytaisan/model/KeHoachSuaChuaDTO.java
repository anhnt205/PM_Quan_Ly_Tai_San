package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

/**
 * DTO kế hoạch sửa chữa – mirror DieuDongTaiSanDTO với đầy đủ join fields.
 */
@Data
public class KeHoachSuaChuaDTO {
    private String id;
    private String idCongTy;

    // Thông tin cơ bản
    private String soKeHoach;
    private String tenKeHoach;
    private String idLoaiKeHoach;
    private String tenLoaiKeHoach;
    private String idLoaiSuaChua;
    private String tenLoaiSuaChua;
    private Integer nam;

    // Đơn vị lập kế hoạch (join)
    private String idDonViLap;
    private String tenDonViLap;

    // Đơn vị thực hiện (join)
    private String idDonViThucHien;
    private String tenDonViThucHien;

    // Người lập phiếu ký nháy
    private String idNguoiKyNhay;
    private String tenNguoiKyNhay;
    private Boolean trangThaiKyNhay;
    private Boolean nguoiLapPhieuKyNhay;

    // Trình duyệt cấp phòng
    private String idTrinhDuyetCapPhong;
    private String tenTrinhDuyetCapPhong;
    private Boolean trinhDuyetCapPhongXacNhan;

    // Trình duyệt giám đốc
    private String idTrinhDuyetGiamDoc;
    private String tenTrinhDuyetGiamDoc;
    private Boolean trinhDuyetGiamDocXacNhan;

    // Phòng ban xem phiếu
    private String idPhongBanXemPhieu;
    private String tenPhongBanXemPhieu;

    // Ngày kế hoạch
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
    private String tenNguoiTao;
    private String nguoiCapNhat;

    // Nội dung / file
    private String ghiChu;
    private String trichYeu;
    private String duongDanFile;
    private String tenFile;
    private String ngayKy;

    // Workflow flags
    private Boolean share;
    private Boolean byStep;

    // Danh sách chữ ký
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;

    // Danh sách chi tiết tài sản sửa chữa
    private List<KeHoachSuaChuaChiTietTaiSan> danhSachTaiSan;

    // Custom getters for null safety
    public Integer getTrangThai() { return trangThai != null ? trangThai : 0; }
    public Boolean getTrangThaiKyNhay() { return trangThaiKyNhay != null ? trangThaiKyNhay : false; }
    public Boolean getNguoiLapPhieuKyNhay() { return nguoiLapPhieuKyNhay != null ? nguoiLapPhieuKyNhay : false; }
    public Boolean getTrinhDuyetCapPhongXacNhan() { return trinhDuyetCapPhongXacNhan != null ? trinhDuyetCapPhongXacNhan : false; }
    public Boolean getTrinhDuyetGiamDocXacNhan() { return trinhDuyetGiamDocXacNhan != null ? trinhDuyetGiamDocXacNhan : false; }
    public Boolean getShare() { return share != null ? share : false; }
    public Boolean getByStep() { return byStep != null ? byStep : false; }
}