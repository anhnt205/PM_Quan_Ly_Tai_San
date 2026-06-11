package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class BienPhapMayMoc {
    private String id;
    private String idCongTy;
    private String idGiamDinhMayMoc;  // FK -> giamdinh_maymoc.Id

    // Thông tin chính
    private String soPhieu;           // Số phiếu
    private String soDeNghi;          // Số đề nghị
    private String donViSuaChua;      // Đơn vị sửa chữa
    private String donViPhoiHop;      // Đơn vị phối hợp
    private String hinhThuc;          // Hình thức sửa chữa
    private String thoiGianBatDau;    // Thời gian bắt đầu
    private String thoiGianKetThuc;   // Thời gian kết thúc
    private Integer thoiGianNgay;     // Thời gian (số ngày)
    private String ghiChu;            // Ghi chú
    private String ghiChuBienBan;
    private String tenFile;           // Tên file đính kèm
    private String duongDanFile;      // Đường dẫn file đính kèm

    // Luồng ký
    private String  idNguoiLap;
    private Boolean nguoiLapXacNhan;
    private String  idGiamDoc;
    private Boolean giamDocXacNhan;
    private Boolean share;
    private Integer trangThai; // 0:nháp 1:đang duyệt 2:hủy 3:hoàn thành

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    // Người ký (không lưu DB, dùng khi nhận/trả payload)
    private List<NguoiKy> nguoiKyList;

    public Boolean getNguoiLapXacNhan() { return nguoiLapXacNhan != null ? nguoiLapXacNhan : false; }
    public Boolean getGiamDocXacNhan()  { return giamDocXacNhan  != null ? giamDocXacNhan  : false; }
    public Boolean getShare()           { return share            != null ? share            : false; }
}
