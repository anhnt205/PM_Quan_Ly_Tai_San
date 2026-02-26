package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LichSuDieuChuyenCCDCVatTu;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenCCDCVatTuDTO;
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
public class LichSuDieuChuyenCCDCVatTuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int createBatch(List<LichSuDieuChuyenCCDCVatTuDTO> list) {
        // Lưu ý: Tên bảng trong DB là LichSuDieuChuyenCCDCVatTu
        String sql = """
                INSERT INTO LichSuDieuChuyenCCDCVatTu 
                (Id, IdBanGiaoCCDCVatTu, IdCCDCVatTu, IdChiTietCCDCVatTu, IdDonViGiao, IdDonViNhan, ThoiGianBanGiao, SoLuong) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        for (LichSuDieuChuyenCCDCVatTuDTO item : list) {
            if (item.getId() == null || item.getId().isEmpty()) {
                item.setId(UUID.randomUUID().toString());
            }
        }

        int[] result = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LichSuDieuChuyenCCDCVatTuDTO item = list.get(i);
                ps.setString(1, item.getId());
                ps.setString(2, item.getIdBanGiaoCCDCVatTu());
                ps.setString(3, item.getIdCCDCVatTu());
                ps.setString(4, item.getIdChiTietCCDCVatTu());
                ps.setString(5, item.getIdDonViGiao());
                ps.setString(6, item.getIdDonViNhan());
                ps.setString(7, item.getThoiGianBanGiao());
                ps.setInt(8, item.getSoLuong());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        return result.length;
    }

    public List<LichSuDieuChuyenCCDCVatTu> findAllPaged(int offset, int limit, String IdCCDCVatTu, String fromDate, String toDate) {
        StringBuilder sql = new StringBuilder("""
                SELECT 
                    ls.Id, 
                    ls.IdBanGiaoCCDCVatTu, 
                    ls.IdCCDCVatTu,
                    ls.IdChiTietCCDCVatTu,
                    ls.SoLuong,
                    ls.IdDonViGiao, 
                    ls.IdDonViNhan, 
                    ls.ThoiGianBanGiao,
                    ts.Ten AS TenCCDCVatTu,
                    pbGiao.TenPhongBan AS TenDonViGiao,
                    pbNhan.TenPhongBan AS TenDonViNhan
                FROM LichSuDieuChuyenCCDCVatTu ls
                LEFT JOIN CCDCVatTu ts ON ls.IdCCDCVatTu = ts.Id
                LEFT JOIN PhongBan pbGiao ON ls.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON ls.IdDonViNhan = pbNhan.Id
                WHERE 1=1
                """);

        List<Object> params = new ArrayList<>();

        if (IdCCDCVatTu != null && !IdCCDCVatTu.trim().isEmpty()) {
            sql.append(" AND ls.IdCCDCVatTu = ?");
            params.add(IdCCDCVatTu);
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

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(LichSuDieuChuyenCCDCVatTu.class), params.toArray());
    }

    public long countAll(String IdCCDCVatTu, String fromDate, String toDate) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM LichSuDieuChuyenCCDCVatTu ls WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (IdCCDCVatTu != null && !IdCCDCVatTu.trim().isEmpty()) {
            sql.append(" AND ls.IdCCDCVatTu = ?");
            params.add(IdCCDCVatTu);
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
}
