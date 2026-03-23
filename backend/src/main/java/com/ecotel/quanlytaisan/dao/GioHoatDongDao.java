package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GioHoatDong;
import com.ecotel.quanlytaisan.model.GioHoatDongDTO;
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
public class GioHoatDongDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ================== QUERY METHODS ==================
    public List<GioHoatDong> findAllPaged(int offset, int limit, String idTaiSan, Integer nam, Integer thang) {
        StringBuilder sql = new StringBuilder("SELECT * FROM giohoatdong WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND IdTaiSan = ?");
            params.add(idTaiSan);
        }
        if (nam != null) {
            sql.append(" AND Nam = ?");
            params.add(nam);
        }
        if (thang != null) {
            sql.append(" AND Thang = ?");
            params.add(thang);
        }

        sql.append(" ORDER BY Nam DESC, Thang DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(GioHoatDong.class), params.toArray());
    }

    public long countAll(String idTaiSan, Integer nam, Integer thang) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM giohoatdong WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND IdTaiSan = ?");
            params.add(idTaiSan);
        }
        if (nam != null) {
            sql.append(" AND Nam = ?");
            params.add(nam);
        }
        if (thang != null) {
            sql.append(" AND Thang = ?");
            params.add(thang);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    public GioHoatDong findById(String id) {
        String sql = "SELECT * FROM giohoatdong WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(GioHoatDong.class), id);
    }

    // ================== SINGLE INSERT / UPDATE / DELETE ==================
    public int insert(GioHoatDongDTO dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            dto.setId(UUID.randomUUID().toString());
        }
        String sql = """
            INSERT INTO giohoatdong 
            (Id, IdTaiSan, Nam, Thang, GioHoatDong, GioSauSCL, GioSauBcc, 
             NgaySCT_Vao, NgaySCT_Ra, NgayBcc_Vao, NgayBcc_Ra, 
             SoLanBaoDuongCapI, SoLanBaoDuongCapII, GhiChu, NgayTao, NgayCapNhat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                dto.getId(), dto.getIdTaiSan(), dto.getNam(), dto.getThang(),
                dto.getGioHoatDong(), dto.getGioSauSCL(), dto.getGioSauBcc(),
                dto.getNgaySCT_Vao(), dto.getNgaySCT_Ra(),
                dto.getNgayBcc_Vao(), dto.getNgayBcc_Ra(),
                dto.getSoLanBaoDuongCapI(), dto.getSoLanBaoDuongCapII(),
                dto.getGhiChu(), dto.getNgayTao(), dto.getNgayCapNhat());
    }

    public int update(String id, GioHoatDongDTO dto) {
        String sql = """
            UPDATE giohoatdong SET
                IdTaiSan = ?, Nam = ?, Thang = ?,
                GioHoatDong = ?, GioSauSCL = ?, GioSauBcc = ?,
                NgaySCT_Vao = ?, NgaySCT_Ra = ?,
                NgayBcc_Vao = ?, NgayBcc_Ra = ?,
                SoLanBaoDuongCapI = ?, SoLanBaoDuongCapII = ?,
                GhiChu = ?, NgayCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                dto.getIdTaiSan(), dto.getNam(), dto.getThang(),
                dto.getGioHoatDong(), dto.getGioSauSCL(), dto.getGioSauBcc(),
                dto.getNgaySCT_Vao(), dto.getNgaySCT_Ra(),
                dto.getNgayBcc_Vao(), dto.getNgayBcc_Ra(),
                dto.getSoLanBaoDuongCapI(), dto.getSoLanBaoDuongCapII(),
                dto.getGhiChu(), dto.getNgayCapNhat(), id);
    }

    public int delete(String id) {
        String sql = "DELETE FROM giohoatdong WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // ================== BATCH OPERATIONS ==================
    public int[] insertBatch(List<GioHoatDongDTO> list) {
        String sql = """
            INSERT INTO giohoatdong 
            (Id, IdTaiSan, Nam, Thang, GioHoatDong, GioSauSCL, GioSauBcc,
             NgaySCT_Vao, NgaySCT_Ra, NgayBcc_Vao, NgayBcc_Ra,
             SoLanBaoDuongCapI, SoLanBaoDuongCapII, GhiChu, NgayTao, NgayCapNhat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        // Gán ID nếu chưa có
        for (GioHoatDongDTO dto : list) {
            if (dto.getId() == null || dto.getId().isEmpty()) {
                dto.setId(UUID.randomUUID().toString());
            }
        }

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GioHoatDongDTO dto = list.get(i);
                ps.setString(1, dto.getId());
                ps.setString(2, dto.getIdTaiSan());
                ps.setInt(3, dto.getNam());
                ps.setInt(4, dto.getThang());
                ps.setObject(5, dto.getGioHoatDong());
                ps.setObject(6, dto.getGioSauSCL());
                ps.setObject(7, dto.getGioSauBcc());
                ps.setString(8, dto.getNgaySCT_Vao());
                ps.setString(9, dto.getNgaySCT_Ra());
                ps.setString(10, dto.getNgayBcc_Vao());
                ps.setString(11, dto.getNgayBcc_Ra());
                ps.setObject(12, dto.getSoLanBaoDuongCapI());
                ps.setObject(13, dto.getSoLanBaoDuongCapII());
                ps.setString(14, dto.getGhiChu());
                ps.setString(15, dto.getNgayTao());
                ps.setString(16, dto.getNgayCapNhat());
            }
            @Override
            public int getBatchSize() {
                return list.size();
            }
        });
    }

    public int[] updateBatch(List<GioHoatDongDTO> list) {
        String sql = """
            UPDATE giohoatdong SET
                IdTaiSan = ?, Nam = ?, Thang = ?,
                GioHoatDong = ?, GioSauSCL = ?, GioSauBcc = ?,
                NgaySCT_Vao = ?, NgaySCT_Ra = ?,
                NgayBcc_Vao = ?, NgayBcc_Ra = ?,
                SoLanBaoDuongCapI = ?, SoLanBaoDuongCapII = ?,
                GhiChu = ?, NgayCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GioHoatDongDTO dto = list.get(i);
                ps.setString(1, dto.getIdTaiSan());
                ps.setInt(2, dto.getNam());
                ps.setInt(3, dto.getThang());
                ps.setObject(4, dto.getGioHoatDong());
                ps.setObject(5, dto.getGioSauSCL());
                ps.setObject(6, dto.getGioSauBcc());
                ps.setString(7, dto.getNgaySCT_Vao());
                ps.setString(8, dto.getNgaySCT_Ra());
                ps.setString(9, dto.getNgayBcc_Vao());
                ps.setString(10, dto.getNgayBcc_Ra());
                ps.setObject(11, dto.getSoLanBaoDuongCapI());
                ps.setObject(12, dto.getSoLanBaoDuongCapII());
                ps.setString(13, dto.getGhiChu());
                ps.setString(14, dto.getNgayCapNhat());
                ps.setString(15, dto.getId());
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
        String sql = "DELETE FROM giohoatdong WHERE Id IN (" + placeholders + ")";
        return jdbcTemplate.update(sql, ids.toArray());
    }
}