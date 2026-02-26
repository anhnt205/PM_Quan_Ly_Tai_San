package com.ecotel.quanlytaisan.model;

public class PhongBanDTO {
    private String id;
    private String idNhomDonVi;
    private String tenPhongBan;
    private String idQuanLy;
    private String idCongTy;
    private String phongCapTren;
    private String mauSac;
    private String tenNhom;
    private String hoTenQuanLy;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Integer soLuongNhanVien;
    private String tenPhongCapTren;
    private Boolean isKho;
    private Boolean isLanhDao;
    private Integer loaiKho;

    public PhongBanDTO() {
    }

    public PhongBanDTO(String id, String idNhomDonVi, String tenPhongBan, String idQuanLy, String idCongTy, String phongCapTren, String mauSac, String tenNhom, String hoTenQuanLy, String nguoiTao, String nguoiCapNhat, int soLuongNhanVien) {
        this.id = id;
        this.idNhomDonVi = idNhomDonVi;
        this.tenPhongBan = tenPhongBan;
        this.idQuanLy = idQuanLy;
        this.idCongTy = idCongTy;
        this.phongCapTren = phongCapTren;
        this.mauSac = mauSac;
        this.tenNhom = tenNhom;
        this.hoTenQuanLy = hoTenQuanLy;
        this.nguoiTao = nguoiTao;
        this.nguoiCapNhat = nguoiCapNhat;
        this.soLuongNhanVien = soLuongNhanVien;
    }

    public String getTenPhongCapTren() {
        return tenPhongCapTren;
    }

    public void setTenPhongCapTren(String tenPhongCapTren) {
        this.tenPhongCapTren = tenPhongCapTren;
    }

    public int getSoLuongNhanVien() {
        return soLuongNhanVien;
    }

    public void setSoLuongNhanVien(int soLuongNhanVien) {
        this.soLuongNhanVien = soLuongNhanVien;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdNhomDonVi() {
        return idNhomDonVi;
    }

    public void setIdNhomDonVi(String idNhomDonVi) {
        this.idNhomDonVi = idNhomDonVi;
    }

    public String getTenPhongBan() {
        return tenPhongBan;
    }

    public void setTenPhongBan(String tenPhongBan) {
        this.tenPhongBan = tenPhongBan;
    }

    public String getIdQuanLy() {
        return idQuanLy;
    }

    public void setIdQuanLy(String idQuanLy) {
        this.idQuanLy = idQuanLy;
    }

    public String getIdCongTy() {
        return idCongTy;
    }

    public void setIdCongTy(String idCongTy) {
        this.idCongTy = idCongTy;
    }

    public String getPhongCapTren() {
        return phongCapTren;
    }

    public void setPhongCapTren(String phongCapTren) {
        this.phongCapTren = phongCapTren;
    }

    public String getMauSac() {
        return mauSac;
    }

    public void setMauSac(String mauSac) {
        this.mauSac = mauSac;
    }

    public String getTenNhom() {
        return tenNhom;
    }

    public void setTenNhom(String tenNhom) {
        this.tenNhom = tenNhom;
    }

    public String getHoTenQuanLy() {
        return hoTenQuanLy;
    }

    public void setHoTenQuanLy(String hoTenQuanLy) {
        this.hoTenQuanLy = hoTenQuanLy;
    }

    public String getNguoiTao() {
        return nguoiTao;
    }

    public void setNguoiTao(String nguoiTao) {
        this.nguoiTao = nguoiTao;
    }

    public String getNguoiCapNhat() {
        return nguoiCapNhat;
    }

    public void setNguoiCapNhat(String nguoiCapNhat) {
        this.nguoiCapNhat = nguoiCapNhat;
    }

    public Boolean getIsKho() {
        return isKho;
    }

    public void setIsKho(Boolean isKho) {
        this.isKho = isKho;
    }

    public Boolean getIsLanhDao() {
        return isLanhDao;
    }

    public void setIsLanhDao(Boolean isLanhDao) {
        this.isLanhDao = isLanhDao;
    }

    public Integer getLoaiKho() {
        return loaiKho;
    }

    public void setLoaiKho(Integer loaiKho) {
        this.loaiKho = loaiKho;
    }
}
