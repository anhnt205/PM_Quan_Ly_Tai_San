package com.ecotel.quanlytaisan.model;

import lombok.Data;

/**
 * DTO trả về danh sách ChiTietDonViSoHuu theo idDonViSoHuu,
 * đã JOIN sẵn thông tin từ CCDCVatTu và ChiTietTaiSan trong một câu SQL.
 * Tránh việc phải fetch toàn bộ CCDCVatTu rồi join ở tầng ứng dụng.
 */
@Data
public class ChiTietDonViSoHuuEnrichedDTO {
    // --- ChiTietDonViSoHuu fields ---
    private String id;
    private String idCCDCVT;
    private String idDonViSoHuu;
    private Integer soLuong;
    private String idTsCon;
    private String soChungTu;
    private Integer soLuongDaBanGiao;

    // --- CCDCVatTu fields (JOIN) ---
    private String tenCCDCVatTu;
    private String donViTinh;
    private Double giaTri;

    // --- ChiTietTaiSan fields (JOIN) ---
    private Integer namSanXuat;
    private String nuocSanXuat;
    private String ghiChu;
}
