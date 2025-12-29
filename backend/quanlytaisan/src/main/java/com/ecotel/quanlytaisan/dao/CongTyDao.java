package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.CongTy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CongTyDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<CongTy> rowMapper = new RowMapper<CongTy>() {
        @Override
        public CongTy mapRow(ResultSet rs, int rowNum) throws SQLException {
            CongTy ct = new CongTy();
            ct.setId(rs.getString("Id"));
            ct.setTenCongTy(rs.getString("TenCongTy"));
            ct.setTenVietTat(rs.getString("TenVietTat"));
            ct.setEmail(rs.getString("Email"));
            ct.setQuocGiaTruSoChinh(rs.getString("QuocGiaTruSoChinh"));
            ct.setTinhThanhTruSoChinh(rs.getString("TinhThanhTruSoChinh"));
            ct.setXaPhuongTruSoChinh(rs.getString("XaPhuongTruSoChinh"));
            ct.setDiaChiKhacTruSoChinh(rs.getString("DiaChiKhacTruSoChinh"));
            ct.setLogoCongTy(rs.getString("LogoCongTy"));
            ct.setMaSoThue(rs.getString("MaSoThue"));
            ct.setWebsite(rs.getString("Website"));
            ct.setSoDienThoai(rs.getString("SoDienThoai"));
            ct.setNgayTao(rs.getString("NgayTao"));
            ct.setNgayCapNhat(rs.getString("NgayCapNhat"));
            ct.setNguoiTao(rs.getString("NguoiTao"));
            ct.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            return ct;
        }
    };

    public List<CongTy> findAll() {
        String sql = "SELECT * FROM CongTy";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<CongTy> findAllPaged(int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenCongTy", "TenVietTat", "Email", "MaSoThue", "NgayTao", "NgayCapNhat"};
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
        
        String sql = "SELECT * FROM CongTy ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, rowMapper, size, offset);
    }

    public long countAll() {
        String sql = "SELECT COUNT(*) FROM CongTy";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public CongTy findById(String id) {
        String sql = "SELECT * FROM CongTy WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    public int insert(CongTy ct) {
        // Kiểm tra id không null và không empty
        if (ct.getId() == null || ct.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM CongTy WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, ct.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(ct);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO CongTy (Id, TenCongTy, TenVietTat, Email, QuocGiaTruSoChinh, TinhThanhTruSoChinh, XaPhuongTruSoChinh, DiaChiKhacTruSoChinh, LogoCongTy, MaSoThue, Website, SoDienThoai, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, ct.getId(), ct.getTenCongTy(), ct.getTenVietTat(), ct.getEmail(), ct.getQuocGiaTruSoChinh(), ct.getTinhThanhTruSoChinh(), ct.getXaPhuongTruSoChinh(), ct.getDiaChiKhacTruSoChinh(), ct.getLogoCongTy(), ct.getMaSoThue(), ct.getWebsite(), ct.getSoDienThoai(), ct.getNguoiTao(), ct.getNguoiCapNhat(), ct.getIsActive());
        }
    }

    public int update(CongTy ct) {
        String sql = "UPDATE CongTy SET TenCongTy=?, TenVietTat=?, Email=?, QuocGiaTruSoChinh=?, TinhThanhTruSoChinh=?, XaPhuongTruSoChinh=?, DiaChiKhacTruSoChinh=?, LogoCongTy=?, MaSoThue=?, Website=?, SoDienThoai=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, ct.getTenCongTy(), ct.getTenVietTat(), ct.getEmail(), ct.getQuocGiaTruSoChinh(), ct.getTinhThanhTruSoChinh(), ct.getXaPhuongTruSoChinh(), ct.getDiaChiKhacTruSoChinh(), ct.getLogoCongTy(), ct.getMaSoThue(), ct.getWebsite(), ct.getSoDienThoai(), ct.getNguoiTao(), ct.getNguoiCapNhat(), ct.getIsActive(), ct.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM CongTy WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
