package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellStringValue;

@Data
public class KhauHao {
    private String id;
    private String tenKhauHao;
    private String congThuc;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    public static KhauHao mapToKhauHao(String[] row) {
        KhauHao kh = new KhauHao();
        kh.setId(row[0]);
        kh.setTenKhauHao(row[1]);
        kh.setCongThuc(row[2]);
        kh.setNgayTao(row[3]);
        kh.setNgayCapNhat(row[4]);
        kh.setNguoiTao(row[5]);
        kh.setNguoiCapNhat(row[6]);
        return kh;
    }
    public static KhauHao mapToKhauHao(Row row) {
        KhauHao kh = new KhauHao();
        kh.setId(getCellStringValue(row.getCell(0)));
        kh.setTenKhauHao(getCellStringValue(row.getCell(1)));
        kh.setCongThuc(getCellStringValue(row.getCell(2)));
        kh.setNgayTao(getCellStringValue(row.getCell(3)));
        kh.setNgayCapNhat(getCellStringValue(row.getCell(4)));
        kh.setNguoiTao(getCellStringValue(row.getCell(5)));
        kh.setNguoiCapNhat(getCellStringValue(row.getCell(6)));
        return kh;
    }


}