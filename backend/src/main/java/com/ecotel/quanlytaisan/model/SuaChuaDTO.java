package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
public class SuaChuaDTO {
    private String id;
    private String idCongTy;
    private String idLoaiSuaChua;
    private String idKeHoach;
    private String tenKeHoach;
    private String maSuaChua;
    private String tenSuaChua;
    private String mucDoSuCo;
    private String mucDoUuTien;

    // Đơn vị
    private String idDonViGiao;
    private String tenDonViGiao;
    private String idDonViNhan;
    private String tenDonViNhan;
    private String idDonViDeNghi;
    private String tenDonViDeNghi;

    // Người ký nháy
    private String idNguoiKyNhay;          // JSON
    private Boolean trangThaiKyNhay;        // Trạng thái tổng thể
    private Boolean nguoiLapPhieuKyNhay;    // Người lập phiếu đã ký nháy chưa

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThucDuKien;

    // Duyệt cấp phòng
    private String idTrinhDuyetCapPhong;
    private String tenTrinhDuyetCapPhong;
    private Boolean trinhDuyetCapPhongXacNhan;

    // Duyệt giám đốc
    private String idTrinhDuyetGiamDoc;
    private String tenTrinhDuyetGiamDoc;
    private Boolean trinhDuyetGiamDocXacNhan;

    private String duongDanFile;
    private String tenFile;
    private String taiLieuBanGhi;
    private Boolean byStep;
    private String soQuyetDinh;
    private String nguoiTao;
    private Boolean share;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    private Boolean daBanGiao;
    private Boolean coPhieuSuaChua;
    private String taiLieuCuoi;
    private String ghiChu;
    private Integer loai;

    // Danh sách chi tiết sửa chữa
    private List<SuaChuaChiTietTaiSan> danhSachTaiSan;
    private List<SuaChuaVatTuTieuHao> danhSachVatTu;

    // Trạng thái tổng hợp (có thể tính toán)
    private Integer trangThaiTongHop; // 0: nháp, 1: chờ ký nháy, 2: chờ duyệt phòng, 3: chờ duyệt giám đốc, 4: hoàn thành, 5: từ chối, v.v.

    private Integer trangThai;
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;


    // Custom getters
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
        return coPhieuSuaChua != null ? coPhieuSuaChua : false;
    }
}