package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class GioHoatDongYearData {
    private Integer nam;
    private List<GioHoatDong> data; // monthly records for that year
}