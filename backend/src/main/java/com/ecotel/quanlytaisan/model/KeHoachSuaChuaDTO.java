package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

@Data
public class KeHoachSuaChuaDTO {
    private String id;
    private String idCongTy;
    private String tenKeHoach;
    private String idLoaiKeHoach;
    private String tenLoaiKeHoach;
    private String idLoaiSuaChua;
    private String tenLoaiSuaChua;

    // Đơn vị thực hiện
    private String idDonViGiao;
    private String tenDonViGiao;

    private String idDonViThucHien;
    private String tenDonViThucHien;

    // Người phụ trách
    private String idNguoiPhuTrach;
    private String tenNguoiPhuTrach;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayBatDau;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThuc;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String ghiChu;
    private String trangThai;

    // Danh sách công việc (nếu cần)
    private List<KeHoachCongViecSuaChuaDTO> congViecs;

    // --- THAY THẾ: Xóa chiTiets, thêm hai danh sách mới ---
    private List<KeHoachSuaChuaChiTietTaiSan> danhSachTaiSan;   // chi tiết tài sản sửa chữa
    private List<KeHoachSuaChuaVatTuTieuHao> danhSachVatTu;     // vật tư tiêu hao
}