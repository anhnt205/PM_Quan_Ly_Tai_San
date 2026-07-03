package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class KeHoachCongViecSuaChuaDTO {
    private String id;
    private String idKeHoach;
    private String tenCongViec;
    private String moTa;
    private Integer thoiGianDuKien;       // phút
    private String nguoiThucHien;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayThucHien;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private Integer trangThai;             // 0: Chưa TH, 1: Đang TH, 2: Hoàn thành, 3: Hủy

    // Custom getters
    public Integer getThoiGianDuKien() {
        return thoiGianDuKien != null ? thoiGianDuKien : 0;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }
}