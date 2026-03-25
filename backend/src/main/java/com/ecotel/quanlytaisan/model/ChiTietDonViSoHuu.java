package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import static com.ecotel.quanlytaisan.utils.ParserHelper.getCellStringValue;
import static com.ecotel.quanlytaisan.utils.ParserHelper.parseInteger;

@Data
public class ChiTietDonViSoHuu {
    private String id;
    private String idCCDCVT;
    private String idDonViSoHuu;
    private Integer soLuong;
    private String thoiGianBanGiao;
    private String ngayTao;
    private String nguoiTao;
    private String idTsCon;
    private String soKyHieu;
    public static ChiTietDonViSoHuu mapToChiTietDonViSoHuu(String[] row) {
        ChiTietDonViSoHuu dv = new ChiTietDonViSoHuu();
        dv.setId(row[0]);
        dv.setIdCCDCVT(row[1]);
        dv.setIdDonViSoHuu(row[2]);
        dv.setSoLuong(row[3] != null && !row[3].isEmpty() ? Integer.parseInt(row[3]) : 0);
        dv.setThoiGianBanGiao(row[4]);
        dv.setNgayTao(row[5]);
        dv.setNguoiTao(row[6]);
        dv.setIdTsCon(row[7]);
        return dv;
    }
    public static ChiTietDonViSoHuu mapToChiTietDonViSoHuu(Row row) {
        ChiTietDonViSoHuu dv = new ChiTietDonViSoHuu();
        dv.setId(getCellStringValue(row.getCell(0)));
        dv.setIdCCDCVT(getCellStringValue(row.getCell(1)));
        dv.setIdDonViSoHuu(getCellStringValue(row.getCell(2)));
        dv.setSoLuong(parseInteger(String.valueOf(row.getCell(3))));
        dv.setThoiGianBanGiao(getCellStringValue(row.getCell(4)));
        dv.setNgayTao(getCellStringValue(row.getCell(5)));
        dv.setNguoiTao(getCellStringValue(row.getCell(6)));
        dv.setIdTsCon(getCellStringValue(row.getCell(7)));
        return dv;
    }

}
