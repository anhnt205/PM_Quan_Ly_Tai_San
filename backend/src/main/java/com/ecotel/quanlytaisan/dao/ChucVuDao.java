package com.ecotel.quanlytaisan.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.ChucVu;

@Repository
public class ChucVuDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<ChucVu> rowMapper = new RowMapper<>() {
        @Override
        public ChucVu mapRow(ResultSet rs, int rowNum) throws SQLException {
            ChucVu cv = new ChucVu();
            cv.setId(rs.getString("Id"));
            cv.setTenChucVu(rs.getString("TenChucVu"));

            cv.setQuanLyNhanVien(rs.getBoolean("QuanLyNhanVien"));
            cv.setQuanLyPhongBan(rs.getBoolean("QuanLyPhongBan"));
            cv.setQuanLyDuAn(rs.getBoolean("QuanLyDuAn"));
            cv.setQuanLyNguonVon(rs.getBoolean("QuanLyNguonVon"));
            cv.setQuanLyMoHinhTaiSan(rs.getBoolean("QuanLyMoHinhTaiSan"));
            cv.setQuanLyNhomTaiSan(rs.getBoolean("QuanLyNhomTaiSan"));
            cv.setQuanLyTaiSan(rs.getBoolean("QuanLyTaiSan"));
            cv.setQuanLyCCDCVatTu(rs.getBoolean("QuanLyCCDCVatTu"));
            cv.setDieuDongTaiSan(rs.getBoolean("DieuDongTaiSan"));
            cv.setDieuDongCCDCVatTu(rs.getBoolean("DieuDongCCDCVatTu"));
            cv.setBanGiaoTaiSan(rs.getBoolean("BanGiaoTaiSan"));
            cv.setBanGiaoCCDCVatTu(rs.getBoolean("BanGiaoCCDCVatTu"));
            cv.setBaoCao(rs.getBoolean("BaoCao"));

            cv.setIdCongTy(rs.getString("IdCongTy"));
            cv.setNgayTao(rs.getString("NgayTao"));
            cv.setNgayCapNhat(rs.getString("NgayCapNhat"));
            cv.setNguoiTao(rs.getString("NguoiTao"));
            cv.setNguoiCapNhat(rs.getString("NguoiCapNhat"));

            return cv;
        }
    };

    // RowMapper có JOIN với bảng CongTy để lấy thêm TenCongTy
    private RowMapper<ChucVu> rowMapperWithCongTy = new RowMapper<>() {
        @Override
        public ChucVu mapRow(ResultSet rs, int rowNum) throws SQLException {
            ChucVu cv = new ChucVu();
            cv.setId(rs.getString("Id"));
            cv.setTenChucVu(rs.getString("TenChucVu"));

            cv.setQuanLyNhanVien(rs.getBoolean("QuanLyNhanVien"));
            cv.setQuanLyPhongBan(rs.getBoolean("QuanLyPhongBan"));
            cv.setQuanLyDuAn(rs.getBoolean("QuanLyDuAn"));
            cv.setQuanLyNguonVon(rs.getBoolean("QuanLyNguonVon"));
            cv.setQuanLyMoHinhTaiSan(rs.getBoolean("QuanLyMoHinhTaiSan"));
            cv.setQuanLyNhomTaiSan(rs.getBoolean("QuanLyNhomTaiSan"));
            cv.setQuanLyTaiSan(rs.getBoolean("QuanLyTaiSan"));
            cv.setQuanLyCCDCVatTu(rs.getBoolean("QuanLyCCDCVatTu"));
            cv.setDieuDongTaiSan(rs.getBoolean("DieuDongTaiSan"));
            cv.setDieuDongCCDCVatTu(rs.getBoolean("DieuDongCCDCVatTu"));
            cv.setBanGiaoTaiSan(rs.getBoolean("BanGiaoTaiSan"));
            cv.setBanGiaoCCDCVatTu(rs.getBoolean("BanGiaoCCDCVatTu"));
            cv.setBaoCao(rs.getBoolean("BaoCao"));

            cv.setIdCongTy(rs.getString("IdCongTy"));
            cv.setNgayTao(rs.getString("NgayTao"));
            cv.setNgayCapNhat(rs.getString("NgayCapNhat"));
            cv.setNguoiTao(rs.getString("NguoiTao"));
            cv.setNguoiCapNhat(rs.getString("NguoiCapNhat"));

            // Thêm TenCongTy từ JOIN
            try {
                cv.setTenCongTy(rs.getString("TenCongTy"));
            } catch (SQLException e) {
                cv.setTenCongTy(null);
            }

            return cv;
        }
    };

    public int insert(ChucVu cv) {
        String checkSql = "SELECT COUNT(*) FROM ChucVu WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, cv.getId());

        if (count > 0) {
            return update(cv);
        } else {
            String sql = """
                    INSERT INTO ChucVu(Id, TenChucVu, QuanLyNhanVien, QuanLyPhongBan, QuanLyDuAn,
                                       QuanLyNguonVon, QuanLyMoHinhTaiSan, QuanLyNhomTaiSan, QuanLyTaiSan,
                                       QuanLyCCDCVatTu, DieuDongTaiSan, DieuDongCCDCVatTu, BanGiaoTaiSan,
                                       BanGiaoCCDCVatTu, BaoCao, IdCongTy, NgayTao, NguoiTao)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;
            return jdbcTemplate.update(sql,
                    cv.getId(),
                    cv.getTenChucVu(),
                    cv.getQuanLyNhanVien(),
                    cv.getQuanLyPhongBan(),
                    cv.getQuanLyDuAn(),
                    cv.getQuanLyNguonVon(),
                    cv.getQuanLyMoHinhTaiSan(),
                    cv.getQuanLyNhomTaiSan(),
                    cv.getQuanLyTaiSan(),
                    cv.getQuanLyCCDCVatTu(),
                    cv.getDieuDongTaiSan(),
                    cv.getDieuDongCCDCVatTu(),
                    cv.getBanGiaoTaiSan(),
                    cv.getBanGiaoCCDCVatTu(),
                    cv.getBaoCao(),
                    cv.getIdCongTy(),
                    cv.getNgayTao(),
                    cv.getNguoiTao()
            );
        }
    }

    public int update(ChucVu cv) {
        String sql = """
                UPDATE ChucVu
                SET TenChucVu=?, QuanLyNhanVien=?, QuanLyPhongBan=?, QuanLyDuAn=?, QuanLyNguonVon=?,
                    QuanLyMoHinhTaiSan=?, QuanLyNhomTaiSan=?, QuanLyTaiSan=?, QuanLyCCDCVatTu=?,
                    DieuDongTaiSan=?, DieuDongCCDCVatTu=?, BanGiaoTaiSan=?, BanGiaoCCDCVatTu=?, BaoCao=?,
                    IdCongTy=?, NgayCapNhat=?, NguoiCapNhat=?
                WHERE Id=?
                """;
        return jdbcTemplate.update(sql,
                cv.getTenChucVu(),
                cv.getQuanLyNhanVien(),
                cv.getQuanLyPhongBan(),
                cv.getQuanLyDuAn(),
                cv.getQuanLyNguonVon(),
                cv.getQuanLyMoHinhTaiSan(),
                cv.getQuanLyNhomTaiSan(),
                cv.getQuanLyTaiSan(),
                cv.getQuanLyCCDCVatTu(),
                cv.getDieuDongTaiSan(),
                cv.getDieuDongCCDCVatTu(),
                cv.getBanGiaoTaiSan(),
                cv.getBanGiaoCCDCVatTu(),
                cv.getBaoCao(),
                cv.getIdCongTy(),
                cv.getNgayCapNhat(),
                cv.getNguoiCapNhat(),
                cv.getId()
        );
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChucVu WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public List<ChucVu> findAll(String idCongTy) {
        String sql = """
                SELECT cv.*, ct.TenCongTy 
                FROM ChucVu cv 
                LEFT JOIN CongTy ct ON cv.IdCongTy = ct.Id 
                WHERE cv.IdCongTy=?
                """;
        return jdbcTemplate.query(sql, rowMapperWithCongTy, idCongTy);
    }

    public List<ChucVu> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String searchKeyword) {
        List<Object> params = new ArrayList<>();

        StringBuilder sql = new StringBuilder("""
                SELECT cv.*, ct.TenCongTy 
                FROM ChucVu cv 
                LEFT JOIN CongTy ct ON cv.IdCongTy = ct.Id 
                WHERE cv.IdCongTy=?
                """);
        params.add(idCongTy);

        // Thêm điều kiện tìm kiếm
        if (searchKeyword != null && !searchKeyword.trim().isEmpty()) {
            sql.append(" AND (cv.Id LIKE ? OR cv.TenChucVu LIKE ? OR ct.TenCongTy LIKE ?)");
            String searchPattern = "%" + searchKeyword.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        // Xử lý sắp xếp
        String orderBy = "cv.Id";
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            String[] allowedColumns = {"Id", "TenChucVu", "NgayTao", "NgayCapNhat"};
            for (String column : allowedColumns) {
                if (column.equalsIgnoreCase(sortBy)) {
                    orderBy = "cv." + column;
                    break;
                }
            }
        }

        String direction = "ASC";
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            direction = "DESC";
        }

        sql.append(" ORDER BY ").append(orderBy).append(" ").append(direction);
        sql.append(" LIMIT ? OFFSET ?");

        int offset = page * size;
        params.add(size);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), rowMapperWithCongTy, params.toArray());
    }

    public long countAll(String idCongTy, String searchKeyword) {
        StringBuilder sql = new StringBuilder("""
                SELECT COUNT(*) 
                FROM ChucVu cv 
                LEFT JOIN CongTy ct ON cv.IdCongTy = ct.Id 
                WHERE cv.IdCongTy=?
                """);

        if (searchKeyword != null && !searchKeyword.trim().isEmpty()) {
            sql.append(" AND (cv.Id LIKE ? OR cv.TenChucVu LIKE ? OR ct.TenCongTy LIKE ?)");
            String searchPattern = "%" + searchKeyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql.toString(), Long.class,
                    idCongTy, searchPattern, searchPattern, searchPattern);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, idCongTy);
    }

    public ChucVu findById(String id) {
        String sql = """
                SELECT cv.*, ct.TenCongTy 
                FROM ChucVu cv 
                LEFT JOIN CongTy ct ON cv.IdCongTy = ct.Id 
                WHERE cv.Id=?
                """;
        return jdbcTemplate.queryForObject(sql, rowMapperWithCongTy, id);
    }

    public List<ChucVu> findByTen(String ten) {
        String sql = """
                SELECT cv.*, ct.TenCongTy 
                FROM ChucVu cv 
                LEFT JOIN CongTy ct ON cv.IdCongTy = ct.Id 
                WHERE cv.TenChucVu LIKE ?
                """;
        return jdbcTemplate.query(sql, rowMapperWithCongTy, "%" + ten + "%");
    }




    public int deleteAll() {
        String sql = "DELETE FROM ChucVu";
        return jdbcTemplate.update(sql);
    }





}