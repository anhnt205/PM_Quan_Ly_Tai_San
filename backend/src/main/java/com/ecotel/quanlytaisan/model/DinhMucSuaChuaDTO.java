package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class DinhMucSuaChuaDTO {
    private String id;
    private String tenLoaiTaiSan;
    private String idCapSuaChua;
    private String tenCapSuaChua;
    private String ghiChu;
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;
    
    private List<DinhMucVatTuDTO> dinhMucVatTuList;
}
