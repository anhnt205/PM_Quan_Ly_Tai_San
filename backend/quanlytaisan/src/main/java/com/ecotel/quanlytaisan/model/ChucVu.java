package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;



import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellBooleanValue;
import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellStringValue;

@Data
public class ChucVu {
    private String id;
    private String tenChucVu;

    private Boolean quanLyNhanVien;
    private Boolean quanLyPhongBan;
    private Boolean quanLyDuAn;
    private Boolean quanLyNguonVon;
    private Boolean quanLyMoHinhTaiSan;
    private Boolean quanLyNhomTaiSan;
    private Boolean quanLyTaiSan;
    private Boolean quanLyCCDCVatTu;
    private Boolean dieuDongTaiSan;
    private Boolean dieuDongCCDCVatTu;
    private Boolean banGiaoTaiSan;
    private Boolean banGiaoCCDCVatTu;
    private Boolean baoCao;

    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    public static ChucVu mapToChucVu(String[] row) {
        ChucVu cv = new ChucVu();
        cv.setId(row[0]);
        cv.setTenChucVu(row[1]);
        cv.setQuanLyNhanVien(row[2] != null && row[2].equalsIgnoreCase("true"));
        cv.setQuanLyPhongBan(row[3] != null && row[3].equalsIgnoreCase("true"));
        cv.setQuanLyDuAn(row[4] != null && row[4].equalsIgnoreCase("true"));
        cv.setQuanLyNguonVon(row[5] != null && row[5].equalsIgnoreCase("true"));
        cv.setQuanLyMoHinhTaiSan(row[6] != null && row[6].equalsIgnoreCase("true"));
        cv.setQuanLyNhomTaiSan(row[7] != null && row[7].equalsIgnoreCase("true"));
        cv.setQuanLyTaiSan(row[8] != null && row[8].equalsIgnoreCase("true"));
        cv.setQuanLyCCDCVatTu(row[9] != null && row[9].equalsIgnoreCase("true"));
        cv.setDieuDongTaiSan(row[10] != null && row[10].equalsIgnoreCase("true"));
        cv.setDieuDongCCDCVatTu(row[11] != null && row[11].equalsIgnoreCase("true"));
        cv.setBanGiaoTaiSan(row[12] != null && row[12].equalsIgnoreCase("true"));
        cv.setBanGiaoCCDCVatTu(row[13] != null && row[13].equalsIgnoreCase("true"));
        cv.setBaoCao(row[14] != null && row[14].equalsIgnoreCase("true"));
        cv.setIdCongTy(row[15]);
        cv.setNgayTao(row[16]);
        cv.setNgayCapNhat(row[17]);
        cv.setNguoiTao(row[18]);
        cv.setNguoiCapNhat(row[19]);
        return cv;
    }
    public static ChucVu mapToChucVu(Row row) {
        ChucVu cv = new ChucVu();
        cv.setId(getCellStringValue(row.getCell(0)));
        cv.setTenChucVu(getCellStringValue(row.getCell(1)));
        cv.setQuanLyNhanVien(getCellBooleanValue(row.getCell(2)));
        cv.setQuanLyPhongBan(getCellBooleanValue(row.getCell(3)));
        cv.setQuanLyDuAn(getCellBooleanValue(row.getCell(4)));
        cv.setQuanLyNguonVon(getCellBooleanValue(row.getCell(5)));
        cv.setQuanLyMoHinhTaiSan(getCellBooleanValue(row.getCell(6)));
        cv.setQuanLyNhomTaiSan(getCellBooleanValue(row.getCell(7)));
        cv.setQuanLyTaiSan(getCellBooleanValue(row.getCell(8)));
        cv.setQuanLyCCDCVatTu(getCellBooleanValue(row.getCell(9)));
        cv.setDieuDongTaiSan(getCellBooleanValue(row.getCell(10)));
        cv.setDieuDongCCDCVatTu(getCellBooleanValue(row.getCell(11)));
        cv.setBanGiaoTaiSan(getCellBooleanValue(row.getCell(12)));
        cv.setBanGiaoCCDCVatTu(getCellBooleanValue(row.getCell(13)));
        cv.setBaoCao(getCellBooleanValue(row.getCell(14)));
        cv.setIdCongTy(getCellStringValue(row.getCell(15)));
        cv.setNgayTao(getCellStringValue(row.getCell(16)));
        cv.setNgayCapNhat(getCellStringValue(row.getCell(17)));
        cv.setNguoiTao(getCellStringValue(row.getCell(18)));
        cv.setNguoiCapNhat(getCellStringValue(row.getCell(19)));
        return cv;
    }



}
