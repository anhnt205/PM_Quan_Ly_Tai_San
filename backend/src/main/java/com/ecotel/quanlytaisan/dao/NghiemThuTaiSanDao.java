package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NghiemThuTaiSan;
import com.ecotel.quanlytaisan.model.NghiemThuVatTu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Repository
public class NghiemThuTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<NghiemThuTaiSan> findByIdBienBan(String idBienBan) {
        String sql = """
            SELECT nts.*, ts.TenTaiSan, ts.DonViTinh
            FROM nghiemthu_maymoc_taisan nts
                LEFT JOIN TaiSan ts ON ts.Id = nts.IdTaiSan
            WHERE nts.IdBienBan = ?
            """;
        List<NghiemThuTaiSan> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NghiemThuTaiSan.class), idBienBan);
        // Enrich each item with vattu list
        for (NghiemThuTaiSan item : list) {
            item.setDanhSachVatTu(findVatTuByIdBienBanTaiSan(item.getId()));
        }
        return list;
    }

    public NghiemThuTaiSan findById(String id) {
        String sql = """
            SELECT nts.*, ts.TenTaiSan, ts.DonViTinh
            FROM nghiemthu_maymoc_taisan nts
                LEFT JOIN TaiSan ts ON ts.Id = nts.IdTaiSan
            WHERE nts.Id = ?
            """;
        List<NghiemThuTaiSan> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NghiemThuTaiSan.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<NghiemThuVatTu> findVatTuByIdBienBanTaiSan(String idBienBanTaiSan) {
        String sql = """
            SELECT ntvt.*, cv2.Ten AS tenVatTu, cv2.DonVitinh as donViTinh
            FROM nghiemthu_maymoc_vattu ntvt
                LEFT JOIN CCDCVatTu cv2 ON cv2.Id = ntvt.IdVatTu
            WHERE ntvt.IdBienBanTaiSan = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NghiemThuVatTu.class), idBienBanTaiSan);
    }

    public String generateNextIdTaiSan() {
        return "NTTS_" + UUID.randomUUID().toString();
    }

    public String generateNextIdVatTu() {
        return "NTVT_" + UUID.randomUUID().toString();
    }

    public int insertTaiSan(NghiemThuTaiSan e) {
        if (e.getId() == null) e.setId(generateNextIdTaiSan());
        String sql = "INSERT INTO nghiemthu_maymoc_taisan (Id, IdBienBan, IdTaiSan, IdChiTietGiamDinhMayMoc) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, e.getId(), e.getIdBienBan(), e.getIdTaiSan(), e.getIdChiTietGiamDinhMayMoc());
    }

    public int[] batchInsertTaiSan(List<NghiemThuTaiSan> list) {
        String sql = "INSERT INTO nghiemthu_maymoc_taisan (Id, IdBienBan, IdTaiSan, IdChiTietGiamDinhMayMoc) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                NghiemThuTaiSan e = list.get(i);
                if (e.getId() == null) e.setId(generateNextIdTaiSan());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdBienBan());
                ps.setString(3, e.getIdTaiSan());
                ps.setString(4, e.getIdChiTietGiamDinhMayMoc());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int insertVatTu(NghiemThuVatTu e) {
        if (e.getId() == null) e.setId(generateNextIdVatTu());
        String sql = "INSERT INTO nghiemthu_maymoc_vattu (Id, IdBienBanTaiSan, IdChiTietVatTu, IdVatTu, SoLuong, GhiChu) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, e.getId(), e.getIdBienBanTaiSan(), e.getIdChiTietVatTu(), e.getIdVatTu(), e.getSoLuong(), e.getGhiChu());
    }

    public int[] batchInsertVatTu(List<NghiemThuVatTu> list) {
        String sql = "INSERT INTO nghiemthu_maymoc_vattu (Id, IdBienBanTaiSan, IdChiTietVatTu, IdVatTu, SoLuong, GhiChu) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                NghiemThuVatTu e = list.get(i);
                if (e.getId() == null) e.setId(generateNextIdVatTu());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdBienBanTaiSan());
                ps.setString(3, e.getIdChiTietVatTu());
                ps.setString(4, e.getIdVatTu());
                ps.setObject(5, e.getSoLuong());
                ps.setString(6, e.getGhiChu());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int updateVatTu(NghiemThuVatTu e) {
        String sql = "UPDATE nghiemthu_maymoc_vattu SET IdChiTietVatTu = ?, IdVatTu = ?, SoLuong = ?, GhiChu = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, e.getIdChiTietVatTu(), e.getIdVatTu(), e.getSoLuong(), e.getGhiChu(), e.getId());
    }

    public int[] batchUpdateVatTu(List<NghiemThuVatTu> list) {
        String sql = "UPDATE nghiemthu_maymoc_vattu SET IdChiTietVatTu = ?, IdVatTu = ?, SoLuong = ?, GhiChu = ? WHERE Id = ?";
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                NghiemThuVatTu e = list.get(i);
                ps.setString(1, e.getIdChiTietVatTu());
                ps.setString(2, e.getIdVatTu());
                ps.setObject(3, e.getSoLuong());
                ps.setString(4, e.getGhiChu());
                ps.setString(5, e.getId());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int deleteByIdBienBan(String idBienBan) {
        // First delete vattu of all taisan in this bienban
        List<NghiemThuTaiSan> taiSanList = findByIdBienBanNoEnrich(idBienBan);
        for (NghiemThuTaiSan ts : taiSanList) {
            deleteVatTuByIdBienBanTaiSan(ts.getId());
        }
        return jdbcTemplate.update("DELETE FROM nghiemthu_maymoc_taisan WHERE IdBienBan = ?", idBienBan);
    }

    public int deleteById(String id) {
        deleteVatTuByIdBienBanTaiSan(id);
        return jdbcTemplate.update("DELETE FROM nghiemthu_maymoc_taisan WHERE Id = ?", id);
    }

    public int deleteVatTuByIdBienBanTaiSan(String idBienBanTaiSan) {
        return jdbcTemplate.update("DELETE FROM nghiemthu_maymoc_vattu WHERE IdBienBanTaiSan = ?", idBienBanTaiSan);
    }

    public void batchDeleteVatTu(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM nghiemthu_maymoc_vattu WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
    }

    private List<NghiemThuTaiSan> findByIdBienBanNoEnrich(String idBienBan) {
        String sql = "SELECT * FROM nghiemthu_maymoc_taisan WHERE IdBienBan = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NghiemThuTaiSan.class), idBienBan);
    }
}
