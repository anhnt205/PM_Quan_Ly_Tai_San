package com.ecotel.quanlytaisan.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
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
            cv.setNgayTao(rs.getString("NgayTao") );
            cv.setNgayCapNhat(rs.getString("NgayCapNhat"));
            cv.setNguoiTao(rs.getString("NguoiTao"));
            cv.setNguoiCapNhat(rs.getString("NguoiCapNhat"));

            return cv;
        }
    };

    // Thêm mới
    public int insert(ChucVu cv) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ChucVu WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, cv.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(cv);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = """
                    INSERT INTO ChucVu(Id, TenChucVu, QuanLyNhanVien, QuanLyPhongBan, QuanLyDuAn,
                                       QuanLyNguonVon, QuanLyMoHinhTaiSan, QuanLyNhomTaiSan, QuanLyTaiSan,
                                       QuanLyCCDCVatTu, DieuDongTaiSan, DieuDongCCDCVatTu, BanGiaoTaiSan,
                                       BanGiaoCCDCVatTu, BaoCao, IdCongTy, NgayTao, NguoiTao)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
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

    // Sửa
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

    // Xóa
    public int delete(String id) {
        String sql = "DELETE FROM ChucVu WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    // Tìm tất cả
    public List<ChucVu> findAll(String idCongTy) {
        return jdbcTemplate.query("SELECT * FROM ChucVu where IdCongTy=?", rowMapper, idCongTy);
    }

    public List<ChucVu> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir) {
        // Xử lý sortBy và sortDir
        String orderBy = "Id"; // default sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            // Validate sortBy để tránh SQL injection
            String[] allowedColumns = {"Id", "TenChucVu", "NgayTao", "NgayCapNhat"};
            for (String column : allowedColumns) {
                if (column.equalsIgnoreCase(sortBy)) {
                    orderBy = column;
                    break;
                }
            }
        }
        
        String direction = "ASC";
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            direction = "DESC";
        }
        
        String sql = "SELECT * FROM ChucVu WHERE IdCongTy=? ORDER BY " + orderBy + " " + direction + " LIMIT ? OFFSET ?";
        int offset = page * size;
        return jdbcTemplate.query(sql, rowMapper, idCongTy, size, offset);
    }

    public long countAll(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM ChucVu WHERE IdCongTy=?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    // Tìm theo Id
    public ChucVu findById(String id) {
        String sql = "SELECT * FROM ChucVu WHERE Id=?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    // Tìm theo tên
    public List<ChucVu> findByTen(String ten) {
        String sql = "SELECT * FROM ChucVu WHERE TenChucVu LIKE ?";
        return jdbcTemplate.query(sql, rowMapper, "%" + ten + "%");
    }
}
