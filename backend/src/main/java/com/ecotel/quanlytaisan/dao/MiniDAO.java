package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.MiniDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * DAO chung để lấy dữ liệu tối giản (id, tên) cho các dropdown/select
 */
@Repository
public class MiniDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<MiniDTO> miniRowMapper = (rs, rowNum) ->
        new MiniDTO(rs.getString("id"), rs.getString("ten"));

    // ========== PHÒNG BAN ==========
    public long countPhongBanMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM PhongBan WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM PhongBan WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenPhongBan) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findPhongBanMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenPhongBan) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, TenPhongBan AS ten FROM PhongBan %s ORDER BY TenPhongBan ASC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== NHÂN VIÊN ==========
    public long countNhanVienMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM NhanVien WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM NhanVien WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(HoTen) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findNhanVienMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(HoTen) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, HoTen AS ten FROM NhanVien %s ORDER BY HoTen ASC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== ĐƠN VỊ TÍNH ==========
    public long countDonViTinhMini(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM DonViTinh";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = "SELECT COUNT(*) FROM DonViTinh WHERE LOWER(Id) LIKE LOWER(?) OR LOWER(TenDonVi) LIKE LOWER(?)";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findDonViTinhMini(int offset, int limit, String keyword) {
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        String sql;
        if (hasKeyword) {
            sql = "SELECT Id AS id, TenDonVi AS ten FROM DonViTinh WHERE LOWER(Id) LIKE LOWER(?) OR LOWER(TenDonVi) LIKE LOWER(?) ORDER BY TenDonVi ASC LIMIT ? OFFSET ?";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, searchPattern, searchPattern, limit, offset);
        } else {
            sql = "SELECT Id AS id, TenDonVi AS ten FROM DonViTinh ORDER BY TenDonVi ASC LIMIT ? OFFSET ?";
            return jdbcTemplate.query(sql, miniRowMapper, limit, offset);
        }
    }

    // ========== HIỆN TRẠNG KỸ THUẬT ==========
    public long countHienTrangMini(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM HienTrangKyThuat WHERE IsActive = true";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = "SELECT COUNT(*) FROM HienTrangKyThuat WHERE IsActive = true AND (LOWER(CAST(Id AS CHAR)) LIKE LOWER(?) OR LOWER(TenHTKT) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findHienTrangMini(int offset, int limit, String keyword) {
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        String sql;
        if (hasKeyword) {
            sql = "SELECT CAST(Id AS CHAR) AS id, TenHTKT AS ten FROM HienTrangKyThuat WHERE IsActive = true AND (LOWER(CAST(Id AS CHAR)) LIKE LOWER(?) OR LOWER(TenHTKT) LIKE LOWER(?)) ORDER BY TenHTKT ASC LIMIT ? OFFSET ?";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, searchPattern, searchPattern, limit, offset);
        } else {
            sql = "SELECT CAST(Id AS CHAR) AS id, TenHTKT AS ten FROM HienTrangKyThuat WHERE IsActive = true ORDER BY TenHTKT ASC LIMIT ? OFFSET ?";
            return jdbcTemplate.query(sql, miniRowMapper, limit, offset);
        }
    }

    // ========== DỰ ÁN ==========
    public long countDuAnMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM DuAn WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM DuAn WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenDuAn) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findDuAnMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenDuAn) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, TenDuAn AS ten FROM DuAn %s ORDER BY TenDuAn ASC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== NHÓM TÀI SẢN ==========
    public long countNhomTaiSanMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM NhomTaiSan WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM NhomTaiSan WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenNhom) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findNhomTaiSanMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenNhom) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, TenNhom AS ten FROM NhomTaiSan %s ORDER BY TenNhom ASC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== LOẠI TÀI SẢN ==========
    public long countLoaiTaiSanMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM LoaiTaiSan WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM LoaiTaiSan WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenLoai) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findLoaiTaiSanMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenLoai) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, TenLoai AS ten FROM LoaiTaiSan %s ORDER BY TenLoai ASC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== LÝ DO TĂNG ==========
    public long countLyDoTangMini(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM LyDoTang";
            return jdbcTemplate.queryForObject(sql, Long.class);
        } else {
            String sql = "SELECT COUNT(*) FROM LyDoTang WHERE LOWER(Id) LIKE LOWER(?) OR LOWER(TenLyDo) LIKE LOWER(?)";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findLyDoTangMini(int offset, int limit, String keyword) {
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        String sql;
        if (hasKeyword) {
            sql = "SELECT Id AS id, TenLyDo AS ten FROM LyDoTang WHERE LOWER(Id) LIKE LOWER(?) OR LOWER(TenLyDo) LIKE LOWER(?) ORDER BY TenLyDo ASC LIMIT ? OFFSET ?";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, searchPattern, searchPattern, limit, offset);
        } else {
            sql = "SELECT Id AS id, TenLyDo AS ten FROM LyDoTang ORDER BY TenLyDo ASC LIMIT ? OFFSET ?";
            return jdbcTemplate.query(sql, miniRowMapper, limit, offset);
        }
    }

    // ========== NHÓM CCDC ==========
    public long countNhomCCDCMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM NhomCCDC WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM NhomCCDC WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenNhom) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findNhomCCDCMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenNhom) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, TenNhom AS ten FROM NhomCCDC %s ORDER BY TenNhom ASC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== LOẠI CCDC ==========
    public long countLoaiCCDCMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM LoaiCCDCCon WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM LoaiCCDCCon WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenLoai) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findLoaiCCDCMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(TenLoai) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, TenLoai AS ten FROM LoaiCCDCCon %s ORDER BY TenLoai ASC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== ĐIỀU ĐỘNG TÀI SẢN ==========
    public long countDieuDongTaiSanMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM DieuDongTaiSan WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM DieuDongTaiSan WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(SoChungTu) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findDieuDongTaiSanMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(SoChungTu) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, SoChungTu AS ten FROM DieuDongTaiSan %s ORDER BY NgayTao DESC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }

    // ========== ĐIỀU ĐỘNG CCDC ==========
    public long countDieuDongCCDCMini(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM DieuDongCCDCVatTu WHERE IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = "SELECT COUNT(*) FROM DieuDongCCDCVatTu WHERE IdCongTy = ? AND (LOWER(Id) LIKE LOWER(?) OR LOWER(SoChungTu) LIKE LOWER(?))";
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern);
        }
    }

    public List<MiniDTO> findDieuDongCCDCMini(String idCongTy, int offset, int limit, String keyword) {
        String whereClause = "WHERE IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            whereClause += " AND (LOWER(Id) LIKE LOWER(?) OR LOWER(SoChungTu) LIKE LOWER(?))";
        }

        String sql = String.format("SELECT Id AS id, SoChungTu AS ten FROM DieuDongCCDCVatTu %s ORDER BY NgayTao DESC LIMIT ? OFFSET ?", whereClause);

        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, miniRowMapper, idCongTy, limit, offset);
        }
    }
}
