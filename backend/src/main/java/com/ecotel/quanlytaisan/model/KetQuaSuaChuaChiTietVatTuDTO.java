package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Data
@Getter
@Setter
public class KetQuaSuaChuaChiTietVatTuDTO {

    private String id;
    private String idKetQuaSuaChua;
    private String idSuaChuaChiTietTaiSan;
    private String idCcdc;
    private String idChiTietCcdc;
    private Integer soLuong;
    private BigDecimal donGia;
    private BigDecimal thanhTien;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String idNhomCcdc;

    // Có thể thêm field hiển thị tên CCDC, nhóm CCDC nếu cần
}