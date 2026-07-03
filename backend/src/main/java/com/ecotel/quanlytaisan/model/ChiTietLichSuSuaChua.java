package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Data
@Getter
@Setter
public class ChiTietLichSuSuaChua {
    private String id;                     // Id varchar(50) PK
    private String idLichSuSuaChua;         // IdLichSuSuaChua varchar(50)
    private String idCCDC;                  // IdCCDC varchar(50)
    private String idChiTietCCDC;            // IdChiTietCCDC varchar(50)
    private BigDecimal donGia;               // DonGia decimal(18,2)
    private Integer soLuong;                 // SoLuong int
}