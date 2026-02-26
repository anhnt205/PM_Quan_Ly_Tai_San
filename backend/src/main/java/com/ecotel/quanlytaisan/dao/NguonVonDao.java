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

    // Thay method findAllPaged hiện tại
    public List<NguonVon> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sortBy an toàn
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "tennguonkinhphi";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "Id";
                break;
            case "ghichu":
                orderColumn = "GhiChu";
                break;
            case "hieuluc":
                orderColumn = "HieuLuc";
                break;
            case "ngaytao":
                orderColumn = "NgayTao";
                break;
            case "ngaycapnhat":
                orderColumn = "NgayCapNhat";
                break;
            case "tennguonkinhphi":
            default:
                orderColumn = "TenNguonKinhPhi";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        // Luôn có WHERE cơ bản
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause += " AND (LOWER(TenNguonKinhPhi) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = """
        SELECT *
        FROM NguonVon
        %s
        ORDER BY %s %s
        LIMIT ? OFFSET ?
        """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonVon.class),
                    idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonVon.class),
                    idCongTy, limit, offset);
        }
    }

    // Thay method countAll hiện tại
    public long countAll(String idCongTy, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereClause += " AND (LOWER(TenNguonKinhPhi) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = "SELECT COUNT(*) FROM NguonVon " + whereClause;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        }
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




    public int deleteAll() {
        String sql = "DELETE FROM NguonVon";
        return jdbcTemplate.update(sql);
    }





}
