package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class SuaChuaDetailResponse {
    private SuaChuaDTO suaChua;
    private List<ChiTietSuaChuaDTO> chiTietSuaChua;
    private KetQuaSuaChuaDTO ketQuaSuaChua;
    private List<ChiTietKetQuaSuaChuaDTO> chiTietKetQuaSuaChua;
    private List<KyTaiLieu> kyTaiLieu;

    public SuaChuaDetailResponse() {}

    public SuaChuaDetailResponse(SuaChuaDTO suaChua,
                                 List<ChiTietSuaChuaDTO> chiTietSuaChua,
                                 KetQuaSuaChuaDTO ketQuaSuaChua,
                                 List<ChiTietKetQuaSuaChuaDTO> chiTietKetQuaSuaChua,
                                 List<KyTaiLieu> kyTaiLieu) {
        this.suaChua = suaChua;
        this.chiTietSuaChua = chiTietSuaChua;
        this.ketQuaSuaChua = ketQuaSuaChua;
        this.chiTietKetQuaSuaChua = chiTietKetQuaSuaChua;
        this.kyTaiLieu = kyTaiLieu;
    }
}