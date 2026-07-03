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
            cv.setBanHanhQuyetDinh(rs.getBoolean("BanHanhQuyetDinh"));

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
            cv.setBanHanhQuyetDinh(rs.getBoolean("BanHanhQuyetDinh"));

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
                                       BanGiaoCCDCVatTu, BaoCao,BanHanhQuyetDinh, IdCongTy, NgayTao, NguoiTao)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
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
                    cv.getBanHanhQuyetDinh(),
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
                    DieuDongTaiSan=?, DieuDongCCDCVatTu=?, BanGiaoTaiSan=?, BanGiaoCCDCVatTu=?, BaoCao=?,BanHanhQuyetDinh=?,
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
                cv.getBanHanhQuyetDinh(),
                cv.getIdCongTy(),
                cv.getNgayCapNhat(),
                cv.getNguoiCapNhat(),
                cv.getId()
        );
    }

    public int batchUpdate(List<ChucVu> list) {
        String sql = """
                UPDATE ChucVu
                SET TenChucVu=?, QuanLyNhanVien=?, QuanLyPhongBan=?, QuanLyDuAn=?, QuanLyNguonVon=?,
                    QuanLyMoHinhTaiSan=?, QuanLyNhomTaiSan=?, QuanLyTaiSan=?, QuanLyCCDCVatTu=?,
                    DieuDongTaiSan=?, DieuDongCCDCVatTu=?, BanGiaoTaiSan=?, BanGiaoCCDCVatTu=?, BaoCao=?,BanHanhQuyetDinh=?,
                    IdCongTy=?, NgayCapNhat=?, NguoiCapNhat=?
                WHERE Id=?
                """;
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ChucVu cv = list.get(i);
                ps.setString(1, cv.getTenChucVu());
                ps.setBoolean(2, cv.getQuanLyNhanVien() != null ? cv.getQuanLyNhanVien() : false);
                ps.setBoolean(3, cv.getQuanLyPhongBan() != null ? cv.getQuanLyPhongBan() : false);
                ps.setBoolean(4, cv.getQuanLyDuAn() != null ? cv.getQuanLyDuAn() : false);
                ps.setBoolean(5, cv.getQuanLyNguonVon() != null ? cv.getQuanLyNguonVon() : false);
                ps.setBoolean(6, cv.getQuanLyMoHinhTaiSan() != null ? cv.getQuanLyMoHinhTaiSan() : false);
                ps.setBoolean(7, cv.getQuanLyNhomTaiSan() != null ? cv.getQuanLyNhomTaiSan() : false);
                ps.setBoolean(8, cv.getQuanLyTaiSan() != null ? cv.getQuanLyTaiSan() : false);
                ps.setBoolean(9, cv.getQuanLyCCDCVatTu() != null ? cv.getQuanLyCCDCVatTu() : false);
                ps.setBoolean(10, cv.getDieuDongTaiSan() != null ? cv.getDieuDongTaiSan() : false);
                ps.setBoolean(11, cv.getDieuDongCCDCVatTu() != null ? cv.getDieuDongCCDCVatTu() : false);
                ps.setBoolean(12, cv.getBanGiaoTaiSan() != null ? cv.getBanGiaoTaiSan() : false);
                ps.setBoolean(13, cv.getBanGiaoCCDCVatTu() != null ? cv.getBanGiaoCCDCVatTu() : false);
                ps.setBoolean(14, cv.getBaoCao() != null ? cv.getBaoCao() : false);
                ps.setBoolean(15, cv.getBanHanhQuyetDinh() != null ? cv.getBanHanhQuyetDinh() : false);
                ps.setString(16, cv.getIdCongTy());
                ps.setString(17, cv.getNgayCapNhat());
                ps.setString(18, cv.getNguoiCapNhat());
                ps.setString(19, cv.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchInsert(List<ChucVu> list) {
        String sql = """
                INSERT INTO ChucVu(Id, TenChucVu, QuanLyNhanVien, QuanLyPhongBan, QuanLyDuAn,
                                   QuanLyNguonVon, QuanLyMoHinhTaiSan, QuanLyNhomTaiSan, QuanLyTaiSan,
                                   QuanLyCCDCVatTu, DieuDongTaiSan, DieuDongCCDCVatTu, BanGiaoTaiSan,
                                   BanGiaoCCDCVatTu, BaoCao,BanHanhQuyetDinh, IdCongTy, NgayTao, NguoiTao)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
                """;
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ChucVu cv = list.get(i);
                ps.setString(1, cv.getId());
                ps.setString(2, cv.getTenChucVu());
                ps.setBoolean(3, cv.getQuanLyNhanVien() != null ? cv.getQuanLyNhanVien() : false);
                ps.setBoolean(4, cv.getQuanLyPhongBan() != null ? cv.getQuanLyPhongBan() : false);
                ps.setBoolean(5, cv.getQuanLyDuAn() != null ? cv.getQuanLyDuAn() : false);
                ps.setBoolean(6, cv.getQuanLyNguonVon() != null ? cv.getQuanLyNguonVon() : false);
                ps.setBoolean(7, cv.getQuanLyMoHinhTaiSan() != null ? cv.getQuanLyMoHinhTaiSan() : false);
                ps.setBoolean(8, cv.getQuanLyNhomTaiSan() != null ? cv.getQuanLyNhomTaiSan() : false);
                ps.setBoolean(9, cv.getQuanLyTaiSan() != null ? cv.getQuanLyTaiSan() : false);
                ps.setBoolean(10, cv.getQuanLyCCDCVatTu() != null ? cv.getQuanLyCCDCVatTu() : false);
                ps.setBoolean(11, cv.getDieuDongTaiSan() != null ? cv.getDieuDongTaiSan() : false);
                ps.setBoolean(12, cv.getDieuDongCCDCVatTu() != null ? cv.getDieuDongCCDCVatTu() : false);
                ps.setBoolean(13, cv.getBanGiaoTaiSan() != null ? cv.getBanGiaoTaiSan() : false);
                ps.setBoolean(14, cv.getBanGiaoCCDCVatTu() != null ? cv.getBanGiaoCCDCVatTu() : false);
                ps.setBoolean(15, cv.getBaoCao() != null ? cv.getBaoCao() : false);
                ps.setBoolean(16, cv.getBanHanhQuyetDinh() != null ? cv.getBanHanhQuyetDinh() : false);
                ps.setString(17, cv.getIdCongTy());
                ps.setString(18, cv.getNgayTao());
                ps.setString(19, cv.getNguoiTao());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchCreate(List<ChucVu> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (ChucVu cv : list) {
            if (cv.getId() != null && !cv.getId().trim().isEmpty()) {
                ids.add(cv.getId());
            }
        }

        if (ids.isEmpty()) {
            return 0;
        }

        StringBuilder inBuilder = new StringBuilder();
        for (int i = 0; i < ids.size(); i++) {
            inBuilder.append("?");
            if (i < ids.size() - 1) {
                inBuilder.append(",");
            }
        }

        String checkSql = "SELECT Id FROM ChucVu WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<ChucVu> toInsert = new java.util.ArrayList<>();
        List<ChucVu> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (ChucVu cv : list) {
            if (cv.getId() == null || cv.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(cv.getId())) {
                toUpdate.add(cv);
            } else {
                toInsert.add(cv);
            }
        }

        int total = 0;
        if (!toInsert.isEmpty()) {
            total += batchInsert(toInsert);
        }
        if (!toUpdate.isEmpty()) {
            total += batchUpdate(toUpdate);
        }

        return total;
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChucVu WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        String sql = "DELETE FROM ChucVu WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
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