package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Data
@Getter
@Setter
public class KetQuaSuaChuaDTO {

    private String id;
    private String idCongTy;
    private String tenPhieu;
    private String idSuaChua;
    private String idLoaiSuaChua;
    private String ngayBatDauThucTe;
    private String ngayKetThucThucTe;

    private String idDonViGiao;
    private String tenDonViGiao;

    private String idDonViNhan;
    private String tenDonViNhan;

    private String idNguoiKyNhay;
    private String tenNguoiKyNhay;

    private Boolean trangThaiKyNhay;
    private Boolean nguoiLapPhieuKyNhay;

    private String idTrinhDuyetCapPhong;
    private String tenTrinhDuyetCapPhong;
    private Boolean trinhDuyetCapPhongXacNhan;

    private String idTrinhDuyetGiamDoc;
    private String tenTrinhDuyetGiamDoc;
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
    private Boolean coPhieuBanGiao;
    private String taiLieuCuoi;
    private Integer trangThai;

    // Thay thế hai list cũ bằng một list chứa chi tiết tài sản kèm vật tư
    private List<KetQuaSuaChuaChiTietFullDTO> chiTietTaiSanList;

    // Giữ nguyên các list chữ ký
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;

    // Custom getters giữ nguyên
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

    public Boolean getCoPhieuBanGiao() {
        return coPhieuBanGiao != null ? coPhieuBanGiao : false;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }
}