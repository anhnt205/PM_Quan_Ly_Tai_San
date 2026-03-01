package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class DieuDongTaiSanDTO {
    private String id;
    private String soQuyetDinh;
    private String tenPhieu;
    //don vi giao
    private String idDonViGiao;
    private String tenDonViGiao;
    //don vi nhan
    private String idDonViNhan;
    private String tenDonViNhan;

    //    nguoi de nghi/ nguoi ky nhay
    private String idNguoiKyNhay;
    private Boolean trangThaiKyNhay;
    private Boolean nguoiLapPhieuKyNhay;
    private String tenNguoiKyNhay;
    //    don vi de nghi
    private String idDonViDeNghi;
    private String tenDonViDeNghi;
    //    tggn
    private String tgGnTuNgay;
    private String tgGnDenNgay;
    //trinh duyet cap phong
    private String idTrinhDuyetCapPhong;
    private String tenTrinhDuyetCapPhong;
    private Boolean trinhDuyetCapPhongXacNhan;

    //    trinh duyet giam doc
    private String idTrinhDuyetGiamDoc;
    private Boolean trinhDuyetGiamDocXacNhan;
    private String tenTrinhDuyetGiamDoc;

    private String idPhongBanXemPhieu;
    private String tenPhongBanXemPhieu;


    private String diaDiemGiaoNhan;
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
    private Integer trangThaiPhieu;
    private String taiLieuCuoi;
    /**
     * Trạng thái phiếu điều động:
     * 1: Chưa tạo phiếu bàn giao từ phiếu điều động
     * 2: Có biên bản bàn giao nhưng chưa bàn giao hết tài sản
     * 3: Đã bàn giao hết tất cả
     * 4: Sắp quá hạn điều động
     * 5: Đã quá hạn điều động
     */
    private Integer trangThaiPhieuDieuDong;
    private List<KyTaiLieu> chuKyList;
    private List<ChiTietDieuDongTaiSanDTO>chiTietDieuDongTaiSanDTOS;
    private List<NguoiKy>nguoiKyList;

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

    public Integer getTrangThaiPhieu() {
        return trangThaiPhieu != null ? trangThaiPhieu : 0;
    }

}
