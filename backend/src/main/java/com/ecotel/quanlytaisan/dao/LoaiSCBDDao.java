package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiSCBD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class LoaiSCBDDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<LoaiSCBD> findAllPaged(int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sortBy an toàn
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ten";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "lcsbd.Id";
                break;
            case "ten":
            default:
                orderColumn = "lcsbd.Ten";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        // Luôn có WHERE cơ bản
        String whereClause = "WHERE 1=1";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause += " AND (LOWER(lcsbd.Ten) LIKE LOWER(?) OR LOWER(lcsbd.Id) LIKE LOWER(?))";
        }

        String sql = """
        SELECT lcsbd.Id,
               lcsbd.Ten,
               lcsbd.GhiChu
        FROM LoaiSCBD AS lcsbd
        %s
        ORDER BY %s %s
        LIMIT ? OFFSET ?
        """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LoaiSCBD.class),
                    searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LoaiSCBD.class),
                    limit, offset);
        }
    }

    // Thay method countAll hiện tại bằng cái này
    public long countAll(String keyword) {
        String whereClause = "WHERE 1=1";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereClause += " AND (LOWER(Ten) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = "SELECT COUNT(*) FROM LoaiSCBD " + whereClause;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class);
        }
    }

    public List<LoaiSCBD> findAll() {
        String sql = "SELECT * FROM LoaiSCBD";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LoaiSCBD.class));
    }

    public LoaiSCBD findById(String id) {
        String sql = "SELECT * FROM LoaiSCBD WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(LoaiSCBD.class), id);
    }

    public int insert(LoaiSCBD loaiSCBD) {
        // Kiểm tra id không null và không empty
        if (loaiSCBD.getId() == null || loaiSCBD.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM LoaiSCBD WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, loaiSCBD.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(loaiSCBD);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO LoaiSCBD (Id, Ten, GhiChu) VALUES (?, ?, ?)";
            return jdbcTemplate.update(sql, loaiSCBD.getId(), loaiSCBD.getTen(), loaiSCBD.getGhiChu());
        }
    }

    public int update(LoaiSCBD loaiSCBD) {
        String sql = "UPDATE LoaiSCBD SET Ten=?, GhiChu=? WHERE Id=?";
        return jdbcTemplate.update(sql, loaiSCBD.getTen(), loaiSCBD.getGhiChu(), loaiSCBD.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM LoaiSCBD WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int insertBatch(List<LoaiSCBD> loaiSCBDs) {
        String sql = "INSERT INTO LoaiSCBD (Id, Ten, GhiChu) VALUES (?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE " +
                "Ten = VALUES(Ten), GhiChu = VALUES(GhiChu)";

        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LoaiSCBD loaiSCBD = loaiSCBDs.get(i);
                ps.setString(1, loaiSCBD.getId());
                ps.setString(2, loaiSCBD.getTen());
                ps.setString(3, loaiSCBD.getGhiChu());
            }

            @Override
            public int getBatchSize() {
                return loaiSCBDs.size();
            }
        });
        return results.length;
    }

    public int updateBatch(List<LoaiSCBD> loaiSCBDs) {
        String sql = "UPDATE LoaiSCBD SET Ten=?, GhiChu=? WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LoaiSCBD loaiSCBD = loaiSCBDs.get(i);
                ps.setString(1, loaiSCBD.getTen());
                ps.setString(2, loaiSCBD.getGhiChu());
                ps.setString(3, loaiSCBD.getId());
            }

            @Override
            public int getBatchSize() {
                return loaiSCBDs.size();
            }
        });
        return results.length;
    }

    public int deleteBatch(List<String> ids) {
        String sql = "DELETE FROM LoaiSCBD WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });
        return results.length;
    }


    public int deleteAll() {
        String sql = "DELETE FROM LoaiSCBD";
        return jdbcTemplate.update(sql);
    }


}
