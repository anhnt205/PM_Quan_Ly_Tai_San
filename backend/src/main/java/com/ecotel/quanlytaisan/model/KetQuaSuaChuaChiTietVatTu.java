package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Getter
@Setter
public class KetQuaSuaChuaChiTietVatTu {

    private String id;                          // Id varchar(50) PK
    private String idKetQuaSuaChua;              // IdKetQuaSuaChua varchar(50)
    private String idSuaChuaChiTietTaiSan;       // IdSuaChuaChiTietTaiSan varchar(50)
    private String idCcdc;                        // IdCCDC varchar(50)
    private String idChiTietCcdc;                 // IdChiTietCCDC varchar(50)
    private Integer soLuong;                       // SoLuong int
    private BigDecimal donGia;                      // DonGia float
    private BigDecimal thanhTien;                   // ThanhTien float
    private String ghiChu;                          // GhiChu text
    private String ngayTao;                          // NgayTao varchar(50)
    private String ngayCapNhat;                      // NgayCapNhat varchar(50)
    private String nguoiTao;                          // NguoiTao varchar(50)
    private String nguoiCapNhat;                      // NguoiCapNhat varchar(50)
    private Boolean isActive;                         // IsActive tinyint(1)
    private String idNhomCcdc;                        // IdNhomCCDC varchar(50)

    // Default values
    public Boolean getIsActive() {
        return isActive != null ? isActive : true;
    }

    public BigDecimal getDonGia() {
        return donGia != null ? donGia : BigDecimal.ZERO;
    }

    public BigDecimal getThanhTien() {
        return thanhTien != null ? thanhTien : BigDecimal.ZERO;
    }
}