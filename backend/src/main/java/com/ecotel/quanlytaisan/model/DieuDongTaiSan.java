package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class DieuDongTaiSan {
    private String id;
    private String soQuyetDinh;
    private String tenPhieu;
    //    don vi giao
    private String idDonViGiao;

    //    don vi nhan
    private String idDonViNhan;

    //    nguoi de nghi/ nguoi ky nhay\
    private String idNguoiKyNhay;
    private Boolean trangThaiKyNhay;
    private Boolean nguoiLapPhieuKyNhay;

    //    don vi den nghi
    private String idDonViDeNghi;

    //    tggn
    private String tgGnTuNgay;
    private String tgGnDenNgay;
//    trinh duyet cap phong

    private String idTrinhDuyetCapPhong;
    private Boolean trinhDuyetCapPhongXacNhan;

    // trinh duyet giam doc

    private String idTrinhDuyetGiamDoc;
    private Boolean trinhDuyetGiamDocXacNhan;

    private String diaDiemGiaoNhan;
    private String idPhongBanXemPhieu;
    private String noiNhan;
    private Integer trangThai;
    private String idCongTy;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Integer coHieuLuc;
    private Integer loai;
    private Boolean share;
    private String trichYeu;
    private String duongDanFile;
    private String tenFile;
    private String ngayKy;
    private Boolean daBanGiao;
    private Boolean byStep;
    private Boolean coPhieuBanGiao;
    private String taiLieuCuoi;

    // Custom getters for null safety
    public Boolean getTrangThaiKyNhay() {
        return trangThaiKyNhay != null ? trangThaiKyNhay : false;
    }

    public Boolean getNguoiLapPhieuKyNhay() {
        return nguoiLapPhieuKyNhay != null ? nguoiLapPhieuKyNhay : false;
    }

    public Boolean getTrinhDuyetCapPhongXacNhan() {
        return trinhDuyetCapPhongXacNhan != null ? trinhDuyetCapPhongXacNhan : false;
    }

    public Boolean getTrinhDuyetGiamDocXacNhan() {
        return trinhDuyetGiamDocXacNhan != null ? trinhDuyetGiamDocXacNhan : false;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }

    public Integer getCoHieuLuc() {
        return coHieuLuc != null ? coHieuLuc : 0;
    }

    public Integer getLoai() {
        return loai != null ? loai : 0;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getDaBanGiao() {
        return daBanGiao != null ? daBanGiao : false;
    }

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }

    public static DieuDongTaiSan mapToDieuDongTaiSan(String[] row) {
        DieuDongTaiSan dd = new DieuDongTaiSan();
        dd.setId(row[0]);
        dd.setSoQuyetDinh(row[1]);
        dd.setTenPhieu(row[2]);
        dd.setIdDonViGiao(row[3]);
        dd.setIdDonViNhan(row[4]);
        dd.setIdNguoiKyNhay(row[5]);
        dd.setTrangThaiKyNhay(row[6] != null && row[6].equalsIgnoreCase("true"));
        dd.setNguoiLapPhieuKyNhay(row[7] != null && row[7].equalsIgnoreCase("true"));
        dd.setIdDonViDeNghi(row[8]);
        dd.setTgGnTuNgay(row[9]);
        dd.setTgGnDenNgay(row[10]);
        dd.setIdTrinhDuyetCapPhong(row[11]);
        dd.setTrinhDuyetCapPhongXacNhan(row[12] != null && row[12].equalsIgnoreCase("true"));
        dd.setIdTrinhDuyetGiamDoc(row[13]);
        dd.setTrinhDuyetGiamDocXacNhan(row[14] != null && row[14].equalsIgnoreCase("true"));
        dd.setDiaDiemGiaoNhan(row[15]);
        dd.setIdPhongBanXemPhieu(row[16]);
        dd.setNoiNhan(row[17]);
        dd.setTrangThai(row[18] != null && !row[18].isEmpty() ? Integer.parseInt(row[18]) : 0);
        dd.setIdCongTy(row[19]);
        dd.setNgayTao(row[20]);
        dd.setNgayCapNhat(row[21]);
        dd.setNguoiTao(row[22]);
        dd.setNguoiCapNhat(row[23]);
        dd.setCoHieuLuc(row[24] != null && !row[24].isEmpty() ? Integer.parseInt(row[24]) : 0);
        dd.setLoai(row[25] != null && !row[25].isEmpty() ? Integer.parseInt(row[25]) : 0);
        dd.setShare(row[26] != null && row[26].equalsIgnoreCase("true"));
        dd.setTrichYeu(row[27]);
        dd.setDuongDanFile(row[28]);
        dd.setTenFile(row[29]);
        dd.setNgayKy(row[30]);
        return dd;
    }
    public static DieuDongTaiSan mapToDieuDongTaiSan(Row row) {
        DieuDongTaiSan dd = new DieuDongTaiSan();
        dd.setId(getCellStringValue(row.getCell(0)));
        dd.setSoQuyetDinh(getCellStringValue(row.getCell(1)));
        dd.setTenPhieu(getCellStringValue(row.getCell(2)));
        dd.setIdDonViGiao(getCellStringValue(row.getCell(3)));
        dd.setIdDonViNhan(getCellStringValue(row.getCell(4)));
        dd.setIdNguoiKyNhay(getCellStringValue(row.getCell(5)));
        dd.setTrangThaiKyNhay(getCellBooleanValue(row.getCell(6)));
        dd.setNguoiLapPhieuKyNhay(getCellBooleanValue(row.getCell(7)));
        dd.setIdDonViDeNghi(getCellStringValue(row.getCell(8)));
        dd.setTgGnTuNgay(getCellStringValue(row.getCell(9)));
        dd.setTgGnDenNgay(getCellStringValue(row.getCell(10)));
        dd.setIdTrinhDuyetCapPhong(getCellStringValue(row.getCell(11)));
        dd.setTrinhDuyetCapPhongXacNhan(getCellBooleanValue(row.getCell(12)));
        dd.setIdTrinhDuyetGiamDoc(getCellStringValue(row.getCell(13)));
        dd.setTrinhDuyetGiamDocXacNhan(getCellBooleanValue(row.getCell(14)));
        dd.setDiaDiemGiaoNhan(getCellStringValue(row.getCell(15)));
        dd.setIdPhongBanXemPhieu(getCellStringValue(row.getCell(16)));
        dd.setNoiNhan(getCellStringValue(row.getCell(17)));
        dd.setTrangThai(parseInt(String.valueOf(row.getCell(18))));
        dd.setIdCongTy(getCellStringValue(row.getCell(19)));
        dd.setNgayTao(getCellStringValue(row.getCell(20)));
        dd.setNgayCapNhat(getCellStringValue(row.getCell(21)));
        dd.setNguoiTao(getCellStringValue(row.getCell(22)));
        dd.setNguoiCapNhat(getCellStringValue(row.getCell(23)));
        dd.setCoHieuLuc(parseInt(String.valueOf(row.getCell(24))));
        dd.setLoai(parseInt(String.valueOf(row.getCell(25))));
        dd.setShare(getCellBooleanValue(row.getCell(26)));
        dd.setTrichYeu(getCellStringValue(row.getCell(27)));
        dd.setDuongDanFile(getCellStringValue(row.getCell(28)));
        dd.setTenFile(getCellStringValue(row.getCell(29)));
        dd.setNgayKy(getCellStringValue(row.getCell(30)));
        return dd;
    }

}
