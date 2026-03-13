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

    private String loaiDoiTuong;          // 'TAI_SAN', 'CCDC'

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String ghiChu;

    // Danh sách công việc (nếu cần gộp)
    private List<KeHoachCongViecSuaChuaDTO> congViecs;

    // Danh sách chi tiết (nếu cần gộp)
    private List<KeHoachChiTietSuaChuaDTO> chiTiets;


    private String trangThai;
}