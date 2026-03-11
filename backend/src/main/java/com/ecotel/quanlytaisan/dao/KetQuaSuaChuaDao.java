package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Year;

@Repository
public class KetQuaSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public KetQuaSuaChuaDTO findByIdSuaChua(String idSuaChua) {
        String sql = """
            SELECT
                kq.Id,
                kq.IdCongTy,
                kq.MaSuaChua,
                kq.TenSuaChua,
                kq.MucDoSuCo,
                kq.MucDoUuTien,
                kq.IdDonViGiao,
                pbGiao.TenPhongBan   AS tenDonViGiao,
                kq.IdDonViNhan,
                pbNhan.TenPhongBan   AS tenDonViNhan,
                kq.IdNguoiKyNhay,
                nvKyNhay.HoTen       AS tenNguoiKyNhay,
                kq.TrangThaiKyNhay,
                kq.NguoiLapPhieuKyNhay,
                kq.NgayKetThucDuKien,
                kq.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen     AS tenTrinhDuyetCapPhong,
                kq.TrinhDuyetCapPhongXacNhan,
                kq.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen      AS tenTrinhDuyetGiamDoc,
                kq.TrinhDuyetGiamDocXacNhan,
                kq.IdDonViDeNghi,
                kq.DuongDanFile,
                kq.TenFile,
                kq.TaiLieuBanGhi,
                kq.ByStep,
                kq.SoQuyetDinh,
                kq.NguoiTao,
                kq.Share,
                kq.NgayTao,
                kq.DaBanGiao,
                kq.CoPhieuBanGiao,
                kq.TaiLieuCuoi,
                kq.Loai,
                kq.TrangThai,
                kq.IdKeHoach,
                kq.NgayCapNhat,
                kq.idLoaiSuaChua,
                kq.GhiChu,
                kq.IdSuaChua,
                kq.ChiPhiPhanCong,
                kq.ChiPhiThueNgoai
            FROM ketquasuachua kq
                LEFT JOIN PhongBan pbGiao    ON kq.IdDonViGiao            = pbGiao.Id
                LEFT JOIN PhongBan pbNhan    ON kq.IdDonViNhan             = pbNhan.Id
                LEFT JOIN NhanVien nvKyNhay  ON kq.IdNguoiKyNhay          = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON kq.IdTrinhDuyetCapPhong   = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc  ON kq.IdTrinhDuyetGiamDoc   = nvGiamDoc.Id
            WHERE kq.IdSuaChua = ?
        """;
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaDTO.class), idSuaChua);
        } catch (Exception e) {
            return null;
        }
    }

    public KetQuaSuaChua findById(String id) {
        String sql = "SELECT * FROM ketquasuachua WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChua.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String prefix = "KQSC-" + currentYear + "-";
        String sql = """
            SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(Id, '-', -1) AS UNSIGNED)), 0) + 1
            FROM ketquasuachua
            WHERE Id LIKE ?
        """;
        try {
            Integer nextSeq = jdbcTemplate.queryForObject(sql, Integer.class, prefix + "%");
            return prefix + String.format("%04d", nextSeq != null ? nextSeq : 1);
        } catch (Exception e) {
            return prefix + "0001";
        }
    }

    public KetQuaSuaChua insert(KetQuaSuaChua entity) {
        entity.setId(generateNextId());

        String sql = """
            INSERT INTO ketquasuachua (
                Id, IdCongTy, MaSuaChua, TenSuaChua, MucDoSuCo, MucDoUuTien,
                IdDonViGiao, IdDonViNhan, IdNguoiKyNhay, TrangThaiKyNhay,
                NguoiLapPhieuKyNhay, NgayKetThucDuKien, IdTrinhDuyetCapPhong,
                TrinhDuyetCapPhongXacNhan, IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan,
                IdDonViDeNghi, DuongDanFile, TenFile, TaiLieuBanGhi, ByStep,
                SoQuyetDinh, NguoiTao, Share, NgayTao, DaBanGiao, CoPhieuBanGiao,
                TaiLieuCuoi, Loai, TrangThai, IdKeHoach, NgayCapNhat,
                idLoaiSuaChua, GhiChu, IdSuaChua, ChiPhiPhanCong, ChiPhiThueNgoai
            ) VALUES (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?
            )
        """;

        jdbcTemplate.update(sql,
                entity.getId(), entity.getIdCongTy(), entity.getMaSuaChua(),
                entity.getTenSuaChua(), entity.getMucDoSuCo(), entity.getMucDoUuTien(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay() ? 1 : 0,
                entity.getNguoiLapPhieuKyNhay() ? 1 : 0,
                entity.getNgayKetThucDuKien(), entity.getIdTrinhDuyetCapPhong(),
                entity.getTrinhDuyetCapPhongXacNhan() ? 1 : 0,
                entity.getIdTrinhDuyetGiamDoc(),
                entity.getTrinhDuyetGiamDocXacNhan() ? 1 : 0,
                entity.getIdDonViDeNghi(), entity.getDuongDanFile(), entity.getTenFile(),
                entity.getTaiLieuBanGhi(), entity.getByStep() ? 1 : 0,
                entity.getSoQuyetDinh(), entity.getNguoiTao(),
                entity.getShare() ? 1 : 0,
                entity.getNgayTao(),
                entity.getDaBanGiao() ? 1 : 0,
                entity.getCoPhieuBanGiao() ? 1 : 0,
                entity.getTaiLieuCuoi(), entity.getLoai(), entity.getTrangThai(),
                entity.getIdKeHoach(), entity.getNgayCapNhat(),
                entity.getIdLoaiSuaChua(), entity.getGhiChu(), entity.getIdSuaChua(),
                entity.getChiPhiPhanCong(), entity.getChiPhiThueNgoai()
        );

        return entity;
    }

    public KetQuaSuaChua update(KetQuaSuaChua entity) {
        String sql = """
            UPDATE ketquasuachua SET
                IdCongTy = ?, MaSuaChua = ?, TenSuaChua = ?, MucDoSuCo = ?, MucDoUuTien = ?,
                IdDonViGiao = ?, IdDonViNhan = ?, IdNguoiKyNhay = ?, TrangThaiKyNhay = ?,
                NguoiLapPhieuKyNhay = ?, NgayKetThucDuKien = ?, IdTrinhDuyetCapPhong = ?,
                TrinhDuyetCapPhongXacNhan = ?, IdTrinhDuyetGiamDoc = ?, TrinhDuyetGiamDocXacNhan = ?,
                IdDonViDeNghi = ?, DuongDanFile = ?, TenFile = ?, TaiLieuBanGhi = ?, ByStep = ?,
                SoQuyetDinh = ?, NguoiTao = ?, Share = ?, NgayTao = ?, DaBanGiao = ?,
                CoPhieuBanGiao = ?, TaiLieuCuoi = ?, Loai = ?, TrangThai = ?, IdKeHoach = ?,
                NgayCapNhat = ?, idLoaiSuaChua = ?, GhiChu = ?, IdSuaChua = ?,
                ChiPhiPhanCong = ?, ChiPhiThueNgoai = ?
            WHERE Id = ?
        """;

        jdbcTemplate.update(sql,
                entity.getIdCongTy(), entity.getMaSuaChua(), entity.getTenSuaChua(),
                entity.getMucDoSuCo(), entity.getMucDoUuTien(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay() ? 1 : 0,
                entity.getNguoiLapPhieuKyNhay() ? 1 : 0,
                entity.getNgayKetThucDuKien(), entity.getIdTrinhDuyetCapPhong(),
                entity.getTrinhDuyetCapPhongXacNhan() ? 1 : 0,
                entity.getIdTrinhDuyetGiamDoc(),
                entity.getTrinhDuyetGiamDocXacNhan() ? 1 : 0,
                entity.getIdDonViDeNghi(), entity.getDuongDanFile(), entity.getTenFile(),
                entity.getTaiLieuBanGhi(), entity.getByStep() ? 1 : 0,
                entity.getSoQuyetDinh(), entity.getNguoiTao(),
                entity.getShare() ? 1 : 0,
                entity.getNgayTao(),
                entity.getDaBanGiao() ? 1 : 0,
                entity.getCoPhieuBanGiao() ? 1 : 0,
                entity.getTaiLieuCuoi(), entity.getLoai(), entity.getTrangThai(),
                entity.getIdKeHoach(), entity.getNgayCapNhat(),
                entity.getIdLoaiSuaChua(), entity.getGhiChu(), entity.getIdSuaChua(),
                entity.getChiPhiPhanCong(), entity.getChiPhiThueNgoai(),
                entity.getId()
        );

        return entity;
    }

    public int delete(String id) {
        String sql = "DELETE FROM ketquasuachua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}