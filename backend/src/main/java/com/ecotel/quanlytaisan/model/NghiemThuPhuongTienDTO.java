package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class NghiemThuPhuongTienDTO {
    private String id;
    private String idCongTy;
    private String idBienPhapPhuongTien;
    private String idTaiSan;

    // Thông tin chính
    private String soPhieu;
    private String noiDung;
    private String tinhTrang;
    private String congViecPhatSinh;
    private BigDecimal chiPhiNhanCong;
    private String ketLuan;

    // Người lập phiếu
    private String idNguoiLap;
    private Boolean nguoiLapXacNhan;

    // Giám đốc duyệt
    private String idGiamDoc;
    private Boolean giamDocXacNhan;

    // Workflow & trạng thái
    private Boolean share;
    private Integer trangThai;

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    private Integer daCoDanhGiaVatTu; // 1 nếu đã có, 0 nếu chưa

    // Join fields
    private String tenNguoiLap;
    private String tenGiamDoc;
    private String soPhieuBienPhapPhuongTien; // Số phiếu biện pháp PT liên quan
    private String tenTaiSan;

    // Relations
    private List<NghiemThuPhuongTienChiTiet> danhSachChiTiet;
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;

    public Boolean getNguoiLapXacNhan() {
        return nguoiLapXacNhan != null ? nguoiLapXacNhan : false;
    }

    public Boolean getGiamDocXacNhan() {
        return giamDocXacNhan != null ? giamDocXacNhan : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }
}
