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
    private String loaiKeHoach;          // 'THIET_BI', 'CHU_KY', 'GIO_MAY'
    private Integer chuKyNgay;
    private Integer mocGioMay;

    // Đơn vị thực hiện
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

    // Custom getters for null safety
    public Integer getChuKyNgay() {
        return chuKyNgay != null ? chuKyNgay : 0;
    }

    public Integer getMocGioMay() {
        return mocGioMay != null ? mocGioMay : 0;
    }

    private String trangThai;
}