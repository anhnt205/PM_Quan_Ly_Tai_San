package com.ecotel.quanlytaisan.dao;

import java.util.List;

import com.ecotel.quanlytaisan.model.PhuLucTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.PhuLucTaiSan;

@Repository
public class PhuLucTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<PhuLucTaiSanDTO> findAll(String idCongTy) {
        String sql = """
                SELECT 
    plt.Id,
    plt.IdTaiSan,
    ts.TenTaiSan,
    
    plt.TenPhuLucTS,
    plt.IdDonViHienThoi,
    pb.TenPhongBan AS TenDonViHienThoi,
    
    plt.MoTaThietBiDinhKemTaiSan,
    plt.MaPhuLucTSTB,
    plt.NgayTaoPhuLuc,
    plt.HienTrang,
    plt.DonViTinh,
    plt.DacDiem,
    
    plt.IdCongTy,
    plt.NgayTao,
    plt.NgayCapNhat,
    plt.NguoiTao,
    plt.NguoiCapNhat,
    plt.IsActive
FROM 
    PhuLucTaiSan AS plt
LEFT JOIN 
    TaiSan AS ts ON plt.IdTaiSan = ts.Id
LEFT JOIN 
    PhongBan AS pb ON plt.IdDonViHienThoi = pb.Id
WHERE 
    plt.IdCongTy = ? 
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PhuLucTaiSanDTO.class), idCongTy);
    }

    public PhuLucTaiSanDTO findById(String id) {
        String sql = """
                SELECT 
    plt.Id,
    plt.IdTaiSan,
    ts.TenTaiSan,
    
    plt.TenPhuLucTS,
    plt.IdDonViHienThoi,
    pb.TenPhongBan AS TenDonViHienThoi,
    
    plt.MoTaThietBiDinhKemTaiSan,
    plt.MaPhuLucTSTB,
    plt.NgayTaoPhuLuc,
    plt.HienTrang,
    plt.DonViTinh,
    plt.DacDiem,
    
    plt.IdCongTy,
    plt.NgayTao,
    plt.NgayCapNhat,
    plt.NguoiTao,
    plt.NguoiCapNhat,
    plt.IsActive
FROM 
    PhuLucTaiSan AS plt
LEFT JOIN 
    TaiSan AS ts ON plt.IdTaiSan = ts.Id
LEFT JOIN 
    PhongBan AS pb ON plt.IdDonViHienThoi = pb.Id
WHERE 
    plt.Id = ? 
                """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(PhuLucTaiSanDTO.class), id);
    }

    public int insert(PhuLucTaiSan obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM PhuLucTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO PhuLucTaiSan (Id, IdTaiSan, TenPhuLucTS, IdDonViHienThoi, MoTaThietBiDinhKemTaiSan, MaPhuLucTSTB, NgayTaoPhuLuc, HienTrang, DonViTinh, DacDiem, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, obj.getId(), obj.getIdTaiSan(), obj.getTenPhuLucTS(), obj.getIdDonViHienThoi(), obj.getMoTaThietBiDinhKemTaiSan(), obj.getMaPhuLucTSTB(), obj.getNgayTaoPhuLuc(), obj.getHienTrang(), obj.getDonViTinh(), obj.getDacDiem(), obj.getIdCongTy(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive());
        }
    }

    public int update(PhuLucTaiSan obj) {
        String sql = "UPDATE PhuLucTaiSan SET IdTaiSan=?, TenPhuLucTS=?, IdDonViHienThoi=?, MoTaThietBiDinhKemTaiSan=?, MaPhuLucTSTB=?, NgayTaoPhuLuc=?, HienTrang=?, DonViTinh=?, DacDiem=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, obj.getIdTaiSan(), obj.getTenPhuLucTS(), obj.getIdDonViHienThoi(), obj.getMoTaThietBiDinhKemTaiSan(), obj.getMaPhuLucTSTB(), obj.getNgayTaoPhuLuc(), obj.getHienTrang(), obj.getDonViTinh(), obj.getDacDiem(), obj.getIdCongTy(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM PhuLucTaiSan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
