package com.ecotel.quanlytaisan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data // lombok: tạo getter/setter, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienDTO {
    private String id;
    private String hoTen;
    private String diDong;
    private String emailCongViec;

    private Boolean kyNhay,kyThuong,kySo;
    private String chuKyNhay,chuKyThuong;

    private String agreementUUId;
    private String pin;

    private Boolean hasAccount;

    private String phongBanId;
    private String tenPhongBan;

    private String chucVuId;
    private String tenChucVu;

    private String quanLyId;
    private String tenQuanLy;

    private Boolean laQuanLy;
    private String avatar;
    private String idCongTy;
    private String diaChiLamViec;
    private String hinhThucLamViec;
    private String gioLamViec;
    private String muiGio;

    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    private Boolean savePin;

}
