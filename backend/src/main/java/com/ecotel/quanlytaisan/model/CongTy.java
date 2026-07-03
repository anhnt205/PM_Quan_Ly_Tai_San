package com.ecotel.quanlytaisan.model;

import org.apache.poi.ss.usermodel.Row;


import java.util.Objects;

import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellStringValue;
import static com.ecotel.quanlytaisan.utils.ParserHelper.parseDate;

public class CongTy {
    private String id;
    private String tenCongTy;
    private String tenVietTat;
    private String email;
    private String quocGiaTruSoChinh;
    private String tinhThanhTruSoChinh;
    private String xaPhuongTruSoChinh;
    private String diaChiKhacTruSoChinh;
    private String logoCongTy;
    private String maSoThue;
    private String website;
    private String soDienThoai;
    private String nguoiTao;
    private String nguoiCapNhat;
    private String ngayTao;
    private String ngayCapNhat;
    private Boolean isActive;

    public static CongTy mapToCongTy(String[] row) {
        CongTy ct = new CongTy();
        ct.setId(row[0]);
        ct.setTenCongTy(row[1]);
        ct.setTenVietTat(row[2]);
        ct.setEmail(row[3]);
        ct.setQuocGiaTruSoChinh(row[4]);
        ct.setTinhThanhTruSoChinh(row[5]);
        ct.setXaPhuongTruSoChinh(row[6]);
        ct.setDiaChiKhacTruSoChinh(row[7]);
        ct.setLogoCongTy(row[8]);
        ct.setMaSoThue(row[9]);
        ct.setWebsite(row[10]);
        ct.setSoDienThoai(row[11]);
        ct.setNguoiTao(row[12]);
        ct.setNguoiCapNhat(row[13]);
        ct.setNgayTao(row[14] != null && !row[14].isEmpty() ? String.valueOf(row[14]) : null);
        ct.setNgayCapNhat(row[15] != null && !row[15].isEmpty() ? String.valueOf(row[15]) : null);

        return ct;
    }
    public static CongTy mapToCongTy(Row row) {
        CongTy ct = new CongTy();
        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setTenCongTy(getCellStringValue(row.getCell(1)));
        ct.setTenVietTat(getCellStringValue(row.getCell(2)));
        ct.setEmail(getCellStringValue(row.getCell(3)));
        ct.setQuocGiaTruSoChinh(getCellStringValue(row.getCell(4)));
        ct.setTinhThanhTruSoChinh(getCellStringValue(row.getCell(5)));
        ct.setXaPhuongTruSoChinh(getCellStringValue(row.getCell(6)));
        ct.setDiaChiKhacTruSoChinh(getCellStringValue(row.getCell(7)));
        ct.setLogoCongTy(getCellStringValue(row.getCell(8)));
        ct.setMaSoThue(getCellStringValue(row.getCell(9)));
        ct.setWebsite(getCellStringValue(row.getCell(10)));
        ct.setSoDienThoai(getCellStringValue(row.getCell(11)));
        ct.setNguoiTao(getCellStringValue(row.getCell(12)));
        ct.setNguoiCapNhat(getCellStringValue(row.getCell(13)));
        ct.setNgayTao(String.valueOf(Objects.requireNonNull(parseDate(String.valueOf(row.getCell(14))))));
        ct.setNgayCapNhat(String.valueOf(Objects.requireNonNull(parseDate(String.valueOf(row.getCell(15))))));

        return ct;
    }

    // Getter & Setter
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenCongTy() { return tenCongTy; }
    public void setTenCongTy(String tenCongTy) { this.tenCongTy = tenCongTy; }
    public String getTenVietTat() { return tenVietTat; }
    public void setTenVietTat(String tenVietTat) { this.tenVietTat = tenVietTat; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getQuocGiaTruSoChinh() { return quocGiaTruSoChinh; }
    public void setQuocGiaTruSoChinh(String quocGiaTruSoChinh) { this.quocGiaTruSoChinh = quocGiaTruSoChinh; }
    public String getTinhThanhTruSoChinh() { return tinhThanhTruSoChinh; }
    public void setTinhThanhTruSoChinh(String tinhThanhTruSoChinh) { this.tinhThanhTruSoChinh = tinhThanhTruSoChinh; }
    public String getXaPhuongTruSoChinh() { return xaPhuongTruSoChinh; }
    public void setXaPhuongTruSoChinh(String xaPhuongTruSoChinh) { this.xaPhuongTruSoChinh = xaPhuongTruSoChinh; }
    public String getDiaChiKhacTruSoChinh() { return diaChiKhacTruSoChinh; }
    public void setDiaChiKhacTruSoChinh(String diaChiKhacTruSoChinh) { this.diaChiKhacTruSoChinh = diaChiKhacTruSoChinh; }
    public String getLogoCongTy() { return logoCongTy; }
    public void setLogoCongTy(String logoCongTy) { this.logoCongTy = logoCongTy; }
    public String getMaSoThue() { return maSoThue; }
    public void setMaSoThue(String maSoThue) { this.maSoThue = maSoThue; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getNguoiTao() { return nguoiTao; }
    public void setNguoiTao(String nguoiTao) { this.nguoiTao = nguoiTao; }
    public String getNguoiCapNhat() { return nguoiCapNhat; }
    public void setNguoiCapNhat(String nguoiCapNhat) { this.nguoiCapNhat = nguoiCapNhat; }
    public Boolean getIsActive() { return isActive; }


    public String getNgayTao() { return ngayTao; }
    public void setNgayTao(String ngayTao) { this.ngayTao = ngayTao; }

    public String getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(String ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
} 