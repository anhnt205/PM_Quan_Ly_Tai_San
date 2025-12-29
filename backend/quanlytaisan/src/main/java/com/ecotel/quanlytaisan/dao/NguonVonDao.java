package com.ecotel.quanlytaisan.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.NguonVon;

@Repository
public class NguonVonDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<NguonVon> findAll(String idCongTy) {
        String sql = "SELECT * FROM NguonVon where IdCongTy = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonVon.class),idCongTy);
    }

    public List<NguonVon> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenNguonKinhPhi", "GhiChu", "HieuLuc", "NgayTao", "NgayCapNhat"};
            for (String column : allowedColumns) {
                if (column.equalsIgnoreCase(sortBy)) {
                    orderBy = column;
                    break;
                }
            }
        }
        
        String direction = "ASC";
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            direction = "DESC";
        }
        
        String sql = "SELECT * FROM NguonVon WHERE IdCongTy=? ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonVon.class), idCongTy, size, offset);
    }

    public long countAll(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM NguonVon WHERE IdCongTy=?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public NguonVon findById(String id) {
        String sql = "SELECT * FROM NguonVon WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(NguonVon.class), id);
    }

    public int insert(NguonVon obj) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM NguonVon WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO NguonVon (Id, TenNguonKinhPhi, GhiChu, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                    obj.getId(),
                    obj.getTenNguonKinhPhi(),
                    obj.getGhiChu(),
                    obj.getHieuLuc(),
                    obj.getIdCongTy(),
                    obj.getNgayTao(),
                    obj.getNgayCapNhat(),
                    obj.getNguoiTao(),
                    obj.getNguoiCapNhat(),
                    obj.getIsActive());
        }
    }

    public int update(NguonVon obj) {
        String sql = "UPDATE NguonVon SET TenNguonKinhPhi=?, GhiChu=?, HieuLuc=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? " +
                     "WHERE Id=?";
        return jdbcTemplate.update(sql,
                obj.getTenNguonKinhPhi(),
                obj.getGhiChu(),
                obj.getHieuLuc(),
                obj.getIdCongTy(),
                obj.getNgayTao(),
                obj.getNgayCapNhat(),
                obj.getNguoiTao(),
                obj.getNguoiCapNhat(),
                obj.getIsActive(),
                obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM NguonVon WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
