package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class KeHoachSuaChuaDetailResponse {
    private KeHoachSuaChuaDTO keHoach;
    private List<KeHoachCongViecSuaChuaDTO> congViecs;
    private List<KeHoachChiTietSuaChuaDTO> chiTiets;

    public KeHoachSuaChuaDetailResponse() {}

    public KeHoachSuaChuaDetailResponse(
            KeHoachSuaChuaDTO keHoach,
            List<KeHoachCongViecSuaChuaDTO> congViecs,
            List<KeHoachChiTietSuaChuaDTO> chiTiets
    ) {
        this.keHoach = keHoach;
        this.congViecs = congViecs;
        this.chiTiets = chiTiets;
    }
}