package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

/**
 * DTO kế hoạch sửa chữa với join fields.
 * TrangThai: 0=Nháp | 1=Chờ duyệt | 2=Đã hủy | 3=Đã duyệt/Hoàn thành
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

    // Đơn vị giao
    private String idDonViGiao;
    private String tenDonViGiao;

    // Đơn vị nhận
    private String idDonViNhan;
    private String tenDonViNhan;

    // Người lập biểu
    private String idNguoiLapBieu;
    private String tenNguoiLapBieu;
    private Boolean nguoiLapBieuXacNhan;

    // Trình duyệt giám đốc
    private String idTrinhDuyetGiamDoc;
    private String tenTrinhDuyetGiamDoc;
    private Boolean trinhDuyetGiamDocXacNhan;

    // Thông tin chung
    private Integer trangThai;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String tenNguoiTao;
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

    // Danh sách chữ ký
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;

    // Danh sách chi tiết tài sản
    private List<KeHoachSuaChuaChiTietTaiSan> danhSachTaiSan;

    // Null-safe getters
    public Integer getTrangThai()                { return trangThai != null ? trangThai : 0; }
    public Boolean getNguoiLapBieuXacNhan()      { return nguoiLapBieuXacNhan != null ? nguoiLapBieuXacNhan : false; }
    public Boolean getTrinhDuyetGiamDocXacNhan() { return trinhDuyetGiamDocXacNhan != null ? trinhDuyetGiamDocXacNhan : false; }
    public Boolean getShare()                    { return share != null ? share : false; }
    public Boolean getByStep()                   { return byStep != null ? byStep : false; }
}