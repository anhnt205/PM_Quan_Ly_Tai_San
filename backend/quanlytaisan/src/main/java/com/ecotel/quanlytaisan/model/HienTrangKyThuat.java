package com.ecotel.quanlytaisan.model;

import org.apache.poi.ss.usermodel.Row;

import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellStringValue;

public class HienTrangKyThuat {
    private Integer id;
    private String tenHTKT;
    private String moTa;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public static HienTrangKyThuat mapToHienTrangKyThuat(String[] row) {
        HienTrangKyThuat htkt = new HienTrangKyThuat();
        htkt.setId(row[0] != null && !row[0].isEmpty() ? Integer.parseInt(row[0]) : null);
        htkt.setTenHTKT(row.length > 1 ? row[1] : null);
        htkt.setMoTa(row.length > 2 ? row[2] : null);
        htkt.setNgayTao(row.length > 3 ? row[3] : null);
        htkt.setNgayCapNhat(row.length > 4 ? row[4] : null);
        htkt.setNguoiTao(row.length > 5 ? row[5] : null);
        htkt.setNguoiCapNhat(row.length > 6 ? row[6] : null);
        htkt.setIsActive(row.length > 7 ? "1".equals(row[7]) || "true".equalsIgnoreCase(row[7]) : true);
        return htkt;
    }

    public static HienTrangKyThuat mapToHienTrangKyThuat(Row row) {
        HienTrangKyThuat htkt = new HienTrangKyThuat();
        String idStr = getCellStringValue(row.getCell(0));
        htkt.setId(idStr != null && !idStr.isEmpty() ? Integer.parseInt(idStr) : null);
        htkt.setTenHTKT(getCellStringValue(row.getCell(1)));
        htkt.setMoTa(getCellStringValue(row.getCell(2)));
        htkt.setNgayTao(getCellStringValue(row.getCell(3)));
        htkt.setNgayCapNhat(getCellStringValue(row.getCell(4)));
        htkt.setNguoiTao(getCellStringValue(row.getCell(5)));
        htkt.setNguoiCapNhat(getCellStringValue(row.getCell(6)));
        String isActiveStr = getCellStringValue(row.getCell(7));
        htkt.setIsActive(isActiveStr == null || isActiveStr.isEmpty() || "1".equals(isActiveStr) || "true".equalsIgnoreCase(isActiveStr));
        return htkt;
    }

    // Getter & Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTenHTKT() {
        return tenHTKT;
    }

    public void setTenHTKT(String tenHTKT) {
        this.tenHTKT = tenHTKT;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(String ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getNgayCapNhat() {
        return ngayCapNhat;
    }

    public void setNgayCapNhat(String ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    public String getNguoiTao() {
        return nguoiTao;
    }

    public void setNguoiTao(String nguoiTao) {
        this.nguoiTao = nguoiTao;
    }

    public String getNguoiCapNhat() {
        return nguoiCapNhat;
    }

    public void setNguoiCapNhat(String nguoiCapNhat) {
        this.nguoiCapNhat = nguoiCapNhat;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}