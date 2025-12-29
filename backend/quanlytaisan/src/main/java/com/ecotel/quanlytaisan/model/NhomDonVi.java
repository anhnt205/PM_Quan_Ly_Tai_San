package com.ecotel.quanlytaisan.model;



import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
@Data
public class NhomDonVi {
    private String id;
    private String tenNhom;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private String idCongTy;
    private Boolean isActive;

    public static NhomDonVi mapToNhomDonVi(String[] row) {
        NhomDonVi ndv = new NhomDonVi();
        ndv.setId(row[0]);
        ndv.setTenNhom(row[1]);
        ndv.setNgayTao(row[2] != null && !row[2].isEmpty() ? String.valueOf(row[2]) : null);
        ndv.setNgayCapNhat(row[3] != null && !row[3].isEmpty() ? String.valueOf(row[3]) : null);
        ndv.setNguoiTao(row[4]);
        ndv.setNguoiCapNhat(row[5]);
        ndv.setIdCongTy(row[6]);
        ndv.setIsActive(row[7] != null ? Boolean.parseBoolean(row[7]) : false);
        return ndv;
    }

    public static NhomDonVi mapToNhomDonVi(Row row) {
        NhomDonVi ndv = new NhomDonVi();
        ndv.setId(getCellStringValue(row.getCell(0)));
        ndv.setTenNhom(getCellStringValue(row.getCell(1)));
        ndv.setNgayTao(row.getCell(2) != null ? String.valueOf(row.getCell(2).getLocalDateTimeCellValue()) : null);
        ndv.setNgayCapNhat(row.getCell(3) != null ? String.valueOf(row.getCell(3).getLocalDateTimeCellValue()) : null);
        ndv.setNguoiTao(getCellStringValue(row.getCell(4)));
        ndv.setNguoiCapNhat(getCellStringValue(row.getCell(5)));
        ndv.setIdCongTy(getCellStringValue(row.getCell(6)));
        ndv.setIsActive(row.getCell(7) != null && row.getCell(7).getBooleanCellValue());
        return ndv;
    }

    // helper tái sử dụng
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

    public NhomDonVi() {
    }

    public NhomDonVi(String id, String tenNhom, String ngayTao, String ngayCapNhat, String nguoiTao, String nguoiCapNhat, String idCongTy, boolean isActive) {
        this.id = id;
        this.tenNhom = tenNhom;
        this.ngayTao = ngayTao;
        this.ngayCapNhat = ngayCapNhat;
        this.nguoiTao = nguoiTao;
        this.nguoiCapNhat = nguoiCapNhat;
        this.idCongTy = idCongTy;
        this.isActive = isActive;
    }



    @Override
    public String toString() {
        return "NhomDonVi{" +
                "id='" + id + '\'' +
                ", tenNhom='" + tenNhom + '\'' +
                ", ngayTao=" + ngayTao +
                ", ngayCapNhat=" + ngayCapNhat +
                ", nguoiTao='" + nguoiTao + '\'' +
                ", nguoiCapNhat='" + nguoiCapNhat + '\'' +
                ", idCongTy='" + idCongTy + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
