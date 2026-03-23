package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSan;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class LichSuDieuChuyenTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int createBatch(List<LichSuDieuChuyenTaiSanDTO> list) {
        String sql = """
                INSERT INTO LichSuDieuChuyenTaiSan 
                (Id, IdBanGiaoTaiSan, IdTaiSan, IdDonViGiao, IdDonViNhan, ThoiGianBanGiao) 
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        for (LichSuDieuChuyenTaiSanDTO item : list) {
            if (item.getId() == null || item.getId().isEmpty()) {
                item.setId(UUID.randomUUID().toString());
            }
        }

        int[] result = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LichSuDieuChuyenTaiSanDTO item = list.get(i);
                ps.setString(1, item.getId());
                ps.setString(2, item.getIdBanGiaoTaiSan());
                ps.setString(3, item.getIdTaiSan());
                ps.setString(4, item.getIdDonViGiao());
                ps.setString(5, item.getIdDonViNhan());
                ps.setString(6, item.getThoiGianBanGiao());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        return result.length;
    }

    public List<LichSuDieuChuyenTaiSan> findAllPaged(int offset, int limit, String idTaiSan, String fromDate, String toDate) {
        StringBuilder sql = new StringBuilder("""
                SELECT 
                    ls.Id, 
                    ls.IdBanGiaoTaiSan, 
                    ls.IdTaiSan, 
                    ls.IdDonViGiao, 
                    ls.IdDonViNhan, 
                    ls.ThoiGianBanGiao,
                    ts.TenTaiSan,
                    pbGiao.TenPhongBan AS TenDonViGiao,
                    pbNhan.TenPhongBan AS TenDonViNhan
                FROM LichSuDieuChuyenTaiSan ls
                LEFT JOIN TaiSan ts ON ls.IdTaiSan = ts.Id
                LEFT JOIN PhongBan pbGiao ON ls.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON ls.IdDonViNhan = pbNhan.Id
                WHERE 1=1
                """);

        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.trim().isEmpty()) {
            sql.append(" AND ls.IdTaiSan = ?");
            params.add(idTaiSan);
        }

        if (fromDate != null && !fromDate.trim().isEmpty()) {
            sql.append(" AND ls.ThoiGianBanGiao >= ?");
            if (fromDate.trim().length() <= 10) {
                params.add(fromDate.trim() + " 00:00:00");
            } else {
                params.add(fromDate);
            }
        }

        if (toDate != null && !toDate.trim().isEmpty()) {
            sql.append(" AND ls.ThoiGianBanGiao <= ?");
            if (toDate.trim().length() <= 10) {
                params.add(toDate.trim() + " 23:59:59");
            } else {
                params.add(toDate);
            }
        }

        sql.append(" ORDER BY ls.ThoiGianBanGiao DESC");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(LichSuDieuChuyenTaiSan.class), params.toArray());
    }

    public int update(String id, LichSuDieuChuyenTaiSanDTO item) {
        String sql = """
                UPDATE LichSuDieuChuyenTaiSan 
                SET IdDonViNhan = ?, ThoiGianBanGiao = ? 
                WHERE Id = ?
                """;
        return jdbcTemplate.update(sql, item.getIdDonViNhan(), item.getThoiGianBanGiao(), id);
    }

    public int delete(String id) {
        String sql = "DELETE FROM LichSuDieuChuyenTaiSan WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public long countAll(String idTaiSan, String fromDate, String toDate) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM LichSuDieuChuyenTaiSan ls WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.trim().isEmpty()) {
            sql.append(" AND ls.IdTaiSan = ?");
            params.add(idTaiSan);
        }

        if (fromDate != null && !fromDate.trim().isEmpty()) {
            sql.append(" AND ls.ThoiGianBanGiao >= ?");
            if (fromDate.trim().length() <= 10) {
                params.add(fromDate.trim() + " 00:00:00");
            } else {
                params.add(fromDate);
            }
        }

        if (toDate != null && !toDate.trim().isEmpty()) {
            sql.append(" AND ls.ThoiGianBanGiao <= ?");
            if (toDate.trim().length() <= 10) {
                params.add(toDate.trim() + " 23:59:59");
            } else {
                params.add(toDate);
            }
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    // ================== BATCH UPDATE & DELETE ==================
    public int[] updateBatch(List<LichSuDieuChuyenTaiSanDTO> list) {
        String sql = """
                UPDATE LichSuDieuChuyenTaiSan 
                SET IdDonViNhan = ?, ThoiGianBanGiao = ? 
                WHERE Id = ?
                """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LichSuDieuChuyenTaiSanDTO item = list.get(i);
                ps.setString(1, item.getIdDonViNhan());
                ps.setString(2, item.getThoiGianBanGiao());
                ps.setString(3, item.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int deleteBatch(List<String> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        String placeholders = String.join(",", java.util.Collections.nCopies(ids.size(), "?"));
        String sql = "DELETE FROM LichSuDieuChuyenTaiSan WHERE Id IN (" + placeholders + ")";
        return jdbcTemplate.update(sql, ids.toArray());
    }
}