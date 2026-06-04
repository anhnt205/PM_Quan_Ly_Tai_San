package com.ecotel.quanlytaisan.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@Table(name = "nhomtaisan")
@Access(AccessType.FIELD)
@NoArgsConstructor
@AllArgsConstructor
public class NhomTaiSan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "TenNhom")
    private String tenNhom;

    @Column(name = "HieuLuc")
    private Boolean hieuLuc;

    @Column(name = "IdCongTy")
    private String idCongTy;

    @Column(name = "NgayTao")
    private String ngayTao;

    @Column(name = "NgayCapNhat")
    private String ngayCapNhat;

    @Column(name = "NguoiTao")
    private String nguoiTao;

    @Column(name = "NguoiCapNhat")
    private String nguoiCapNhat;

    @Column(name = "IsActive")
    private Boolean isActive;

    @Column(name = "SoLuongTaiSan")
    private Integer soLuongTaiSan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdLyLich")
    private LyLich lyLich;

    public static NhomTaiSan mapToNhomTaiSan(String[] row) {
        NhomTaiSan nts = new NhomTaiSan();
        nts.setId(row[0]);
        nts.setTenNhom(row[1]);
        nts.setHieuLuc(row[2] != null ? Boolean.parseBoolean(row[2]) : false);
        nts.setIdCongTy(row[3]);
        nts.setNgayTao(row[4] != null && !row[4].isEmpty() ? String.valueOf(row[4]) : null);
        nts.setNgayCapNhat(row[5] != null && !row[5].isEmpty() ? String.valueOf(row[5]) : null);
        nts.setNguoiTao(row[6]);
        nts.setNguoiCapNhat(row[7]);
        nts.setIsActive(row[8] != null ? Boolean.parseBoolean(row[8]) : false);
        return nts;
    }
    public static NhomTaiSan mapToNhomTaiSan(Row row) {
        NhomTaiSan nts = new NhomTaiSan();
        nts.setId(getCellStringValue(row.getCell(0)));
        nts.setTenNhom(getCellStringValue(row.getCell(1)));
        nts.setHieuLuc(row.getCell(2) != null && row.getCell(2).getBooleanCellValue());
        nts.setIdCongTy(getCellStringValue(row.getCell(3)));
        nts.setNgayTao(row.getCell(4) != null ? String.valueOf(row.getCell(4).getLocalDateTimeCellValue()) : null);
        nts.setNgayCapNhat(row.getCell(5) != null ? String.valueOf(row.getCell(5).getLocalDateTimeCellValue()) : null);
        nts.setNguoiTao(getCellStringValue(row.getCell(6)));
        nts.setNguoiCapNhat(getCellStringValue(row.getCell(7)));
        nts.setIsActive(row.getCell(8) != null && row.getCell(8).getBooleanCellValue());
        return nts;
    }

    // helper chung
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

}
