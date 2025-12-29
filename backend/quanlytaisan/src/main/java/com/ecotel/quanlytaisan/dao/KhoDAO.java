package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.Kho;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class KhoDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Kho> findAll(String idCongTy) {
        String sql = "SELECT * FROM Kho WHERE IdCongTy = ? AND IsActive = 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Kho.class), idCongTy);
    }

    public List<Kho> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenKho", "NgayTao", "NgayCapNhat"};
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
        
        String sql = "SELECT * FROM Kho WHERE IdCongTy=? AND IsActive = 1 ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Kho.class), idCongTy, size, offset);
    }

    public long countAll(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM Kho WHERE IdCongTy=? AND IsActive = 1";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public Kho findById(String id) {
        String sql = "SELECT * FROM Kho WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Kho.class), id);
    }

    public int insert(Kho kho) {
        // Kiểm tra id không null và không empty
        if (kho.getId() == null || kho.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM Kho WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, kho.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(kho);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO Kho (Id, TenKho, IdQuanLy, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, kho.getId(), kho.getTenKho(), kho.getIdQuanLy(),
                    kho.getIdCongTy(), kho.getNgayTao(), kho.getNgayCapNhat(),
                    kho.getNguoiTao(), kho.getNguoiCapNhat(), kho.getIsActive() != null ? kho.getIsActive() : true);
        }
    }

    public int update(Kho kho) {
        String sql = "UPDATE Kho SET TenKho=?, IdQuanLy=?, IdCongTy=?, NgayCapNhat=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, kho.getTenKho(), kho.getIdQuanLy(), kho.getIdCongTy(),
                kho.getNgayCapNhat(), kho.getNguoiCapNhat(), 
                kho.getIsActive() != null ? kho.getIsActive() : true, kho.getId());
    }

    public int delete(String id) {
        String sql = "UPDATE Kho SET IsActive = 0 WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int insertBatch(List<Kho> khos) {
        String sql = "INSERT INTO Kho (Id, TenKho, IdQuanLy, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE " +
                "TenKho = VALUES(TenKho), " +
                "IdQuanLy = VALUES(IdQuanLy), " +
                "IdCongTy = VALUES(IdCongTy), " +
                "NgayTao = VALUES(NgayTao), " +
                "NgayCapNhat = VALUES(NgayCapNhat), " +
                "NguoiTao = VALUES(NguoiTao), " +
                "NguoiCapNhat = VALUES(NguoiCapNhat), " +
                "IsActive = VALUES(IsActive)";

        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Kho kho = khos.get(i);
                ps.setString(1, kho.getId());
                ps.setString(2, kho.getTenKho());
                ps.setString(3, kho.getIdQuanLy());
                ps.setString(4, kho.getIdCongTy());
                ps.setString(5, kho.getNgayTao());
                ps.setString(6, kho.getNgayCapNhat());
                ps.setString(7, kho.getNguoiTao());
                ps.setString(8, kho.getNguoiCapNhat());
                ps.setBoolean(9, kho.getIsActive() != null ? kho.getIsActive() : true);
            }

            @Override
            public int getBatchSize() {
                return khos.size();
            }
        });
        return results.length;
    }

    public int updateBatch(List<Kho> khos) {
        String sql = "UPDATE Kho SET TenKho=?, IdQuanLy=?, IdCongTy=?, NgayCapNhat=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Kho kho = khos.get(i);
                ps.setString(1, kho.getTenKho());
                ps.setString(2, kho.getIdQuanLy());
                ps.setString(3, kho.getIdCongTy());
                ps.setString(4, kho.getNgayCapNhat());
                ps.setString(5, kho.getNguoiCapNhat());
                ps.setBoolean(6, kho.getIsActive() != null ? kho.getIsActive() : true);
                ps.setString(7, kho.getId());
            }
            
            @Override
            public int getBatchSize() {
                return khos.size();
            }
        });
        return results.length;
    }

    public int deleteBatch(List<String> ids) {
        String sql = "UPDATE Kho SET IsActive = 0 WHERE Id=?";
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
}

