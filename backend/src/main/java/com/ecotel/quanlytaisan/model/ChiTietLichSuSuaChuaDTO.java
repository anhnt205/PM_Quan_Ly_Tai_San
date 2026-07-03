package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Data
@Getter
@Setter
public class ChiTietLichSuSuaChuaDTO {
    private String id;
    private String idLichSuSuaChua;
    private String idCCDC;
    private String maCCDC;              // JOIN CCDC
    private String tenCCDC;              // JOIN CCDC
    private String idChiTietCCDC;
    private String tenChiTietCCDC;       // JOIN ChiTietTaiSan (nếu cần)
    private BigDecimal donGia;
    private Integer soLuong;
    private BigDecimal thanhTien;        // tính = donGia * soLuong
}