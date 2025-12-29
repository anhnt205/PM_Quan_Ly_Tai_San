
package com.ecotel.quanlytaisan.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.ThuocTinhNhanVien;

@Repository
public class ThuocTinhNhanVienDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ThuocTinhNhanVien> findAll(String idNhanVien) {
        String sql = "SELECT * FROM ThuocTinhNhanVien where IdNhanVien=?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ThuocTinhNhanVien.class),idNhanVien);
    }

    public ThuocTinhNhanVien findById(String id) {
        String sql = "SELECT * FROM ThuocTinhNhanVien WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ThuocTinhNhanVien.class), id);
    }

    public int insert(ThuocTinhNhanVien obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ThuocTinhNhanVien WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO ThuocTinhNhanVien (Id, IdNhanVien, NoiDung, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, obj.getId(), obj.getIdNhanVien(), obj.getNoiDung(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive());
        }
    }

    public int update(ThuocTinhNhanVien obj) {
        String sql = "UPDATE ThuocTinhNhanVien SET IdNhanVien=?, NoiDung=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, obj.getIdNhanVien(), obj.getNoiDung(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ThuocTinhNhanVien WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}