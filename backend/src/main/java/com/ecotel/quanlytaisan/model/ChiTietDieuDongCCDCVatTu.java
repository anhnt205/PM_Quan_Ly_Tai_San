package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import java.time.LocalDateTime;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;
@Data
public class ChiTietDieuDongCCDCVatTu {
    private String id;
    private String idDieuDongCCDCVatTu;
    private String idCCDCVatTu;
    private Double soLuong;
    private Double soLuongXuat;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private String idChiTietCCDCVatTu;
    private Boolean isActive;
    private Double soLuongDaBanGiao;
    private Double soLuongConLai;
    private String hienTrang;
    private String moTa;
    public static ChiTietDieuDongCCDCVatTu mapToChiTietDieuDongCCDCVatTu(String[] row) {
        ChiTietDieuDongCCDCVatTu ct = new ChiTietDieuDongCCDCVatTu();
        ct.setId(row[0]);
        ct.setIdDieuDongCCDCVatTu(row[1]);
        ct.setIdCCDCVatTu(row[2]);
        ct.setSoLuong(row[3] != null && !row[3].isEmpty() ? Double.parseDouble(row[3]) : 0);
        ct.setSoLuongXuat(row[4] != null && !row[4].isEmpty() ? Double.parseDouble(row[4]) : 0);
        ct.setGhiChu(row[5]);
        ct.setNgayTao(row[6] != null && !row[6].isEmpty() ? row[6] : null);
        ct.setNgayCapNhat(row[7] != null && !row[7].isEmpty() ? row[7] : null);
        ct.setNguoiTao(row[8]);
        ct.setNguoiCapNhat(row[9]);

        ct.setSoLuongDaBanGiao(Double.parseDouble(row[11]));
        return ct;
    }
    public static ChiTietDieuDongCCDCVatTu mapToChiTietDieuDongCCDCVatTu(Row row) {
        ChiTietDieuDongCCDCVatTu ct = new ChiTietDieuDongCCDCVatTu();
        ct.setId(getCellStringValue(row.getCell(0)));
        ct.setIdDieuDongCCDCVatTu(getCellStringValue(row.getCell(1)));
        ct.setIdCCDCVatTu(getCellStringValue(row.getCell(2)));
        ct.setSoLuong(parseDouble(String.valueOf(row.getCell(3))));
        ct.setSoLuongXuat(parseDouble(String.valueOf(row.getCell(4))));
        ct.setGhiChu(getCellStringValue(row.getCell(5)));
        LocalDateTime ngayTao = getCellDate(row.getCell(6));
        LocalDateTime ngayCapNhat = getCellDate(row.getCell(7));
        ct.setNgayTao(ngayTao != null ? String.valueOf(ngayTao) : null);
        ct.setNgayCapNhat(ngayCapNhat != null ? String.valueOf(ngayCapNhat) : null);
        ct.setNguoiTao(getCellStringValue(row.getCell(8)));
        ct.setNguoiCapNhat(getCellStringValue(row.getCell(9)));

        ct.setSoLuongDaBanGiao(parseDouble(String.valueOf(row.getCell(11))));
        return ct;
    }
}
