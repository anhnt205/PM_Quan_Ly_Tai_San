package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.BanGiaoPhuLuc;
import com.ecotel.quanlytaisan.model.BanGiaoPhuLucDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BanGiaoPhuLucDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<BanGiaoPhuLucDTO> findAll(String idCongTy) {
        String sql = """
                SELECT bg.Id,
                       bg.BanGiaoPhuLuc,
                       bg.QuyetDinhDieuDongSo,
                       bg.LenhDieuDong,
                       bg.NgayBanGiao,
                
                       bg.IdDonViGiao,
                       pbGiao.TenPhongBan    AS TenDonViGiao,
                
                       bg.IdDonViNhan,
                       pbNhan.TenPhongBan    AS TenDonViNhan,
                
                       bg.IdDonViDaiDien,
                       pbDaiDien.TenPhongBan AS TenDonViDaiDien,
                
                       bg.IdLanhDao,
                       nvLanhDao.HoTen       AS TenLanhDao,
                
                       bg.IdDaiDiendonviBanHanhQD,
                       nvBanHanh.HoTen       AS TenNguoiBanHanh,
                
                       bg.IdDaiDienBenGiao,
                       nvBenGiao.HoTen       AS TenBenGiao,
                
                       bg.IdDaiDienBenNhan,
                       nvBenNhan.HoTen       AS TenBenNhan,
                
                       bg.DaiDienBenGiaoXacNhan,
                       bg.DaiDienBenNhanXacNhan,
                       bg.DonViDaiDienXacNhan,
                       bg.DaXacNhan,
                       bg.TrangThai,
                       bg.Note,
                
                       bg.NgayTao,
                       bg.NgayCapNhat,
                       bg.NguoiTao,
                       bg.NguoiCapNhat,
                       bg.IsActive
                
                FROM BanGiaoPhuLuc AS bg
                         LEFT JOIN PhongBan AS pbGiao ON bg.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bg.IdDonViNhan = pbNhan.Id
                         LEFT JOIN PhongBan AS pbDaiDien ON bg.IdDonViDaiDien = pbDaiDien.Id
                
                         LEFT JOIN NhanVien AS nvLanhDao ON bg.IdLanhDao = nvLanhDao.Id
                         LEFT JOIN NhanVien AS nvBanHanh ON bg.IdDaiDiendonviBanHanhQD = nvBanHanh.Id
                         LEFT JOIN NhanVien AS nvBenGiao ON bg.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bg.IdDaiDienBenNhan = nvBenNhan.Id
                
                WHERE  bg.IdCongty=?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BanGiaoPhuLucDTO.class), idCongTy);
    }

    public BanGiaoPhuLucDTO findById(String id) {
        String sql = """
                SELECT bg.Id,
                       bg.BanGiaoPhuLuc,
                       bg.QuyetDinhDieuDongSo,
                       bg.LenhDieuDong,
                       bg.NgayBanGiao,
                
                       bg.IdDonViGiao,
                       pbGiao.TenPhongBan    AS TenDonViGiao,
                
                       bg.IdDonViNhan,
                       pbNhan.TenPhongBan    AS TenDonViNhan,
                
                       bg.IdDonViDaiDien,
                       pbDaiDien.TenPhongBan AS TenDonViDaiDien,
                
                       bg.IdLanhDao,
                       nvLanhDao.HoTen       AS TenLanhDao,
                
                       bg.IdDaiDiendonviBanHanhQD,
                       nvBanHanh.HoTen       AS TenNguoiBanHanh,
                
                       bg.IdDaiDienBenGiao,
                       nvBenGiao.HoTen       AS TenBenGiao,
                
                       bg.IdDaiDienBenNhan,
                       nvBenNhan.HoTen       AS TenBenNhan,
                
                       bg.DaiDienBenGiaoXacNhan,
                       bg.DaiDienBenNhanXacNhan,
                       bg.DonViDaiDienXacNhan,
                       bg.DaXacNhan,
                       bg.TrangThai,
                       bg.Note,
                
                       bg.NgayTao,
                       bg.NgayCapNhat,
                       bg.NguoiTao,
                       bg.NguoiCapNhat,
                       bg.IsActive
                
                FROM BanGiaoPhuLuc AS bg
                         LEFT JOIN PhongBan AS pbGiao ON bg.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bg.IdDonViNhan = pbNhan.Id
                         LEFT JOIN PhongBan AS pbDaiDien ON bg.IdDonViDaiDien = pbDaiDien.Id
                
                         LEFT JOIN NhanVien AS nvLanhDao ON bg.IdLanhDao = nvLanhDao.Id
                         LEFT JOIN NhanVien AS nvBanHanh ON bg.IdDaiDiendonviBanHanhQD = nvBanHanh.Id
                         LEFT JOIN NhanVien AS nvBenGiao ON bg.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bg.IdDaiDienBenNhan = nvBenNhan.Id
                
                WHERE  bg.id=?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(BanGiaoPhuLucDTO.class), id);
    }

    public int insert(BanGiaoPhuLuc obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM BanGiaoPhuLuc WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO BanGiaoPhuLuc (Id,IdCongty, BanGiaoPhuLuc, QuyetDinhDieuDongSo, LenhDieuDong, IdDonViGiao, IdDonViNhan, NgayBanGiao, IdLanhDao, IdDaiDiendonviBanHanhQD, DaXacNhan, IdDaiDienBenGiao, DaiDienBenGiaoXacNhan, IdDaiDienBenNhan, DaiDienBenNhanXacNhan, IdDonViDaiDien, DonViDaiDienXacNhan, TrangThai, Note, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, obj.getId(),obj.getIdCongTy(), obj.getBanGiaoPhuLuc(), obj.getQuyetDinhDieuDongSo(), obj.getLenhDieuDong(), obj.getIdDonViGiao(), obj.getIdDonViNhan(), obj.getNgayBanGiao(), obj.getIdLanhDao(), obj.getIdDaiDiendonviBanHanhQD(), obj.getDaXacNhan(), obj.getIdDaiDienBenGiao(), obj.getDaiDienBenGiaoXacNhan(), obj.getIdDaiDienBenNhan(), obj.getDaiDienBenNhanXacNhan(), obj.getIdDonViDaiDien(), obj.getDonViDaiDienXacNhan(), obj.getTrangThai(), obj.getNote(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive());
        }
    }

    public int update(BanGiaoPhuLuc obj) {
        String sql = "UPDATE BanGiaoPhuLuc SET BanGiaoPhuLuc=?,IdCongty=?, QuyetDinhDieuDongSo=?, LenhDieuDong=?, IdDonViGiao=?, IdDonViNhan=?, NgayBanGiao=?, IdLanhDao=?, IdDaiDiendonviBanHanhQD=?, DaXacNhan=?, IdDaiDienBenGiao=?, DaiDienBenGiaoXacNhan=?, IdDaiDienBenNhan=?, DaiDienBenNhanXacNhan=?, IdDonViDaiDien=?, DonViDaiDienXacNhan=?, TrangThai=?, Note=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, obj.getBanGiaoPhuLuc(),obj.getIdCongTy(), obj.getQuyetDinhDieuDongSo(), obj.getLenhDieuDong(), obj.getIdDonViGiao(), obj.getIdDonViNhan(), obj.getNgayBanGiao(), obj.getIdLanhDao(), obj.getIdDaiDiendonviBanHanhQD(), obj.getDaXacNhan(), obj.getIdDaiDienBenGiao(), obj.getDaiDienBenGiaoXacNhan(), obj.getIdDaiDienBenNhan(), obj.getDaiDienBenNhanXacNhan(), obj.getIdDonViDaiDien(), obj.getDonViDaiDienXacNhan(), obj.getTrangThai(), obj.getNote(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM BanGiaoPhuLuc WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
