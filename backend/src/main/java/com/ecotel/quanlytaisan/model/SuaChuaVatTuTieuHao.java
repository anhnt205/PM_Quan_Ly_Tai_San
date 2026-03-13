package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class SuaChuaVatTuTieuHao {
    private String id;
    private String idKeHoachSuaChua;
    private String idCCDC;           // Khóa ngoại đến bảng ccdcvattu
    private String tenVatTu;          // Tên vật tư (có thể lấy từ CCDC hoặc nhập tay)
    private Integer soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Các trường hiển thị (join)
    private String tenCCDC;
    private String tenKeHoach;
}
