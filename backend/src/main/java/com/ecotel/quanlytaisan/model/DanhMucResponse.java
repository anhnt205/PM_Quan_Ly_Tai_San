package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class DanhMucResponse {
    private List<NhomTaiSan> nhomTaiSan;
    private List<NhomCCDC> nhomCCDC;
    private List<LoaiTaiSanEnrichedDTO> loaiTaiSan;
    private List<LoaiTaiSanCon> loaiTaiSanCon;
    private List<LoaiCCDCCon> loaiCCDCCon;
    private List<NhanVienDTO> nhanVien;
    private List<MoHinhTaiSanEnrichedDTO> moHinhTaiSan;
    private List<NhomDonVi> donVi;
    private List<DonViTinh> donViTinh;

    public DanhMucResponse() {
    }

    public DanhMucResponse(List<NhomTaiSan> nhomTaiSan, 
                          List<NhomCCDC> nhomCCDC,
                          List<LoaiTaiSanEnrichedDTO> loaiTaiSan,
                          List<LoaiTaiSanCon> loaiTaiSanCon,
                          List<LoaiCCDCCon> loaiCCDCCon,
                          List<NhanVienDTO> nhanVien,
                          List<MoHinhTaiSanEnrichedDTO> moHinhTaiSan,
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
