package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.Date;

@Data
public class SuaChua {
    private String id;
    private String idCongTy;
    private String soPhieu;
    private String idKeHoach;
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
    private Date ngayTao;
    private Date ngayCapNhat;
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
}