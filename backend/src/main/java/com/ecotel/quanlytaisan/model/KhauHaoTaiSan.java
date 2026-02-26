package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class KhauHaoTaiSan {
    private String soThe;
    private String tenTaiSan;
    private String nguonVon;
    private String maTk;
    private Date ngayTinhKhao;
    private Integer thangKh;
    private BigDecimal nguyenGia;
    private BigDecimal khauHaoBanDau;
    private BigDecimal khauHaoPsdk;
    private BigDecimal gtclBanDau;
    private BigDecimal khauHaoPsck;
    private BigDecimal gtclHienTai;
    private BigDecimal khauHaoBinhQuan;
    private BigDecimal soTien;
    private BigDecimal chenhLech;
    private BigDecimal khKyTruoc;
    private BigDecimal clKyTruoc;
    private Integer hsdCkh;
    private String tkNo;
    private String tkCo;
    private String dtgt;
    private String dtth;
    private String kmcp;
    private String ghiChuKhao;
    private String userId;
    private Date userTime;
    private Double nvNS;
    private Double vonVay;
    private Double vonKhac;

    public static KhauHaoTaiSan mapToKhauHaoTaiSan(String[] row) throws ParseException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        KhauHaoTaiSan kh = new KhauHaoTaiSan();

        kh.setSoThe(row[0]);
        kh.setTenTaiSan(row[1]);
        kh.setNguonVon(row[2]);
        kh.setMaTk(row[3]);
        kh.setNgayTinhKhao(row[4] != null && !row[4].isEmpty() ? Date.from(LocalDate.parse(row[4], formatter).atStartOfDay(ZoneId.systemDefault()).toInstant()) : null);
        kh.setThangKh(row[5] != null && !row[5].isEmpty() ? Integer.parseInt(row[5]) : null);
        kh.setNguyenGia(toBigDecimal(row[6]));
        kh.setKhauHaoBanDau(toBigDecimal(row[7]));
        kh.setKhauHaoPsdk(toBigDecimal(row[8]));
        kh.setGtclBanDau(toBigDecimal(row[9]));
        kh.setKhauHaoPsck(toBigDecimal(row[10]));
        kh.setGtclHienTai(toBigDecimal(row[11]));
        kh.setKhauHaoBinhQuan(toBigDecimal(row[12]));
        kh.setSoTien(toBigDecimal(row[13]));
        kh.setChenhLech(toBigDecimal(row[14]));
        kh.setKhKyTruoc(toBigDecimal(row[15]));
        kh.setClKyTruoc(toBigDecimal(row[16]));
        kh.setHsdCkh(row[17] != null && !row[17].isEmpty() ? Integer.parseInt(row[17]) : null);
        kh.setTkNo(row[18]);
        kh.setTkCo(row[19]);
        kh.setDtgt(row[20]);
        kh.setDtth(row[21]);
        kh.setKmcp(row[22]);
        kh.setGhiChuKhao(row[23]);
        kh.setUserId(row[24]);
        kh.setUserTime(row[25] != null && !row[25].isEmpty() ? Date.from(LocalDate.parse(row[25], formatter).atStartOfDay(ZoneId.systemDefault()).toInstant()) : null);

        return kh;
    }

    public static KhauHaoTaiSan mapToKhauHaoTaiSan(Row row) {
        KhauHaoTaiSan kh = new KhauHaoTaiSan();

        kh.setSoThe(getCellStringValue(row.getCell(0)));
        kh.setTenTaiSan(getCellStringValue(row.getCell(1)));
        kh.setNguonVon(getCellStringValue(row.getCell(2)));
        kh.setMaTk(getCellStringValue(row.getCell(3)));
        kh.setNgayTinhKhao(getCellDateValue(row.getCell(4)));
        kh.setThangKh(parseInteger(String.valueOf(row.getCell(5))));
        kh.setNguyenGia(toBigDecimal(String.valueOf(row.getCell(6))));
        kh.setKhauHaoBanDau(toBigDecimal(String.valueOf(row.getCell(7))));
        kh.setKhauHaoPsdk(toBigDecimal(String.valueOf(row.getCell(8))));
        kh.setGtclBanDau(toBigDecimal(String.valueOf(row.getCell(9))));
        kh.setKhauHaoPsck(toBigDecimal(String.valueOf(row.getCell(10))));
        kh.setGtclHienTai(toBigDecimal(String.valueOf(row.getCell(11))));
        kh.setKhauHaoBinhQuan(toBigDecimal(String.valueOf(row.getCell(12))));
        kh.setSoTien(toBigDecimal(String.valueOf(row.getCell(13))));
        kh.setChenhLech(toBigDecimal(String.valueOf(row.getCell(14))));
        kh.setKhKyTruoc(toBigDecimal(String.valueOf(row.getCell(15))));
        kh.setClKyTruoc(toBigDecimal(String.valueOf(row.getCell(16))));
        kh.setHsdCkh(parseInteger(String.valueOf(row.getCell(17))));
        kh.setTkNo(getCellStringValue(row.getCell(18)));
        kh.setTkCo(getCellStringValue(row.getCell(19)));
        kh.setDtgt(getCellStringValue(row.getCell(20)));
        kh.setDtth(getCellStringValue(row.getCell(21)));
        kh.setKmcp(getCellStringValue(row.getCell(22)));
        kh.setGhiChuKhao(getCellStringValue(row.getCell(23)));
        kh.setUserId(getCellStringValue(row.getCell(24)));
        kh.setUserTime(getCellDateValue(row.getCell(25)));

        return kh;
    }


}
