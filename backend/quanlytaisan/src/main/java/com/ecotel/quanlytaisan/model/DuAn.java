package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;



import static com.ecotel.quanlytaisan.utils.ParserHelper.*;
@Data
public class DuAn {
    private String id;
    private String tenDuAn;
    private String ghiChu;
    private Boolean hieuLuc;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public static DuAn mapToDuAn(String[] row) {
        DuAn da = new DuAn();
        da.setId(row[0]);
        da.setTenDuAn(row[1]);
        da.setGhiChu(row[2]);
        da.setHieuLuc(row[3] != null && row[3].equalsIgnoreCase("true"));
        da.setIdCongTy(row[4]);
        da.setNgayTao(row[5] != null && !row[5].isEmpty() ? String.valueOf(row[5]) : null);
        da.setNgayCapNhat(row[6] != null && !row[6].isEmpty() ? String.valueOf(row[6]) : null);
        da.setNguoiTao(row[7]);
        da.setNguoiCapNhat(row[8]);
        da.setIsActive(row[9] != null && row[9].equalsIgnoreCase("true"));
        return da;
    }

    public static DuAn mapToDuAn(Row row) {
        DuAn da = new DuAn();
        da.setId(getCellStringValue(row.getCell(0)));
        da.setTenDuAn(getCellStringValue(row.getCell(1)));
        da.setGhiChu(getCellStringValue(row.getCell(2)));
        da.setHieuLuc(getCellBooleanValue(row.getCell(3)));
        da.setIdCongTy(getCellStringValue(row.getCell(4)));
        da.setNgayTao(String.valueOf(parseDate(String.valueOf(row.getCell(5)))));
        da.setNgayCapNhat(String.valueOf(parseDate(String.valueOf(row.getCell(6)))));
        da.setNguoiTao(getCellStringValue(row.getCell(7)));
        da.setNguoiCapNhat(getCellStringValue(row.getCell(8)));
        da.setIsActive(getCellBooleanValue(row.getCell(9)));
        return da;
    }

}
