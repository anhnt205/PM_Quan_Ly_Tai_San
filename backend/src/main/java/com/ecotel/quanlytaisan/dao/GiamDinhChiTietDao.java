package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GiamDinhChiTiet;
import com.ecotel.quanlytaisan.model.GiamDinhVatTu;
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
public class GiamDinhChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<GiamDinhChiTiet> findAll() {
        String sql = "SELECT * FROM giamdinh_chitiet";
        List<GiamDinhChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhChiTiet.class));
        for (GiamDinhChiTiet item : list) {
            item.setDanhSachVatTu(findVatTuByIdChiTietGiamDinh(item.getId()));
        }
        return list;
    }

    public GiamDinhChiTiet findById(String id) {
        String sql = """
                SELECT gdct.* ,ts.TenTaiSan,ts.DonViTinh,
                       COALESCE(khscct.SoLuong, ktscct.SoLuong) as SoLuong
                         FROM giamdinh_chitiet gdct
                         LEFT JOIN suachua_chitiet scct ON scct.Id = gdct.IdBienBanChiTiet
                         LEFT JOIN kiemtra_suco_chitiet ktscct ON ktscct.Id = gdct.IdBienBanChiTiet
                         INNER JOIN taisan ts ON ts.Id = gdct.IdTaiSan
                         LEFT JOIN kehoachsuachua_chitiet_taisan khscct ON khscct.Id = scct.IdKeHoachChiTiet
                     WHERE gdct.Id = ?
                """;
        List<GiamDinhChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhChiTiet.class), id);
        if (list.isEmpty()) return null;
        GiamDinhChiTiet item = list.get(0);
        item.setDanhSachVatTu(findVatTuByIdChiTietGiamDinh(item.getId()));
        return item;
    }

    public List<GiamDinhChiTiet> findByIdGiamDinh(String idGiamDinh) {
        String sql = """
                SELECT gdct.* ,ts.TenTaiSan,ts.DonViTinh                        
                FROM giamdinh_chitiet gdct
                INNER JOIN taisan ts ON ts.Id = gdct.IdTaiSan
                WHERE gdct.IdGiamDinh = ?""" ;

        List<GiamDinhChiTiet> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhChiTiet.class), idGiamDinh);
        for (GiamDinhChiTiet item : list) {
            item.setDanhSachVatTu(findVatTuByIdChiTietGiamDinh(item.getId()));
        }
        return list;
    }

    public String generateNextId() {
        return "GDCT_" + UUID.randomUUID().toString();
    }

    public String generateNextIdVatTu() {
        return "GDVT_" + UUID.randomUUID().toString();
    }

    // --- CÁC PHƯƠNG THỨC CHO TÀI SẢN CHI TIẾT (giamdinh_chitiet) ---

    public int insert(GiamDinhChiTiet entity) {
        String sql = """
            INSERT INTO giamdinh_chitiet (
                Id, IdGiamDinh, IdTaiSan, IdBienBanChiTiet, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        if (entity.getId() == null) entity.setId(generateNextId());
        return jdbcTemplate.update(sql,
                entity.getId(), entity.getIdGiamDinh(),
                entity.getIdTaiSan(), entity.getIdBienBanChiTiet(),
                entity.getNgayTao(), entity.getNgayCapNhat(), entity.getNguoiTao(), entity.getNguoiCapNhat()
        );
    }

    public int[] batchInsert(List<GiamDinhChiTiet> list) {
        String sql = """
            INSERT INTO giamdinh_chitiet (
                Id, IdGiamDinh, IdTaiSan, IdBienBanChiTiet, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhChiTiet e = list.get(i);
                if (e.getId() == null) e.setId(generateNextId());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdGiamDinh());
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

    public int update(GiamDinhChiTiet entity) {
        String sql = """
            UPDATE giamdinh_chitiet SET
                IdTaiSan = ?, IdBienBanChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                entity.getIdTaiSan(), entity.getIdBienBanChiTiet(), entity.getNgayCapNhat(), entity.getNguoiCapNhat(),
                entity.getId()
        );
    }

    public int[] batchUpdate(List<GiamDinhChiTiet> list) {
        String sql = """
            UPDATE giamdinh_chitiet SET
                IdTaiSan = ?, IdBienBanChiTiet = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhChiTiet e = list.get(i);
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

    public int deleteByIdGiamDinh(String idGiamDinh) {
        List<GiamDinhChiTiet> taiSanList = findByIdGiamDinh(idGiamDinh);
        for (GiamDinhChiTiet ts : taiSanList) {
            deleteVatTuByIdChiTietGiamDinh(ts.getId());
        }
        String sql = "DELETE FROM giamdinh_chitiet WHERE IdGiamDinh = ?";
        return jdbcTemplate.update(sql, idGiamDinh);
    }

    public int deleteById(String id) {
        deleteVatTuByIdChiTietGiamDinh(id);
        String sql = "DELETE FROM giamdinh_chitiet WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public void batchDelete(List<String> ids) {
        for (String id : ids) {
            deleteVatTuByIdChiTietGiamDinh(id);
        }
        String sql = "DELETE FROM giamdinh_chitiet WHERE Id = ?";
        jdbcTemplate.batchUpdate(sql, ids, 50, (ps, id) -> ps.setString(1, id));
    }

    // --- CÁC PHƯƠNG THỨC CHO VẬT TƯ THEO TÀI SẢN (giamdinh_vattu) ---

    public List<GiamDinhVatTu> findVatTuByIdChiTietGiamDinh(String idChiTietGiamDinh) {
        String sql = """
            SELECT gdvt.*, cv2.Ten AS tenVatTu, cv2.DonVitinh as donViTinh
            FROM giamdinh_vattu gdvt
                LEFT JOIN CCDCVatTu cv2 ON cv2.Id = gdvt.IdVatTu
            WHERE gdvt.IdChiTietGiamDinh = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhVatTu.class), idChiTietGiamDinh);
    }

    public int insertVatTu(GiamDinhVatTu e) {
        if (e.getId() == null) e.setId(generateNextIdVatTu());
        String sql = """
            INSERT INTO giamdinh_vattu (
                Id, IdChiTietGiamDinh, IdVatTu, IdChiTietVatTu, SoLuong, TinhTrang, SoLuongSuaChua, SoLuongThayMoi, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                e.getId(), e.getIdChiTietGiamDinh(), e.getIdVatTu(), e.getIdChiTietVatTu(),
                e.getSoLuong(), e.getTinhTrang(), e.getSoLuongSuaChua(), e.getSoLuongThayMoi(), e.getGhiChu()
        );
    }

    public int[] batchInsertVatTu(List<GiamDinhVatTu> list) {
        String sql = """
            INSERT INTO giamdinh_vattu (
                Id, IdChiTietGiamDinh, IdVatTu, IdChiTietVatTu, SoLuong, TinhTrang, SoLuongSuaChua, SoLuongThayMoi, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                GiamDinhVatTu e = list.get(i);
                if (e.getId() == null) e.setId(generateNextIdVatTu());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdChiTietGiamDinh());
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

    public int updateVatTu(GiamDinhVatTu e) {
        String sql = """
            UPDATE giamdinh_vattu SET
                IdVatTu = ?, IdChiTietVatTu = ?, SoLuong = ?, TinhTrang = ?, SoLuongSuaChua = ?, SoLuongThayMoi = ?, GhiChu = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                e.getIdVatTu(), e.getIdChiTietVatTu(), e.getSoLuong(), e.getTinhTrang(),
                e.getSoLuongSuaChua(), e.getSoLuongThayMoi(), e.getGhiChu(), e.getId()
        );
    }

    public int deleteVatTuByIdChiTietGiamDinh(String idChiTietGiamDinh) {
        return jdbcTemplate.update("DELETE FROM giamdinh_vattu WHERE IdChiTietGiamDinh = ?", idChiTietGiamDinh);
    }

    public void batchDeleteVatTu(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM giamdinh_vattu WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
    }
}
