package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class NghiemThuPhuongTienChiTiet {
    private String id;
    private String idNghiemThuPhuongTien; // FK -> nghiemthu_phuongtien.Id
    private String idChiTietVatTu;         // FK -> giamdinh_phuongtien_chitiet.Id
    private String idVatTu;                // FK -> CCDCVatTu.Id

    // Thông tin nghiệm thu vật tư
    private Integer soLuongThayThe;       // Số lượng thay thế
    private Integer soLuongThuHoi;        // Số lượng thu hồi
    private BigDecimal phanTramConLai;    // Phần trăm còn lại (%)
    private String bienPhapXuLy;          // Biện pháp xử lý
    private String ghiChu;                // Ghi chú

    // View fields (join từ bảng khác)
    private String tenVatTu;
    private String donViTinh;
}
