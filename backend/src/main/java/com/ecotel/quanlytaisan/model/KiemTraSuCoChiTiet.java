package com.ecotel.quanlytaisan.model;

import lombok.Data;

/**
 * Chi tiết biên bản kiểm tra sự cố.
 */
@Data
public class KiemTraSuCoChiTiet {
    private String id;
    private String idKiemTraSuCo;
    private String idTaiSan;
    private String idSuCoChiTiet;
    private String capBaoDuong;
    private String tinhTrang;
    private Boolean suaChua;
    private Boolean thayMoi;
    private String ghiChu;
    private Integer soLuong;
    
    // Enrich data
    private String tenTaiSan;
    private String maTaiSan;
    private String donViTinh;

    public Boolean getSuaChua() {
        return suaChua != null ? suaChua : false;
    }

    public Boolean getThayMoi() {
        return thayMoi != null ? thayMoi : false;
    }
}
