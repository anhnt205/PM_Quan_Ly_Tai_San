package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class BanGiaoTaiSanDetailResponse {
    private BanGiaoTaiSanDTO banGiaoTaiSan;
    private List<ChiTietBanGiaoTaiSanDTO> chiTietBanGiaoTaiSan;
    private List<KyTaiLieu> kyTaiLieu;

    public BanGiaoTaiSanDetailResponse() {
    }

    public BanGiaoTaiSanDetailResponse(BanGiaoTaiSanDTO banGiaoTaiSan, 
                                     List<ChiTietBanGiaoTaiSanDTO> chiTietBanGiaoTaiSan,
                                     List<KyTaiLieu> kyTaiLieu) {
        this.banGiaoTaiSan = banGiaoTaiSan;
        this.chiTietBanGiaoTaiSan = chiTietBanGiaoTaiSan;
        this.kyTaiLieu = kyTaiLieu;
    }
}
