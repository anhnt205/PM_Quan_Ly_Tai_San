package com.ecotel.quanlytaisan.model;

import org.apache.poi.ss.usermodel.Row;

import java.util.Objects;

import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellStringValue;

public class DonViTinh {
    private String id;
    private String tenDonVi;
    private String note;
    private Boolean laHeThong;

    public static DonViTinh mapToDonViTinh(String[] row) {
        DonViTinh dvt = new DonViTinh();
        dvt.setId(row[0]);
        dvt.setTenDonVi(row[1]);
        dvt.setNote(row[2]);
        return dvt;
    }

    public static DonViTinh mapToDonViTinh(Row row) {
        DonViTinh dvt = new DonViTinh();
        dvt.setId(getCellStringValue(row.getCell(0)));
        dvt.setTenDonVi(getCellStringValue(row.getCell(1)));
        dvt.setNote(getCellStringValue(row.getCell(2)));
        return dvt;
    }

    // Getter & Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTenDonVi() {
        return tenDonVi;
    }

    public void setTenDonVi(String tenDonVi) {
        this.tenDonVi = tenDonVi;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Boolean getLaHeThong() {
        return laHeThong;
    }

    public void setLaHeThong(Boolean laHeThong) {
        this.laHeThong = laHeThong;
    }
}
