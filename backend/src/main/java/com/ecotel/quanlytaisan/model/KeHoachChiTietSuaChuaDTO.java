package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class KeHoachChiTietSuaChuaDTO {
    private String id;
    private String idKeHoach;
    private String idTaiSan;
    private String tenTaiSan;              // Hiển thị tên tài sản
    private String idCCDC;
    private String tenCCDC;                 // Hiển thị tên CCDC
    private String ghiChu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    // Có thể thêm trường loại đối tượng để xác định (từ master)
    private String loaiDoiTuong;

    private String idChiTietCCDC;
    private String soKyHieu;
    private String nuocSanXuat;
    private Integer namSanXuat;
}