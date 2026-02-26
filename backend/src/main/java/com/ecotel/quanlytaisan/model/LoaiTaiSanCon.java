package com.ecotel.quanlytaisan.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoaiTaiSanCon {
    private String id;
    private String idLoaiTs;
    private String tenLoai;
    private String tenLoaiTs;

    public LoaiTaiSanCon() {
    }

    public LoaiTaiSanCon(String id, String idLoaiTs, String tenLoai) {
        this.id = id;
        this.idLoaiTs = idLoaiTs;
        this.tenLoai = tenLoai;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdLoaiTs() {
        return idLoaiTs;
    }

    public void setIdLoaiTs(String idLoaiTs) {
        this.idLoaiTs = idLoaiTs;
    }

    public String getTenLoai() {
        return tenLoai;
    }

    public void setTenLoai(String tenLoai) {
        this.tenLoai = tenLoai;
    }
}
