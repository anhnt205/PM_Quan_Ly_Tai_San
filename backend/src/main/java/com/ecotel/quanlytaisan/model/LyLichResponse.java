package com.ecotel.quanlytaisan.model;

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
public class LyLichResponse {
    String id;
    String maLyLich;
    String tenLyLich;
    String moTa;
    Boolean hieuLuc;
    String idCongTy;
    String ngayTao;
    String ngayCapNhat;
    String nguoiTao;
    String nguoiCapNhat;
    String idLyLichTemplate;
    String LyLichTemplateTen;
}
