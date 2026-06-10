package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class GiamDinhMayMoc {
    private String id;
    private String idCongTy;
    private String idBienBan;
    private String loaiBienBan; // sua_chua, su_co
    private String soPhieu;
    private String ngayGiamDinh;
    private String viTri;
    private Integer soDeLaiPhucHoi;
    private Integer soDeLamPheLieu;
    private Integer soLuongHuy;
    private String ghiChuBienBan;
    
    // Người lập phiếu
    private String idNguoiLap;
    private Boolean nguoiLapXacNhan;
    
    // Giám đốc duyệt
    private String idGiamDoc;
    private Boolean giamDocXacNhan;
    
    // Workflow & trạng thái
    private Boolean share;
    private Integer trangThai; // 0:nháp, 1:duyệt, 2:hủy, 3:hoàn thành
    
    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    public Boolean getNguoiLapXacNhan() {
        return nguoiLapXacNhan != null ? nguoiLapXacNhan : false;
    }

    public Boolean getGiamDocXacNhan() {
        return giamDocXacNhan != null ? giamDocXacNhan : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    private List<GiamDinhMayMocChiTiet> danhSachChiTiet;
    private List<NguoiKy> nguoiKyList;
}
