package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Data
@Getter
@Setter
public class LichSuSuaChuaDTO {
    private String id;
    private String idTaiSan;
    private String tenTaiSan;           // JOIN Tài sản
    private String ngayBatDau;
    private String ngayKetThuc;
    private String idKetQuaSuaChua;
    private String soPhieuSuaChua;      // từ bảng ketquasuachua.TenPhieu (hoặc mã)
    private String ngayTao;
    private String ngayCapNhat;

    private List<ChiTietLichSuSuaChuaDTO> chiTietList;
}