package com.ecotel.quanlytaisan.model;

import lombok.Data;

import java.util.List;

@Data
public class DieuDongCCDCVatTuDetailResponse {
    private DieuDongCCDCVatTuDTO dieuDongCCDCVatTu;
    private List<ChiTietDieuDongCCDCVatTuDTO> chiTietDieuDongCCDCVatTu;
    private List<KyTaiLieu> kyTaiLieu;

    public DieuDongCCDCVatTuDetailResponse() {}

    public DieuDongCCDCVatTuDetailResponse(DieuDongCCDCVatTuDTO dieuDongCCDCVatTu, 
                                         List<ChiTietDieuDongCCDCVatTuDTO> chiTietDieuDongCCDCVatTu, 
                                         List<KyTaiLieu> kyTaiLieu) {
        this.dieuDongCCDCVatTu = dieuDongCCDCVatTu;
        this.chiTietDieuDongCCDCVatTu = chiTietDieuDongCCDCVatTu;
        this.kyTaiLieu = kyTaiLieu;
    }
}

