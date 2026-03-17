package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietVatTuDTO;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietVatTu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Year;
import java.util.List;

@Repository
public class KetQuaSuaChuaChiTietVatTuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String prefix = "KQVT-" + currentYear + "-";
        String sql = """
            SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(Id, '-', -1) AS UNSIGNED)), 0) + 1
            FROM ketquasuachua_chitiet_vattu
            WHERE Id LIKE ?
        """;
        try {
            Integer nextSeq = jdbcTemplate.queryForObject(sql, Integer.class, prefix + "%");
            return prefix + String.format("%04d", nextSeq != null ? nextSeq : 1);
        } catch (Exception e) {
            return prefix + "0001";
        }
    }

    public List<KetQuaSuaChuaChiTietVatTuDTO> findByIdKetQuaSuaChuaChiTiet(String idKetQuaSuaChuaChiTiet) {
        String sql = "SELECT vt.*, " +
                    // Nối chuỗi: Ten (SoKyHieu) - NamSanXuat
                    "CONCAT(c.Ten, ' (', ct.SoKyHieu, ') - ', ct.NamSanXuat) AS tenVatTu " +
                    "FROM ketquasuachua_chitiet_vattu vt " +
                    "LEFT JOIN ccdcvattu c ON vt.idCCDC = c.Id " +
                    "LEFT JOIN chitiettaisan ct ON vt.idChiTietCCDC = ct.Id " +
                    "WHERE vt.IdKetQuaSuaChuaChiTiet = ? " +
                    "AND (vt.IsActive IS NULL OR vt.IsActive = 1)";

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaChiTietVatTuDTO.class), idKetQuaSuaChuaChiTiet);
    }

    public KetQuaSuaChuaChiTietVatTu findById(String id) {
        String sql = "SELECT * FROM ketquasuachua_chitiet_vattu WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaChiTietVatTu.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<KetQuaSuaChuaChiTietVatTuDTO> findByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        String sql = "SELECT * FROM ketquasuachua_chitiet_vattu WHERE IdKetQuaSuaChua = ? AND (IsActive IS NULL OR IsActive = 1)";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaChiTietVatTuDTO.class), idKetQuaSuaChua);
    }

    public KetQuaSuaChuaChiTietVatTu insert(KetQuaSuaChuaChiTietVatTu entity) {
        entity.setId(generateNextId());
        String sql = """
            INSERT INTO ketquasuachua_chitiet_vattu (
                Id, IdKetQuaSuaChua, IdKetQuaSuaChuaChiTiet, IdCCDC, IdChiTietCCDC,
                SoLuong, DonGia, ThanhTien, GhiChu, NgayTao, NgayCapNhat,
                NguoiTao, NguoiCapNhat, IsActive, IdNhomCCDC
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdKetQuaSuaChua(),
                entity.getIdKetQuaSuaChuaChiTiet(),
                entity.getIdCcdc(),
                entity.getIdChiTietCcdc(),
                entity.getSoLuong(),
                entity.getDonGia(),
                entity.getThanhTien(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() ? 1 : 0,
                entity.getIdNhomCcdc()
        );
        return entity;
    }

    public KetQuaSuaChuaChiTietVatTu update(KetQuaSuaChuaChiTietVatTu entity) {
        String sql = """
            UPDATE ketquasuachua_chitiet_vattu SET
                IdKetQuaSuaChua = ?, IdKetQuaSuaChuaChiTiet = ?, IdCCDC = ?, IdChiTietCCDC = ?,
                SoLuong = ?, DonGia = ?, ThanhTien = ?, GhiChu = ?,
                NgayTao = ?, NgayCapNhat = ?, NguoiTao = ?, NguoiCapNhat = ?,
                IsActive = ?, IdNhomCCDC = ?
            WHERE Id = ?
        """;
        jdbcTemplate.update(sql,
                entity.getIdKetQuaSuaChua(),
                entity.getIdKetQuaSuaChuaChiTiet(),
                entity.getIdCcdc(),
                entity.getIdChiTietCcdc(),
                entity.getSoLuong(),
                entity.getDonGia(),
                entity.getThanhTien(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive() ? 1 : 0,
                entity.getIdNhomCcdc(),
                entity.getId()
        );
        return entity;
    }

    public int delete(String id) {
        String sql = "DELETE FROM ketquasuachua_chitiet_vattu WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        String sql = "DELETE FROM ketquasuachua_chitiet_vattu WHERE IdKetQuaSuaChua = ?";
        return jdbcTemplate.update(sql, idKetQuaSuaChua);
    }

    public int softDelete(String id) {
        String sql = "UPDATE ketquasuachua_chitiet_vattu SET IsActive = 0 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}