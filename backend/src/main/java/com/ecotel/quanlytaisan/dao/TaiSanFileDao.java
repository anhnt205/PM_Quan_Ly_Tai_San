package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.TaiSanFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TaiSanFileDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Lấy tất cả file của một tài sản
    public List<TaiSanFile> findByTaiSanId(String idTaiSan) {
        String sql = "SELECT Id, IdTaiSan, FilePath, TenFile, Loai, NgayTao, GhiChu FROM taisan_file WHERE IdTaiSan = ? ORDER BY NgayTao DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanFile.class), idTaiSan);
    }

    // Lấy file theo id
    public TaiSanFile findById(Integer id) {
        String sql = "SELECT Id, IdTaiSan, FilePath, TenFile, Loai, NgayTao, GhiChu FROM taisan_file WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(TaiSanFile.class), id);
    }

    // Thêm mới file
    public int insert(TaiSanFile file) {
        String sql = "INSERT INTO taisan_file (IdTaiSan, FilePath, TenFile, Loai, NgayTao, GhiChu) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                file.getIdTaiSan(),
                file.getFilePath(),
                file.getTenFile(),
                file.getLoai(),
                file.getNgayTao(),
                file.getGhiChu()
        );
    }

    // Cập nhật file
    public int update(TaiSanFile file) {
        String sql = "UPDATE taisan_file SET FilePath = ?, TenFile = ?, Loai = ?, GhiChu = ? WHERE Id = ?";
        return jdbcTemplate.update(sql,
                file.getFilePath(),
                file.getTenFile(),
                file.getLoai(),
                file.getGhiChu(),
                file.getId()
        );
    }

    // Xóa file theo id
    public int delete(Integer id) {
        String sql = "DELETE FROM taisan_file WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // Xóa tất cả file của một tài sản
    public int deleteByTaiSanId(String idTaiSan) {
        String sql = "DELETE FROM taisan_file WHERE IdTaiSan = ?";
        return jdbcTemplate.update(sql, idTaiSan);
    }

    // Kiểm tra tồn tại (dùng cho validation)
    public boolean existsById(Integer id) {
        String sql = "SELECT COUNT(*) FROM taisan_file WHERE Id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Thêm nhiều file cùng lúc (batch insert)
     */
    public int[] insertBatch(List<TaiSanFile> files) {
        String sql = "INSERT INTO taisan_file (IdTaiSan, FilePath, TenFile, Loai, NgayTao, GhiChu) VALUES (?, ?, ?, ?, ?, ?)";
        List<Object[]> batchArgs = new ArrayList<>();
        for (TaiSanFile file : files) {
            Object[] args = new Object[]{
                    file.getIdTaiSan(),
                    file.getFilePath(),
                    file.getTenFile(),
                    file.getLoai(),
                    file.getNgayTao(),
                    file.getGhiChu()
            };
            batchArgs.add(args);
        }
        return jdbcTemplate.batchUpdate(sql, batchArgs);
    }

    /**
     * Xóa nhiều file theo danh sách ID
     */
    public int deleteByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        String placeholders = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM taisan_file WHERE Id IN (" + placeholders + ")";
        return jdbcTemplate.update(sql, ids.toArray());
    }
}