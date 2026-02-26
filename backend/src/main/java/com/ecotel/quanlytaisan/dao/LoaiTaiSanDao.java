package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiTaiSan;
import com.ecotel.quanlytaisan.model.LoaiTaiSanEnrichedDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class LoaiTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<LoaiTaiSanEnrichedDTO> enrichedRowMapper = (rs, rowNum) -> {
        LoaiTaiSanEnrichedDTO lts = new LoaiTaiSanEnrichedDTO();
        lts.setId(rs.getString("Id"));
        lts.setTenLoaiTaiSan(rs.getString("TenLoaiTaiSan"));
        lts.setIdCongTy(rs.getString("IdCongTy"));
        lts.setNgayTao(rs.getString("NgayTao"));
        lts.setNgayCapNhat(rs.getString("NgayCapNhat"));
        lts.setNguoiTao(rs.getString("NguoiTao"));
        lts.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
        lts.setIsActive(rs.getBoolean("IsActive"));
        lts.setTenCongTy(rs.getString("tenCongTy"));
        return lts;
    };

    public List<LoaiTaiSanEnrichedDTO> findAll(String idCongTy) {
        StringBuilder sql = new StringBuilder("""
            SELECT lts.*, ct.TenCongTy AS tenCongTy 
            FROM LoaiTaiSan lts 
            LEFT JOIN CongTy ct ON lts.IdCongTy = ct.Id
        """);
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" WHERE lts.IdCongTy = ?");
            params.add(idCongTy);
        }

        return jdbcTemplate.query(sql.toString(), enrichedRowMapper, params.toArray());
    }

    public List<LoaiTaiSanEnrichedDTO> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;

        StringBuilder sql = new StringBuilder("""
            SELECT lts.*, ct.TenCongTy AS tenCongTy 
            FROM LoaiTaiSan lts 
            LEFT JOIN CongTy ct ON lts.IdCongTy = ct.Id 
            WHERE 1=1
        """);
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND lts.IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (lts.Id LIKE ? OR lts.TenLoaiTaiSan LIKE ?)");
            params.add(keyword);
            params.add(keyword);
        }

        // Sort an toàn
        String orderBy = "lts.Id";
        String[] allowed = {"Id", "TenLoaiTaiSan", "NgayTao", "NgayCapNhat"};
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            for (String col : allowed) {
                if (col.equalsIgnoreCase(sortBy.trim())) {
                    orderBy = "lts." + col;
                    break;
                }
            }
        }
        String direction = (sortDir != null && sortDir.trim().equalsIgnoreCase("desc")) ? "DESC" : "ASC";

        sql.append(" ORDER BY ").append(orderBy).append(" ").append(direction)
                .append(" LIMIT ? OFFSET ?");
        params.add(size);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), enrichedRowMapper, params.toArray());
    }

    public long countAll(String idCongTy, String search) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM LoaiTaiSan lts WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND lts.IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (lts.Id LIKE ? OR lts.TenLoaiTaiSan LIKE ?)");
            params.add(keyword);
            params.add(keyword);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    public LoaiTaiSanEnrichedDTO findById(String id) {
        String sql = """
            SELECT lts.*, ct.TenCongTy AS tenCongTy 
            FROM LoaiTaiSan lts 
            LEFT JOIN CongTy ct ON lts.IdCongTy = ct.Id 
            WHERE lts.Id = ?
            """;

        List<LoaiTaiSanEnrichedDTO> results = jdbcTemplate.query(sql, enrichedRowMapper, id);
        if (results.isEmpty()) return null;
        if (results.size() > 1) throw new IllegalStateException("Duplicate ID: " + id);
        return results.get(0);
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




    public int deleteAll() {
        String sql = "DELETE FROM LoaiTaiSan";
        return jdbcTemplate.update(sql);
    }




}
