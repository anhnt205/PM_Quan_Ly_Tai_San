package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietDieuDongPhucLucTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongPhucLucTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChiTietDieuDongPhucLucTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ChiTietDieuDongPhucLucTaiSanDTO> findAll(String idDieuDongPhuLucTaiSan) {
        String sql = """
                SELECT ct.Id,
                       ct.IdDieuDongPhuLucTaiSan,
                       dd.TenPhieu,
                       dd.SoQuyetDinh,
                
                       ct.IdPhuLucTaiSan,
                       pl.TenPhuLucTS,
                       pl.MaPhuLucTSTB,
                       pl.DonViTinh,
                       pl.HienTrang,
                       pl.DacDiem,
                       pl.MoTaThietBiDinhKemTaiSan,
                
                       ct.SoLuong,
                
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive
                FROM ChiTietDieuDongPhucLucTaiSan AS ct
                         LEFT JOIN
                     DieuDongPhuLucTaiSan AS dd ON ct.IdDieuDongPhuLucTaiSan = dd.Id
                         LEFT JOIN
                     PhuLucTaiSan AS pl ON ct.IdPhuLucTaiSan = pl.Id
                WHERE  ct.IdDieuDongPhuLucTaiSan = ?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongPhucLucTaiSanDTO.class), idDieuDongPhuLucTaiSan);
    }

    public ChiTietDieuDongPhucLucTaiSanDTO findById(String id) {
        String sql = """
                SELECT ct.Id,
                       ct.IdDieuDongPhuLucTaiSan,
                       dd.TenPhieu,
                       dd.SoQuyetDinh,
                
                       ct.IdPhuLucTaiSan,
                       pl.TenPhuLucTS,
                       pl.MaPhuLucTSTB,
                       pl.DonViTinh,
                       pl.HienTrang,
                       pl.DacDiem,
                       pl.MoTaThietBiDinhKemTaiSan,
                
                       ct.SoLuong,
                
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive
                FROM ChiTietDieuDongPhucLucTaiSan AS ct
                         LEFT JOIN
                     DieuDongPhuLucTaiSan AS dd ON ct.IdDieuDongPhuLucTaiSan = dd.Id
                         LEFT JOIN
                     PhuLucTaiSan AS pl ON ct.IdPhuLucTaiSan = pl.Id
                WHERE  ct.Id = ?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongPhucLucTaiSanDTO.class), id);
    }

    public int insert(ChiTietDieuDongPhucLucTaiSan obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ChiTietDieuDongPhucLucTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO ChiTietDieuDongPhucLucTaiSan (Id, IdDieuDongPhuLucTaiSan, IdPhuLucTaiSan, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                    obj.getId(), obj.getIdDieuDongPhuLucTaiSan(), obj.getIdPhuLucTaiSan(),
                    obj.getSoLuong(), obj.getGhiChu(), obj.getNgayTao(), obj.getNgayCapNhat(),
                    obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive());
        }
    }

    public int update(ChiTietDieuDongPhucLucTaiSan obj) {
        String sql = "UPDATE ChiTietDieuDongPhucLucTaiSan SET IdDieuDongPhuLucTaiSan=?, IdPhuLucTaiSan=?, SoLuong=?, GhiChu=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql,
                obj.getIdDieuDongPhuLucTaiSan(), obj.getIdPhuLucTaiSan(), obj.getSoLuong(),
                obj.getGhiChu(), obj.getNgayTao(), obj.getNgayCapNhat(),
                obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChiTietDieuDongPhucLucTaiSan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
