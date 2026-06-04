package com.ecotel.quanlytaisan.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LyLichTemplateResponse {
    String id;
    String maLyLich;
    String tenLyLich;
}
