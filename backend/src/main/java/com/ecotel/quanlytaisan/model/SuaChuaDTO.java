package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class SuaChuaDTO {
    private String id;
    private String idCongTy;
    private String soPhieu;
    private String idKeHoach;
    private Integer thang;
    private Integer nam;
    private String ghiChu;
    
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
    private String tenKeHoach;

    // Danh sách chi tiết
    private List<SuaChuaChiTiet> danhSachTaiSan;
    
    // Workflow tracking
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;

    //
    private Integer daCoGiamDinh;

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