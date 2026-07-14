package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GiamDinhMayMocChiTiet;
import com.ecotel.quanlytaisan.model.GiamDinhMayMocVatTu;
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
public class GiamDinhMayMocChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<GiamDinhMayMocChiTiet> findAll() {
        String sql = "SELECT * FROM giamdinh_maymoc_chitiet";
        List<GiamDinhMayMocChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhMayMocChiTiet.class));
        for (GiamDinhMayMocChiTiet item : list) {
            item.setDanhSachVatTu(findVatTuByIdChiTietGiamDinh(item.getId()));
        }
        return list;
    }

    public GiamDinhMayMocChiTiet findById(String id) {
        String sql = """
                SELECT gdct.* ,ts.TenTaiSan,ts.DonViTinh,
                       COALESCE(khscct.SoLuong, ktscct.SoLuong) as SoLuong
                         FROM giamdinh_maymoc_chitiet gdct
                         LEFT JOIN suachua_chitiet scct ON scct.Id = gdct.IdBienBanChiTiet
                         LEFT JOIN kiemtra_suco_chitiet ktscct ON ktscct.Id = gdct.IdBienBanChiTiet
                         LEFT JOIN taisan ts ON ts.Id = gdct.IdTaiSan
                         LEFT JOIN kehoachsuachua_chitiet_taisan khscct ON khscct.Id = scct.IdKeHoachChiTiet
                      WHERE gdct.Id = ?
                """;
        List<GiamDinhMayMocChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhMayMocChiTiet.class), id);
        if (list.isEmpty()) return null;
        GiamDinhMayMocChiTiet item = list.get(0);
        item.setDanhSachVatTu(findVatTuByIdChiTietGiamDinh(item.getId()));
        return item;
    }

    public List<GiamDinhMayMocChiTiet> findByIdGiamDinh(String idGiamDinhMayMoc) {
        String sql = """
                SELECT gdct.* ,ts.TenTaiSan,ts.DonViTinh                        
                FROM giamdinh_maymoc_chitiet gdct
                LEFT JOIN taisan ts ON ts.Id = gdct.IdTaiSan
                WHERE gdct.IdGiamDinhMayMoc = ?""" ;

        List<GiamDinhMayMocChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhMayMocChiTiet.class), idGiamDinhMayMoc);
        for (GiamDinhMayMocChiTiet item : list) {
            item.setDanhSachVatTu(findVatTuByIdChiTietGiamDinh(item.getId()));
        }
        return list;
    }

    public List<String> findIdGiamDinhMayMocByIdTaiSan(String idTaiSan) {
        String sql = "SELECT DISTINCT IdGiamDinhMayMoc FROM giamdinh_maymoc_chitiet WHERE IdTaiSan = ?";
        return jdbcTemplate.queryForList(sql, String.class, idTaiSan);
    }

    public String generateNextId() {
        return "GDCT_" + UUID.randomUUID().toString();
    }

    public String generateNextIdVatTu() {
        return "GDVT_" + UUID.randomUUID().toString();
    }

    // --- CÁC PHƯƠNG THỨC CHO TÀI SẢN CHI TIẾT (giamdinh_maymoc_chitiet) ---

    public int insert(GiamDinhMayMocChiTiet entity) {
        String sql = """
            INSERT INTO giamdinh_maymoc_chitiet (
                Id, IdGiamDinhMayMoc, IdTaiSan, IdBienBanChiTiet, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        if (entity.getId() == null) entity.setId(generateNextId());
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdGiamDinhMayMoc(),
                entity.getIdTaiSan(), entity.getIdBienBanChiTiet(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(), entity.getNguoiCapNhat()
        );
    }

    public int[] batchInsert(List<GiamDinhMayMocChiTiet> list) {
        String sql = """
            INSERT INTO giamdinh_maymoc_chitiet (
                Id, IdGiamDinhMayMoc, IdTaiSan, IdBienBanChiTiet, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhMayMocChiTiet e = list.get(i);
                if (e.getId() == null) e.setId(generateNextId());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdGiamDinhMayMoc());
                ps.setString(3, e.getIdTaiSan());
                ps.setString(4, e.getIdBienBanChiTiet());
                ps.setString(5, e.getNgayTao());
                ps.setString(6, e.getNgayCapNhat());
                ps.setString(7, e.getNguoiTao());
                ps.setString(8, e.getNguoiCapNhat());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int update(GiamDinhMayMocChiTiet entity) {
        String sql = """
            UPDATE giamdinh_maymoc_chitiet SET
                IdTaiSan = ?, IdBienBanChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                entity.getIdTaiSan(), entity.getIdBienBanChiTiet(), entity.getNgayCapNhat(), entity.getNguoiCapNhat(),
                entity.getId()
        );
    }

    public int[] batchUpdate(List<GiamDinhMayMocChiTiet> list) {
        String sql = """
            UPDATE giamdinh_maymoc_chitiet SET
                IdTaiSan = ?, IdBienBanChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhMayMocChiTiet e = list.get(i);
                ps.setString(1, e.getIdTaiSan());
                ps.setString(2, e.getIdBienBanChiTiet());
                ps.setString(3, e.getNgayCapNhat());
                ps.setString(4, e.getNguoiCapNhat());
                ps.setString(5, e.getId());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int deleteByIdGiamDinh(String idGiamDinhMayMoc) {
        List<GiamDinhMayMocChiTiet> taiSanList = findByIdGiamDinh(idGiamDinhMayMoc);
        for (GiamDinhMayMocChiTiet ts : taiSanList) {
            deleteVatTuByIdChiTietGiamDinh(ts.getId());
        }
        String sql = "DELETE FROM giamdinh_maymoc_chitiet WHERE IdGiamDinhMayMoc = ?";
        return jdbcTemplate.update(sql, idGiamDinhMayMoc);
    }

    public int deleteById(String id) {
        deleteVatTuByIdChiTietGiamDinh(id);
        String sql = "DELETE FROM giamdinh_maymoc_chitiet WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public void batchDelete(List<String> ids) {
        for (String id : ids) {
            deleteVatTuByIdChiTietGiamDinh(id);
        }
        String sql = "DELETE FROM giamdinh_maymoc_chitiet WHERE Id = ?";
        jdbcTemplate.batchUpdate(sql, ids, 50, (ps, id) -> ps.setString(1, id));
    }

    // --- CÁC PHƯƠNG THỨC CHO VẬT TƯ THEO TÀI SẢN (giamdinh_maymoc_vattu) ---

    public List<GiamDinhMayMocVatTu> findVatTuByIdChiTietGiamDinh(String idChiTietGiamDinhMayMoc) {
        String sql = """
            SELECT gdvt.*, cv2.Ten AS tenVatTu, cv2.DonVitinh as donViTinh
            FROM giamdinh_maymoc_vattu gdvt
                LEFT JOIN CCDCVatTu cv2 ON cv2.Id = gdvt.IdVatTu
            WHERE gdvt.IdChiTietGiamDinhMayMoc = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhMayMocVatTu.class), idChiTietGiamDinhMayMoc);
    }

    public int insertVatTu(GiamDinhMayMocVatTu e) {
        if (e.getId() == null) e.setId(generateNextIdVatTu());
        String sql = """
            INSERT INTO giamdinh_maymoc_vattu (
                Id, IdChiTietGiamDinhMayMoc, IdVatTu, IdChiTietVatTu, SoLuong, TinhTrang, SoLuongSuaChua, SoLuongThayMoi, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                e.getId(), e.getIdChiTietGiamDinhMayMoc(), e.getIdVatTu(), e.getIdChiTietVatTu(),
                e.getSoLuong(), e.getTinhTrang(), e.getSoLuongSuaChua(), e.getSoLuongThayMoi(), e.getGhiChu()
        );
    }

    public int[] batchInsertVatTu(List<GiamDinhMayMocVatTu> list) {
        String sql = """
            INSERT INTO giamdinh_maymoc_vattu (
                Id, IdChiTietGiamDinhMayMoc, IdVatTu, IdChiTietVatTu, SoLuong, TinhTrang, SoLuongSuaChua, SoLuongThayMoi, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhMayMocVatTu e = list.get(i);
                if (e.getId() == null) e.setId(generateNextIdVatTu());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdChiTietGiamDinhMayMoc());
                ps.setString(3, e.getIdVatTu());
                ps.setString(4, e.getIdChiTietVatTu());
                ps.setObject(5, e.getSoLuong());
                ps.setString(6, e.getTinhTrang());
                ps.setObject(7, e.getSoLuongSuaChua() != null ? e.getSoLuongSuaChua() : 0);
                ps.setObject(8, e.getSoLuongThayMoi() != null ? e.getSoLuongThayMoi() : 0);
                ps.setString(9, e.getGhiChu());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int updateVatTu(GiamDinhMayMocVatTu e) {
        String sql = """
            UPDATE giamdinh_maymoc_vattu SET
                IdVatTu = ?, IdChiTietVatTu = ?, SoLuong = ?, TinhTrang = ?, SoLuongSuaChua = ?, SoLuongThayMoi = ?, GhiChu = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                e.getIdVatTu(), e.getIdChiTietVatTu(), e.getSoLuong(), e.getTinhTrang(),
                e.getSoLuongSuaChua(), e.getSoLuongThayMoi(), e.getGhiChu(), e.getId()
        );
    }

    public int deleteVatTuByIdChiTietGiamDinh(String idChiTietGiamDinhMayMoc) {
        return jdbcTemplate.update("DELETE FROM giamdinh_maymoc_vattu WHERE IdChiTietGiamDinhMayMoc = ?", idChiTietGiamDinhMayMoc);
    }

    public void batchDeleteVatTu(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM giamdinh_maymoc_vattu WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
    }
}
