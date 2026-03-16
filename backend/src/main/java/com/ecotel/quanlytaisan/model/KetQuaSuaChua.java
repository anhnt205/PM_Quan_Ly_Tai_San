package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;

@Data
@Getter
@Setter
public class KetQuaSuaChua {

    private String id;                          // Id varchar(50) PK
    private String idCongTy;                    // IdCongTy varchar(50)
    private String tenPhieu;                     // TenPhieu varchar(255)
    private String idSuaChua;                    // IdSuaChua varchar(50)
    private String idLoaiSuaChua;                 // IdLoaiSuaChua varchar(50)
    private String ngayBatDauThucTe;              // NgayBatDauThucTe varchar(50)
    private String ngayKetThucThucTe;             // NgayKetThucThucTe varchar(50)
    private String idDonViGiao;                    // IdDonViGiao varchar(50)
    private String idDonViNhan;                    // IdDonViNhan varchar(50)
    private String idNguoiKyNhay;                  // IdNguoiKyNhay varchar(100)
    private Boolean trangThaiKyNhay;               // TrangThaiKyNhay tinyint(1)
    private Boolean nguoiLapPhieuKyNhay;           // NguoiLapPhieuKyNhay tinyint(1)
    private String idTrinhDuyetCapPhong;           // IdTrinhDuyetCapPhong varchar(100)
    private Boolean trinhDuyetCapPhongXacNhan;     // TrinhDuyetCapPhongXacNhan tinyint(1)
    private String idTrinhDuyetGiamDoc;            // IdTrinhDuyetGiamDoc varchar(100)
    private Boolean trinhDuyetGiamDocXacNhan;      // TrinhDuyetGiamDocXacNhan tinyint(1)
    private String idDonViDeNghi;                   // IdDonViDeNghi varchar(100)
    private String duongDanFile;                    // DuongDanFile text
    private String tenFile;                          // TenFile text
    private String taiLieuBanGhi;                    // TaiLieuBanGhi text
    private Boolean byStep;                          // ByStep tinyint(1)
    private String soQuyetDinh;                      // SoQuyetDinh varchar(100)
    private String nguoiTao;                          // NguoiTao text
    private Boolean share;                            // Share tinyint(1)
    private String ngayTao;                           // NgayTao varchar(50)
    private Boolean coPhieuBanGiao;                   // CoPhieuBanGiao tinyint(1)
    private String taiLieuCuoi;                        // TaiLieuCuoi text
    private Integer trangThai;                         // TrangThai int

    // Custom getters với default value
    public Boolean getTrangThaiKyNhay() {
        return trangThaiKyNhay != null ? trangThaiKyNhay : false;
    }

    public Boolean getNguoiLapPhieuKyNhay() {
        return nguoiLapPhieuKyNhay != null ? nguoiLapPhieuKyNhay : false;
    }

    public Boolean getTrinhDuyetCapPhongXacNhan() {
        return trinhDuyetCapPhongXacNhan != null ? trinhDuyetCapPhongXacNhan : false;
    }

    public Boolean getTrinhDuyetGiamDocXacNhan() {
        return trinhDuyetGiamDocXacNhan != null ? trinhDuyetGiamDocXacNhan : false;
    }

    public Boolean getByStep() {
        return byStep != null ? byStep : false;
    }

    public Boolean getShare() {
        return share != null ? share : false;
    }

    public Boolean getCoPhieuBanGiao() {
        return coPhieuBanGiao != null ? coPhieuBanGiao : false;
    }

    public Integer getTrangThai() {
        return trangThai != null ? trangThai : 0;
    }

    // ----------------------------------------------------------------
    // Helper: parse an tinyint(1) từ String ("0"/"1"/"true"/"false")
    // ----------------------------------------------------------------
    private static Boolean parseBool(String val) {
        if (val == null || val.isBlank()) return false;
        String v = val.trim();
        return v.equals("1") || v.equalsIgnoreCase("true");
    }

    private static Integer parseInt(String val) {
        if (val == null || val.isBlank()) return null;
        try { return Integer.parseInt(val.trim()); } catch (Exception e) { return null; }
    }

