package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.CCDCVatTu;
import com.ecotel.quanlytaisan.model.CCDCVatTuDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
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

    public long countAllPaged(String idCongTy, String search, String idDonViSoHuu,String idNhomCCDC) {
    boolean hasSearch = search != null && !search.trim().isEmpty();
    boolean hasDonVi  = idDonViSoHuu != null && !idDonViSoHuu.trim().isEmpty();
    boolean hasNhomCCDC = idNhomCCDC != null && !idNhomCCDC.trim().isEmpty();

    StringBuilder sql = new StringBuilder("""
            SELECT COUNT(DISTINCT ccdc.Id)
            FROM CCDCVatTu ccdc
            LEFT JOIN PhongBan pb ON ccdc.IdDonVi = pb.Id
            LEFT JOIN NhomCCDC nccdc ON nccdc.Id = ccdc.IdNhomCCDC
            """);

    if (hasDonVi) {
        sql.append(" INNER JOIN ChiTietDonViSoHuu ctdv ON ctdv.IdCCDCVT = ccdc.Id AND ctdv.IdDonViSoHuu = ? ");
    }

    sql.append(" WHERE ccdc.IdCongTy = ? ");
     if (hasNhomCCDC) {
        sql.append(" AND ccdc.IdNhomCCDC = ? \n");
    }

    if (hasSearch) {
        sql.append("""
                AND (
                    ccdc.Id           LIKE ? OR
                    ccdc.Ten          LIKE ? OR
                    pb.TenPhongBan    LIKE ? OR
                    nccdc.Ten         LIKE ? OR
                    ccdc.KyHieu       LIKE ? OR
                    ccdc.SoKyHieu     LIKE ? OR
                    ccdc.CongSuat     LIKE ? OR
                    ccdc.NuocSanXuat  LIKE ? OR
                    ccdc.DonViTinh    LIKE ? OR
                    ccdc.GhiChu       LIKE ?
                )
                """);
    }

    List<Object> params = new ArrayList<>();
    if (hasDonVi)  params.add(idDonViSoHuu);
    params.add(idCongTy);
    if (hasNhomCCDC) params.add(idNhomCCDC);
    if (hasSearch) {
        String like = "%" + search.trim() + "%";
        for (int i = 0; i < 10; i++) params.add(like);
    }

    return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
}

    public List<CCDCVatTuDTO> findAllPaged(
            String idCongTy, int offset, int limit,
            String sortBy, String sortDir,
            String search, String idDonViSoHuu,String idNhomCCDC) {

        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasDonVi  = idDonViSoHuu != null && !idDonViSoHuu.trim().isEmpty();
        boolean hasNhomCCDC = idNhomCCDC != null && !idNhomCCDC.trim().isEmpty();

        String orderColumn = resolveOrderColumn(sortBy);
        String direction   = resolveDirection(sortDir);

        // SoLuong: nếu lọc theo đơn vị thì SUM của đơn vị đó, ngược lại lấy gốc
        String soLuongExpr = hasDonVi
                ? "COALESCE(SUM(ctdv.SoLuong), 0) AS SoLuong"
                : "ccdc.SoLuong";

        StringBuilder sql = new StringBuilder();
        sql.append("""
                SELECT
                    ccdc.Id,
                    ccdc.Ten,
                    ccdc.IdDonVi,
                    pb.TenPhongBan AS TenDonVi,
                    ccdc.IdNhomCCDC,
                    nccdc.Ten AS TenNhomCCDC,
                    ccdc.NgayNhap,
                    ccdc.DonVitinh,
                    """);
        sql.append("       ccdc.IdNhomCCDC, nccdc.Ten AS TenNhomCCDC, ccdc.NgayNhap, ccdc.DonVitinh,\n");
        sql.append("       ").append(soLuongExpr).append(",\n");
        sql.append("""
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
                FROM CCDCVatTu AS ccdc
                LEFT JOIN PhongBan AS pb ON ccdc.IdDonVi = pb.Id
                LEFT JOIN NhomCCDC AS nccdc ON nccdc.Id = ccdc.IdNhomCCDC
                """);

        if (hasDonVi) {
            sql.append(" INNER JOIN ChiTietDonViSoHuu ctdv ON ctdv.IdCCDCVT = ccdc.Id AND ctdv.IdDonViSoHuu = ? \n");
        }

        sql.append(" WHERE ccdc.IdCongTy = ? \n");
        if (hasNhomCCDC) {
            sql.append(" AND ccdc.IdNhomCCDC = ? \n");
        }

        if (hasSearch) {
            sql.append("""
                    AND (
                        ccdc.Id           LIKE ? OR
                        ccdc.Ten          LIKE ? OR
                        pb.TenPhongBan    LIKE ? OR
                        nccdc.Ten         LIKE ? OR
                        ccdc.KyHieu       LIKE ? OR
                        ccdc.SoKyHieu     LIKE ? OR
                        ccdc.CongSuat     LIKE ? OR
                        ccdc.NuocSanXuat  LIKE ? OR
                        ccdc.DonViTinh    LIKE ? OR
                        ccdc.GhiChu       LIKE ?
                    )
                    """);
        }

        if (hasDonVi) {
            sql.append("""
                    GROUP BY
                        ccdc.Id, ccdc.Ten, ccdc.IdDonVi, pb.TenPhongBan,
                        ccdc.IdNhomCCDC, nccdc.Ten, ccdc.NgayNhap, ccdc.DonVitinh,
                        ccdc.GiaTri, ccdc.SoKyHieu, ccdc.KyHieu, ccdc.CongSuat,
                        ccdc.NuocSanXuat, ccdc.NamSanXuat, ccdc.GhiChu, ccdc.IdCongTy,
                        ccdc.NgayTao, ccdc.NgayCapNhat, ccdc.NguoiTao, ccdc.NguoiCapNhat,
                        ccdc.IsActive, ccdc.IdLoaiCCDCCon, ccdc.HienTrang
                    """);
        }

        sql.append(" ORDER BY ").append(orderColumn).append(" ").append(direction).append("\n");
        sql.append(" LIMIT ? OFFSET ? ");

        List<Object> params = new ArrayList<>();
        if (hasDonVi)  params.add(idDonViSoHuu);
        params.add(idCongTy);
        if (hasNhomCCDC) params.add(idNhomCCDC);
        if (hasSearch) {
            String like = "%" + search.trim() + "%";
            for (int i = 0; i < 10; i++) params.add(like);
        }
        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(),
                new BeanPropertyRowMapper<>(CCDCVatTuDTO.class),
                params.toArray());
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
