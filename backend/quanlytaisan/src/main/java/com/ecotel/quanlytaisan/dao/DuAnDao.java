
package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DuAn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class DuAnDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<DuAn> rowMapper = new RowMapper<DuAn>() {
        @Override
        public DuAn mapRow(ResultSet rs, int rowNum) throws SQLException {
            DuAn da = new DuAn();
            da.setId(rs.getString("Id"));
            da.setTenDuAn(rs.getString("TenDuAn"));
            da.setGhiChu(rs.getString("GhiChu"));
            da.setHieuLuc(rs.getBoolean("HieuLuc"));
            da.setIdCongTy(rs.getString("IdCongTy"));
            da.setNgayTao(rs.getString("NgayTao"));
            da.setNgayCapNhat(rs.getString("NgayCapNhat"));
            da.setNguoiTao(rs.getString("NguoiTao"));
            da.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            da.setIsActive(rs.getBoolean("IsActive"));
            return da;
        }
    };

    public List<DuAn> findAll(String idCongTy) {
        String sql = "SELECT * FROM DuAn where IdCongTy=?";
        return jdbcTemplate.query(sql, rowMapper,idCongTy);
    }

    public List<DuAn> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenDuAn", "GhiChu", "HieuLuc", "NgayTao", "NgayCapNhat"};
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
        
        String sql = "SELECT * FROM DuAn WHERE IdCongTy=? ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, rowMapper, idCongTy, size, offset);
    }

    public long countAll(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM DuAn WHERE IdCongTy=?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public DuAn findById(String id) {
        String sql = "SELECT * FROM DuAn WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    public int insert(DuAn da) {
        // Kiểm tra id không null và không empty
        if (da.getId() == null || da.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM DuAn WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, da.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(da);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO DuAn (Id, TenDuAn, GhiChu, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, da.getId(), da.getTenDuAn(), da.getGhiChu(), da.getHieuLuc(), da.getIdCongTy(), da.getNgayTao(), da.getNgayCapNhat(), da.getNguoiTao(), da.getNguoiCapNhat(), da.getIsActive());
        }
    }

    public int update(DuAn da) {
        String sql = "UPDATE DuAn SET TenDuAn=?, GhiChu=?, HieuLuc=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, da.getTenDuAn(), da.getGhiChu(), da.getHieuLuc(), da.getIdCongTy(), da.getNgayTao(), da.getNgayCapNhat(), da.getNguoiTao(), da.getNguoiCapNhat(), da.getIsActive(), da.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM DuAn WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
