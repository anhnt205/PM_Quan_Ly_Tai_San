package com.ecotel.quanlytaisan.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.poi.ss.usermodel.Row;
import java.util.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import static com.ecotel.quanlytaisan.utils.ParserHelper.*;

@Data
public class KetQuaSuaChua {
    private String id;
    private String idCongTy;
    private String idSuaChua;
    private String maKetQua;
    private String tenKetQua;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayBatDauThucTe;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayKetThucThucTe;

    private Integer thoiGianThucHienGio;     // DB: ThoiGianThucHienGio INT
    private String noiDungCongViec;
    private String ketQuaDatDuoc;
    private String idDonViThucHien;
    private String nhanSuThucHien;           // JSON -> String
    private String idTruongNhom;
    private String danhGiaTinhTrang;
    private Integer trangThaiHoatDong;        // 1:Tốt, 2:Yếu, 3:Chưa dùng được
    private Double tongChiPhi;                 // DECIMAL(15,2) -> Double
    private String vatTuTieuHao;               // JSON -> String
    private Boolean daXacNhan;
    private String idDaiDienBenGiao;
    private Boolean daiDienBenGiaoXacNhan;
    private String idDaiDienBenNhan;
    private Boolean daiDienBenNhanXacNhan;
    private Integer trangThai;                 // 0:Nháp,1:Gửi,2:Chờ duyệt,3:Duyệt,4:Từ chối
    private String idNguoiDuyet;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayDuyet;

    private String lyDoTuChoi;
    private String note;
    private String ghiChu;
    private String duongDanFile;
    private String tenFile;
    private String taiLieuBanGhi;
    private Boolean byStep;
    private String idGiamDoc;
    private Boolean giamDocKy;
    private String soQuyetDinh;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayQuyetDinh;

    private String diaDiemQuyetDinh;
    private Boolean share;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTaoChungTu;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayTao;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date ngayCapNhat;

    private String nguoiTao;
    private String nguoiCapNhat;
    private Boolean isActive;

    // Custom getters
    public Boolean getDaXacNhan() {
        return daXacNhan != null ? daXacNhan : false;
    }

    public Boolean getDaiDienBenGiaoXacNhan() {
        return daiDienBenGiaoXacNhan != null ? daiDienBenGiaoXacNhan : false;
    }

    public Boolean getDaiDienBenNhanXacNhan() {
        return daiDienBenNhanXacNhan != null ? daiDienBenNhanXacNhan : false;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }

    public Integer getTrangThaiHoatDong() {
        return trangThaiHoatDong != null ? trangThaiHoatDong : 0;
    }

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }

    public Boolean getGiamDocKy() {
        return giamDocKy != null ? giamDocKy : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : false;
    }

    public Double getTongChiPhi() {
        return tongChiPhi != null ? tongChiPhi : 0.0;
    }

    public Integer getThoiGianThucHienGio() {
        return thoiGianThucHienGio != null ? thoiGianThucHienGio : 0;
    }

    public static KetQuaSuaChua mapToKetQuaSuaChua(String[] row) {
        KetQuaSuaChua kq = new KetQuaSuaChua();
        // Cài đặt chi tiết nếu cần import, tương tự các method map ở trên
        return kq;
    }

    public static KetQuaSuaChua mapToKetQuaSuaChua(Row row) {
        KetQuaSuaChua kq = new KetQuaSuaChua();
        // Cài đặt chi tiết nếu cần import
        return kq;
    }
}