package com.ecotel.quanlytaisan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BaoCaoTangGiamTrongKy {
    private String id;
    private String tenTaiSan;
    private String donViTinh;
    private String nuocSanXuat;

    @JsonIgnore
    private Integer soDuDauKy;
    @JsonIgnore
    private Integer soLuongTangTrongKy;
    private String lyDoTangTrongKy;
    @JsonIgnore
    private Integer soLuongGiamTrongKy;
    private String lyDoGiamTrongKy;
    @JsonIgnore
    private Integer soDuCuoiKy;
    private String tinhTrangKyThuat;
    private String ghiChu;
    private String loai; // "TaiSan" hoặc "CCDCVatTu"

    // Custom getters: trả về chuỗi rỗng nếu giá trị = 0 hoặc null
    @JsonProperty("soDuDauKy")
    public String getSoDuDauKyStr() {
        return (soDuDauKy == null || soDuDauKy == 0) ? "" : String.valueOf(soDuDauKy);
    }

    @JsonProperty("soLuongTangTrongKy")
    public String getSoLuongTangTrongKyStr() {
        return (soLuongTangTrongKy == null || soLuongTangTrongKy == 0) ? "" : String.valueOf(soLuongTangTrongKy);
    }

    @JsonProperty("soLuongGiamTrongKy")
    public String getSoLuongGiamTrongKyStr() {
        return (soLuongGiamTrongKy == null || soLuongGiamTrongKy == 0) ? "" : String.valueOf(soLuongGiamTrongKy);
    }

    @JsonProperty("soDuCuoiKy")
    public String getSoDuCuoiKyStr() {
        return (soDuCuoiKy == null || soDuCuoiKy == 0) ? "" : String.valueOf(soDuCuoiKy);
    }
}
