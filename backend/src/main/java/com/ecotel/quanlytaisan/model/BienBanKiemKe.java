package com.ecotel.quanlytaisan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BienBanKiemKe {
    private String id;
    private String tenTaiSan;
    private String donViTinh;
    private String nuocSanXuat;
    private String phuongThucKiemKe;
    @JsonIgnore
    private Integer soLuongKiemKeThucTe;
    private String hienTrang;
    private String ghiChu;
    private String loai; // "TaiSan" hoặc "CCDCVatTu"

    // Custom getter: trả về chuỗi rỗng nếu giá trị = 0 hoặc null
    @JsonProperty("soLuongKiemKeThucTe")
    public String getSoLuongKiemKeThucTeStr() {
        return (soLuongKiemKeThucTe == null || soLuongKiemKeThucTe == 0) ? "" : String.valueOf(soLuongKiemKeThucTe);
    }
}
