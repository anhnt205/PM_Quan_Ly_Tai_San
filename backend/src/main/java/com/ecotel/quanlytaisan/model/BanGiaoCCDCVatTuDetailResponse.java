package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class BanGiaoCCDCVatTuDetailResponse {
    private BanGiaoCCDCVatTuDTO banGiaoCCDCVatTu;
    private List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTu;
    private List<KyTaiLieu> kyTaiLieu;

    public BanGiaoCCDCVatTuDetailResponse() {
    }

    public BanGiaoCCDCVatTuDetailResponse(BanGiaoCCDCVatTuDTO banGiaoCCDCVatTu, 
                                        List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTu,
                                        List<KyTaiLieu> kyTaiLieu) {
        this.banGiaoCCDCVatTu = banGiaoCCDCVatTu;
        this.chiTietBanGiaoCCDCVatTu = chiTietBanGiaoCCDCVatTu;
        this.kyTaiLieu = kyTaiLieu;
    }
}
