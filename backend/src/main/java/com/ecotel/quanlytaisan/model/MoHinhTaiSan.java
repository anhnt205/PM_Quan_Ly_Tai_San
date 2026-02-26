package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.DateUtil;

@Data
public class MoHinhTaiSan {
    private String id;
    private String tenMoHinh;
    private Integer phuongPhapKhauHao;
    private Integer kyKhauHao;
    private String loaiKyKhauHao;
    private String taiKhoanTaiSan;
    private String taiKhoanKhauHao;
    private String taiKhoanChiPhi;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    public static MoHinhTaiSan mapToMoHinhTaiSan(String[] row) {
        MoHinhTaiSan mh = new MoHinhTaiSan();
        mh.setId(row[0]);
        mh.setTenMoHinh(row[1]);
        mh.setPhuongPhapKhauHao(row[2] != null && !row[2].isEmpty() ? Integer.parseInt(row[2]) : 0);
        mh.setKyKhauHao(row[3] != null && !row[3].isEmpty() ? Integer.parseInt(row[3]) : 0);
        mh.setLoaiKyKhauHao(row[4]);
        mh.setTaiKhoanTaiSan(row[5]);
        mh.setTaiKhoanKhauHao(row[6]);
        mh.setTaiKhoanChiPhi(row[7]);
        mh.setIdCongTy(row[8]);
        mh.setNgayTao(row[9] != null && !row[9].isEmpty() ? String.valueOf(row[9]) : null);
        mh.setNgayCapNhat(row[10] != null && !row[10].isEmpty() ? String.valueOf(row[10]) : null);
        mh.setNguoiTao(row[11]);
        mh.setNguoiCapNhat(row[12]);
        mh.setIsActive(row[13] != null && Boolean.parseBoolean(row[13]));
        return mh;
    }

    public static MoHinhTaiSan mapToMoHinhTaiSan(Row row) {
        MoHinhTaiSan mh = new MoHinhTaiSan();
        mh.setId(getCellStringValue(row.getCell(0)));
        mh.setTenMoHinh(getCellStringValue(row.getCell(1)));
        mh.setPhuongPhapKhauHao(row.getCell(2) != null ? (int) row.getCell(2).getNumericCellValue() : 0);
        mh.setKyKhauHao(row.getCell(3) != null ? (int) row.getCell(3).getNumericCellValue() : 0);
        mh.setLoaiKyKhauHao(getCellStringValue(row.getCell(4)));
        mh.setTaiKhoanTaiSan(getCellStringValue(row.getCell(5)));
        mh.setTaiKhoanKhauHao(getCellStringValue(row.getCell(6)));
        mh.setTaiKhoanChiPhi(getCellStringValue(row.getCell(7)));
        mh.setIdCongTy(getCellStringValue(row.getCell(8)));
        mh.setNgayTao(row.getCell(9) != null ? String.valueOf(row.getCell(9).getLocalDateTimeCellValue()) : null);
        mh.setNgayCapNhat(row.getCell(10) != null ? String.valueOf(row.getCell(10).getLocalDateTimeCellValue()) : null);
        mh.setNguoiTao(getCellStringValue(row.getCell(11)));
        mh.setNguoiCapNhat(getCellStringValue(row.getCell(12)));
        mh.setIsActive(getCellBooleanValue(row.getCell(13)));
        return mh;
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
