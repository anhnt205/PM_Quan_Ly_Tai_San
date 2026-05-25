package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class GiamDinhMayMocChiTiet {
    private String id;
    private String idGiamDinhMayMoc;
    private String idTaiSan;
    private String idBienBanChiTiet;

    // Danh sách vật tư đi kèm tài sản
    private List<GiamDinhMayMocVatTu> danhSachVatTu;

    // Audit
    private String ngayTao;
    private String ngayCapNhat;
    private String nguoiTao;
    private String nguoiCapNhat;

    //view
    private String tenTaiSan;
    private String donViTinh;
    private String soLuong;
}
