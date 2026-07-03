package com.ecotel.quanlytaisan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BaoCaoKiemKeTaiSan {

    // Thông tin tài sản
    private String idTaiSan;
    private String tenTaiSan;
    private String maSo;           // SoKyHieu hoặc KyHieu
    private String noiSuDung;      // Tên đơn vị hiện thời
    private String idDonViHienThoi;

    // Giá trị sổ sách
    @JsonIgnore
    private Integer soLuongSoSach;
    @JsonIgnore
    private Double nguyenGiaSoSach;
    @JsonIgnore
    private Double giaTriConLaiSoSach;

    // Giá trị kiểm kê
    @JsonIgnore
    private Integer soLuongKiemKe;
    @JsonIgnore
    private Double nguyenGiaKiemKe;
    @JsonIgnore
    private Double giaTriConLaiKiemKe;

    // Chênh lệch (tính toán: Kiểm kê - Sổ sách)
    @JsonIgnore
    private Integer chenhLechSoLuong;
    @JsonIgnore
    private Double chenhLechNguyenGia;
    @JsonIgnore
    private Double chenhLechGiaTriConLai;

    // Thông tin khác
    private String ghiChu;
    private String donViTinh;
    private String hienTrang;

    // Custom getters: trả về chuỗi rỗng nếu giá trị = 0 hoặc null
    @JsonProperty("soLuongSoSach")
    public String getSoLuongSoSachStr() {
        return (soLuongSoSach == null || soLuongSoSach == 0) ? "" : String.valueOf(soLuongSoSach);
    }

    @JsonProperty("nguyenGiaSoSach")
    public String getNguyenGiaSoSachStr() {
        return (nguyenGiaSoSach == null || nguyenGiaSoSach == 0) ? "" : String.valueOf(nguyenGiaSoSach);
    }

    @JsonProperty("giaTriConLaiSoSach")
    public String getGiaTriConLaiSoSachStr() {
        return (giaTriConLaiSoSach == null || giaTriConLaiSoSach == 0) ? "" : String.valueOf(giaTriConLaiSoSach);
    }

    @JsonProperty("soLuongKiemKe")
    public String getSoLuongKiemKeStr() {
        return (soLuongKiemKe == null || soLuongKiemKe == 0) ? "" : String.valueOf(soLuongKiemKe);
    }

    @JsonProperty("nguyenGiaKiemKe")
    public String getNguyenGiaKiemKeStr() {
        return (nguyenGiaKiemKe == null || nguyenGiaKiemKe == 0) ? "" : String.valueOf(nguyenGiaKiemKe);
    }

    @JsonProperty("giaTriConLaiKiemKe")
    public String getGiaTriConLaiKiemKeStr() {
        return (giaTriConLaiKiemKe == null || giaTriConLaiKiemKe == 0) ? "" : String.valueOf(giaTriConLaiKiemKe);
    }

    @JsonProperty("chenhLechSoLuong")
    public String getChenhLechSoLuongStr() {
        return (chenhLechSoLuong == null || chenhLechSoLuong == 0) ? "" : String.valueOf(chenhLechSoLuong);
    }

    @JsonProperty("chenhLechNguyenGia")
    public String getChenhLechNguyenGiaStr() {
        return (chenhLechNguyenGia == null || chenhLechNguyenGia == 0) ? "" : String.valueOf(chenhLechNguyenGia);
    }

    @JsonProperty("chenhLechGiaTriConLai")
    public String getChenhLechGiaTriConLaiStr() {
        return (chenhLechGiaTriConLai == null || chenhLechGiaTriConLai == 0) ? "" : String.valueOf(chenhLechGiaTriConLai);
    }
}
