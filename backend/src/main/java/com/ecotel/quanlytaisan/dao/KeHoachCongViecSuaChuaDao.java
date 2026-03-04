package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public class KeHoachCongViecSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<KeHoachCongViecSuaChuaDTO> findByIdKeHoach(String idKeHoach) {
        String sql = """
            SELECT 
                Id,
                IdKeHoach,
                TenCongViec,
                MoTa,
                ThoiGianDuKien,
                NgayThucHien,
                NgayTao,
                NgayCapNhat,
                TrangThai
            FROM KeHoachCongViecSuaChua
            WHERE IdKeHoach = ?
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachCongViecSuaChuaDTO.class), idKeHoach);
    }

    public KeHoachCongViecSuaChuaDTO findById(String id) {
        String sql = "SELECT * FROM KeHoachCongViecSuaChua WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KeHoachCongViecSuaChuaDTO.class), id);
    }

    public int insert(KeHoachCongViecSuaChua entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(UUID.randomUUID().toString());
        }
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());
        String sql = """
            INSERT INTO KeHoachCongViecSuaChua (
                Id, IdKeHoach, TenCongViec, MoTa, ThoiGianDuKien, NgayThucHien,
                NgayTao, NgayCapNhat, TrangThai, NguoiThucHien
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdKeHoach(), entity.getTenCongViec(), entity.getMoTa(),
                entity.getThoiGianDuKien(), entity.getNgayThucHien(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getTrangThai(),
                entity.getNguoiThucHien()
        );
    }

    public int update(KeHoachCongViecSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE KeHoachCongViecSuaChua SET
                TenCongViec = ?, MoTa = ?, ThoiGianDuKien = ?, NgayThucHien = ?,
                NgayCapNhat = ?, TrangThai = ?, NguoiThucHien = ?
            WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getTenCongViec(), entity.getMoTa(), entity.getThoiGianDuKien(), entity.getNgayThucHien(),
                entity.getNgayCapNhat(), entity.getTrangThai(), entity.getNguoiThucHien(),
                entity.getId()
        );
    }

    public int delete(String id) {
        String sql = "DELETE FROM KeHoachCongViecSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdKeHoach(String idKeHoach) {
        String sql = "DELETE FROM KeHoachCongViecSuaChua WHERE IdKeHoach = ?";
        return jdbcTemplate.update(sql, idKeHoach);
    }

    public void deleteByIdKeHoachIn(List<String> ids) {
        String inSql = String.join(",", Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM KeHoachCongViecSuaChua WHERE IdKeHoach IN (" + inSql + ")";
        jdbcTemplate.update(sql, ids.toArray());
    }
}