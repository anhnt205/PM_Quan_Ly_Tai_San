package com.ecotel.quanlytaisan.model;

import lombok.Data;

/**
 * Kế hoạch sửa chữa.
 * TrangThai: 0=Nháp | 1=Chờ duyệt | 2=Đã hủy | 3=Đã duyệt/Hoàn thành
 */
@Data
public class KeHoachSuaChua {
    private String id;
    private String idCongTy;

    // Thông tin cơ bản
    private String soKeHoach;
    private String tenKeHoach;
    private String soQuyetDinh;
    private String idLoaiKeHoach;
    private String idLoaiSuaChua;
    private Integer nam;

    // Đơn vị
    private String idDonViGiao;
    private String idDonViNhan;

    // Người lập biểu
    private String idNguoiLapBieu;
    private Boolean nguoiLapBieuXacNhan;

    // Trình duyệt giám đốc
    private String idTrinhDuyetGiamDoc;
    private Boolean trinhDuyetGiamDocXacNhan;

    // Thông tin chung
    private Integer trangThai;

    private String ngayTao;
    private String ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;

    // File đính kèm chính
    private String ghiChu;
    private String duongDanFile;
    private String tenFile;
    private String ngayKy;

    // Tài liệu bảng kê (file riêng)
    private String duongDanTaiLieuBangKe;

    // Workflow flags
    private Boolean share;
    private Boolean byStep;

    // Null-safe getters
    public Integer getTrangThai()                { return trangThai != null ? trangThai : 0; }
    public Boolean getNguoiLapBieuXacNhan()      { return nguoiLapBieuXacNhan != null ? nguoiLapBieuXacNhan : false; }
    public Boolean getTrinhDuyetGiamDocXacNhan() { return trinhDuyetGiamDocXacNhan != null ? trinhDuyetGiamDocXacNhan : false; }
    public Boolean getShare()                    { return share != null ? share : false; }
    public Boolean getByStep()                   { return byStep != null ? byStep : false; }
}