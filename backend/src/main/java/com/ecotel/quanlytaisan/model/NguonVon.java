package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;


@Data
public class NguonVon {
    private String id;
    private String tenNguonKinhPhi;
    private String ghiChu;
    private Boolean hieuLuc;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public static NguonVon mapToNguonVon(String[] row) {
        NguonVon nv = new NguonVon();
        System.out.println(row.toString());
        nv.setId(row[0]);
        nv.setTenNguonKinhPhi(row[1]);
        nv.setGhiChu(row[2]);
        nv.setHieuLuc(row[3] != null && Boolean.parseBoolean(row[3]));
        nv.setIdCongTy(row[4]);
        nv.setNgayTao(row[5] != null && !row[5].isEmpty() ? String.valueOf(row[5]) : null);
        nv.setNgayCapNhat(row[6] != null && !row[6].isEmpty() ? String.valueOf(row[6]) : null);
        nv.setNguoiTao(row[7]);
        nv.setNguoiCapNhat(row[8]);
        nv.setIsActive(row[9] != null && Boolean.parseBoolean(row[9]));
        return nv;
    }

    public static NguonVon mapToNguonVon(Row row) {
        NguonVon nv = new NguonVon();
        nv.setId(getCellStringValue(row.getCell(0)));
        nv.setTenNguonKinhPhi(getCellStringValue(row.getCell(1)));
        nv.setGhiChu(getCellStringValue(row.getCell(2)));
        nv.setHieuLuc(getCellBooleanValue(row.getCell(3)));
        nv.setIdCongTy(getCellStringValue(row.getCell(4)));
        nv.setNgayTao(row.getCell(5) != null ? String.valueOf(row.getCell(5).getLocalDateTimeCellValue()) : null);
        nv.setNgayCapNhat(row.getCell(6) != null ? String.valueOf(row.getCell(6).getLocalDateTimeCellValue()) : null);
        nv.setNguoiTao(getCellStringValue(row.getCell(7)));
        nv.setNguoiCapNhat(getCellStringValue(row.getCell(8)));
        nv.setIsActive(getCellBooleanValue(row.getCell(9)));
        System.out.println(nv.toString());
        return nv;
    }

    @Override
    public String toString() {
        return "NguonVon{" +
                "id='" + id + '\'' +
                ", tenNguonKinhPhi='" + tenNguonKinhPhi + '\'' +
                ", ghiChu='" + ghiChu + '\'' +
                ", hieuLuc=" + hieuLuc +
                ", idCongTy='" + idCongTy + '\'' +
                ", ngayTao='" + ngayTao + '\'' +
                ", ngayCapNhat='" + ngayCapNhat + '\'' +
                ", nguoiTao='" + nguoiTao + '\'' +
                ", nguoiCapNhat='" + nguoiCapNhat + '\'' +
                ", isActive=" + isActive +
                '}';
    }

    public static String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }

    public static boolean getCellBooleanValue(Cell cell) {
        if (cell == null) return false;
        switch (cell.getCellType()) {
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case STRING:
                return Boolean.parseBoolean(cell.getStringCellValue());
            case NUMERIC:
                return cell.getNumericCellValue() != 0;
            default:
                return false;
        }
    }


}
