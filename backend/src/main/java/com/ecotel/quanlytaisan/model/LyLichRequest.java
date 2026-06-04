package com.ecotel.quanlytaisan.model;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class LyLichRequest {
    String id;
    @NotNull
    String maLyLich;
    @NotNull
    String tenLyLich;
    String moTa;
    String idCongTy;
    String ngayTao;
    String ngayCapNhat;
    String nguoiTao;
    String nguoiCapNhat;
    String idLyLichTemplate;
}
