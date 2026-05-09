package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class KiemTraSuCoDTO {
    private String id;
    private String idCongTy;
    private String idSuCo;
    private String soPhieu;
    private String ngayKiemTra;
    private String viTri;
    private String nhanXetKetLuan;
    private String bienPhapXuLy;
    private Integer trangThai;
    private Boolean share;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    
    // Signing fields
    private String idNguoiLap;
    private String tenNguoiLap;
    private Boolean nguoiLapXacNhan;
    private String idGiamDoc;
    private String tenGiamDoc;
    private Boolean giamDocXacNhan;
    
    // Enrich from SuCoThietBi
    private String soPhieuSuCo;

    public Boolean getNguoiLapXacNhan() {
        return nguoiLapXacNhan != null ? nguoiLapXacNhan : false;
    }

    public Boolean getGiamDocXacNhan() {
        return giamDocXacNhan != null ? giamDocXacNhan : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }
    
    private List<KiemTraSuCoChiTiet> danhSachChiTiet;
    private List<NguoiKy> nguoiKyList;
    private Integer daCoGiamDinh;
}
