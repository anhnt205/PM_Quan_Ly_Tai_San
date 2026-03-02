package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.poi.ss.usermodel.Row;
import java.util.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class ChiTietKetQuaSuaChua {
    private String id;
    private String idKetQuaSuaChua;
    private String idTaiSan;
    private Integer soLuong;              // INT DEFAULT 1
    private String hienTrang;
    private String moTa;
    private String danhGia;
    private String vatTuSuDung;            // JSON -> String
    private String ghiChu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Custom getters
    public Integer getSoLuong() {
        return soLuong != null ? soLuong : 1;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : false;
    }

    public static ChiTietKetQuaSuaChua mapToChiTietKetQuaSuaChua(String[] row) {
        ChiTietKetQuaSuaChua ct = new ChiTietKetQuaSuaChua();
        // Cài đặt chi tiết nếu cần import
        return ct;
    }

    public static ChiTietKetQuaSuaChua mapToChiTietKetQuaSuaChua(Row row) {
        ChiTietKetQuaSuaChua ct = new ChiTietKetQuaSuaChua();
        // Cài đặt chi tiết nếu cần import
        return ct;
    }
}