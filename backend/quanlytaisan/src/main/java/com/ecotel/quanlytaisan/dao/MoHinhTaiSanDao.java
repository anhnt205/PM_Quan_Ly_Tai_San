package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.MoHinhTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class MoHinhTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<MoHinhTaiSan> rowMapper = new RowMapper<MoHinhTaiSan>() {
        @Override
        public MoHinhTaiSan mapRow(ResultSet rs, int rowNum) throws SQLException {
            MoHinhTaiSan mhts = new MoHinhTaiSan();
            mhts.setId(rs.getString("Id"));
            mhts.setTenMoHinh(rs.getString("TenMoHinh"));
            mhts.setPhuongPhapKhauHao(rs.getInt("PhuongPhapKhauHao"));
            mhts.setKyKhauHao(rs.getInt("KyKhauHao"));
            mhts.setLoaiKyKhauHao(rs.getString("LoaiKyKhauHao"));
            mhts.setTaiKhoanTaiSan(rs.getString("TaiKhoanTaiSan"));
            mhts.setTaiKhoanKhauHao(rs.getString("TaiKhoanKhauHao"));
            mhts.setTaiKhoanChiPhi(rs.getString("TaiKhoanChiPhi"));
            mhts.setIdCongTy(rs.getString("IdCongTy"));
            mhts.setNgayTao(rs.getString("NgayTao"));
            mhts.setNgayCapNhat(rs.getString("NgayCapNhat"));
            mhts.setNguoiTao(rs.getString("NguoiTao"));
            mhts.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            mhts.setIsActive(rs.getBoolean("IsActive"));
            return mhts;
        }
    };

    public List<MoHinhTaiSan> findAll(String idCongTy) {
        String sql = "SELECT * FROM MoHinhTaiSan where IdCongTy = ?";
        return jdbcTemplate.query(sql, rowMapper,idCongTy);
    }

    public List<MoHinhTaiSan> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenMoHinh", "PhuongPhapKhauHao", "KyKhauHao", "LoaiKyKhauHao", "NgayTao", "NgayCapNhat"};
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
        
        String sql = "SELECT * FROM MoHinhTaiSan WHERE IdCongTy=? ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, rowMapper, idCongTy, size, offset);
    }

    public long countAll(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM MoHinhTaiSan WHERE IdCongTy=?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public MoHinhTaiSan findById(String id) {
        String sql = "SELECT * FROM MoHinhTaiSan WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    public int insert(MoHinhTaiSan mhts) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM MoHinhTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, mhts.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(mhts);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO MoHinhTaiSan (Id, TenMoHinh, PhuongPhapKhauHao, KyKhauHao, LoaiKyKhauHao, TaiKhoanTaiSan, TaiKhoanKhauHao, TaiKhoanChiPhi, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, mhts.getId(), mhts.getTenMoHinh(), mhts.getPhuongPhapKhauHao(), mhts.getKyKhauHao(), mhts.getLoaiKyKhauHao(), mhts.getTaiKhoanTaiSan(), mhts.getTaiKhoanKhauHao(), mhts.getTaiKhoanChiPhi(), mhts.getIdCongTy(), mhts.getNgayTao(), mhts.getNgayCapNhat(), mhts.getNguoiTao(), mhts.getNguoiCapNhat(), mhts.getIsActive());
        }
    }

    public int update(MoHinhTaiSan mhts) {
        String sql = "UPDATE MoHinhTaiSan SET TenMoHinh=?, PhuongPhapKhauHao=?, KyKhauHao=?, LoaiKyKhauHao=?, TaiKhoanTaiSan=?, TaiKhoanKhauHao=?, TaiKhoanChiPhi=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, mhts.getTenMoHinh(), mhts.getPhuongPhapKhauHao(), mhts.getKyKhauHao(), mhts.getLoaiKyKhauHao(), mhts.getTaiKhoanTaiSan(), mhts.getTaiKhoanKhauHao(), mhts.getTaiKhoanChiPhi(), mhts.getIdCongTy(), mhts.getNgayTao(), mhts.getNgayCapNhat(), mhts.getNguoiTao(), mhts.getNguoiCapNhat(), mhts.getIsActive(), mhts.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM MoHinhTaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
