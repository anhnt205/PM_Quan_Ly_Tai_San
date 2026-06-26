package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class CCDCVatTu {
    private String id;
    private String idDonVi;
    private String ten;
    private String ngayNhap;
    private String donViTinh;
    private Integer soLuong;
    private String idNhomCCDC;
    private Double giaTri;
    private String soKyHieu;
    private String kyHieu;
    private String congSuat;
    private String nuocSanXuat;
    private Integer namSanXuat;
    private String ghiChu;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String idLoaiCCDCCon;
    private String hienTrang;
    private String donViTinh2;
    private Integer soLuong2;
    public static CCDCVatTu mapToCCDCVatTu(String[] row) {
        CCDCVatTu ccdc = new CCDCVatTu();
        ccdc.setId(row[0]);
        ccdc.setIdDonVi(row[1]);
        ccdc.setTen(row[2]);
        ccdc.setNgayNhap(row[3] != null && !row[3].isEmpty() ? String.valueOf(row[3]) : null);
        ccdc.setDonViTinh(row[4]);
        ccdc.setSoLuong(row[5] != null && !row[5].isEmpty() ? Integer.parseInt(row[5]) : null);
        ccdc.setIdNhomCCDC(row[6]);
        ccdc.setGiaTri(row[7] != null && !row[7].isEmpty() ? Double.parseDouble(row[7]) : null);
        ccdc.setSoKyHieu(row[8]);
        ccdc.setKyHieu(row[9]);
        ccdc.setCongSuat(row[10]);
        ccdc.setNuocSanXuat(row[11]);
        ccdc.setNamSanXuat(row[12] != null && !row[12].isEmpty() ? Integer.parseInt(row[12]) : null);
        ccdc.setGhiChu(row[13]);
        ccdc.setIdCongTy(row[14]);
        ccdc.setNgayTao(row[15] != null && !row[15].isEmpty() ? String.valueOf(row[15]) : null);
        ccdc.setNgayCapNhat(row[16] != null && !row[16].isEmpty() ? String.valueOf(row[16]) : null);
        ccdc.setNguoiTao(row[17]);
        ccdc.setNguoiCapNhat(row[18]);

        ccdc.setIdLoaiCCDCCon(row[20]);
        return ccdc;
    }
    public static CCDCVatTu mapToCCDCVatTu(Row row) {
        CCDCVatTu ccdc = new CCDCVatTu();
        ccdc.setId(getCellStringValue(row.getCell(0)));
        ccdc.setIdDonVi(getCellStringValue(row.getCell(1)));
        ccdc.setTen(getCellStringValue(row.getCell(2)));
        ccdc.setNgayNhap(formatToISO(row.getCell(3).getLocalDateTimeCellValue()));
        ccdc.setDonViTinh(getCellStringValue(row.getCell(4)));
        ccdc.setSoLuong(getCellInteger(row.getCell(5)));
        ccdc.setIdNhomCCDC(getCellStringValue(row.getCell(6)));
        ccdc.setGiaTri(row.getCell(7).getNumericCellValue());
        ccdc.setSoKyHieu(getCellStringValue(row.getCell(8)));
        ccdc.setKyHieu(getCellStringValue(row.getCell(9)));
        ccdc.setCongSuat(getCellStringValue(row.getCell(10)));
        ccdc.setNuocSanXuat(getCellStringValue(row.getCell(11)));
        ccdc.setNamSanXuat(getCellInteger(row.getCell(12)));
        ccdc.setGhiChu(getCellStringValue(row.getCell(13)));
        ccdc.setIdCongTy(getCellStringValue(row.getCell(14)));
        ccdc.setNgayTao(formatToISO(row.getCell(15).getLocalDateTimeCellValue()));
        ccdc.setNgayCapNhat(formatToISO(row.getCell(16).getLocalDateTimeCellValue()));
        ccdc.setNguoiTao(getCellStringValue(row.getCell(17)));
        ccdc.setNguoiCapNhat(getCellStringValue(row.getCell(18)));

        ccdc.setIdLoaiCCDCCon(getCellStringValue(row.getCell(20)));
        return ccdc;
    }


}
