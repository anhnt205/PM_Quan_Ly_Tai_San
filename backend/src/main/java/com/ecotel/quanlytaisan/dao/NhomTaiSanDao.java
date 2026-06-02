package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NhomTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class NhomTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<NhomTaiSan> rowMapper = new RowMapper<NhomTaiSan>() {
        @Override
        public NhomTaiSan mapRow(ResultSet rs, int rowNum) throws SQLException {
            NhomTaiSan nts = new NhomTaiSan();
            nts.setId(rs.getString("Id"));
            nts.setTenNhom(rs.getString("TenNhom"));
            nts.setHieuLuc(rs.getBoolean("HieuLuc"));
            nts.setIdCongTy(rs.getString("IdCongTy"));
            nts.setNgayTao(rs.getString("NgayTao"));
            nts.setNgayCapNhat(rs.getString("NgayCapNhat"));
            nts.setNguoiTao(rs.getString("NguoiTao"));
            nts.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            nts.setIsActive(rs.getBoolean("IsActive"));
            // Đếm số lượng tài sản
            try {
                nts.setSoLuongTaiSan(rs.getInt("SoLuongTaiSan"));
            } catch (SQLException e) {
                // Nếu không có column SoLuongTaiSan (trong trường hợp query cũ), set về 0
                nts.setSoLuongTaiSan(0);
            }
            return nts;
        }
    };

    public List<NhomTaiSan> findAll(String idCongTy) {
        String sql = "SELECT nts.*, COALESCE(COUNT(ts.Id), 0) AS SoLuongTaiSan " +
                     "FROM NhomTaiSan nts " +
                     "LEFT JOIN TaiSan ts ON nts.Id = ts.IdNhomTaiSan AND ts.IsActive = 1 " +
                     "WHERE nts.IdCongTy = ? " +
                     "GROUP BY nts.Id, nts.TenNhom, nts.HieuLuc, nts.IdCongTy, nts.NgayTao, nts.NgayCapNhat, nts.NguoiTao, nts.NguoiCapNhat, nts.IsActive";
        return jdbcTemplate.query(sql, rowMapper, idCongTy);
    }

    public List<NhomTaiSan> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String keyword) {
        // Xử lý sortBy an toàn
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "tennhom";
        String orderColumn;
        switch (normalizedSortBy) {
            case "id":
                orderColumn = "nts.Id";
                break;
            case "hieuluc":
                orderColumn = "nts.HieuLuc";
                break;
            case "ngaytao":
                orderColumn = "nts.NgayTao";
                break;
            case "ngaycapnhat":
                orderColumn = "nts.NgayCapNhat";
                break;
            case "soluongtaisan":
                orderColumn = "SoLuongTaiSan";
                break;
            case "tennhom":
            default:
                orderColumn = "nts.TenNhom";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        // Luôn có WHERE cơ bản
        String whereClause = "WHERE nts.IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause += " AND (LOWER(nts.TenNhom) LIKE LOWER(?) OR LOWER(nts.Id) LIKE LOWER(?))";
        }

        String sql = """
        SELECT nts.*, COALESCE(COUNT(ts.Id), 0) AS SoLuongTaiSan
        FROM NhomTaiSan nts
        LEFT JOIN TaiSan ts ON nts.Id = ts.IdNhomTaiSan AND ts.IsActive = 1
        %s
        GROUP BY nts.Id, nts.TenNhom, nts.HieuLuc, nts.IdCongTy, nts.NgayTao, nts.NgayCapNhat, nts.NguoiTao, nts.NguoiCapNhat, nts.IsActive
        ORDER BY %s %s
        LIMIT ? OFFSET ?
        """.formatted(whereClause, orderColumn, direction);

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, rowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, rowMapper, idCongTy, limit, offset);
        }
    }

    public long countAll(String idCongTy, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereClause += " AND (LOWER(TenNhom) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = "SELECT COUNT(*) FROM NhomTaiSan " + whereClause;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        }
    }

    public NhomTaiSan findById(String id) {
        String sql = "SELECT nts.*, COALESCE(COUNT(ts.Id), 0) AS SoLuongTaiSan " +
                     "FROM NhomTaiSan nts " +
                     "LEFT JOIN TaiSan ts ON nts.Id = ts.IdNhomTaiSan AND ts.IsActive = 1 " +
                     "WHERE nts.Id = ? " +
                     "GROUP BY nts.Id, nts.TenNhom, nts.HieuLuc, nts.IdCongTy, nts.NgayTao, nts.NgayCapNhat, nts.NguoiTao, nts.NguoiCapNhat, nts.IsActive";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }


    public int insert(NhomTaiSan nts) {
        // Kiểm tra id không null và không empty
        if (nts.getId() == null || nts.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM NhomTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, nts.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(nts);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO NhomTaiSan (Id, TenNhom, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            String ngayTao = nts.getNgayTao();
            String ngayCapNhat = nts.getNgayCapNhat();

            return jdbcTemplate.update(sql,
                    nts.getId(),
                    nts.getTenNhom(),
                    nts.getHieuLuc(),
                    nts.getIdCongTy(),
                    ngayTao,
                    ngayCapNhat,
                    nts.getNguoiTao(),
                    nts.getNguoiCapNhat(),
                    nts.getIsActive()
            );
        }
    }


    public int update(NhomTaiSan nts) {
        String sql = "UPDATE NhomTaiSan " +
                "SET TenNhom=?, HieuLuc=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? " +
                "WHERE Id=?";



        return jdbcTemplate.update(sql,
                nts.getTenNhom(),
                nts.getHieuLuc(),
                nts.getIdCongTy(),
                nts.getNgayTao(),
                nts.getNgayCapNhat(),
                nts.getNguoiTao(),
                nts.getNguoiCapNhat(),
                nts.getIsActive(),
                nts.getId()
        );
    }

    public int batchUpdate(List<NhomTaiSan> list) {
        String sql = "UPDATE NhomTaiSan SET TenNhom=?, HieuLuc=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                NhomTaiSan nts = list.get(i);
                ps.setString(1, nts.getTenNhom());
                ps.setBoolean(2, nts.getHieuLuc() != null ? nts.getHieuLuc() : false);
                ps.setString(3, nts.getIdCongTy());
                ps.setString(4, nts.getNgayTao());
                ps.setString(5, nts.getNgayCapNhat());
                ps.setString(6, nts.getNguoiTao());
                ps.setString(7, nts.getNguoiCapNhat());
                ps.setBoolean(8, nts.getIsActive() != null ? nts.getIsActive() : false);
                ps.setString(9, nts.getId());
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

    public int batchInsert(List<NhomTaiSan> list) {
        String sql = "INSERT INTO NhomTaiSan (Id, TenNhom, HieuLuc, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                NhomTaiSan nts = list.get(i);
                ps.setString(1, nts.getId());
                ps.setString(2, nts.getTenNhom());
                ps.setBoolean(3, nts.getHieuLuc() != null ? nts.getHieuLuc() : false);
                ps.setString(4, nts.getIdCongTy());
                ps.setString(5, nts.getNgayTao());
                ps.setString(6, nts.getNgayCapNhat());
                ps.setString(7, nts.getNguoiTao());
                ps.setString(8, nts.getNguoiCapNhat());
                ps.setBoolean(9, nts.getIsActive() != null ? nts.getIsActive() : false);
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

    public int batchCreate(List<NhomTaiSan> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (NhomTaiSan nts : list) {
            if (nts.getId() != null && !nts.getId().trim().isEmpty()) {
                ids.add(nts.getId());
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

        String checkSql = "SELECT Id FROM NhomTaiSan WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<NhomTaiSan> toInsert = new java.util.ArrayList<>();
        List<NhomTaiSan> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (NhomTaiSan nts : list) {
            if (nts.getId() == null || nts.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(nts.getId())) {
                toUpdate.add(nts);
            } else {
                toInsert.add(nts);
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
        String sql = "DELETE FROM NhomTaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM NhomTaiSan WHERE Id=?";
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
        String sql = "DELETE FROM NhomTaiSan";
        return jdbcTemplate.update(sql);
    }


}
