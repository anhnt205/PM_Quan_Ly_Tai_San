package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class ChiTietBanGiaoPhuLucDTO {
    private String id;
    private String idBanGiaoPhuLuc;
    private String banGiaoPhuLuc;
    private String quyetDinhDieuDongSo;
    private String idPhuLuc;
    private String tenPhuLucTS;
    private String maPhuLucTSTB;
    private String donViTinh;
    private String hienTrang;
    private String dacDiem;
    private String moTaThietBiDinhKemTaiSan;
    private Integer soLuong;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;


}
