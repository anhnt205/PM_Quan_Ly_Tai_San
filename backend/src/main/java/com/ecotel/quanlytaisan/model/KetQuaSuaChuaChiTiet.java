package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class KetQuaSuaChuaChiTiet {

    private String id;                          // Id varchar(50) PK
    private String idKetQuaSuaChua;              // IdKetQuaSuaChua varchar(50)
    private String idTaiSan;                      // IdTaiSan varchar(50)
    private Integer soLuong;                       // SoLuong int
    private String ghiChu;                          // GhiChu text
    private String ngayTao;                          // NgayTao varchar(50)
    private String ngayCapNhat;                      // NgayCapNhat varchar(50)
    private String nguoiTao;                          // NguoiTao varchar(50)
    private String nguoiCapNhat;                      // NguoiCapNhat varchar(50)
    private Boolean isActive;                         // IsActive tinyint(1)
    private Integer hienTrang;

    // Default values
    public Boolean getIsActive() {
        return isActive != null ? isActive : true;
    }
}