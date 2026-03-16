package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class LichSuSuaChua {
    private String id;                 // Id varchar(50) PK
    private String idTaiSan;            // IdTaiSan varchar(50)
    private String ngayBatDau;          // NgayBatDau varchar(50)
    private String ngayKetThuc;         // NgayKetThuc varchar(50)
    private String idKetQuaSuaChua;     // IdKetQuaSuaChua varchar(50)
    private String ngayTao;              // NgayTao varchar(50)
    private String ngayCapNhat;          // NgayCapNhat varchar(50)
}