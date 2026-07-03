package com.ecotel.quanlytaisan.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NhanVien {
    private String id;
    private String hoTen;
    private String diDong;
    private String emailCongViec;
    private Boolean kyNhay, kyThuong, kySo;
    private String chuKyNhay, chuKyThuong;
    private String agreementUUId;
    private String pin;
    private String boPhan;
    private String chucVu;
    private String nguoiQuanLy;
    private Boolean laQuanLy;
    private String avatar;
    private String idCongTy;
    private String diaChiLamViec;
    private String hinhThucLamViec;
    private String gioLamViec;
    private String muiGio;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private String ngayTao;
    private String ngayCapNhat;
    private Boolean savePin;

    public static NhanVien mapToNhanVien(String[] row) {
        NhanVien nv = new NhanVien();
        nv.setId(row[0]);
        nv.setHoTen(row[1]);
        nv.setDiDong(row[2]);
        nv.setEmailCongViec(row[3]);
        nv.setKyNhay(row[4] != null ? Boolean.parseBoolean(row[4]) : null);
        nv.setChuKyNhay(row[5]);
        nv.setKyThuong(row[6] != null ? Boolean.parseBoolean(row[6]) : null);
        nv.setChuKyThuong(row[7]);
        nv.setKySo(row[8] != null ? Boolean.parseBoolean(row[8]) : null);
        nv.setAgreementUUId(row[9]);
        nv.setPin(row[10]);
        nv.setSavePin(row[11] != null ? Boolean.parseBoolean(row[11]) : null);
        nv.setBoPhan(row[12]);
        nv.setChucVu(row[13]);
        nv.setNgayTao(row[14] != null && !row[14].isEmpty() ? String.valueOf(row[14]) : null);
        nv.setNgayCapNhat(row[15] != null && !row[15].isEmpty() ? String.valueOf(row[15]) : null);
        // nv.setNguoiQuanLy(row[16]);
        // nv.setLaQuanLy(row[17] != null ? Boolean.parseBoolean(row[17]) : null);
        // nv.setAvatar(row[18]);
        // nv.setIdCongTy(row[19]);
        // nv.setDiaChiLamViec(row[20]);
        // nv.setHinhThucLamViec(row[21]);
        // nv.setGioLamViec(row[22]);
        // nv.setMuiGio(row[23]);
        // nv.setNguoiTao(row[24]);
        // nv.setNguoiCapNhat(row[25]);
        return nv;
    }

    public static NhanVien mapToNhanVien(Row row) {
        NhanVien nv = new NhanVien();
        nv.setId(getCellStringValue(row.getCell(0)));
        nv.setHoTen(getCellStringValue(row.getCell(1)));
        nv.setDiDong(getCellStringValue(row.getCell(2)));
        nv.setEmailCongViec(getCellStringValue(row.getCell(3)));
        nv.setKyNhay(getCellBooleanValue(row.getCell(4)));
        nv.setChuKyNhay(getCellStringValue(row.getCell(5)));
        nv.setKyThuong(getCellBooleanValue(row.getCell(6)));
        nv.setChuKyThuong(getCellStringValue(row.getCell(7)));
        nv.setKySo(getCellBooleanValue(row.getCell(8)));
        nv.setAgreementUUId(getCellStringValue(row.getCell(9)));
        nv.setPin(getCellStringValue(row.getCell(10)));
        nv.setSavePin(getCellBooleanValue(row.getCell(11)));
        nv.setBoPhan(getCellStringValue(row.getCell(12)));
        nv.setChucVu(getCellStringValue(row.getCell(13)));
        nv.setNgayTao(getCellStringValue(row.getCell(14)));     // Cột O
        nv.setNgayCapNhat(getCellStringValue(row.getCell(15)));
        // nv.setNguoiQuanLy(getCellStringValue(row.getCell(16)));
        // nv.setLaQuanLy(getCellBooleanValue(row.getCell(17)));
        // nv.setAvatar(getCellStringValue(row.getCell(18)));
        // nv.setIdCongTy(getCellStringValue(row.getCell(19)));
        // nv.setDiaChiLamViec(getCellStringValue(row.getCell(20)));
        // nv.setHinhThucLamViec(getCellStringValue(row.getCell(21)));
        // nv.setGioLamViec(getCellStringValue(row.getCell(22)));
        // nv.setMuiGio(getCellStringValue(row.getCell(23)));
        // nv.setNguoiTao(getCellStringValue(row.getCell(24)));
        // nv.setNguoiCapNhat(getCellStringValue(row.getCell(25)));
        return nv;
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

    public static Boolean getCellBooleanValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case STRING:
                return Boolean.parseBoolean(cell.getStringCellValue());
            case NUMERIC:
                return cell.getNumericCellValue() != 0;
            default:
                return null;
        }
    }
}