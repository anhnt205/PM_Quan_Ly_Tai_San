package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class DanhGiaVatTu {
    private String id;
    private String idCongTy;
    private String congTy;
    private String tenMauBienBan;
    private String soPhieu;
    private String ngayDanhGia;
    private String viTri;
    private String capSuaChua;
    private String tenThietBi;
    private String kieu;
    private String soDangKi;
    private String idDonViQuanLy;
    private String tenDonViQuanLy;
    private String idNghiemThu;
    
    private Integer soLuongPhucHoi;
    private Integer soLuongPheLieu;
    private Integer soLuongHuy;
    private String ghiChuBienBan;
    
    // Người lập phiếu
    private String idNguoiLap;
    private String tenNguoiLap;
    private Boolean nguoiLapXacNhan;
    
    // Giám đốc duyệt
    private String idGiamDoc;
    private String tenGiamDoc;
    private Boolean giamDocXacNhan;
    
    private Boolean share;
    private Integer trangThai; 
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    
    // Relations
    private List<ChiTietVatTuThuHoi> danhSachChiTiet;
    private List<NguoiKy> nguoiKyList;

    public Boolean getNguoiLapXacNhan() {
        return nguoiLapXacNhan != null ? nguoiLapXacNhan : false;
    }

    public Boolean getGiamDocXacNhan() {
        return giamDocXacNhan != null ? giamDocXacNhan : false;
    }
}
