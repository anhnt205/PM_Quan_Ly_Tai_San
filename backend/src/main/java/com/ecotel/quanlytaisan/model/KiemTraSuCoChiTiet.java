package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

/**
 * Chi tiết biên bản kiểm tra sự cố.
 */
@Data
public class KiemTraSuCoChiTiet {
    private String id;
    private String idKiemTraSuCo;
    private String idTaiSan;
    private String idSuCoChiTiet;
    
    // Enrich data
    private String tenTaiSan;
    private String maTaiSan;
    private String donViTinh;

    private List<KiemTraSuCoVattu> danhSachVatTu;
}

