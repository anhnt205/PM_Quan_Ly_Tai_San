package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class TaiSanFile {
    private Integer id;
    private String idTaiSan;
    private String filePath;
    private String tenFile;
    private Integer loai;          // 1: ảnh, 2: tài liệu, ...
    private String ngayTao;        // lưu dạng String theo định dạng của dự án
    private String ghiChu;
}