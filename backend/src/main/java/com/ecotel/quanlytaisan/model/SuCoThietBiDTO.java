package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

/**
 * DTO sự cố thiết bị – bao gồm các trường join từ bảng liên quan.
 *
 * TrangThai: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành
 * MucDo    : 1=Nhẹ  | 2=Trung bình | 3=Nặng | 4=Nghiêm trọng
 */
@Data
public class SuCoThietBiDTO {

    /** Khóa chính */
    private String id;

    /** ID công ty */
    private String idCongTy;
    private String congTy;
    private String tenMauBienBan;

    /** ID kế hoạch sửa chữa liên quan */
    private String idKeHoach;

    /** Số phiếu sự cố */
    private String soPhieu;

    // ---------- Đơn vị báo cáo ----------

    /** ID đơn vị / phòng ban báo cáo */
    private String idDonViBaoCao;

    /** Tên đơn vị báo cáo (join PhongBan) */
    private String tenDonViBaoCao;

    /** Ngày phát hiện sự cố */
    private String ngayPhatHien;

    /** Tên hệ thống / thiết bị gặp sự cố */
    private String tenHeThongThietBi;

    /** Phân hệ hoặc vị trí xảy ra sự cố */
    private String phanHeViTri;

    /**
     * Mức độ sự cố:
     *   1 = Nhẹ
     *   2 = Trung bình
     *   3 = Nặng
     *   4 = Nghiêm trọng
     */
    private Integer mucDo;

    /** Mô tả chi tiết sự cố */
    private String moTa;

    private String ghiChuBienBan;

    // ---------- Người lập ----------

    /** ID nhân viên lập phiếu */
    private String idNguoiLap;

    /** Họ tên người lập (join NhanVien) */
    private String tenNguoiLap;

    /** Người lập đã xác nhận? */
    private Boolean nguoiLapXacNhan;

    // ---------- Giám đốc ----------

    /** ID giám đốc duyệt */
    private String idGiamDoc;

    /** Họ tên giám đốc (join NhanVien) */
    private String tenGiamDoc;

    /** Giám đốc đã xác nhận? */
    private Boolean giamDocXacNhan;

    // ---------- Workflow ----------

    /** Chia sẻ phiếu cho người ký */
    private Boolean share;

    /**
     * Trạng thái phiếu:
     *   0 = Nháp
     *   1 = Đã duyệt
     *   2 = Hủy
     *   3 = Hoàn thành
     */
    private Integer trangThai;

    // ---------- Audit ----------

    private String ngayTao;
    private String ngayCapNhat;

    private String nguoiTao;

    /** Họ tên người tạo (join NhanVien) */
    private String tenNguoiTao;

    private String nguoiCapNhat;

    // ---------- Danh sách liên quan ----------

    /** Danh sách chữ ký tài liệu */
    private List<KyTaiLieu> chuKyList;

    /** Danh sách người ký */
    private List<NguoiKy> nguoiKyList;

    /** Danh sách chi tiết tài sản bị sự cố */
    private List<SuCoThietBiChiTiet> danhSachTaiSan;

    private Integer daCoGiamDinh;

    // ---------- Null-safe getters ----------

    public Integer getTrangThai()       { return trangThai != null ? trangThai : 0; }
    public Integer getMucDo()           { return mucDo != null ? mucDo : 1; }
    public Boolean getNguoiLapXacNhan() { return nguoiLapXacNhan != null ? nguoiLapXacNhan : false; }
    public Boolean getGiamDocXacNhan()  { return giamDocXacNhan != null ? giamDocXacNhan : false; }
    public Boolean getShare()           { return share != null ? share : false; }
}
