package com.ecotel.quanlytaisan.model;

import lombok.Data;

import java.util.List;

@Data
public class DieuDongTaiSanDetailResponse {
    private DieuDongTaiSanDTO dieuDongTaiSan;
    private List<ChiTietDieuDongTaiSanDTO> chiTietDieuDongTaiSan;
    private List<KyTaiLieu> kyTaiLieu;

    public DieuDongTaiSanDetailResponse() {}

    public DieuDongTaiSanDetailResponse(DieuDongTaiSanDTO dieuDongTaiSan, 
                                      List<ChiTietDieuDongTaiSanDTO> chiTietDieuDongTaiSan, 
                                      List<KyTaiLieu> kyTaiLieu) {
        this.dieuDongTaiSan = dieuDongTaiSan;
        this.chiTietDieuDongTaiSan = chiTietDieuDongTaiSan;
        this.kyTaiLieu = kyTaiLieu;
    }
}

