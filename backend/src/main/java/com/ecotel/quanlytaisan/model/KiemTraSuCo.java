package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

/**
 * Biên bản kiểm tra sự cố thiết bị.
 * Được tạo từ SuCoThietBi.
 */
@Data
public class KiemTraSuCo {
    private String id;
    private String idCongTy;
    private String idSuCo;
    private String soPhieu;
    private String ngayKiemTra;
    private String viTri;
    private String nhanXetKetLuan;
    private String bienPhapXuLy;
    private String ghiChuBienBan;
    
    // Người lập
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

    private List<KiemTraSuCoChiTiet> danhSachChiTiet;
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
