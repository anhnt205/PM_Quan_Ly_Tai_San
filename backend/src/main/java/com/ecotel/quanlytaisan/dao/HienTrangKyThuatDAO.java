package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.HienTrangKyThuat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class HienTrangKyThuatDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<HienTrangKyThuat> rowMapper = new RowMapper<HienTrangKyThuat>() {
        @Override
        public HienTrangKyThuat mapRow(ResultSet rs, int rowNum) throws SQLException {
            HienTrangKyThuat htkt = new HienTrangKyThuat();
            htkt.setId(rs.getInt("Id"));
            htkt.setTenHTKT(rs.getString("TenHTKT"));
            htkt.setMoTa(rs.getString("MoTa"));
            htkt.setNgayTao(rs.getString("NgayTao"));
            htkt.setNgayCapNhat(rs.getString("NgayCapNhat"));
            htkt.setNguoiTao(rs.getString("NguoiTao"));
            htkt.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            htkt.setIsActive(rs.getBoolean("IsActive"));
            return htkt;
        }
    };

    public List<HienTrangKyThuat> findAll() {
        String sql = "SELECT * FROM HienTrangKyThuat WHERE IsActive = 1";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<HienTrangKyThuat> findAllIncludeInactive() {
        String sql = "SELECT * FROM HienTrangKyThuat";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public HienTrangKyThuat findById(Integer id) {
        String sql = "SELECT * FROM HienTrangKyThuat WHERE Id = ?";
        List<HienTrangKyThuat> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? null : results.get(0);
    }

    public int insert(HienTrangKyThuat htkt) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM HienTrangKyThuat WHERE Id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, htkt.getId());

        if (count != null && count > 0) {
            // Nếu tồn tại thì update
            return update(htkt);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO HienTrangKyThuat (Id, TenHTKT, MoTa, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                htkt.getId(),
                htkt.getTenHTKT(),
                htkt.getMoTa(),
                htkt.getNgayTao(),
                htkt.getNgayCapNhat(),
                htkt.getNguoiTao(),
                htkt.getNguoiCapNhat(),
                htkt.getIsActive() != null ? htkt.getIsActive() : true);
        }
    }

    public int update(HienTrangKyThuat htkt) {
        String sql = "UPDATE HienTrangKyThuat SET TenHTKT=?, MoTa=?, NgayCapNhat=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql,
            htkt.getTenHTKT(),
            htkt.getMoTa(),
            htkt.getNgayCapNhat(),
            htkt.getNguoiCapNhat(),
            htkt.getIsActive(),
            htkt.getId());
    }

    public int delete(Integer id) {
        String sql = "DELETE FROM HienTrangKyThuat WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int softDelete(Integer id) {
        String sql = "UPDATE HienTrangKyThuat SET IsActive = 0 WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public long count(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM HienTrangKyThuat WHERE IsActive = 1";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = """
                SELECT COUNT(*)
                FROM HienTrangKyThuat
                WHERE IsActive = 1
                    AND (
                        LOWER(TenHTKT) LIKE LOWER(?) OR
                        LOWER(MoTa) LIKE LOWER(?)
                    )
                """;
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        }
    }

    public List<HienTrangKyThuat> findAllPaged(int offset, int limit, String sortBy, String sortDir, String keyword) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tenhtkt":
                orderColumn = "TenHTKT";
                break;
            case "ngaytao":
                orderColumn = "NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "NgayCapNhat";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = "WHERE IsActive = 1";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += """
                     AND (
                        LOWER(TenHTKT) LIKE LOWER(?) OR
                        LOWER(MoTa) LIKE LOWER(?)
                    )
                """;
        }

        String sql = String.format("""
                SELECT * FROM HienTrangKyThuat
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, rowMapper, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, rowMapper, limit, offset);
        }
    }



    public int deleteAll() {
        String sql = "DELETE FROM HienTrangKyThuat";
        return jdbcTemplate.update(sql);
    }



}
