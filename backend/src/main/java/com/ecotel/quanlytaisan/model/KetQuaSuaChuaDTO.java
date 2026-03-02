package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

@Data
public class KetQuaSuaChuaDTO {
    private String id;
    private String idSuaChua;
    private String maKetQua;
    private String tenKetQua;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayBatDauThucTe;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThucThucTe;

    private Integer thoiGianThucHienGio;
    private String noiDungCongViec;
    private String ketQuaDatDuoc;

    private String idDonViThucHien;
    private String tenDonViThucHien;
    private String nhanSuThucHien;      // JSON
    private String idTruongNhom;
    private String tenTruongNhom;

    private String danhGiaTinhTrang;
    private Integer trangThaiHoatDong;   // 1:Tốt,2:Yếu,3:Chưa dùng
    private Double tongChiPhi;
    private String vatTuTieuHao;         // JSON

    private Boolean daXacNhan;
    private String idDaiDienBenGiao;
    private String tenDaiDienBenGiao;
    private Boolean daiDienBenGiaoXacNhan;
    private String idDaiDienBenNhan;
    private String tenDaiDienBenNhan;
    private Boolean daiDienBenNhanXacNhan;

    private Integer trangThai;           // 0:Nháp,1:Gửi,2:Chờ duyệt,3:Duyệt,4:Từ chối
    private String idNguoiDuyet;
    private String tenNguoiDuyet;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayDuyet;

    private String lyDoTuChoi;
    private String note;
    private String ghiChu;
    private String duongDanFile;
    private String tenFile;
    private String taiLieuBanGhi;

    private Boolean byStep;
    private String idGiamDoc;
    private String tenGiamDoc;
    private Boolean giamDocKy;

    private String soQuyetDinh;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayQuyetDinh;

    private String diaDiemQuyetDinh;
    private Boolean share;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTaoChungTu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    private List<ChiTietKetQuaSuaChuaDTO> chiTietKetQuaSuaChuas;

    // Custom getters
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

    public Integer getTrangThaiHoatDong() {
        return trangThaiHoatDong != null ? trangThaiHoatDong : 0;
    }

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }

    public Boolean getGiamDocKy() {
        return giamDocKy != null ? giamDocKy : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : false;
    }

    public Double getTongChiPhi() {
        return tongChiPhi != null ? tongChiPhi : 0.0;
    }

    public Integer getThoiGianThucHienGio() {
        return thoiGianThucHienGio != null ? thoiGianThucHienGio : 0;
    }
}