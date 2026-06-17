package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class NghiemThuPhuongTien {
    private String id;
    private String idCongTy;
    private String congTy;
    private String tenMauBienBan;
    private String idBienPhapPhuongTien; // FK -> bienphap_phuongtien.Id
    private String idTaiSan;

    // Thông tin chính
    private String soPhieu;
    private String noiDung;           // Nội dung nghiệm thu
    private String tinhTrang;         // Tình trạng phương tiện
    private String congViecPhatSinh;  // Công việc phát sinh
    private BigDecimal chiPhiNhanCong; // Chi phí nhân công
    private String ketLuan;           // Kết luận
    private String ghiChuBienBan;

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
    private List<NghiemThuPhuongTienChiTiet> danhSachChiTiet;
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
