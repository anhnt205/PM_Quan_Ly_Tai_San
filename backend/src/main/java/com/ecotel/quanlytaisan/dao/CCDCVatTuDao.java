package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.CCDCVatTu;
import com.ecotel.quanlytaisan.model.CCDCVatTuDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CCDCVatTuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<CCDCVatTuDTO> findAll(String idCongTy) {
        String sql = """
                SELECT 
                    ccdc.Id,
                    ccdc.Ten,
                    ccdc.IdDonVi,
                    pb.TenPhongBan AS TenDonVi,
                    ccdc.IdNhomCCDC,
                    nccdc.Ten as TenNhomCCDC,
                    ccdc.NgayNhap,
                    ccdc.DonVitinh,
                    ccdc.SoLuong,
                    ccdc.GiaTri,
                    ccdc.SoKyHieu,
                    ccdc.KyHieu,
                    ccdc.CongSuat,
                    ccdc.NuocSanXuat,
                    ccdc.NamSanXuat,
                    ccdc.GhiChu,
                    ccdc.IdCongTy,
                    ccdc.NgayTao,
                    ccdc.NgayCapNhat,
                    ccdc.NguoiTao,
                    ccdc.NguoiCapNhat,
                    ccdc.IsActive,
                    ccdc.IdLoaiCCDCCon, 
                    ccdc.HienTrang
                FROM 
                    CCDCVatTu AS ccdc
                LEFT JOIN 
                    PhongBan AS pb ON ccdc.IdDonVi = pb.Id
                LEFT JOIN 
                    NhomCCDC as nccdc on nccdc.Id = ccdc.IdNhomCCDC
                
                WHERE 
                    ccdc.IdCongTy = ? 
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(CCDCVatTuDTO.class), idCongTy);

    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM CCDCVatTu ccdc WHERE ccdc.IdCongTy = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public List<CCDCVatTuDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir) {
        String orderColumn = resolveOrderColumn(sortBy);
        String direction = resolveDirection(sortDir);

        String sql = """
                SELECT 
                    ccdc.Id,
                    ccdc.Ten,
                    ccdc.IdDonVi,
                    pb.TenPhongBan AS TenDonVi,
                    ccdc.IdNhomCCDC,
                    nccdc.Ten as TenNhomCCDC,
                    ccdc.NgayNhap,
                    ccdc.DonVitinh,
                    ccdc.SoLuong,
                    ccdc.GiaTri,
                    ccdc.SoKyHieu,
                    ccdc.KyHieu,
                    ccdc.CongSuat,
                    ccdc.NuocSanXuat,
                    ccdc.NamSanXuat,
                    ccdc.GhiChu,
                    ccdc.IdCongTy,
                    ccdc.NgayTao,
                    ccdc.NgayCapNhat,
                    ccdc.NguoiTao,
                    ccdc.NguoiCapNhat,
                    ccdc.IsActive,
                    ccdc.IdLoaiCCDCCon, 
                    ccdc.HienTrang
                FROM 
                    CCDCVatTu AS ccdc
                LEFT JOIN 
                    PhongBan AS pb ON ccdc.IdDonVi = pb.Id
                LEFT JOIN 
                    NhomCCDC as nccdc on nccdc.Id = ccdc.IdNhomCCDC
                WHERE ccdc.IdCongTy = ?
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """;
        String finalSql = String.format(sql, orderColumn, direction);
        return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(CCDCVatTuDTO.class), idCongTy, limit, offset);
    }

    private String resolveOrderColumn(String sortBy) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        switch (normalizedSortBy) {
            case "ten":
                return "ccdc.Ten";
            case "ngaynhap":
                return "ccdc.NgayNhap";
            case "ngaycapnhat":
            default:
                return "ccdc.NgayCapNhat";
        }
    }

    private String resolveDirection(String sortDir) {
        return (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";
    }

    public List<CCDCVatTuDTO> findAllPagedByDonViSoHuu(String idCongTy, String idDonViSoHuu, int offset, int limit, String sortBy, String sortDir, boolean daBanGiao) {
        String orderColumn = resolveOrderColumn(sortBy);
        String direction = resolveDirection(sortDir);
        String condition;
        if (daBanGiao) {
            condition = "EXISTS (SELECT 1 FROM ChiTietDonViSoHuu ctdv WHERE ctdv.IdCCDCVT = ccdc.Id AND ctdv.IdDonViSoHuu = ?)";
        } else {
            condition = "NOT EXISTS (SELECT 1 FROM ChiTietDonViSoHuu ctdv WHERE ctdv.IdCCDCVT = ccdc.Id AND ctdv.IdDonViSoHuu = ?) AND ccdc.IdDonVi = ?";
        }

        String sql = """
                SELECT 
                    ccdc.Id,
                    ccdc.Ten,
                    ccdc.IdDonVi,
                    pb.TenPhongBan AS TenDonVi,
                    ccdc.IdNhomCCDC,
                    nccdc.Ten as TenNhomCCDC,
                    ccdc.NgayNhap,
                    ccdc.DonVitinh,
                    ccdc.SoLuong,
                    ccdc.GiaTri,
                    ccdc.SoKyHieu,
                    ccdc.KyHieu,
                    ccdc.CongSuat,
                    ccdc.NuocSanXuat,
                    ccdc.NamSanXuat,
                    ccdc.GhiChu,
                    ccdc.IdCongTy,
                    ccdc.NgayTao,
                    ccdc.NgayCapNhat,
                    ccdc.NguoiTao,
                    ccdc.NguoiCapNhat,
                    ccdc.IsActive,
                    ccdc.IdLoaiCCDCCon, 
                    ccdc.HienTrang
                FROM 
                    CCDCVatTu AS ccdc
                LEFT JOIN 
                    PhongBan AS pb ON ccdc.IdDonVi = pb.Id
                LEFT JOIN 
                    NhomCCDC as nccdc on nccdc.Id = ccdc.IdNhomCCDC
                WHERE ccdc.IdCongTy = ?
                  AND %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """;
        String finalSql = String.format(sql, condition, orderColumn, direction);
        Object[] params = daBanGiao
                ? new Object[]{idCongTy, idDonViSoHuu, limit, offset}
                : new Object[]{idCongTy, idDonViSoHuu, idDonViSoHuu, limit, offset};
        return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(CCDCVatTuDTO.class), params);
    }

    public long countByDonViSoHuu(String idCongTy, String idDonViSoHuu, boolean daBanGiao) {
        String condition;
        Object[] params;
        if (daBanGiao) {
            condition = "EXISTS (SELECT 1 FROM ChiTietDonViSoHuu ctdv WHERE ctdv.IdCCDCVT = ccdc.Id AND ctdv.IdDonViSoHuu = ?)";
            params = new Object[]{idCongTy, idDonViSoHuu};
        } else {
            condition = "NOT EXISTS (SELECT 1 FROM ChiTietDonViSoHuu ctdv WHERE ctdv.IdCCDCVT = ccdc.Id AND ctdv.IdDonViSoHuu = ?) AND ccdc.IdDonVi = ?";
            params = new Object[]{idCongTy, idDonViSoHuu, idDonViSoHuu};
        }
        String sql = "SELECT COUNT(*) FROM CCDCVatTu ccdc WHERE ccdc.IdCongTy = ? AND " + condition;
        return jdbcTemplate.queryForObject(sql, Long.class, params);
    }

    public CCDCVatTuDTO findById(String id) {
        String sql = """
                SELECT 
                      ccdc.Id,
                      ccdc.Ten,
                      ccdc.IdDonVi,
                      pb.TenPhongBan AS TenDonVi,
                      ccdc.NgayNhap,
                    ccdc.IdNhomCCDC,
                        nccdc.Ten as TenNhomCCDC,
                      ccdc.DonVitinh,
                      ccdc.SoLuong,
                      ccdc.GiaTri,
                      ccdc.SoKyHieu,
                      ccdc.KyHieu,
                      ccdc.CongSuat,
                      ccdc.NuocSanXuat,
                      ccdc.NamSanXuat,
                      ccdc.GhiChu,
                      ccdc.IdCongTy,
                      ccdc.NgayTao,
                      ccdc.NgayCapNhat,
                      ccdc.NguoiTao,
                      ccdc.NguoiCapNhat,
                      ccdc.IsActive,
                      ccdc.IdLoaiCCDCCon,
                         ccdc.HienTrang
                  FROM 
                      CCDCVatTu AS ccdc
                  LEFT JOIN 
                      PhongBan AS pb ON ccdc.IdDonVi = pb.Id
                LEFT JOIN 
                    NhomCCDC as nccdc on nccdc.Id = ccdc.IdNhomCCDC
                  WHERE 
                       ccdc.Id = ? 
                """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(CCDCVatTuDTO.class), id);
    }

    public int insert(CCDCVatTu ccdc) {
        // Kiểm tra id không null và không empty
        if (ccdc.getId() == null || ccdc.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM CCDCVatTu WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, ccdc.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(ccdc);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO CCDCVatTu (Id, IdDonVi, Ten, NgayNhap, DonVitinh, SoLuong, GiaTri, SoKyHieu, KyHieu, CongSuat, NuocSanXuat, NamSanXuat, GhiChu, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive,IdNhomCCDC,IdLoaiCCDCCon,   HienTrang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?)";
            return jdbcTemplate.update(sql, ccdc.getId(), ccdc.getIdDonVi(), ccdc.getTen(), ccdc.getNgayNhap(), ccdc.getDonViTinh(), ccdc.getSoLuong(), ccdc.getGiaTri(), ccdc.getSoKyHieu(), ccdc.getKyHieu(), ccdc.getCongSuat(), ccdc.getNuocSanXuat(), ccdc.getNamSanXuat(), ccdc.getGhiChu(), ccdc.getIdCongTy(), ccdc.getNgayTao(), ccdc.getNgayCapNhat(), ccdc.getNguoiTao(), ccdc.getNguoiCapNhat(), ccdc.getIsActive(), ccdc.getIdNhomCCDC(),ccdc.getIdLoaiCCDCCon(), ccdc.getHienTrang());
        }
    }

    public int update(CCDCVatTu ccdc) {
        String sql = "UPDATE CCDCVatTu SET IdDonVi=?, Ten=?, NgayNhap=?, DonVitinh=?, SoLuong=?, GiaTri=?, SoKyHieu=?, KyHieu=?, CongSuat=?, NuocSanXuat=?, NamSanXuat=?, GhiChu=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?,IdNhomCCDC=?,IdLoaiCCDCCon=?,    HienTrang=? WHERE Id=?";
        return jdbcTemplate.update(sql, ccdc.getIdDonVi(), ccdc.getTen(), ccdc.getNgayNhap(), ccdc.getDonViTinh(), ccdc.getSoLuong(), ccdc.getGiaTri(), ccdc.getSoKyHieu(), ccdc.getKyHieu(), ccdc.getCongSuat(), ccdc.getNuocSanXuat(), ccdc.getNamSanXuat(), ccdc.getGhiChu(), ccdc.getIdCongTy(), ccdc.getNgayTao(), ccdc.getNgayCapNhat(), ccdc.getNguoiTao(), ccdc.getNguoiCapNhat(), ccdc.getIsActive(), ccdc.getIdNhomCCDC(),ccdc.getIdLoaiCCDCCon(), ccdc.getHienTrang(), ccdc.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM CCDCVatTu WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteAllChiTietTaiSan() {
        String sql = "DELETE FROM ChiTietTaiSan WHERE IdTaiSan IN (SELECT Id FROM CCDCVatTu)";
        return jdbcTemplate.update(sql);
    }

    public int deleteAllChiTietDonViSoHuu() {
        String sql = "DELETE FROM ChiTietDonViSoHuu WHERE IdCCDCVT IN (SELECT Id FROM CCDCVatTu)";
        return jdbcTemplate.update(sql);
    }

    public int deleteAll() {
        String sql = "DELETE FROM CCDCVatTu";
        return jdbcTemplate.update(sql);
    }
}
