package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class NghiemThuTaiSan {
    private String id;
    private String idBienBan;   // FK -> nghiemthu.Id
    private String idTaiSan;    // FK -> taisan.Id
    private String idChiTietGiamDinhMayMoc; // FK -> giamdinh_maymoc_chitiet.Id

    // View fields
    private String tenTaiSan;
    private String donViTinh;

    // Relations
    private List<NghiemThuVatTu> danhSachVatTu;
}
