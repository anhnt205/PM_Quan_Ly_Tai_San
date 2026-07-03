
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

    public int batchUpdate(List<DuAn> list) {
        String sql = "UPDATE DuAn SET TenDuAn=?, GhiChu=?, HieuLuc=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                DuAn da = list.get(i);
                ps.setString(1, da.getTenDuAn());
                ps.setString(2, da.getGhiChu());
                ps.setBoolean(3, da.getHieuLuc() != null ? da.getHieuLuc() : false);
                ps.setString(4, da.getIdCongTy());
                ps.setString(5, da.getNgayTao());
                ps.setString(6, da.getNgayCapNhat());
                ps.setString(7, da.getNguoiTao());
                ps.setString(8, da.getNguoiCapNhat());
                ps.setBoolean(9, da.getIsActive() != null ? da.getIsActive() : false);
                ps.setString(10, da.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchInsert(List<DuAn> list) {
        String sql = "INSERT INTO DuAn (Id, TenDuAn, GhiChu, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                DuAn da = list.get(i);
                ps.setString(1, da.getId());
                ps.setString(2, da.getTenDuAn());
                ps.setString(3, da.getGhiChu());
                ps.setBoolean(4, da.getHieuLuc() != null ? da.getHieuLuc() : false);
                ps.setString(5, da.getIdCongTy());
                ps.setString(6, da.getNgayTao());
                ps.setString(7, da.getNgayCapNhat());
                ps.setString(8, da.getNguoiTao());
                ps.setString(9, da.getNguoiCapNhat());
                ps.setBoolean(10, da.getIsActive() != null ? da.getIsActive() : false);
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchCreate(List<DuAn> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (DuAn da : list) {
            if (da.getId() != null && !da.getId().trim().isEmpty()) {
                ids.add(da.getId());
            }
        }

        if (ids.isEmpty()) {
            return 0;
        }

        StringBuilder inBuilder = new StringBuilder();
        for (int i = 0; i < ids.size(); i++) {
            inBuilder.append("?");
            if (i < ids.size() - 1) {
                inBuilder.append(",");
            }
        }

        String checkSql = "SELECT Id FROM DuAn WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<DuAn> toInsert = new java.util.ArrayList<>();
        List<DuAn> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (DuAn da : list) {
            if (da.getId() == null || da.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(da.getId())) {
                toUpdate.add(da);
            } else {
                toInsert.add(da);
            }
        }

        int total = 0;
        if (!toInsert.isEmpty()) {
            total += batchInsert(toInsert);
        }
        if (!toUpdate.isEmpty()) {
            total += batchUpdate(toUpdate);
        }

        return total;
    }

    public int delete(String id) {
        String sql = "DELETE FROM DuAn WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM DuAn WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }




    public int deleteAll() {
        String sql = "DELETE FROM DuAn";
        return jdbcTemplate.update(sql);
    }




}
