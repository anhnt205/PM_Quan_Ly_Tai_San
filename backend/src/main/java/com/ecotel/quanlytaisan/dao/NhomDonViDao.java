package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NhomDonVi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class NhomDonViDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<NhomDonVi> rowMapper = new RowMapper<NhomDonVi>() {
        @Override
        public NhomDonVi mapRow(ResultSet rs, int rowNum) throws SQLException {
            NhomDonVi ndv = new NhomDonVi();
            ndv.setId(rs.getString("Id"));
            ndv.setTenNhom(rs.getString("TenNhom"));
            ndv.setNgayTao(rs.getString("NgayTao"));
            ndv.setNgayCapNhat(rs.getString("NgayCapNhat"));
            ndv.setNguoiTao(rs.getString("NguoiTao"));
            ndv.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            ndv.setIdCongTy(rs.getString("IdCongTy"));
            ndv.setIsActive(rs.getBoolean("IsActive"));
            return ndv;
        }
    };

    public List<NhomDonVi> findAll(String idCongTy) {
        String sql = "SELECT * FROM NhomDonVi where IdCongTy =?";
        return jdbcTemplate.query(sql, rowMapper,idCongTy);
    }

    public NhomDonVi findById(String id) {
        String sql = "SELECT * FROM NhomDonVi WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    public int insert(NhomDonVi ndv) {
        // Kiểm tra id không null và không empty
        if (ndv.getId() == null || ndv.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM NhomDonVi WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, ndv.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(ndv);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO NhomDonVi (Id, TenNhom, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IdCongTy, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, ndv.getId(), ndv.getTenNhom(), ndv.getNgayTao(), ndv.getNgayCapNhat(), ndv.getNguoiTao(), ndv.getNguoiCapNhat(), ndv.getIdCongTy(), ndv.getIsActive());
        }
    }

    public int update(NhomDonVi ndv) {
        String sql = "UPDATE NhomDonVi SET TenNhom=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IdCongTy=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, ndv.getTenNhom(), ndv.getNgayTao(), ndv.getNgayCapNhat(), ndv.getNguoiTao(), ndv.getNguoiCapNhat(), ndv.getIdCongTy(), ndv.getIsActive(), ndv.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM NhomDonVi WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }
}
