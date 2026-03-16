package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Data
@Getter
@Setter
public class KetQuaSuaChuaDTO {

    private String id;
    private String idCongTy;
    private String maSuaChua;
    private String tenSuaChua;
    private String mucDoSuCo;
    private String mucDoUuTien;

    private String idDonViGiao;
    private String tenDonViGiao;            // JOIN PhongBan

    private String idDonViNhan;
    private String tenDonViNhan;            // JOIN PhongBan

    private String idNguoiKyNhay;
    private String tenNguoiKyNhay;          // JOIN NhanVien

    private Boolean trangThaiKyNhay;
    private Boolean nguoiLapPhieuKyNhay;
    private String ngayKetThucDuKien;

    private String idTrinhDuyetCapPhong;
    private String tenTrinhDuyetCapPhong;   // JOIN NhanVien
    private Boolean trinhDuyetCapPhongXacNhan;

    private String idTrinhDuyetGiamDoc;
    private String tenTrinhDuyetGiamDoc;    // JOIN NhanVien
    private Boolean trinhDuyetGiamDocXacNhan;

    private String idDonViDeNghi;
    private String duongDanFile;
    private String tenFile;
    private String taiLieuBanGhi;
    private Boolean byStep;
    private String soQuyetDinh;
    private String nguoiTao;
    private Boolean share;
    private String ngayTao;
    private Boolean daBanGiao;
    private Boolean coPhieuBanGiao;
    private String taiLieuCuoi;
    private Integer loai;
    private Integer trangThai;
    private String idKeHoach;
    private String ngayCapNhat;
    private String idLoaiSuaChua;
    private String ghiChu;
    private String idSuaChua;
    private BigDecimal chiPhiPhanCong;
    private BigDecimal chiPhiThueNgoai;


    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;


    // Custom getters với default value
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

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getDaBanGiao() {
        return daBanGiao != null ? daBanGiao : false;
    }

    public Boolean getCoPhieuBanGiao() {
        return coPhieuBanGiao != null ? coPhieuBanGiao : false;
    }

    public Integer getLoai() {
        return loai != null ? loai : 0;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }

    public BigDecimal getChiPhiPhanCong() {
        return chiPhiPhanCong != null ? chiPhiPhanCong : BigDecimal.ZERO;
    }

    public BigDecimal getChiPhiThueNgoai() {
        return chiPhiThueNgoai != null ? chiPhiThueNgoai : BigDecimal.ZERO;
    }
}