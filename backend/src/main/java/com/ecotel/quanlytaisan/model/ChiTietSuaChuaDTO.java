package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class ChiTietSuaChuaDTO {
    private String id;
    private String idSuaChua;
    private String idTaiSan;
    private String tenTaiSan;
    private String kyHieu;
    private String soKyHieu;
    private String donViTinh;
    private String idCCDC;
    private String idChiTietCCDC;
    private Integer soLuong;
    private String hienTrang;
    private String moTa;
    private String ghiChu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public Integer getSoLuong() {
        return soLuong != null ? soLuong : 1;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : false;
    }
}