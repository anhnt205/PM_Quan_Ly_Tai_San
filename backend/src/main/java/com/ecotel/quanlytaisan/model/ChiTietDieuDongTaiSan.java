package com.ecotel.quanlytaisan.model;

import org.apache.poi.ss.usermodel.Row;

import java.time.LocalDateTime;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;
import lombok.Data;

@Data
public class ChiTietDieuDongTaiSan {
    private String id;
    private String idDieuDongTaiSan;
    private String idTaiSan;
    private Double soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String hienTrang;
    private String moTa;
    private Boolean daBanGiao;

    public static ChiTietDieuDongTaiSan mapToChiTietDieuDongTaiSan(String[] row) {
        ChiTietDieuDongTaiSan ct = new ChiTietDieuDongTaiSan();
        ct.setId(row[0]);
        ct.setIdDieuDongTaiSan(row[1]);
        ct.setIdTaiSan(row[2]);
        ct.setSoLuong(row[3] != null && !row[3].isEmpty() ? Double.parseDouble(row[3]) : 0);
        ct.setGhiChu(row[4]);
        ct.setNgayTao(row[5] != null && !row[5].isEmpty() ? row[5] : null);
        ct.setNgayCapNhat(row[6] != null && !row[6].isEmpty() ? row[6] : null);
        ct.setNguoiTao(row[7]);
        ct.setNguoiCapNhat(row[8]);
        ct.setIsActive(row[9] != null && row[9].equalsIgnoreCase("true"));
        return ct;
    }

    public static ChiTietDieuDongTaiSan mapToChiTietDieuDongTaiSan(Row row) {
        ChiTietDieuDongTaiSan ct = new ChiTietDieuDongTaiSan();
        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setIdDieuDongTaiSan(getCellStringValue(row.getCell(1)));
        ct.setIdTaiSan(getCellStringValue(row.getCell(2)));
        ct.setSoLuong(parseDouble(String.valueOf(row.getCell(3))));
        ct.setGhiChu(getCellStringValue(row.getCell(4)));
        LocalDateTime ngayTao = getCellDate(row.getCell(5));
        LocalDateTime ngayCapNhat = getCellDate(row.getCell(6));
        ct.setNgayTao(ngayTao != null ? String.valueOf(ngayTao) : null);
        ct.setNgayCapNhat(ngayCapNhat != null ? String.valueOf(ngayCapNhat) : null);
        ct.setNguoiTao(getCellStringValue(row.getCell(7)));
        ct.setNguoiCapNhat(getCellStringValue(row.getCell(8)));
        ct.setIsActive(getCellBooleanValue(row.getCell(9)));
        return ct;
    }


}
