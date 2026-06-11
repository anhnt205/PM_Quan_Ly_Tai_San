package com.ecotel.quanlytaisan.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class LichTrinhDTO {
    private String id;
    
    @NotBlank(message = "idTaiSan là bắt buộc")
    private String idTaiSan;
    
    @NotBlank(message = "nam là bắt buộc")
    private String nam;
    
    @NotBlank(message = "thang là bắt buộc")
    private String thang;
    
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    
    @Valid
    private List<ChiTietLichTrinh> chiTietLichTrinhs;
}
