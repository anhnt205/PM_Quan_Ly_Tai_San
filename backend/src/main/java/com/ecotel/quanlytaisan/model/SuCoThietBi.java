package com.ecotel.quanlytaisan.model;

import lombok.Data;

/**
 * Sự cố thiết bị.
 *
 * TrangThai: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành
 * MucDo    : 1=Nhẹ  | 2=Trung bình | 3=Nặng | 4=Nghiêm trọng
 */
@Data
public class SuCoThietBi {

    /** Khóa chính, tự sinh theo pattern SC-YYYY-NNNN */
    private String id;

    /** ID công ty sở hữu phiếu sự cố */
    private String idCongTy;
    private String congTy;
    private String tenMauBienBan;

    /** ID kế hoạch sửa chữa liên quan (nếu có) */
    private String idKeHoach;

    /** Số phiếu sự cố (có thể nhập tay hoặc tự sinh) */
    private String soPhieu;

    /** Đơn vị / phòng ban báo cáo sự cố */
    private String idDonViBaoCao;

    /** Ngày phát hiện sự cố (dạng chuỗi yyyy-MM-dd) */
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

    /** Nhân viên lập phiếu đã xác nhận? */
    private Boolean nguoiLapXacNhan;

    // ---------- Giám đốc ----------

    /** ID nhân viên giám đốc duyệt */
    private String idGiamDoc;

    /** Giám đốc đã xác nhận? */
    private Boolean giamDocXacNhan;

    // ---------- Workflow ----------

    /** Chia sẻ phiếu để người ký có thể thấy */
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
    private String nguoiCapNhat;

    // ---------- Null-safe getters ----------

    public Integer getTrangThai()       { return trangThai != null ? trangThai : 0; }
    public Integer getMucDo()           { return mucDo != null ? mucDo : 1; }
    public Boolean getNguoiLapXacNhan() { return nguoiLapXacNhan != null ? nguoiLapXacNhan : false; }
    public Boolean getGiamDocXacNhan()  { return giamDocXacNhan != null ? giamDocXacNhan : false; }
    public Boolean getShare()           { return share != null ? share : false; }
}
