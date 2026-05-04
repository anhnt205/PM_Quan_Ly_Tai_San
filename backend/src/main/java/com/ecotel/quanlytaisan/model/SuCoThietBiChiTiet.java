package com.ecotel.quanlytaisan.model;

import lombok.Data;

/**
 * Chi tiết tài sản trong phiếu sự cố thiết bị.
 *
 * Mỗi dòng tương ứng một tài sản cụ thể xuất hiện trong phiếu sự cố.
 */
@Data
public class SuCoThietBiChiTiet {

    /** Khóa chính (UUID prefix SCCT_) */
    private String id;

    /** ID phiếu sự cố cha */
    private String idSuCo;

    /** ID tài sản liên quan */
    private String idTaiSan;

    /**
     * Thuộc hệ thống – nhập tay tự do
     * (ví dụ: "Hệ thống điện", "Hệ thống PCCC", …)
     */
    private String thuocHeThong;

    private String viTri;

    private Integer soLuong;

    /**
     * Tình trạng tài sản tại thời điểm sự cố – nhập tay
     * (ví dụ: "Hỏng hoàn toàn", "Còn hoạt động một phần", …)
     */
    private String tinhTrang;

    /** ID đơn vị quản lý kỹ thuật phụ trách tài sản */
    private String idDonViQuanLyKyThuat;

    // ---------- Audit ----------

    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    // ---------- Join fields (chỉ đọc, không lưu DB) ----------

    /** Tên tài sản (join TaiSan) */
    private String tenTaiSan;

    /** Đơn vị tính của tài sản (join TaiSan) */
    private String donViTinh;

    /** Tên nhóm tài sản (join NhomTaiSan qua TaiSan.IdNhomTaiSan) */
    private String tenNhomTaiSan;

    /** Tên đơn vị quản lý kỹ thuật (join PhongBan) */
    private String tenDonViQuanLyKyThuat;
}
