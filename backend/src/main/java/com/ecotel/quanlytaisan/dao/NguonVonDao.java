package com.ecotel.quanlytaisan.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.NguonVon;

@Repository
public class NguonVonDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<NguonVon> findAll(String idCongTy) {
        String sql = "SELECT * FROM NguonVon where IdCongTy = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonVon.class),idCongTy);
    }

    // Thay method findAllPaged hiện tại
    public List<NguonVon> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sortBy an toàn
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "tennguonkinhphi";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "Id";
                break;
            case "ghichu":
                orderColumn = "GhiChu";
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
            case "tennguonkinhphi":
            default:
                orderColumn = "TenNguonKinhPhi";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        // Luôn có WHERE cơ bản
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause += " AND (LOWER(TenNguonKinhPhi) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = """
        SELECT *
        FROM NguonVon
        %s
        ORDER BY %s %s
        LIMIT ? OFFSET ?
        """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonVon.class),
                    idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguonVon.class),
                    idCongTy, limit, offset);
        }
    }

    // Thay method countAll hiện tại
    public long countAll(String idCongTy, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereClause += " AND (LOWER(TenNguonKinhPhi) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = "SELECT COUNT(*) FROM NguonVon " + whereClause;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        }
    }

    public NguonVon findById(String id) {
        String sql = "SELECT * FROM NguonVon WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(NguonVon.class), id);
    }

    public int insert(NguonVon obj) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM NguonVon WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO NguonVon (Id, TenNguonKinhPhi, GhiChu, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                    obj.getId(),
                    obj.getTenNguonKinhPhi(),
                    obj.getGhiChu(),
                    obj.getHieuLuc(),
                    obj.getIdCongTy(),
                    obj.getNgayTao(),
                    obj.getNgayCapNhat(),
                    obj.getNguoiTao(),
                    obj.getNguoiCapNhat(),
                    obj.getIsActive());
        }
    }

    public int update(NguonVon obj) {
        String sql = "UPDATE NguonVon SET TenNguonKinhPhi=?, GhiChu=?, HieuLuc=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? " +
                     "WHERE Id=?";
        return jdbcTemplate.update(sql,
                obj.getTenNguonKinhPhi(),
                obj.getGhiChu(),
                obj.getHieuLuc(),
                obj.getIdCongTy(),
                obj.getNgayTao(),
                obj.getNgayCapNhat(),
                obj.getNguoiTao(),
                obj.getNguoiCapNhat(),
                obj.getIsActive(),
                obj.getId());
    }

    public int batchUpdate(List<NguonVon> list) {
        String sql = "UPDATE NguonVon SET TenNguonKinhPhi=?, GhiChu=?, HieuLuc=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                NguonVon obj = list.get(i);
                ps.setString(1, obj.getTenNguonKinhPhi());
                ps.setString(2, obj.getGhiChu());
                ps.setBoolean(3, obj.getHieuLuc() != null ? obj.getHieuLuc() : false);
                ps.setString(4, obj.getIdCongTy());
                ps.setString(5, obj.getNgayTao());
                ps.setString(6, obj.getNgayCapNhat());
                ps.setString(7, obj.getNguoiTao());
                ps.setString(8, obj.getNguoiCapNhat());
                ps.setBoolean(9, obj.getIsActive() != null ? obj.getIsActive() : false);
                ps.setString(10, obj.getId());
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

    public int batchInsert(List<NguonVon> list) {
        String sql = "INSERT INTO NguonVon (Id, TenNguonKinhPhi, GhiChu, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                NguonVon obj = list.get(i);
                ps.setString(1, obj.getId());
                ps.setString(2, obj.getTenNguonKinhPhi());
                ps.setString(3, obj.getGhiChu());
                ps.setBoolean(4, obj.getHieuLuc() != null ? obj.getHieuLuc() : false);
                ps.setString(5, obj.getIdCongTy());
                ps.setString(6, obj.getNgayTao());
                ps.setString(7, obj.getNgayCapNhat());
                ps.setString(8, obj.getNguoiTao());
                ps.setString(9, obj.getNguoiCapNhat());
                ps.setBoolean(10, obj.getIsActive() != null ? obj.getIsActive() : false);
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

    public int batchCreate(List<NguonVon> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (NguonVon obj : list) {
            if (obj.getId() != null && !obj.getId().trim().isEmpty()) {
                ids.add(obj.getId());
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

        String checkSql = "SELECT Id FROM NguonVon WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<NguonVon> toInsert = new java.util.ArrayList<>();
        List<NguonVon> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (NguonVon obj : list) {
            if (obj.getId() == null || obj.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(obj.getId())) {
                toUpdate.add(obj);
            } else {
                toInsert.add(obj);
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
        String sql = "DELETE FROM NguonVon WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM NguonVon WHERE Id = ?";
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
        String sql = "DELETE FROM NguonVon";
        return jdbcTemplate.update(sql);
    }





}
