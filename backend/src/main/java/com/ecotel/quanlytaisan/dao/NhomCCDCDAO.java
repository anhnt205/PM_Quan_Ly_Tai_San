package com.ecotel.quanlytaisan.dao;
import com.ecotel.quanlytaisan.model.NhomCCDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class NhomCCDCDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<NhomCCDC> findAll(String idCongTy) {
        String sql = "SELECT * FROM NhomCCDC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NhomCCDC.class));
    }

    public List<NhomCCDC> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sortBy an toàn
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ten";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "Id";
                break;
            case "hieuluc":
                orderColumn = "HieuLuc";
                break;
            case "ngaytao":
                orderColumn = "NgayTao";
                break;
            case "ngaycapnhat":
                orderColumn = "NgayCapNhat";
                break;
            case "ten":
            default:
                orderColumn = "Ten";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        // Luôn có WHERE cơ bản
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause += " AND (LOWER(Ten) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = """
        SELECT Id, Ten, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, LaCCDC, LaVatTu
        FROM NhomCCDC
        %s
        ORDER BY %s %s
        LIMIT ? OFFSET ?
        """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NhomCCDC.class),
                    idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NhomCCDC.class),
                    idCongTy, limit, offset);
        }
    }

    public long countAll(String idCongTy, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereClause += " AND (LOWER(Ten) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = "SELECT COUNT(*) FROM NhomCCDC " + whereClause;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        }
    }

    public NhomCCDC findById(String id) {
        String sql = "SELECT * FROM NhomCCDC WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(NhomCCDC.class), id);
    }

    public int insert(NhomCCDC nhom) {
        // Kiểm tra id không null và không empty
        if (nhom.getId() == null || nhom.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM NhomCCDC WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, nhom.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(nhom);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO NhomCCDC (Id, Ten, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, LaCCDC, LaVatTu) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, nhom.getId(), nhom.getTen(), nhom.getHieuLuc() != null ? nhom.getHieuLuc() : true,
                    nhom.getIdCongTy(), nhom.getNgayTao(), nhom.getNgayCapNhat(),
                    nhom.getNguoiTao(), nhom.getNguoiCapNhat(),
                    nhom.getLaCCDC() != null ? nhom.getLaCCDC() : false,
                    nhom.getLaVatTu() != null ? nhom.getLaVatTu() : false);
        }
    }

    public int update(NhomCCDC nhom) {
        String sql = "UPDATE NhomCCDC SET Ten=?, HieuLuc=?, IdCongTy=?, NgayCapNhat=?, NguoiCapNhat=?, LaCCDC=?, LaVatTu=? WHERE Id=?";
        return jdbcTemplate.update(sql, nhom.getTen(), nhom.getHieuLuc() != null ? nhom.getHieuLuc() : true, nhom.getIdCongTy(),
                nhom.getNgayCapNhat(), nhom.getNguoiCapNhat(),
                nhom.getLaCCDC() != null ? nhom.getLaCCDC() : false,
                nhom.getLaVatTu() != null ? nhom.getLaVatTu() : false,
                nhom.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM NhomCCDC WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int insertBatch(List<NhomCCDC> nhomCCDCs) {
        String sql = "INSERT INTO NhomCCDC (Id, Ten, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, LaCCDC, LaVatTu) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE " +
                "Ten = VALUES(Ten), " +
                "HieuLuc = VALUES(HieuLuc), " +
                "IdCongTy = VALUES(IdCongTy), " +
                "NgayTao = VALUES(NgayTao), " +
                "NgayCapNhat = VALUES(NgayCapNhat), " +
                "NguoiTao = VALUES(NguoiTao), " +
                "NguoiCapNhat = VALUES(NguoiCapNhat), " +
                "LaCCDC = VALUES(LaCCDC), " +
                "LaVatTu = VALUES(LaVatTu)";

        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                NhomCCDC nhom = nhomCCDCs.get(i);
                ps.setString(1, nhom.getId());
                ps.setString(2, nhom.getTen());
                ps.setBoolean(3, nhom.getHieuLuc() != null ? nhom.getHieuLuc() : true);
                ps.setString(4, nhom.getIdCongTy());
                ps.setString(5, nhom.getNgayTao());
                ps.setString(6, nhom.getNgayCapNhat());
                ps.setString(7, nhom.getNguoiTao());
                ps.setString(8, nhom.getNguoiCapNhat());
                ps.setBoolean(9, nhom.getLaCCDC() != null ? nhom.getLaCCDC() : false);
                ps.setBoolean(10, nhom.getLaVatTu() != null ? nhom.getLaVatTu() : false);
            }

            @Override
            public int getBatchSize() {
                return nhomCCDCs.size();
            }
        });
        return results.length;
    }

    public int updateBatch(List<NhomCCDC> nhomCCDCs) {
        String sql = "UPDATE NhomCCDC SET Ten=?, HieuLuc=?, IdCongTy=?, NgayCapNhat=?, NguoiCapNhat=?, LaCCDC=?, LaVatTu=? WHERE Id=?";
        int[] results = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                NhomCCDC nhom = nhomCCDCs.get(i);
                ps.setString(1, nhom.getTen());
                ps.setBoolean(2, nhom.getHieuLuc() != null ? nhom.getHieuLuc() : true);
                ps.setString(3, nhom.getIdCongTy());
                ps.setString(4, nhom.getNgayCapNhat());
                ps.setString(5, nhom.getNguoiCapNhat());
                ps.setBoolean(6, nhom.getLaCCDC() != null ? nhom.getLaCCDC() : false);
                ps.setBoolean(7, nhom.getLaVatTu() != null ? nhom.getLaVatTu() : false);
                ps.setString(8, nhom.getId());
            }
            
            @Override
            public int getBatchSize() {
                return nhomCCDCs.size();
            }
        });
        return results.length;
    }

    public int deleteBatch(List<String> ids) {
        String sql = "DELETE FROM NhomCCDC WHERE Id=?";
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
        String sql = "DELETE FROM NhomCCDC";
        return jdbcTemplate.update(sql);
    }




}
