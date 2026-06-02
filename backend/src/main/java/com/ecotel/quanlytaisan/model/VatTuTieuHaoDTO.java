package com.ecotel.quanlytaisan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VatTuTieuHaoDTO {
    private String ma;
    private String ten;
    private String donViTinh;
    private Double soLuong;
}
