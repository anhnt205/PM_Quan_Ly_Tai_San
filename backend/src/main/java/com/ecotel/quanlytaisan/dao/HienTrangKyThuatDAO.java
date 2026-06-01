package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.HienTrangKyThuat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class HienTrangKyThuatDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<HienTrangKyThuat> rowMapper = new RowMapper<HienTrangKyThuat>() {
        @Override
        public HienTrangKyThuat mapRow(ResultSet rs, int rowNum) throws SQLException {
            HienTrangKyThuat htkt = new HienTrangKyThuat();
            htkt.setId(rs.getInt("Id"));
            htkt.setTenHTKT(rs.getString("TenHTKT"));
            htkt.setMoTa(rs.getString("MoTa"));
            htkt.setNgayTao(rs.getString("NgayTao"));
            htkt.setNgayCapNhat(rs.getString("NgayCapNhat"));
            htkt.setNguoiTao(rs.getString("NguoiTao"));
            htkt.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            htkt.setIsActive(rs.getBoolean("IsActive"));
            return htkt;
        }
    };

    public List<HienTrangKyThuat> findAll() {
        String sql = "SELECT * FROM HienTrangKyThuat WHERE IsActive = 1";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<HienTrangKyThuat> findAllIncludeInactive() {
        String sql = "SELECT * FROM HienTrangKyThuat";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public HienTrangKyThuat findById(Integer id) {
        String sql = "SELECT * FROM HienTrangKyThuat WHERE Id = ?";
        List<HienTrangKyThuat> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? null : results.get(0);
    }

    public int insert(HienTrangKyThuat htkt) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM HienTrangKyThuat WHERE Id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, htkt.getId());

        if (count != null && count > 0) {
            // Nếu tồn tại thì update
            return update(htkt);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO HienTrangKyThuat (Id, TenHTKT, MoTa, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                htkt.getId(),
                htkt.getTenHTKT(),
                htkt.getMoTa(),
                htkt.getNgayTao(),
                htkt.getNgayCapNhat(),
                htkt.getNguoiTao(),
                htkt.getNguoiCapNhat(),
                htkt.getIsActive() != null ? htkt.getIsActive() : true);
        }
    }

    public int update(HienTrangKyThuat htkt) {
        String sql = "UPDATE HienTrangKyThuat SET TenHTKT=?, MoTa=?, NgayCapNhat=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql,
            htkt.getTenHTKT(),
            htkt.getMoTa(),
            htkt.getNgayCapNhat(),
            htkt.getNguoiCapNhat(),
            htkt.getIsActive(),
            htkt.getId());
    }

    public int batchUpdate(List<HienTrangKyThuat> list) {
        String sql = "UPDATE HienTrangKyThuat SET TenHTKT=?, MoTa=?, NgayCapNhat=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                HienTrangKyThuat htkt = list.get(i);
                ps.setString(1, htkt.getTenHTKT());
                ps.setString(2, htkt.getMoTa());
                ps.setString(3, htkt.getNgayCapNhat());
                ps.setString(4, htkt.getNguoiCapNhat());
                ps.setBoolean(5, htkt.getIsActive() != null ? htkt.getIsActive() : true);
                if (htkt.getId() != null) {
                    ps.setInt(6, htkt.getId());
                } else {
                    ps.setNull(6, java.sql.Types.INTEGER);
                }
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

    public int batchInsert(List<HienTrangKyThuat> list) {
        String sql = "INSERT INTO HienTrangKyThuat (Id, TenHTKT, MoTa, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                HienTrangKyThuat htkt = list.get(i);
                if (htkt.getId() != null) {
                    ps.setInt(1, htkt.getId());
                } else {
                    ps.setNull(1, java.sql.Types.INTEGER);
                }
                ps.setString(2, htkt.getTenHTKT());
                ps.setString(3, htkt.getMoTa());
                ps.setString(4, htkt.getNgayTao());
                ps.setString(5, htkt.getNgayCapNhat());
                ps.setString(6, htkt.getNguoiTao());
                ps.setString(7, htkt.getNguoiCapNhat());
                ps.setBoolean(8, htkt.getIsActive() != null ? htkt.getIsActive() : true);
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

    public int batchCreate(List<HienTrangKyThuat> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<Integer> ids = new java.util.ArrayList<>();
        for (HienTrangKyThuat htkt : list) {
            if (htkt.getId() != null) {
                ids.add(htkt.getId());
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

        String checkSql = "SELECT Id FROM HienTrangKyThuat WHERE Id IN (" + inBuilder.toString() + ")";
        List<Integer> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getInt("Id"),
                ids.toArray()
        );

        List<HienTrangKyThuat> toInsert = new java.util.ArrayList<>();
        List<HienTrangKyThuat> toUpdate = new java.util.ArrayList<>();

        java.util.Set<Integer> existingSet = new java.util.HashSet<>(existingIds);
        for (HienTrangKyThuat htkt : list) {
            if (htkt.getId() == null) {
                continue;
            }
            if (existingSet.contains(htkt.getId())) {
                toUpdate.add(htkt);
            } else {
                toInsert.add(htkt);
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

    public int delete(Integer id) {
        String sql = "DELETE FROM HienTrangKyThuat WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM HienTrangKyThuat WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setInt(1, ids.get(i));
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

    public int softDelete(Integer id) {
        String sql = "UPDATE HienTrangKyThuat SET IsActive = 0 WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public long count(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM HienTrangKyThuat WHERE IsActive = 1";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = """
                SELECT COUNT(*)
                FROM HienTrangKyThuat
                WHERE IsActive = 1
                    AND (
                        LOWER(TenHTKT) LIKE LOWER(?) OR
                        LOWER(MoTa) LIKE LOWER(?)
                    )
                """;
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        }
    }

    public List<HienTrangKyThuat> findAllPaged(int offset, int limit, String sortBy, String sortDir, String keyword) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tenhtkt":
                orderColumn = "TenHTKT";
                break;
            case "ngaytao":
                orderColumn = "NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "NgayCapNhat";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = "WHERE IsActive = 1";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += """
                     AND (
                        LOWER(TenHTKT) LIKE LOWER(?) OR
                        LOWER(MoTa) LIKE LOWER(?)
                    )
                """;
        }

        String sql = String.format("""
                SELECT * FROM HienTrangKyThuat
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, rowMapper, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, rowMapper, limit, offset);
        }
    }



    public int deleteAll() {
        String sql = "DELETE FROM HienTrangKyThuat";
        return jdbcTemplate.update(sql);
    }



}
