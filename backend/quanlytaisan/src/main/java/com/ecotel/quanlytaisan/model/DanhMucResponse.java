package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class DanhMucResponse {
    private List<NhomTaiSan> nhomTaiSan;
    private List<NhomCCDC> nhomCCDC;
    private List<LoaiTaiSan> loaiTaiSan;
    private List<LoaiTaiSanCon> loaiTaiSanCon;
    private List<LoaiCCDCCon> loaiCCDCCon;
    private List<NhanVienDTO> nhanVien;
    private List<MoHinhTaiSan> moHinhTaiSan;
    private List<NhomDonVi> donVi;
    private List<DonViTinh> donViTinh;

    public DanhMucResponse() {
    }

    public DanhMucResponse(List<NhomTaiSan> nhomTaiSan, 
                          List<NhomCCDC> nhomCCDC,
                          List<LoaiTaiSan> loaiTaiSan,
                          List<LoaiTaiSanCon> loaiTaiSanCon,
                          List<LoaiCCDCCon> loaiCCDCCon,
                          List<NhanVienDTO> nhanVien,
                          List<MoHinhTaiSan> moHinhTaiSan,
                          List<NhomDonVi> donVi,
                          List<DonViTinh> donViTinh) {
        this.nhomTaiSan = nhomTaiSan;
        this.nhomCCDC = nhomCCDC;
        this.loaiTaiSan = loaiTaiSan;
        this.loaiTaiSanCon = loaiTaiSanCon;
        this.loaiCCDCCon = loaiCCDCCon;
        this.nhanVien = nhanVien;
        this.moHinhTaiSan = moHinhTaiSan;
        this.donVi = donVi;
        this.donViTinh = donViTinh;
    }
}
