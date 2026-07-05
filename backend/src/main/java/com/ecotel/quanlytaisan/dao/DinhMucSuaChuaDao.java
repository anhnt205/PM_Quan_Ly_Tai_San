package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DinhMucSuaChua;
import com.ecotel.quanlytaisan.model.DinhMucSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class DinhMucSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final String SELECT_DTO = """
            SELECT 
                dm.*, 
                csc.Ten AS tenLoaiSuaChua
            FROM DinhMucSuaChua dm
            LEFT JOIN LoaiSCBD csc ON dm.IdLoaiSuaChua = csc.Id
            """;

    public List<DinhMucSuaChuaDTO> findAllPaged(int page, int size, String search) {
        int offset = page * size;
        StringBuilder sql = new StringBuilder(SELECT_DTO);
        List<Object> params = new ArrayList<>();

        if (search != null && !search.isEmpty()) {
            sql.append(" WHERE csc.Ten LIKE ? OR dm.GhiChu LIKE ? ");
            String likeParam = "%" + search + "%";
            params.add(likeParam);
            params.add(likeParam);
        }

        sql.append(" ORDER BY dm.NgayTao DESC LIMIT ? OFFSET ?");
        params.add(size);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(DinhMucSuaChuaDTO.class), params.toArray());
    }

    public int countAll(String search) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM DinhMucSuaChua dm LEFT JOIN LoaiSCBD csc ON dm.IdLoaiSuaChua = csc.Id");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.isEmpty()) {
            sql.append(" WHERE csc.Ten LIKE ? OR dm.GhiChu LIKE ? ");
            String likeParam = "%" + search + "%";
            params.add(likeParam);
            params.add(likeParam);
        }

        Integer count = jdbcTemplate.queryForObject(sql.toString(), Integer.class, params.toArray());
        return count != null ? count : 0;
    }

    public DinhMucSuaChuaDTO findById(String id) {
        String sql = SELECT_DTO + " WHERE dm.Id = ?";
        List<DinhMucSuaChuaDTO> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DinhMucSuaChuaDTO.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public DinhMucSuaChuaDTO findDtoByLoaiSuaChuaId(String idLoaiSuaChua) {
        String sql = SELECT_DTO + " WHERE dm.IdLoaiSuaChua = ?";
        List<DinhMucSuaChuaDTO> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DinhMucSuaChuaDTO.class), idLoaiSuaChua);
        return list.isEmpty() ? null : list.get(0);
    }

    public int insert(DinhMucSuaChua dm) {
        if (dm.getId() == null || dm.getId().isEmpty()) {
            dm.setId(UUID.randomUUID().toString());
        }
        String sql = "INSERT INTO DinhMucSuaChua (Id, IdLoaiSuaChua, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, dm.getId(), dm.getIdLoaiSuaChua(), dm.getGhiChu(), dm.getNgayTao(), dm.getNgayCapNhat(), dm.getNguoiTao(), dm.getNguoiCapNhat(), dm.getIsActive());
    }

    public int update(DinhMucSuaChua dm) {
        String sql = "UPDATE DinhMucSuaChua SET IdLoaiSuaChua = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, dm.getIdLoaiSuaChua(), dm.getGhiChu(), dm.getNgayCapNhat(), dm.getNguoiCapNhat(), dm.getIsActive(), dm.getId());
    }

    public DinhMucSuaChua findByLoaiSuaChuaId(String idLoaiSuaChua) {
        String sql = "SELECT * FROM DinhMucSuaChua WHERE IdLoaiSuaChua = ? LIMIT 1";
        List<DinhMucSuaChua> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DinhMucSuaChua.class), idLoaiSuaChua);
        return list.isEmpty() ? null : list.get(0);
    }

    public int delete(String id) {
        String sql = "DELETE FROM DinhMucSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
