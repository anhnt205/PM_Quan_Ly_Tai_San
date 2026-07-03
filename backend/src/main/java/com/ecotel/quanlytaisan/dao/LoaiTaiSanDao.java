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

    public int batchUpdate(List<LoaiTaiSan> list) {
        String sql = "UPDATE LoaiTaiSan SET TenLoaiTaiSan=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                LoaiTaiSan lts = list.get(i);
                ps.setString(1, lts.getTenLoaiTaiSan());
                ps.setString(2, lts.getIdCongTy());
                ps.setString(3, lts.getNgayTao());
                ps.setString(4, lts.getNgayCapNhat());
                ps.setString(5, lts.getNguoiTao());
                ps.setString(6, lts.getNguoiCapNhat());
                ps.setBoolean(7, lts.getIsActive() != null ? lts.getIsActive() : false);
                ps.setString(8, lts.getId());
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

    public int batchInsert(List<LoaiTaiSan> list) {
        String sql = "INSERT INTO LoaiTaiSan (Id, TenLoaiTaiSan, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                LoaiTaiSan lts = list.get(i);
                ps.setString(1, lts.getId());
                ps.setString(2, lts.getTenLoaiTaiSan());
                ps.setString(3, lts.getIdCongTy());
                ps.setString(4, lts.getNgayTao());
                ps.setString(5, lts.getNgayCapNhat());
                ps.setString(6, lts.getNguoiTao());
                ps.setString(7, lts.getNguoiCapNhat());
                ps.setBoolean(8, lts.getIsActive() != null ? lts.getIsActive() : false);
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

    public int batchCreate(List<LoaiTaiSan> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (LoaiTaiSan lts : list) {
            if (lts.getId() != null && !lts.getId().trim().isEmpty()) {
                ids.add(lts.getId());
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

        String checkSql = "SELECT Id FROM LoaiTaiSan WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<LoaiTaiSan> toInsert = new java.util.ArrayList<>();
        List<LoaiTaiSan> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (LoaiTaiSan lts : list) {
            if (lts.getId() == null || lts.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(lts.getId())) {
                toUpdate.add(lts);
            } else {
                toInsert.add(lts);
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
        String sql = "DELETE FROM LoaiTaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM LoaiTaiSan WHERE Id=?";
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
        String sql = "DELETE FROM LoaiTaiSan";
        return jdbcTemplate.update(sql);
    }




}
