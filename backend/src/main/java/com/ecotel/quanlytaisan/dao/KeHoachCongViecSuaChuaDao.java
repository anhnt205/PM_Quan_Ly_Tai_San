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
    private String upper(String value) {
        return value == null ? null : value.trim().toUpperCase();
    }

    public List<KeHoachCongViecSuaChuaDTO> findByIdKeHoach(String idKeHoach) {
        String sql = """
            SELECT 
                Id,
                IdKeHoach,
                TenCongViec,
                MoTa,
                NguoiThucHien,
                ThoiGianDuKien,
                NgayThucHien,
                NgayTao,
                NgayCapNhat
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
                NgayTao, NgayCapNhat, NguoiThucHien
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdKeHoach(), entity.getTenCongViec(), entity.getMoTa(),
                entity.getThoiGianDuKien(), entity.getNgayThucHien(),
                entity.getNgayTao(), entity.getNgayCapNhat(),
                entity.getNguoiThucHien()
        );
    }

    public int update(KeHoachCongViecSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE KeHoachCongViecSuaChua SET
                TenCongViec = ?, MoTa = ?, ThoiGianDuKien = ?, NgayThucHien = ?,
                NgayCapNhat = ?, NguoiThucHien = ?
            WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getTenCongViec(), entity.getMoTa(), entity.getThoiGianDuKien(), entity.getNgayThucHien(),
                entity.getNgayCapNhat(), entity.getNguoiThucHien(),
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

    //Them nhieu
    public void batchInsert(List<KeHoachCongViecSuaChua> list) {

        String sql = """
        INSERT INTO KeHoachCongViecSuaChua (
            Id, IdKeHoach, TenCongViec, MoTa, ThoiGianDuKien, NgayThucHien,
            NgayTao, NgayCapNhat, NguoiThucHien
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {

            if (entity.getId() == null || entity.getId().isBlank()) {
                entity.setId(UUID.randomUUID().toString());
            }

            entity.setIdKeHoach(upper(entity.getIdKeHoach()));
            entity.setNgayTao(now);
            entity.setNgayCapNhat(now);

            ps.setString(1, entity.getId());
            ps.setString(2, entity.getIdKeHoach());
            ps.setString(3, entity.getTenCongViec());
            ps.setString(4, entity.getMoTa());
            ps.setObject(5, entity.getThoiGianDuKien());
            ps.setObject(6, entity.getNgayThucHien());
            ps.setObject(7, entity.getNgayTao());
            ps.setObject(8, entity.getNgayCapNhat());
            ps.setString(9, entity.getNguoiThucHien());
        });
    }

    public void batchUpdate(List<KeHoachCongViecSuaChua> list) {

        String sql = """
        UPDATE KeHoachCongViecSuaChua SET
            TenCongViec = ?, MoTa = ?, ThoiGianDuKien = ?, NgayThucHien = ?,
            NgayCapNhat = ?, NguoiThucHien = ?
        WHERE Id = ?
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {

            entity.setNgayCapNhat(now);

            ps.setString(1, entity.getTenCongViec());
            ps.setString(2, entity.getMoTa());
            ps.setObject(3, entity.getThoiGianDuKien());
            ps.setObject(4, entity.getNgayThucHien());
            ps.setObject(5, entity.getNgayCapNhat());
            ps.setString(6, entity.getNguoiThucHien());
            ps.setString(7, entity.getId());
        });
    }

    public void batchDelete(List<String> ids) {

        if (ids == null || ids.isEmpty()) return;

        String inSql = String.join(",", Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM KeHoachCongViecSuaChua WHERE Id IN (" + inSql + ")";

        jdbcTemplate.update(sql, ids.toArray());
    }
}