    private static String cellStr(Row row, int idx) {
        Cell cell = row.getCell(idx);
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            double d = cell.getNumericCellValue();
            if (d == Math.floor(d)) return String.valueOf((long) d);
            return String.valueOf(d);
        }
        String val = cell.toString().trim();
        return val.isEmpty() ? null : val;
    }

    // ----------------------------------------------------------------
    // Thứ tự cột theo bảng mới (28 cột):
    // 0 Id | 1 IdCongTy | 2 TenPhieu | 3 IdSuaChua | 4 IdLoaiSuaChua
    // 5 NgayBatDauThucTe | 6 NgayKetThucThucTe | 7 IdDonViGiao
    // 8 IdDonViNhan | 9 IdNguoiKyNhay | 10 TrangThaiKyNhay
    // 11 NguoiLapPhieuKyNhay | 12 IdTrinhDuyetCapPhong
    // 13 TrinhDuyetCapPhongXacNhan | 14 IdTrinhDuyetGiamDoc
    // 15 TrinhDuyetGiamDocXacNhan | 16 IdDonViDeNghi | 17 DuongDanFile
    // 18 TenFile | 19 TaiLieuBanGhi | 20 ByStep | 21 SoQuyetDinh
    // 22 NguoiTao | 23 Share | 24 NgayTao | 25 CoPhieuBanGiao
    // 26 TaiLieuCuoi | 27 TrangThai
    // ----------------------------------------------------------------

    public static KetQuaSuaChua mapToKetQuaSuaChua(String[] row) {
        KetQuaSuaChua kq = new KetQuaSuaChua();
        if (row == null) return kq;

        if (row.length > 0)  kq.setId(row[0].trim().isEmpty() ? null : row[0].trim());
        if (row.length > 1)  kq.setIdCongTy(row[1].trim().isEmpty() ? null : row[1].trim());
        if (row.length > 2)  kq.setTenPhieu(row[2].trim().isEmpty() ? null : row[2].trim());
        if (row.length > 3)  kq.setIdSuaChua(row[3].trim().isEmpty() ? null : row[3].trim());
        if (row.length > 4)  kq.setIdLoaiSuaChua(row[4].trim().isEmpty() ? null : row[4].trim());
        if (row.length > 5)  kq.setNgayBatDauThucTe(row[5].trim().isEmpty() ? null : row[5].trim());
        if (row.length > 6)  kq.setNgayKetThucThucTe(row[6].trim().isEmpty() ? null : row[6].trim());
        if (row.length > 7)  kq.setIdDonViGiao(row[7].trim().isEmpty() ? null : row[7].trim());
        if (row.length > 8)  kq.setIdDonViNhan(row[8].trim().isEmpty() ? null : row[8].trim());
        if (row.length > 9)  kq.setIdNguoiKyNhay(row[9].trim().isEmpty() ? null : row[9].trim());
        if (row.length > 10) kq.setTrangThaiKyNhay(parseBool(row[10]));
        if (row.length > 11) kq.setNguoiLapPhieuKyNhay(parseBool(row[11]));
        if (row.length > 12) kq.setIdTrinhDuyetCapPhong(row[12].trim().isEmpty() ? null : row[12].trim());
        if (row.length > 13) kq.setTrinhDuyetCapPhongXacNhan(parseBool(row[13]));
        if (row.length > 14) kq.setIdTrinhDuyetGiamDoc(row[14].trim().isEmpty() ? null : row[14].trim());
        if (row.length > 15) kq.setTrinhDuyetGiamDocXacNhan(parseBool(row[15]));
        if (row.length > 16) kq.setIdDonViDeNghi(row[16].trim().isEmpty() ? null : row[16].trim());
        if (row.length > 17) kq.setDuongDanFile(row[17].trim().isEmpty() ? null : row[17].trim());
        if (row.length > 18) kq.setTenFile(row[18].trim().isEmpty() ? null : row[18].trim());
        if (row.length > 19) kq.setTaiLieuBanGhi(row[19].trim().isEmpty() ? null : row[19].trim());
        if (row.length > 20) kq.setByStep(parseBool(row[20]));
        if (row.length > 21) kq.setSoQuyetDinh(row[21].trim().isEmpty() ? null : row[21].trim());
        if (row.length > 22) kq.setNguoiTao(row[22].trim().isEmpty() ? null : row[22].trim());
        if (row.length > 23) kq.setShare(parseBool(row[23]));
        if (row.length > 24) kq.setNgayTao(row[24].trim().isEmpty() ? null : row[24].trim());
        if (row.length > 25) kq.setCoPhieuBanGiao(parseBool(row[25]));
        if (row.length > 26) kq.setTaiLieuCuoi(row[26].trim().isEmpty() ? null : row[26].trim());
        if (row.length > 27) kq.setTrangThai(parseInt(row[27]));

        return kq;
    }

    public static KetQuaSuaChua mapToKetQuaSuaChua(Row row) {
        KetQuaSuaChua kq = new KetQuaSuaChua();
        if (row == null) return kq;

        kq.setId(cellStr(row, 0));
        kq.setIdCongTy(cellStr(row, 1));
        kq.setTenPhieu(cellStr(row, 2));
        kq.setIdSuaChua(cellStr(row, 3));
        kq.setIdLoaiSuaChua(cellStr(row, 4));
        kq.setNgayBatDauThucTe(cellStr(row, 5));
        kq.setNgayKetThucThucTe(cellStr(row, 6));
        kq.setIdDonViGiao(cellStr(row, 7));
        kq.setIdDonViNhan(cellStr(row, 8));
        kq.setIdNguoiKyNhay(cellStr(row, 9));
        kq.setTrangThaiKyNhay(parseBool(cellStr(row, 10)));
        kq.setNguoiLapPhieuKyNhay(parseBool(cellStr(row, 11)));
        kq.setIdTrinhDuyetCapPhong(cellStr(row, 12));
        kq.setTrinhDuyetCapPhongXacNhan(parseBool(cellStr(row, 13)));
        kq.setIdTrinhDuyetGiamDoc(cellStr(row, 14));
        kq.setTrinhDuyetGiamDocXacNhan(parseBool(cellStr(row, 15)));
        kq.setIdDonViDeNghi(cellStr(row, 16));
        kq.setDuongDanFile(cellStr(row, 17));
        kq.setTenFile(cellStr(row, 18));
        kq.setTaiLieuBanGhi(cellStr(row, 19));
        kq.setByStep(parseBool(cellStr(row, 20)));
        kq.setSoQuyetDinh(cellStr(row, 21));
        kq.setNguoiTao(cellStr(row, 22));
        kq.setShare(parseBool(cellStr(row, 23)));
        kq.setNgayTao(cellStr(row, 24));
        kq.setCoPhieuBanGiao(parseBool(cellStr(row, 25)));
        kq.setTaiLieuCuoi(cellStr(row, 26));
        kq.setTrangThai(parseInt(cellStr(row, 27)));

        return kq;
    }
}