package com.ecotel.quanlytaisan.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoaiCCDCCon {
    private String id;
    private String idLoaiCCDC;
    private String tenLoai;
    private String tenLoaiCCDC;

    public LoaiCCDCCon() {
    }

    public LoaiCCDCCon(String id, String idLoaiCCDC, String tenLoai) {
        this.id = id;
        this.idLoaiCCDC = idLoaiCCDC;
        this.tenLoai = tenLoai;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdLoaiCCDC() {
        return idLoaiCCDC;
    }

    public void setIdLoaiCCDC(String idLoaiCCDC) {
        this.idLoaiCCDC = idLoaiCCDC;
    }

    public String getTenLoai() {
        return tenLoai;
    }

    public void setTenLoai(String tenLoai) {
        this.tenLoai = tenLoai;
    }
}
