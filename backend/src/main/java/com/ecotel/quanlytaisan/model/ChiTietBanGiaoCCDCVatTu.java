package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import java.time.LocalDateTime;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class ChiTietBanGiaoCCDCVatTu {
    private String id;
    private String idBanGiaoCCDCVatTu;
    private String idCCDCVatTu;
    private String soChungTu;
    private Double soLuong;
    private String idChiTietCCDCVatTu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String idChiTietDieuDong;
    private String hienTrang;
    private String moTa;
    private String ghiChu;

    public static ChiTietBanGiaoCCDCVatTu mapToChiTietBanGiaoCCDCVatTu(String[] row) {
        ChiTietBanGiaoCCDCVatTu ct = new ChiTietBanGiaoCCDCVatTu();
        ct.setId(row[0]);
        ct.setIdBanGiaoCCDCVatTu(row[1]);
        ct.setIdCCDCVatTu(row[2]);
        ct.setSoLuong(row[3] != null && !row[3].isEmpty() ? Double.parseDouble(row[3]) : 0);
        ct.setNgayTao(row[4] != null && !row[4].isEmpty() ? row[4] : null);
        ct.setNgayCapNhat(row[5] != null && !row[5].isEmpty() ? row[5] : null);
        ct.setNguoiTao(row[6]);
        ct.setNguoiCapNhat(row[7]);

        ct.setIdChiTietDieuDong(row[9]);
        return ct;
    }

    public static ChiTietBanGiaoCCDCVatTu mapToChiTietBanGiaoCCDCVatTu(Row row) {
        ChiTietBanGiaoCCDCVatTu ct = new ChiTietBanGiaoCCDCVatTu();
        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setIdBanGiaoCCDCVatTu(getCellStringValue(row.getCell(1)));
        ct.setIdCCDCVatTu(getCellStringValue(row.getCell(2)));
        ct.setSoLuong(parseDouble(String.valueOf(row.getCell(3))));
        LocalDateTime ngayTao = getCellDate(row.getCell(4));
        LocalDateTime ngayCapNhat = getCellDate(row.getCell(5));
        ct.setNgayTao(ngayTao != null ? String.valueOf(ngayTao) : null);
        ct.setNgayCapNhat(ngayCapNhat != null ? String.valueOf(ngayCapNhat) : null);
        ct.setNguoiTao(getCellStringValue(row.getCell(6)));
        ct.setNguoiCapNhat(getCellStringValue(row.getCell(7)));

        ct.setIdChiTietDieuDong(getCellStringValue(row.getCell(9)));
        return ct;
    }
}
