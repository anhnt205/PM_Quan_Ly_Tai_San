package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietSuaChua;
import com.ecotel.quanlytaisan.model.ChiTietSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class ChiTietSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ChiTietSuaChuaDTO> findByIdSuaChua(String idSuaChua) {
        String sql = """
            SELECT 
                ct.Id,
                ct.IdSuaChua,
                ct.IdTaiSan,
                ts.TenTaiSan,
                ts.KyHieu,
                ts.SoKyHieu,
                ts.DonViTinh,
                ct.SoLuong,
                ct.HienTrang,
                ct.MoTa,
                ct.GhiChu,
                ct.NgayTao,
                ct.NgayCapNhat,
                ct.NguoiTao,
                ct.NguoiCapNhat,
                ct.IsActive
            FROM ChiTietSuaChua ct
                INNER JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
            WHERE ct.IdSuaChua = ?
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietSuaChuaDTO.class), idSuaChua);
    }

    public ChiTietSuaChuaDTO findById(String id) {
        String sql = """
            SELECT 
                ct.Id,
                ct.IdSuaChua,
                ct.IdTaiSan,
                ts.TenTaiSan,
                ts.KyHieu,
                ts.SoKyHieu,
                ts.DonViTinh,
                ct.SoLuong,
                ct.HienTrang,
                ct.MoTa,
                ct.GhiChu,
                ct.NgayTao,
                ct.NgayCapNhat,
                ct.NguoiTao,
                ct.NguoiCapNhat,
                ct.IsActive
            FROM ChiTietSuaChua ct
                INNER JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
            WHERE ct.Id = ?
        """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietSuaChuaDTO.class), id);
    }

    public int insert(ChiTietSuaChua entity) {
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());
        entity.setIsActive(true);
        String sql = """
            INSERT INTO ChiTietSuaChua (Id, IdSuaChua, IdTaiSan, SoLuong, HienTrang, MoTa, GhiChu,
                                        NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdSuaChua(), entity.getIdTaiSan(), entity.getSoLuong(),
                entity.getHienTrang(), entity.getMoTa(), entity.getGhiChu(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(),
                entity.getNguoiCapNhat(), entity.getIsActive());
    }

    public int update(ChiTietSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE ChiTietSuaChua SET
                IdSuaChua = ?, IdTaiSan = ?, SoLuong = ?, HienTrang = ?, MoTa = ?, GhiChu = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ?
            WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getIdSuaChua(), entity.getIdTaiSan(), entity.getSoLuong(),
                entity.getHienTrang(), entity.getMoTa(), entity.getGhiChu(),
                entity.getNgayCapNhat(), entity.getNguoiCapNhat(), entity.getIsActive(),
                entity.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChiTietSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdSuaChua(String idSuaChua) {
        String sql = "DELETE FROM ChiTietSuaChua WHERE IdSuaChua = ?";
        return jdbcTemplate.update(sql, idSuaChua);
    }
}