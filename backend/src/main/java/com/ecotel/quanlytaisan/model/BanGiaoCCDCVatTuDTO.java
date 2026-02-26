package com.ecotel.quanlytaisan.model;

import lombok.Data;

import java.util.List;

@Data
public class BanGiaoCCDCVatTuDTO {
    private String id;
    private String banGiaoCCDCVatTu;
    private String quyetDinhDieuDongSo;
    private String lenhDieuDong;

    private String idDonViGiao;
    private String tenDonViGiao;

    private String idDonViNhan;
    private String tenDonViNhan;

    private String ngayBanGiao;

    private String idLanhDao;
    private String tenLanhDao;

    private String idDaiDiendonviBanHanhQD;
    private String tenDaiDienBanHanhQD;

    private Boolean daXacNhan;

    private String idDaiDienBenGiao;
    private String tenDaiDienBenGiao;
    private Boolean daiDienBenGiaoXacNhan;

    private String idDaiDienBenNhan;
    private String tenDaiDienBenNhan;
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
    private Integer trangThaiPhieu;
    private java.util.List<KyTaiLieu> chuKyList;
    private List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTu;
    private List<NguoiKy> nguoiKyList;
    private String idGiamDoc;
    private Boolean giamDocKy;
    private String tenGiamDoc;

    private String soQuyetDinh;
    private String ngayQuyetDinh;
    private String diaDiemQuyetDinh; // Custom getters for null safety
    private String taiLieuBangKe;



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

    public Integer getTrangThaiPhieu() {
        return trangThaiPhieu != null ? trangThaiPhieu : 0;
    }

    public Boolean getGiamDocKy() {
        return giamDocKy != null ? giamDocKy : false;
    }
}
