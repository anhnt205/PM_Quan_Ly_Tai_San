package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class LichSuDieuChuyenTaiSan {
    private String id;
    private String idBanGiaoTaiSan; // ID lệnh bàn giao
    private String idTaiSan;        // ID tài sản (cần thiết để lọc lịch sử theo tài sản)
    private String idDonViGiao;     // ID phòng ban giao
    private String idDonViNhan;     // ID phòng ban nhận
    private String thoiGianBanGiao; // Thời gian bàn giao
    
    // Các trường bổ sung để hiển thị tên nếu cần (DTO)
    private String tenTaiSan;
    private String tenDonViGiao;
    private String tenDonViNhan;
}
