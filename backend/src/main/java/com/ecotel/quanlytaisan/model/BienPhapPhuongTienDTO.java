package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class BienPhapPhuongTienDTO {
    private String id;
    private String idCongTy;
    private String soBienBan;
    private String idTaiSan;
    private String mucDich;
    private String tinhTrangHienTai;
    private String noiDungThucHien;
    private String tienDoTuNgay;
    private String tienDoDenNgay;
    private String bienPhapAnToan;
    private String idKiemTraSuCo;

    // Luồng ký
    private String  idNguoiLap;
    private Boolean nguoiLapXacNhan;
    private String  idGiamDoc;
    private Boolean giamDocXacNhan;
    private Boolean share;
    private Integer trangThai;

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    // Join fields
    private String tenNguoiLap;
    private String tenGiamDoc;
    private String tenTaiSan;
    private String soPhieuSuCo;

    // Nested
    private List<BienPhapPhuongTienChiTiet> danhSachChiTiet;
    private List<KyTaiLieu>  chuKyList;
    private List<NguoiKy>   nguoiKyList;

    public Boolean getNguoiLapXacNhan() { return nguoiLapXacNhan != null ? nguoiLapXacNhan : false; }
    public Boolean getGiamDocXacNhan()  { return giamDocXacNhan  != null ? giamDocXacNhan  : false; }
    public Boolean getShare()           { return share            != null ? share            : false; }
}
