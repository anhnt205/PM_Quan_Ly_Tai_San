package com.ecotel.quanlytaisan.model;

import lombok.Data;
import org.apache.poi.ss.usermodel.Row;

import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class BanGiaoTaiSan {
    private String id;
    private String idCongTy;
    private String banGiaoTaiSan;
    private String quyetDinhDieuDongSo;
    private String lenhDieuDong;
    private String idDonViGiao;
    private String idDonViNhan;
    private String ngayBanGiao;
    private String idLanhDao;
    private String idDaiDiendonviBanHanhQD;
    private Boolean daXacNhan;
    private String idDaiDienBenGiao;
    private Boolean daiDienBenGiaoXacNhan;
    private String idDaiDienBenNhan;
    private Boolean daiDienBenNhanXacNhan;

    private Integer trangThai;
    private String note;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private Boolean share;
    private String duongDanFile;
    private String tenFile;
    private Boolean byStep;
    private String ngayTaoChungTu;
    private String idGiamDoc;
    private Boolean giamDocKy;
    private String soQuyetDinh;
    private String ngayQuyetDinh;
    private String diaDiemQuyetDinh;
    private String taiLieuBangKe;



    // Custom getters for null safety
    public Boolean getDaXacNhan() {
        return daXacNhan != null ? daXacNhan : false;
    }

    public Boolean getDaiDienBenGiaoXacNhan() {
        return daiDienBenGiaoXacNhan != null ? daiDienBenGiaoXacNhan : false;
    }

    public Boolean getDaiDienBenNhanXacNhan() {
        return daiDienBenNhanXacNhan != null ? daiDienBenNhanXacNhan : false;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }

    public Boolean getGiamDocKy() {
        return giamDocKy != null ? giamDocKy : false;
    }

    public static BanGiaoTaiSan mapToBanGiaoTaiSan(String[] row) {
        BanGiaoTaiSan bg = new BanGiaoTaiSan();
        bg.setId(row[0]);
        bg.setIdCongTy(row[1]);
        bg.setBanGiaoTaiSan(row[2]);
        bg.setQuyetDinhDieuDongSo(row[3]);
        bg.setLenhDieuDong(row[4]);
        bg.setIdDonViGiao(row[5]);
        bg.setIdDonViNhan(row[6]);
        bg.setNgayBanGiao(row[7] != null && !row[7].isEmpty() ? String.valueOf(row[7]) : null);
        bg.setIdLanhDao(row[8]);
        bg.setIdDaiDiendonviBanHanhQD(row[9]);
        bg.setDaXacNhan(row[10] != null && row[10].equalsIgnoreCase("true"));
        bg.setIdDaiDienBenGiao(row[11]);
        bg.setDaiDienBenGiaoXacNhan(row[12] != null && row[12].equalsIgnoreCase("true"));
        bg.setIdDaiDienBenNhan(row[13]);
        bg.setDaiDienBenNhanXacNhan(row[14] != null && row[14].equalsIgnoreCase("true"));
        bg.setTrangThai(row[15] != null && !row[15].isEmpty() ? Integer.parseInt(row[15]) : 0);
        bg.setNote(row[16]);
        bg.setNgayTao(row[17] != null && !row[17].isEmpty() ? String.valueOf(row[17]) : null);
        bg.setNgayCapNhat(row[18] != null && !row[18].isEmpty() ? String.valueOf(row[18]) : null);
        bg.setNguoiTao(row[19]);
        bg.setNguoiCapNhat(row[20]);

        bg.setShare(row[22] != null && row[22].equalsIgnoreCase("true"));
        bg.setDuongDanFile(row[23]);
        bg.setTenFile(row[24]);
        bg.setNgayTaoChungTu(row.length > 25 ? row[25] : null);
        bg.setIdGiamDoc(row[26]);
        bg.setGiamDocKy(Boolean.valueOf(row[27]));
        bg.setSoQuyetDinh(row.length > 28 ? row[28] : null);
        bg.setNgayQuyetDinh(row.length > 29 ? row[29] : null);
        bg.setDiaDiemQuyetDinh(row.length > 30 ? row[30] : null);
        return bg;
    }
    public static BanGiaoTaiSan mapToBanGiaoTaiSan(Row row) {
        BanGiaoTaiSan bg = new BanGiaoTaiSan();
        bg.setId(getCellStringValue(row.getCell(0)));
        bg.setIdCongTy(getCellStringValue(row.getCell(1)));
        bg.setBanGiaoTaiSan(getCellStringValue(row.getCell(2)));
        bg.setQuyetDinhDieuDongSo(getCellStringValue(row.getCell(3)));
        bg.setLenhDieuDong(getCellStringValue(row.getCell(4)));
        bg.setIdDonViGiao(getCellStringValue(row.getCell(5)));
        bg.setIdDonViNhan(getCellStringValue(row.getCell(6)));
        bg.setNgayBanGiao(formatToISO(row.getCell(7).getLocalDateTimeCellValue()));
        bg.setIdLanhDao(getCellStringValue(row.getCell(8)));
        bg.setIdDaiDiendonviBanHanhQD(getCellStringValue(row.getCell(9)));
        bg.setDaXacNhan(getCellBooleanValue(row.getCell(10)));
        bg.setIdDaiDienBenGiao(getCellStringValue(row.getCell(11)));
        bg.setDaiDienBenGiaoXacNhan(getCellBooleanValue(row.getCell(12)));
        bg.setIdDaiDienBenNhan(getCellStringValue(row.getCell(13)));
        bg.setDaiDienBenNhanXacNhan(getCellBooleanValue(row.getCell(14)));
        bg.setTrangThai(parseInt(String.valueOf(row.getCell(15))));
        bg.setNote(getCellStringValue(row.getCell(16)));
        bg.setNgayTao(formatToISO(row.getCell(17).getLocalDateTimeCellValue()));
        bg.setNgayCapNhat(formatToISO(row.getCell(18).getLocalDateTimeCellValue()));
        bg.setNguoiTao(getCellStringValue(row.getCell(19)));
        bg.setNguoiCapNhat(getCellStringValue(row.getCell(20)));

        bg.setShare(getCellBooleanValue(row.getCell(22)));
        bg.setDuongDanFile(getCellStringValue(row.getCell(23)));
        bg.setTenFile(getCellStringValue(row.getCell(24)));
        bg.setNgayTaoChungTu(getCellStringValue(row.getCell(25)));
        bg.setIdGiamDoc(getCellStringValue(row.getCell(26)));
        bg.setGiamDocKy(getCellBooleanValue(row.getCell(27)));
        bg.setSoQuyetDinh(getCellStringValue(row.getCell(28)));
        bg.setNgayQuyetDinh(getCellStringValue(row.getCell(29)));
        bg.setDiaDiemQuyetDinh(getCellStringValue(row.getCell(30)));
        return bg;
    }

}
