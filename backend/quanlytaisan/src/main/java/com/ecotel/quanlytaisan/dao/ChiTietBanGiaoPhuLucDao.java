package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietBanGiaoPhuLuc;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoPhuLucDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChiTietBanGiaoPhuLucDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ChiTietBanGiaoPhuLucDTO> findAll(String idBanGiaoPhuLuc) {
        String sql = """
                   SELECT ct.Id,
                       ct.IdBanGiaoPhuLuc,
                       ct.IdPhuLuc,
                       ct.SoLuong,
                
                       pl.TenPhuLucTS,
                       pl.MaPhuLucTSTB,
                       pl.MoTaThietBiDinhKemTaiSan,
                       pl.HienTrang,
                       pl.DonViTinh,
                       pl.DacDiem,
                       pl.IdTaiSan,
                       pl.IdDonViHienThoi,
                
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive
                
                FROM ChiTietBanGiaoPhuLuc AS ct
                         LEFT JOIN PhuLucTaiSan AS pl ON ct.IdPhuLuc = pl.Id
                         LEFT JOIN BanGiaoPhuLuc AS bg ON ct.IdBanGiaoPhuLuc = bg.Id
                
                WHERE ct.IdBanGiaoPhuLuc=?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietBanGiaoPhuLucDTO.class), idBanGiaoPhuLuc);
    }

    public ChiTietBanGiaoPhuLucDTO findById(String id) {
        String sql = """
                   SELECT ct.Id,
                       ct.IdBanGiaoPhuLuc,
                       ct.IdPhuLuc,
                       ct.SoLuong,
                
                       pl.TenPhuLucTS,
                       pl.MaPhuLucTSTB,
                       pl.MoTaThietBiDinhKemTaiSan,
                       pl.HienTrang,
                       pl.DonViTinh,
                       pl.DacDiem,
                       pl.IdTaiSan,
                       pl.IdDonViHienThoi,
                
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive
                
                FROM ChiTietBanGiaoPhuLuc AS ct
                         LEFT JOIN PhuLucTaiSan AS pl ON ct.IdPhuLuc = pl.Id
                         LEFT JOIN BanGiaoPhuLuc AS bg ON ct.IdBanGiaoPhuLuc = bg.Id
                
                WHERE  ct.Id=?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietBanGiaoPhuLucDTO.class), id);
    }

    public int insert(ChiTietBanGiaoPhuLuc obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ChiTietBanGiaoPhuLuc WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO ChiTietBanGiaoPhuLuc (Id, IdBanGiaoPhuLuc, IdPhuLuc, SoLuong, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                    obj.getId(), obj.getIdBanGiaoPhuLuc(), obj.getIdPhuLuc(), obj.getSoLuong(),
                    obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive());
        }
    }

    public int update(ChiTietBanGiaoPhuLuc obj) {
        String sql = "UPDATE ChiTietBanGiaoPhuLuc SET IdBanGiaoPhuLuc=?, IdPhuLuc=?, SoLuong=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql,
                obj.getIdBanGiaoPhuLuc(), obj.getIdPhuLuc(), obj.getSoLuong(),
                obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(),
                obj.getIsActive(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChiTietBanGiaoPhuLuc WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
