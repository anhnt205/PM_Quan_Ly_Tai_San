package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import java.time.LocalDateTime;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;
@Data
public class ChiTietBanGiaoTaiSan {
    private String id;
    private String idBanGiaoTaiSan;
    private String idTaiSan;
    private Double soLuong;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String hienTrang;
    private String moTa;
    private String ghiChu;
    public static ChiTietBanGiaoTaiSan mapToChiTietBanGiaoTaiSan(String[] row) {
        ChiTietBanGiaoTaiSan ct = new ChiTietBanGiaoTaiSan();
        ct.setId(row[0]);
        ct.setIdBanGiaoTaiSan(row[1]);
        ct.setIdTaiSan(row[2]);
        ct.setSoLuong(row[3] != null && !row[3].isEmpty() ? Double.parseDouble(row[3]) : 0);
        ct.setNgayTao(row[4] != null && !row[4].isEmpty() ? row[4] : null);
        ct.setNgayCapNhat(row[5] != null && !row[5].isEmpty() ? row[5] : null);
        ct.setNguoiTao(row[6]);
        ct.setNguoiCapNhat(row[7]);
        ct.setIsActive(row[8] != null && row[8].equalsIgnoreCase("true"));
        return ct;
    }
    public static ChiTietBanGiaoTaiSan mapToChiTietBanGiaoTaiSan(Row row) {
        ChiTietBanGiaoTaiSan ct = new ChiTietBanGiaoTaiSan();
        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setIdBanGiaoTaiSan(getCellStringValue(row.getCell(1)));
        ct.setIdTaiSan(getCellStringValue(row.getCell(2)));
        ct.setSoLuong(parseDouble(String.valueOf(row.getCell(3))));
        LocalDateTime ngayTao = getCellDate(row.getCell(4));
        LocalDateTime ngayCapNhat = getCellDate(row.getCell(5));
        ct.setNgayTao(ngayTao != null ? String.valueOf(ngayTao) : null);
        ct.setNgayCapNhat(ngayCapNhat != null ? String.valueOf(ngayCapNhat) : null);
        ct.setNguoiTao(getCellStringValue(row.getCell(6)));
        ct.setNguoiCapNhat(getCellStringValue(row.getCell(7)));
        ct.setIsActive(getCellBooleanValue(row.getCell(8)));
        return ct;
    }

}
