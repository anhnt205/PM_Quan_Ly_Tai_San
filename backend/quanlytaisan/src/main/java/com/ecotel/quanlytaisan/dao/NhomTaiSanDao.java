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

    public List<NhomTaiSan> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenNhom", "HieuLuc", "NgayTao", "NgayCapNhat", "SoLuongTaiSan"};
            for (String column : allowedColumns) {
                if (column.equalsIgnoreCase(sortBy)) {
                    orderBy = column;
                    break;
                }
            }
        }
        
        String direction = "ASC";
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            direction = "DESC";
        }
        
        String sql = "SELECT nts.*, COALESCE(COUNT(ts.Id), 0) AS SoLuongTaiSan " +
                     "FROM NhomTaiSan nts " +
                     "LEFT JOIN TaiSan ts ON nts.Id = ts.IdNhomTaiSan AND ts.IsActive = 1 " +
                     "WHERE nts.IdCongTy = ? " +
                     "GROUP BY nts.Id, nts.TenNhom, nts.HieuLuc, nts.IdCongTy, nts.NgayTao, nts.NgayCapNhat, nts.NguoiTao, nts.NguoiCapNhat, nts.IsActive " +
                     "ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, rowMapper, idCongTy, size, offset);
    }

    public long countAll(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM NhomTaiSan WHERE IdCongTy=?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
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

    public int delete(String id) {
        String sql = "DELETE FROM NhomTaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
