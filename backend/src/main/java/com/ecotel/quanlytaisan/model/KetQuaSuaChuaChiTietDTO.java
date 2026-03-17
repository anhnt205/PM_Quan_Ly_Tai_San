package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Data
@Getter
@Setter
public class KetQuaSuaChuaChiTietDTO {

    private String id;
    private String idKetQuaSuaChua;
    private String idTaiSan;
    private Integer soLuong;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Có thể thêm các field từ bảng liên quan nếu cần join
    private String tenTaiSan;        // Ví dụ nếu join với TaiSan
}