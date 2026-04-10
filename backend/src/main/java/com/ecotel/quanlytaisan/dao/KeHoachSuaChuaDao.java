package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KeHoachSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.time.Year;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Repository
public class KeHoachSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static List<KeHoachSuaChuaDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                kh.Id,
                kh.IdCongTy,
                kh.SoKeHoach,
                kh.TenKeHoach,
                kh.IdLoaiKeHoach,
                lkh.TenLoai AS tenLoaiKeHoach,
                kh.IdLoaiSuaChua,
                lsc.Ten AS tenLoaiSuaChua,
                kh.Nam,

                kh.IdDonViLap,
                pbLap.TenPhongBan AS tenDonViLap,

                kh.IdDonViThucHien,
                pbTH.TenPhongBan AS tenDonViThucHien,

                kh.IdNguoiKyNhay,
                nvKyNhay.HoTen AS tenNguoiKyNhay,
                kh.TrangThaiKyNhay,
                kh.NguoiLapPhieuKyNhay,

                kh.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS tenTrinhDuyetCapPhong,
                kh.TrinhDuyetCapPhongXacNhan,

                kh.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS tenTrinhDuyetGiamDoc,
                kh.TrinhDuyetGiamDocXacNhan,

                kh.IdPhongBanXemPhieu,
                pbXem.TenPhongBan AS tenPhongBanXemPhieu,

                kh.NgayBatDau,
                kh.NgayKetThuc,
                kh.TrangThai,
                kh.NgayTao,
                kh.NgayCapNhat,
                kh.NguoiTao,
                nvNguoiTao.HoTen AS tenNguoiTao,
                kh.NguoiCapNhat,

                kh.GhiChu,
                kh.TrichYeu,
                kh.DuongDanFile,
                kh.TenFile,
                kh.NgayKy,
                kh.Share,
                kh.ByStep

            FROM KeHoachSuaChua kh
                LEFT JOIN PhongBan pbLap     ON kh.IdDonViLap            = pbLap.Id
                LEFT JOIN PhongBan pbTH      ON kh.IdDonViThucHien        = pbTH.Id
                LEFT JOIN PhongBan pbXem     ON kh.IdPhongBanXemPhieu     = pbXem.Id
                LEFT JOIN NhanVien nvKyNhay  ON kh.IdNguoiKyNhay          = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON kh.IdTrinhDuyetCapPhong   = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc  ON kh.IdTrinhDuyetGiamDoc    = nvGiamDoc.Id
                LEFT JOIN NhanVien nvNguoiTao ON kh.NguoiTao               = nvNguoiTao.Id
                LEFT JOIN loaikehoach lkh    ON kh.IdLoaiKeHoach           = lkh.Id
                LEFT JOIN LoaiSCBD lsc       ON kh.IdLoaiSuaChua           = lsc.Id
            """;
    }

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(KeHoachSuaChuaDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<KeHoachSuaChuaDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(dto -> idCongTy.equalsIgnoreCase(dto.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public KeHoachSuaChua findById(String id) {
        String sql = "SELECT * FROM KeHoachSuaChua WHERE Id = ?";
        List<KeHoachSuaChua> results = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChua.class), id);
        return results.isEmpty() ? null : results.get(0);
    }

    public KeHoachSuaChuaDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE kh.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaDTO.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    // ==================== ID generation ====================

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "KEHOACH";
        String prefix = "KH-" + currentYear + "-";
        String checkSql = "SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?";
        try {
            var result = jdbcTemplate.queryForMap(checkSql, seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            String maxSql = "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 8) AS UNSIGNED)), 0) FROM KeHoachSuaChua WHERE Id LIKE ?";
            Integer maxSeq = jdbcTemplate.queryForObject(maxSql, Integer.class, prefix + "%");
            int initValue = (maxSeq == null) ? 0 : maxSeq;
            jdbcTemplate.update(
                    "INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    seqName, currentYear, initValue, initValue);
        }
        jdbcTemplate.update("UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?", seqName, currentYear);
        Integer nextSeq = jdbcTemplate.queryForObject("SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);
        return prefix + String.format("%04d", nextSeq);
    }

    // ==================== INSERT ====================

    public KeHoachSuaChua insert(KeHoachSuaChua entity) {
        entity.setId(generateNextId());
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());

        String sql = """
            INSERT INTO KeHoachSuaChua (
                Id, IdCongTy, SoKeHoach, TenKeHoach, IdLoaiKeHoach, IdLoaiSuaChua, Nam,
                IdDonViLap, IdDonViThucHien,
                IdNguoiKyNhay, TrangThaiKyNhay, NguoiLapPhieuKyNhay,
                IdTrinhDuyetCapPhong, TrinhDuyetCapPhongXacNhan,
                IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan,
                IdPhongBanXemPhieu,
                NgayBatDau, NgayKetThuc,
                TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat,
                GhiChu, TrichYeu, DuongDanFile, TenFile, NgayKy,
                Share, ByStep
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?,
                ?, ?, ?,
                ?, ?,
                ?, ?,
                ?,
                ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?
            )
            """;
        int result = jdbcTemplate.update(sql,
                entity.getId(), entity.getIdCongTy(), entity.getSoKeHoach(), entity.getTenKeHoach(),
                entity.getIdLoaiKeHoach(), entity.getIdLoaiSuaChua(), entity.getNam(),
                entity.getIdDonViLap(), entity.getIdDonViThucHien(),
                entity.getIdNguoiKyNhay(), entity.getTrangThaiKyNhay(), entity.getNguoiLapPhieuKyNhay(),
                entity.getIdTrinhDuyetCapPhong(), entity.getTrinhDuyetCapPhongXacNhan(),
                entity.getIdTrinhDuyetGiamDoc(), entity.getTrinhDuyetGiamDocXacNhan(),
                entity.getIdPhongBanXemPhieu(),
                entity.getNgayBatDau(), entity.getNgayKetThuc(),
                entity.getTrangThai() != null ? entity.getTrangThai() : 0,
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(), entity.getNguoiCapNhat(),
                entity.getGhiChu(), entity.getTrichYeu(), entity.getDuongDanFile(),
                entity.getTenFile(), entity.getNgayKy(),
                entity.getShare(), entity.getByStep()
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
            return findById(entity.getId());
        }
        return null;
    }

    // ==================== UPDATE ====================

    public KeHoachSuaChua update(KeHoachSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE KeHoachSuaChua SET
                SoKeHoach = ?, TenKeHoach = ?, IdLoaiKeHoach = ?, IdLoaiSuaChua = ?, Nam = ?,
                IdDonViLap = ?, IdDonViThucHien = ?,
                IdNguoiKyNhay = ?, TrangThaiKyNhay = ?, NguoiLapPhieuKyNhay = ?,
                IdTrinhDuyetCapPhong = ?, TrinhDuyetCapPhongXacNhan = ?,
                IdTrinhDuyetGiamDoc = ?, TrinhDuyetGiamDocXacNhan = ?,
                IdPhongBanXemPhieu = ?,
                NgayBatDau = ?, NgayKetThuc = ?,
                TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?,
                GhiChu = ?, TrichYeu = ?, DuongDanFile = ?, TenFile = ?, NgayKy = ?,
                Share = ?, ByStep = ?
            WHERE Id = ?
            """;
        int result = jdbcTemplate.update(sql,
                entity.getSoKeHoach(), entity.getTenKeHoach(), entity.getIdLoaiKeHoach(),
                entity.getIdLoaiSuaChua(), entity.getNam(),
                entity.getIdDonViLap(), entity.getIdDonViThucHien(),
                entity.getIdNguoiKyNhay(), entity.getTrangThaiKyNhay(), entity.getNguoiLapPhieuKyNhay(),
                entity.getIdTrinhDuyetCapPhong(), entity.getTrinhDuyetCapPhongXacNhan(),
                entity.getIdTrinhDuyetGiamDoc(), entity.getTrinhDuyetGiamDocXacNhan(),
                entity.getIdPhongBanXemPhieu(),
                entity.getNgayBatDau(), entity.getNgayKetThuc(),
                entity.getTrangThai(), entity.getNgayCapNhat(), entity.getNguoiCapNhat(),
                entity.getGhiChu(), entity.getTrichYeu(), entity.getDuongDanFile(),
                entity.getTenFile(), entity.getNgayKy(),
                entity.getShare(), entity.getByStep(),
                entity.getId()
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
            return findById(entity.getId());
        }
        return null;
    }

    // ==================== Trạng thái ====================

    public int updateTrangThai(String id, Integer trangThai) {
        String sql = "UPDATE KeHoachSuaChua SET TrangThai = ?, NgayCapNhat = ? WHERE Id = ?";
        int result = jdbcTemplate.update(sql, trangThai, new Date(), id);
        if (result > 0) CompletableFuture.runAsync(this::refreshCache);
        return result;
    }

    public int huyKeHoach(String id) {
        String sql = "UPDATE KeHoachSuaChua SET TrangThai = 2, NgayCapNhat = ? WHERE Id = ?";
        int result = jdbcTemplate.update(sql, new Date(), id);
        if (result > 0) CompletableFuture.runAsync(this::refreshCache);
        return result;
    }

    // ==================== DELETE ====================

    public int delete(String id) {
        String sql = "DELETE FROM KeHoachSuaChua WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);
        if (result > 0) CompletableFuture.runAsync(this::refreshCache);
        return result;
    }

    public void batchDelete(List<String> ids) {
        String sql = "DELETE FROM KeHoachSuaChua WHERE Id = ?";
        jdbcTemplate.batchUpdate(sql, ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}