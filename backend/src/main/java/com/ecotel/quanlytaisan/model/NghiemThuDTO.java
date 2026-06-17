package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class NghiemThuDTO {
    private String id;
    private String idCongTy;
    private String congTy;
    private String tenMauBienBan;
    private String idBienPhapMayMoc;
    private String soPhieu;
    private String ngayNghiemThu;
    private String viTri;
    private String tenThietBi;
    private String soDangKi;
    private String capSuaChua;
    private String ketQua;
    private String noiDung;
    private String ghiChuBienBan;

    // Người lập phiếu
    private String idNguoiLap;
    private Boolean nguoiLapXacNhan;

    // Giám đốc duyệt
    private String idGiamDoc;
    private Boolean giamDocXacNhan;

    // Workflow & trạng thái
    private Boolean share;
    private Integer trangThai;

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    // Join fields
    private String tenNguoiLap;
    private String tenGiamDoc;
    private String soPhieuBienPhapMayMoc;
    private Integer daCoDanhGiaVatTu;

    // Relations
    private List<NghiemThuTaiSan> danhSachTaiSan;
    private List<KyTaiLieu> chuKyList;
    private List<NguoiKy> nguoiKyList;

    public Boolean getNguoiLapXacNhan() {
        return nguoiLapXacNhan != null ? nguoiLapXacNhan : false;
    }

    public Boolean getGiamDocXacNhan() {
        return giamDocXacNhan != null ? giamDocXacNhan : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }
}
