package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.Kho;
import com.ecotel.quanlytaisan.model.KhoEnrichedDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class KhoDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private org.springframework.jdbc.core.RowMapper<KhoEnrichedDTO> enrichedRowMapper = (rs, rowNum) -> {
        KhoEnrichedDTO kho = new KhoEnrichedDTO();
        kho.setId(rs.getString("Id"));
        kho.setTenKho(rs.getString("TenKho"));
        kho.setIdQuanLy(rs.getString("IdQuanLy"));
        kho.setIdCongTy(rs.getString("IdCongTy"));
        kho.setNgayTao(rs.getString("NgayTao"));
        kho.setNgayCapNhat(rs.getString("NgayCapNhat"));
        kho.setNguoiTao(rs.getString("NguoiTao"));
        kho.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
        kho.setIsActive(rs.getBoolean("IsActive"));
        kho.setTenCongTy(rs.getString("tenCongTy"));
        kho.setTenQuanLy(rs.getString("tenQuanLy"));
        return kho;
    };
    public List<KhoEnrichedDTO> findAll(String idCongTy) {
        StringBuilder sql = new StringBuilder("""
        SELECT k.*, 
               ct.TenCongTy AS tenCongTy,
               nv.HoTen AS tenQuanLy   -- ← sửa thành HoTen
        FROM Kho k
        LEFT JOIN CongTy ct ON k.IdCongTy = ct.Id
        LEFT JOIN NhanVien nv ON k.IdQuanLy = nv.Id
        WHERE k.IsActive = 1
    """);
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND k.IdCongTy = ?");
            params.add(idCongTy);
        }

        return jdbcTemplate.query(sql.toString(), enrichedRowMapper, params.toArray());
    }

    public List<KhoEnrichedDTO> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;

        StringBuilder sql = new StringBuilder("""
        SELECT k.*, 
               ct.TenCongTy AS tenCongTy,
               nv.HoTen AS tenQuanLy   -- ← sửa thành HoTen thay vì TenNhanVien
        FROM Kho k
        LEFT JOIN CongTy ct ON k.IdCongTy = ct.Id
        LEFT JOIN NhanVien nv ON k.IdQuanLy = nv.Id
        WHERE k.IsActive = 1
    """);
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND k.IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (k.Id LIKE ? OR k.TenKho LIKE ? OR k.IdQuanLy LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        String orderBy = "k.Id";
        String[] allowed = {"Id", "TenKho", "NgayTao", "NgayCapNhat"};
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            for (String col : allowed) {
                if (col.equalsIgnoreCase(sortBy.trim())) {
                    orderBy = "k." + col;
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
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM Kho k WHERE k.IsActive = 1");
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND k.IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (k.Id LIKE ? OR k.TenKho LIKE ? OR k.IdQuanLy LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }
    public KhoEnrichedDTO findById(String id) {
        String sql = """
        SELECT k.*, 
               ct.TenCongTy AS tenCongTy,
               nv.HoTen AS tenQuanLy   -- ← sửa thành HoTen
        FROM Kho k
        LEFT JOIN CongTy ct ON k.IdCongTy = ct.Id
        LEFT JOIN NhanVien nv ON k.IdQuanLy = nv.Id
        WHERE k.Id = ?
        """;

        List<KhoEnrichedDTO> results = jdbcTemplate.query(sql, enrichedRowMapper, id);
        if (results.isEmpty()) return null;
        if (results.size() > 1) throw new IllegalStateException("Duplicate ID: " + id);
        return results.get(0);
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

