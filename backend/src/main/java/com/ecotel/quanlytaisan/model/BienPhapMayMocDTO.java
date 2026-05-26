package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class BienPhapMayMocDTO {
    private String id;
    private String idCongTy;
    private String idGiamDinhMayMoc;    // FK -> giamdinh_maymoc.Id

    // Thông tin chính
    private String soPhieu;
    private String soDeNghi;
    private String donViSuaChua;
    private String donViPhoiHop;
    private String hinhThuc;
    private String thoiGianBatDau;
    private String thoiGianKetThuc;
    private Integer thoiGianNgay;
    private String ghiChu;

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
    private String soPhieuGiamDinhMayMoc; // Số phiếu giám định máy móc liên quan

    // Relations
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy>   nguoiKyList;

    public Boolean getNguoiLapXacNhan() { return nguoiLapXacNhan != null ? nguoiLapXacNhan : false; }
    public Boolean getGiamDocXacNhan()  { return giamDocXacNhan  != null ? giamDocXacNhan  : false; }
    public Boolean getShare()           { return share            != null ? share            : false; }
}
