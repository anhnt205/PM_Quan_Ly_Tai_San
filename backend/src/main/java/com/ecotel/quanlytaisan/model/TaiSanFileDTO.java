package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class TaiSanFileDTO {
    private Integer id;
    private String idTaiSan;
    private String filePath;
    private String tenFile;
    private Integer loai;
    private String ngayTao;
    private String ghiChu;
    private String action;
}