package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class LoaiTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<LoaiTaiSan> rowMapper = new RowMapper<LoaiTaiSan>() {
        @Override
        public LoaiTaiSan mapRow(ResultSet rs, int rowNum) throws SQLException {
            LoaiTaiSan lts = new LoaiTaiSan();
            lts.setId(rs.getString("Id"));
            lts.setTenLoaiTaiSan(rs.getString("TenLoaiTaiSan"));
            lts.setIdCongTy(rs.getString("IdCongTy"));
            lts.setNgayTao(rs.getString("NgayTao"));
            lts.setNgayCapNhat(rs.getString("NgayCapNhat"));
            lts.setNguoiTao(rs.getString("NguoiTao"));
            lts.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            lts.setIsActive(rs.getBoolean("IsActive"));
            return lts;
        }
    };

    public List<LoaiTaiSan> findAll(String idCongty) {
        String sql = "SELECT * FROM LoaiTaiSan where IdCongTy=?";
        return jdbcTemplate.query(sql, rowMapper, idCongty);
    }

    public List<LoaiTaiSan> findAllPaged(String idCongty, int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenLoaiTaiSan", "NgayTao", "NgayCapNhat"};
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
        
        String sql = "SELECT * FROM LoaiTaiSan WHERE IdCongTy=? ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, rowMapper, idCongty, size, offset);
    }

    public long countAll(String idCongty) {
        String sql = "SELECT COUNT(*) FROM LoaiTaiSan WHERE IdCongTy=?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongty);
    }

    public LoaiTaiSan findById(String id) {
        String sql = "SELECT * FROM LoaiTaiSan WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    public int insert(LoaiTaiSan lts) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM LoaiTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, lts.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(lts);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO LoaiTaiSan (Id, TenLoaiTaiSan, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, lts.getId(), lts.getTenLoaiTaiSan(), lts.getIdCongTy(), lts.getNgayTao(), lts.getNgayCapNhat(), lts.getNguoiTao(), lts.getNguoiCapNhat(), lts.getIsActive());
        }
    }

    public int update(LoaiTaiSan lts) {
        String sql = "UPDATE LoaiTaiSan SET TenLoaiTaiSan=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, lts.getTenLoaiTaiSan(), lts.getIdCongTy(), lts.getNgayTao(), lts.getNgayCapNhat(), lts.getNguoiTao(), lts.getNguoiCapNhat(), lts.getIsActive(), lts.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM LoaiTaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
