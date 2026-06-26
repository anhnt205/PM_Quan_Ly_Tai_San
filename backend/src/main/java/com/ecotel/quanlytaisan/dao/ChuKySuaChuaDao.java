package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChuKySuaChua;
import com.ecotel.quanlytaisan.model.ChuKySuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChuKySuaChuaDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<ChuKySuaChua> rowMapper = (rs, rowNum) -> {
        ChuKySuaChua cysc = new ChuKySuaChua();
        cysc.setId(rs.getString("Id"));
        cysc.setIdTaiSan(rs.getString("IdTaiSan"));
        cysc.setIdLoaiSuaChua(rs.getString("IdLoaiSuaChua"));
        cysc.setChuKy(rs.getInt("ChuKy"));
        cysc.setDonViChuKy(rs.getString("DonViChuKy"));
        cysc.setIsInserted(false);
        cysc.setIsDeleted(false);
        return cysc;
    };

    public List<ChuKySuaChua> findByIdTaiSan(String idTaiSan) {
        String sql = "SELECT * FROM ChuKySuaChua WHERE IdTaiSan = ?";
        return jdbcTemplate.query(sql, rowMapper, idTaiSan);
    }

    public List<ChuKySuaChua> findAllByTaiSanIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        String inSql = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));
        String sql = "SELECT * FROM ChuKySuaChua WHERE IdTaiSan IN (" + inSql + ")";
        return jdbcTemplate.query(sql, rowMapper, ids.toArray());
    }

    public ChuKySuaChua findById(String id) {
        String sql = "SELECT * FROM ChuKySuaChua WHERE Id = ?";
        List<ChuKySuaChua> result = jdbcTemplate.query(sql, rowMapper, id);
        return result.isEmpty() ? null : result.get(0);
    }

    public int insert(ChuKySuaChua item) {
        String sql = "INSERT INTO ChuKySuaChua (Id, IdTaiSan, IdLoaiSuaChua, ChuKy, DonViChuKy) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, item.getId(), item.getIdTaiSan(), item.getIdLoaiSuaChua(), item.getChuKy(), item.getDonViChuKy());
    }

    public int update(ChuKySuaChua item) {
        String sql = "UPDATE ChuKySuaChua SET IdTaiSan = ?, IdLoaiSuaChua = ?, ChuKy = ?, DonViChuKy = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, item.getIdTaiSan(), item.getIdLoaiSuaChua(), item.getChuKy(), item.getDonViChuKy(), item.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChuKySuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
    
    public int deleteByIdTaiSan(String idTaiSan) {
        String sql = "DELETE FROM ChuKySuaChua WHERE IdTaiSan = ?";
        return jdbcTemplate.update(sql, idTaiSan);
    }

    public int batchDeleteByIdTaiSan(List<String> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        String placeholders = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM ChuKySuaChua WHERE IdTaiSan IN (" + placeholders + ")";
        return jdbcTemplate.update(sql, ids.toArray());
    }

    public int deleteAll() {
        String sql = "DELETE FROM ChuKySuaChua WHERE IdTaiSan IN (SELECT Id FROM TaiSan)";
        return jdbcTemplate.update(sql);
    }

    public List<ChuKySuaChuaDTO> findPaged(int page, int pageSize, String searchValue) {
        StringBuilder sql = new StringBuilder("""
            SELECT ck.*, ts.TenTaiSan, loai.Ten as TenLoaiSuaChua
            FROM ChuKySuaChua ck
            LEFT JOIN TaiSan ts ON ck.IdTaiSan = ts.Id
            LEFT JOIN LoaiSCBD loai ON ck.IdLoaiSuaChua = loai.Id
            WHERE 1=1
            """);
        
        Object[] params;
        if (searchValue != null && !searchValue.trim().isEmpty()) {
            sql.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ?)");
            String pattern = "%" + searchValue.trim() + "%";
            params = new Object[]{pattern, pattern, pageSize, page * pageSize};
        } else {
            params = new Object[]{pageSize, page * pageSize};
        }
        
        sql.append(" ORDER BY ts.Id ASC, ck.ChuKy ASC LIMIT ? OFFSET ?");
        
        return jdbcTemplate.query(sql.toString(), (rs, rowNum) -> {
            ChuKySuaChuaDTO dto = new ChuKySuaChuaDTO();
            dto.setId(rs.getString("Id"));
            dto.setIdTaiSan(rs.getString("IdTaiSan"));
            dto.setIdLoaiSuaChua(rs.getString("IdLoaiSuaChua"));
            dto.setChuKy(rs.getInt("ChuKy"));
            dto.setDonViChuKy(rs.getString("DonViChuKy"));
            dto.setTenTaiSan(rs.getString("TenTaiSan"));
            dto.setTenLoaiSuaChua(rs.getString("TenLoaiSuaChua"));
            dto.setIsInserted(false);
            dto.setIsDeleted(false);
            return dto;
        }, params);
    }

    public int count(String searchValue) {
        StringBuilder sql = new StringBuilder("""
            SELECT COUNT(*)
            FROM ChuKySuaChua ck
            LEFT JOIN TaiSan ts ON ck.IdTaiSan = ts.Id
            WHERE 1=1
            """);
        
        if (searchValue != null && !searchValue.trim().isEmpty()) {
            sql.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ?)");
            String pattern = "%" + searchValue.trim() + "%";
            Integer count = jdbcTemplate.queryForObject(sql.toString(), Integer.class, pattern, pattern);
            return count != null ? count : 0;
        }
        
        Integer count = jdbcTemplate.queryForObject(sql.toString(), Integer.class);
        return count != null ? count : 0;
    }
}
