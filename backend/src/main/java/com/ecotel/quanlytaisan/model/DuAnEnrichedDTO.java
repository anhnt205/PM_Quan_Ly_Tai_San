package com.ecotel.quanlytaisan.model;

public class DuAnEnrichedDTO extends DuAn {
    private String tenCongTy;  // Tên công ty từ IdCongTy

    public String getTenCongTy() {
        return tenCongTy;
    }

    public void setTenCongTy(String tenCongTy) {
        this.tenCongTy = tenCongTy;
    }
}