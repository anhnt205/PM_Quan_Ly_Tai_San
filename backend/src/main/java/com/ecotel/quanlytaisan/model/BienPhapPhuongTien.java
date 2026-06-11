package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class BienPhapPhuongTien {
    private String id;
    private String idCongTy;
    private String soBienBan;
    private String idTaiSan;
    private String mucDich;
    private String yeuCau;
    private String tinhTrangHienTai;
    private String noiDungThucHien;
    private String tienDoTuNgay;
    private String tienDoDenNgay;
    private String bienPhapAnToan;
    private String idGiamDinhPhuongTien;
    private String donViQuanLy;
    private String ghiChuBienBan;

    // Luồng ký
    private String  idNguoiLap;
    private Boolean nguoiLapXacNhan;
    private String  idGiamDoc;
    private Boolean giamDocXacNhan;
    private Boolean share;
    private Integer trangThai; // 0:nháp 1:duyệt 2:hủy 3:hoàn thành

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    // Danh sách chi tiết (không map từ DB, dùng khi nhận payload)
    private List<BienPhapPhuongTienChiTiet> danhSachChiTiet;
    private List<NguoiKy> nguoiKyList;

    public Boolean getNguoiLapXacNhan() { return nguoiLapXacNhan != null ? nguoiLapXacNhan : false; }
    public Boolean getGiamDocXacNhan()  { return giamDocXacNhan  != null ? giamDocXacNhan  : false; }
    public Boolean getShare()           { return share            != null ? share            : false; }
}
