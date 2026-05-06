package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class GiamDinhDTO {
    private String id;
    private String idCongTy;
    private String idSuaChua;
    private String soPhieu;
    private String ngayGiamDinh;
    private String viTri;
    private Integer soDeLaiPhucHoi;
    private Integer soDeLamPheLieu;
    private Integer soLuongHuy;
    
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

    // Join fields
    private String tenNguoiLap;
    private String tenGiamDoc;
    private String soPhieuSuaChua;

    // Danh sách chi tiết
    private List<GiamDinhChiTiet> danhSachChiTiet;
    
    // Workflow tracking
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
