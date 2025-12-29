package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
@Data
public class PhongBan {
    private String id;
    private String idNhomDonvi;
    private String tenPhongBan;
    private String idQuanLy;
    private String idCongTy;
    private String phongCapTren;
    private String mauSac;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private Boolean isKho;
    private Boolean isLanhDao;
    private Integer loaiKho;

    public static PhongBan mapToPhongBan(String[] row) {
        PhongBan pb = new PhongBan();
        pb.setId(row[0]);
        pb.setIdNhomDonvi(row[1]);
        pb.setTenPhongBan(row[2]);
        pb.setIdQuanLy(row[3]);
        pb.setIdCongTy(row[4]);
        pb.setPhongCapTren(row[5]);
        pb.setMauSac(row[6]);
        pb.setNgayTao(row[7] != null && !row[7].isEmpty() ? String.valueOf(row[7]) : null);
        pb.setNgayCapNhat(row[8] != null && !row[8].isEmpty() ? String.valueOf(row[8]) : null);
        pb.setNguoiTao(row[9]);
        pb.setNguoiCapNhat(row[10]);
        pb.setIsActive(row[11] != null ? Boolean.parseBoolean(row[11]) : null);
        if (row.length > 12) {
            pb.setIsKho(row[12] != null ? Boolean.parseBoolean(row[12]) : null);
        }
        if (row.length > 13) {
            pb.setIsLanhDao(row[13] != null ? Boolean.parseBoolean(row[13]) : null);
        }
        return pb;
    }
    public static PhongBan mapToPhongBan(Row row) {
        PhongBan pb = new PhongBan();
        pb.setId(getCellStringValue(row.getCell(0)));
        pb.setIdNhomDonvi(getCellStringValue(row.getCell(1)));
        pb.setTenPhongBan(getCellStringValue(row.getCell(2)));
        pb.setIdQuanLy(getCellStringValue(row.getCell(3)));
        pb.setIdCongTy(getCellStringValue(row.getCell(4)));
        pb.setPhongCapTren(getCellStringValue(row.getCell(5)));
        pb.setMauSac(getCellStringValue(row.getCell(6)));
        pb.setNgayTao(row.getCell(7) != null ? String.valueOf(row.getCell(7).getLocalDateTimeCellValue()) : null);
        pb.setNgayCapNhat(row.getCell(8) != null ? String.valueOf(row.getCell(8).getLocalDateTimeCellValue()) : null);
        pb.setNguoiTao(getCellStringValue(row.getCell(9)));
        pb.setNguoiCapNhat(getCellStringValue(row.getCell(10)));
        pb.setIsActive(row.getCell(11) != null ? row.getCell(11).getBooleanCellValue() : null);
        pb.setIsKho(row.getCell(12) != null ? row.getCell(12).getBooleanCellValue() : null);
        pb.setIsLanhDao(row.getCell(13) != null ? row.getCell(13).getBooleanCellValue() : null);
        return pb;
    }

    // helper chung cho tất cả mapper
    public static String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return null;
        }
    }




    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getIdNhomDonvi() { return idNhomDonvi; }
    public void setIdNhomDonvi(String idNhomDonvi) { this.idNhomDonvi = idNhomDonvi; }
    public String getTenPhongBan() { return tenPhongBan; }
    public void setTenPhongBan(String tenPhongBan) { this.tenPhongBan = tenPhongBan; }
    public String getIdQuanLy() { return idQuanLy; }
    public void setIdQuanLy(String idQuanLy) { this.idQuanLy = idQuanLy; }
    public String getIdCongTy() { return idCongTy; }
    public void setIdCongTy(String idCongTy) { this.idCongTy = idCongTy; }
    public String getPhongCapTren() { return phongCapTren; }
    public void setPhongCapTren(String phongCapTren) { this.phongCapTren = phongCapTren; }
    public String getMauSac() { return mauSac; }
    public void setMauSac(String mauSac) { this.mauSac = mauSac; }
    public String getNgayTao() { return ngayTao; }
    public void setNgayTao(String ngayTao) { this.ngayTao = ngayTao; }
    public String getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(String ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
    public String getNguoiTao() { return nguoiTao; }
    public void setNguoiTao(String nguoiTao) { this.nguoiTao = nguoiTao; }
    public String getNguoiCapNhat() { return nguoiCapNhat; }
    public void setNguoiCapNhat(String nguoiCapNhat) { this.nguoiCapNhat = nguoiCapNhat; }
    public Boolean getIsActive() { return isActive; }
    public Boolean getIsKho() { return isKho; }
    public void setIsKho(Boolean isKho) { this.isKho = isKho; }
    public Boolean getIsLanhDao() { return isLanhDao; }
    public void setIsLanhDao(Boolean isLanhDao) { this.isLanhDao = isLanhDao; }
    public Integer getLoaiKho() { return loaiKho; }
    public void setLoaiKho(Integer loaiKho) { this.loaiKho = loaiKho; }


    @Override
    public String toString() {
        return "PhongBan{" +
                "id='" + id + '\'' +
                ", idNhomDonvi='" + idNhomDonvi + '\'' +
                ", tenPhongBan='" + tenPhongBan + '\'' +
                ", idQuanLy='" + idQuanLy + '\'' +
                ", idCongTy='" + idCongTy + '\'' +
                ", phongCapTren='" + phongCapTren + '\'' +
                ", mauSac='" + mauSac + '\'' +
                ", ngayTao=" + ngayTao +
                ", ngayCapNhat=" + ngayCapNhat +
                ", nguoiTao='" + nguoiTao + '\'' +
                ", nguoiCapNhat='" + nguoiCapNhat + '\'' +
                ", isActive=" + isActive +
                ", isKho=" + isKho +
                ", isLanhDao=" + isLanhDao +
                ", loaiKho=" + loaiKho +
                '}';
    }
}