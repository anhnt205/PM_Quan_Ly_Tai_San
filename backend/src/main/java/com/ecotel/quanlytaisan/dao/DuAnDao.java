
package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DuAn;
import com.ecotel.quanlytaisan.model.DuAnEnrichedDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DuAnDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<DuAnEnrichedDTO> enrichedRowMapper = new RowMapper<DuAnEnrichedDTO>() {
        @Override
        public DuAnEnrichedDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            DuAnEnrichedDTO da = new DuAnEnrichedDTO();
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
            da.setTenCongTy(rs.getString("tenCongTy"));
            return da;
        }
    };

    public List<DuAnEnrichedDTO> findAll(String idCongTy) {
        StringBuilder sql = new StringBuilder("""
            SELECT da.*, ct.TenCongTy AS tenCongTy 
            FROM DuAn da 
            LEFT JOIN CongTy ct ON da.IdCongTy = ct.Id
        """);
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" WHERE da.IdCongTy = ?");
            params.add(idCongTy);
        }

        return jdbcTemplate.query(sql.toString(), enrichedRowMapper, params.toArray());
    }

    public List<DuAnEnrichedDTO> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;

        StringBuilder sql = new StringBuilder("""
            SELECT da.*, ct.TenCongTy AS tenCongTy 
            FROM DuAn da 
            LEFT JOIN CongTy ct ON da.IdCongTy = ct.Id 
            WHERE 1=1
        """);
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND da.IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (da.Id LIKE ? OR da.TenDuAn LIKE ? OR da.GhiChu LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        // Sort an toàn
        String orderBy = "da.Id";
        String[] allowed = {"Id", "TenDuAn", "GhiChu", "HieuLuc", "NgayTao", "NgayCapNhat"};
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            for (String col : allowed) {
                if (col.equalsIgnoreCase(sortBy.trim())) {
                    orderBy = "da." + col;
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
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM DuAn WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (Id LIKE ? OR TenDuAn LIKE ? OR GhiChu LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    public DuAnEnrichedDTO findById(String id) {
        String sql = """
            SELECT da.*, ct.TenCongTy AS tenCongTy 
            FROM DuAn da 
            LEFT JOIN CongTy ct ON da.IdCongTy = ct.Id 
            WHERE da.Id = ?
            """;

        List<DuAnEnrichedDTO> results = jdbcTemplate.query(sql, enrichedRowMapper, id);
        if (results.isEmpty()) return null;
        if (results.size() > 1) throw new IllegalStateException("Duplicate ID: " + id);
        return results.get(0);
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




    public int deleteAll() {
        String sql = "DELETE FROM DuAn";
        return jdbcTemplate.update(sql);
    }




}
