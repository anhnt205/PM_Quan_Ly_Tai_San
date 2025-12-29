package com.ecotel.quanlytaisan.model;


public class BanGiaoPhuLucDTO {
    private String id;
    private String banGiaoPhuLuc;
    private String quyetDinhDieuDongSo;
    private String lenhDieuDong;
    private String ngayBanGiao;

    private String idDonViGiao;
    private String tenDonViGiao;

    private String idDonViNhan;
    private String tenDonViNhan;

    private String idDonViDaiDien;
    private String tenDonViDaiDien;

    private String idLanhDao;
    private String tenLanhDao;

    private String idDaiDiendonviBanHanhQD;
    private String tenNguoiBanHanh;

    private String idDaiDienBenGiao;
    private String tenBenGiao;

    private String idDaiDienBenNhan;
    private String tenBenNhan;

    private Boolean daiDienBenGiaoXacNhan;
    private Boolean daiDienBenNhanXacNhan;
    private Boolean donViDaiDienXacNhan;
    private Boolean daXacNhan;
    private Integer trangThai;
    private String note;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBanGiaoPhuLuc() { return banGiaoPhuLuc; }
    public void setBanGiaoPhuLuc(String banGiaoPhuLuc) { this.banGiaoPhuLuc = banGiaoPhuLuc; }

    public String getQuyetDinhDieuDongSo() { return quyetDinhDieuDongSo; }
    public void setQuyetDinhDieuDongSo(String quyetDinhDieuDongSo) { this.quyetDinhDieuDongSo = quyetDinhDieuDongSo; }

    public String getLenhDieuDong() { return lenhDieuDong; }
    public void setLenhDieuDong(String lenhDieuDong) { this.lenhDieuDong = lenhDieuDong; }

    public String getNgayBanGiao() { return ngayBanGiao; }
    public void setNgayBanGiao(String ngayBanGiao) { this.ngayBanGiao = ngayBanGiao; }

    public String getIdDonViGiao() { return idDonViGiao; }
    public void setIdDonViGiao(String idDonViGiao) { this.idDonViGiao = idDonViGiao; }

    public String getTenDonViGiao() { return tenDonViGiao; }
    public void setTenDonViGiao(String tenDonViGiao) { this.tenDonViGiao = tenDonViGiao; }

    public String getIdDonViNhan() { return idDonViNhan; }
    public void setIdDonViNhan(String idDonViNhan) { this.idDonViNhan = idDonViNhan; }

    public String getTenDonViNhan() { return tenDonViNhan; }
    public void setTenDonViNhan(String tenDonViNhan) { this.tenDonViNhan = tenDonViNhan; }

    public String getIdDonViDaiDien() { return idDonViDaiDien; }
    public void setIdDonViDaiDien(String idDonViDaiDien) { this.idDonViDaiDien = idDonViDaiDien; }

    public String getTenDonViDaiDien() { return tenDonViDaiDien; }
    public void setTenDonViDaiDien(String tenDonViDaiDien) { this.tenDonViDaiDien = tenDonViDaiDien; }

    public String getIdLanhDao() { return idLanhDao; }
    public void setIdLanhDao(String idLanhDao) { this.idLanhDao = idLanhDao; }

    public String getTenLanhDao() { return tenLanhDao; }
    public void setTenLanhDao(String tenLanhDao) { this.tenLanhDao = tenLanhDao; }

    public String getIdDaiDiendonviBanHanhQD() { return idDaiDiendonviBanHanhQD; }
    public void setIdDaiDiendonviBanHanhQD(String idDaiDiendonviBanHanhQD) { this.idDaiDiendonviBanHanhQD = idDaiDiendonviBanHanhQD; }

    public String getTenNguoiBanHanh() { return tenNguoiBanHanh; }
    public void setTenNguoiBanHanh(String tenNguoiBanHanh) { this.tenNguoiBanHanh = tenNguoiBanHanh; }

    public String getIdDaiDienBenGiao() { return idDaiDienBenGiao; }
    public void setIdDaiDienBenGiao(String idDaiDienBenGiao) { this.idDaiDienBenGiao = idDaiDienBenGiao; }

    public String getTenBenGiao() { return tenBenGiao; }
    public void setTenBenGiao(String tenBenGiao) { this.tenBenGiao = tenBenGiao; }

    public String getIdDaiDienBenNhan() { return idDaiDienBenNhan; }
    public void setIdDaiDienBenNhan(String idDaiDienBenNhan) { this.idDaiDienBenNhan = idDaiDienBenNhan; }

    public String getTenBenNhan() { return tenBenNhan; }
    public void setTenBenNhan(String tenBenNhan) { this.tenBenNhan = tenBenNhan; }

    public Boolean getDaiDienBenGiaoXacNhan() { return daiDienBenGiaoXacNhan; }
    public void setDaiDienBenGiaoXacNhan(boolean daiDienBenGiaoXacNhan) { this.daiDienBenGiaoXacNhan = daiDienBenGiaoXacNhan; }

    public Boolean getDaiDienBenNhanXacNhan() { return daiDienBenNhanXacNhan; }
    public void setDaiDienBenNhanXacNhan(boolean daiDienBenNhanXacNhan) { this.daiDienBenNhanXacNhan = daiDienBenNhanXacNhan; }

    public Boolean getDonViDaiDienXacNhan() { return donViDaiDienXacNhan; }
    public void setDonViDaiDienXacNhan(boolean donViDaiDienXacNhan) { this.donViDaiDienXacNhan = donViDaiDienXacNhan; }

    public Boolean getDaXacNhan() { return daXacNhan; }
    public void setDaXacNhan(boolean daXacNhan) { this.daXacNhan = daXacNhan; }

    public int getTrangThai() { return trangThai; }
    public void setTrangThai(int trangThai) { this.trangThai = trangThai; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getNgayTao() { return ngayTao; }
    public void setNgayTao(String ngayTao) { this.ngayTao = ngayTao; }

    public String getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(String ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }

    public String getNguoiTao() { return nguoiTao; }
    public void setNguoiTao(String nguoiTao) { this.nguoiTao = nguoiTao; }

    public String getNguoiCapNhat() { return nguoiCapNhat; }
    public void setNguoiCapNhat(String nguoiCapNhat) { this.nguoiCapNhat = nguoiCapNhat; }

    public Boolean getIsActive() { return isActive; }

}
