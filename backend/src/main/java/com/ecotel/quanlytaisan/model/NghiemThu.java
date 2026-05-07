package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class NghiemThu {
    private String id;
    private String idCongTy;
    private String idGiamDinh;
    private String soPhieu;
    private String ngayNghiemThu;
    private String viTri;
    private String tenThietBi;
    private String soDangKi;
    private String capSuaChua;
    private String ketQua;
    private String noiDung;

    // Người lập phiếu
    private String idNguoiLap;
    private Boolean nguoiLapXacNhan;

    // Giám đốc duyệt
    private String idGiamDoc;
    private Boolean giamDocXacNhan;

    // Workflow & trạng thái
    private Boolean share;
    private Integer trangThai; // 0:nháp, 1:đang duyệt, 2:hủy, 3:hoàn thành

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    // Relations
    private List<NghiemThuTaiSan> danhSachTaiSan;
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
