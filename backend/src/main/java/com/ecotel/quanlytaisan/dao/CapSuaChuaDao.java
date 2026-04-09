package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.CapSuaChua;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CapSuaChuaDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<CapSuaChua> rowMapper = new RowMapper<CapSuaChua>() {
        @Override
        public CapSuaChua mapRow(ResultSet rs, int rowNum) throws SQLException {
            CapSuaChua item = new CapSuaChua();
            item.setId(rs.getString("Id"));
            item.setKyHieu(rs.getString("KyHieu"));
            item.setTen(rs.getString("Ten"));
            item.setChuKyThucHien(rs.getString("ChuKyThucHien"));
            item.setSoLanTrongChuKy(rs.getInt("SoLanTrongChuKy"));
            item.setThoiGianSuaChua(rs.getString("ThoiGianSuaChua"));
            item.setIdLoaiTaiSan(rs.getString("IdLoaiTaiSan"));
            try {
                item.setTenLoaiTaiSan(rs.getString("tenLoaiTaiSan"));
            } catch (SQLException e) {
                // column not present, ignore
            }
            item.setMocGioDau(rs.getObject("MocGioDau") != null ? rs.getInt("MocGioDau") : null);
            item.setMocGioCuoi(rs.getObject("MocGioCuoi") != null ? rs.getInt("MocGioCuoi") : null);
            item.setGhiChu(rs.getString("GhiChu"));
            item.setNgayTao(rs.getString("NgayTao"));
            item.setNgayCapNhat(rs.getString("NgayCapNhat"));
            item.setNguoiTao(rs.getString("NguoiTao"));
            item.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            return item;
        }
    };

    public List<CapSuaChua> findAll() {
        String sql = "SELECT csc.*, lts.TenLoai AS tenLoaiTaiSan FROM CapSuaChua csc LEFT JOIN LoaiTaiSanCon lts ON csc.IdLoaiTaiSan = lts.Id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<CapSuaChua> findAllPaged(int offset, int limit, String sortBy, String sortDir, String keyword) {
        String orderColumn = "csc.Ten";
        if (sortBy != null && !sortBy.isEmpty()) {
            switch (sortBy.toLowerCase()) {
                case "id": orderColumn = "csc.Id"; break;
                case "kyhieu": orderColumn = "csc.KyHieu"; break;
                case "ten": orderColumn = "csc.Ten"; break;
                case "ngaytao": orderColumn = "csc.NgayTao"; break;
            }
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = "";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        if (hasKeyword) {
            whereClause = " WHERE (LOWER(csc.Ten) LIKE LOWER(?) OR LOWER(csc.KyHieu) LIKE LOWER(?))";
        }

        String sql = "SELECT csc.*, lts.TenLoai AS tenLoaiTaiSan FROM CapSuaChua csc LEFT JOIN LoaiTaiSanCon lts ON csc.IdLoaiTaiSan = lts.Id " + whereClause + " ORDER BY " + orderColumn + " " + direction + " LIMIT ? OFFSET ?";

        if (hasKeyword) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.query(sql, rowMapper, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(sql, rowMapper, limit, offset);
        }
    }

    public long countAll(String keyword) {
        String whereClause = "";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereClause = " WHERE (LOWER(Ten) LIKE LOWER(?) OR LOWER(KyHieu) LIKE LOWER(?))";
        }
        String sql = "SELECT COUNT(*) FROM CapSuaChua " + whereClause;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class);
        }
    }

    public CapSuaChua findById(String id) {
        String sql = "SELECT csc.*, lts.TenLoai AS tenLoaiTaiSan FROM CapSuaChua csc LEFT JOIN LoaiTaiSanCon lts ON csc.IdLoaiTaiSan = lts.Id WHERE csc.Id = ?";
        return jdbcTemplate.queryForObject(sql, rowMapper, id);
    }

    public int insert(CapSuaChua item) {
        String sql = "INSERT INTO CapSuaChua (Id, KyHieu, Ten, ChuKyThucHien, SoLanTrongChuKy, ThoiGianSuaChua, IdLoaiTaiSan, MocGioDau, MocGioCuoi, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                item.getId(),
                item.getKyHieu(),
                item.getTen(),
                item.getChuKyThucHien(),
                item.getSoLanTrongChuKy(),
                item.getThoiGianSuaChua(),
                item.getIdLoaiTaiSan(),
                item.getMocGioDau(),
                item.getMocGioCuoi(),
                item.getGhiChu(),
                item.getNgayTao(),
                item.getNgayCapNhat(),
                item.getNguoiTao(),
                item.getNguoiCapNhat()
        );
    }

    public int update(CapSuaChua item) {
        String sql = "UPDATE CapSuaChua SET KyHieu=?, Ten=?, ChuKyThucHien=?, SoLanTrongChuKy=?, ThoiGianSuaChua=?, IdLoaiTaiSan=?, MocGioDau=?, MocGioCuoi=?, GhiChu=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=? WHERE Id=?";
        return jdbcTemplate.update(sql,
                item.getKyHieu(),
                item.getTen(),
                item.getChuKyThucHien(),
                item.getSoLanTrongChuKy(),
                item.getThoiGianSuaChua(),
                item.getIdLoaiTaiSan(),
                item.getMocGioDau(),
                item.getMocGioCuoi(),
                item.getGhiChu(),
                item.getNgayTao(),
                item.getNgayCapNhat(),
                item.getNguoiTao(),
                item.getNguoiCapNhat(),
                item.getId()
        );
    }

    public int delete(String id) {
        String sql = "DELETE FROM CapSuaChua WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteAll() {
        String sql = "DELETE FROM CapSuaChua";
        return jdbcTemplate.update(sql);
    }
}
