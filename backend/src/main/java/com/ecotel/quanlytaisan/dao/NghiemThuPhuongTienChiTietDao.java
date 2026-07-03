package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NghiemThuPhuongTienChiTiet;
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
public class NghiemThuPhuongTienChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<NghiemThuPhuongTienChiTiet> findByIdNghiemThu(String idNghiemThuPhuongTien) {
        String sql = """
            SELECT ct.*, cv.Ten AS tenVatTu, cv.DonViTinh AS donViTinh
            FROM nghiemthu_phuongtien_chitiet ct
                LEFT JOIN CCDCVatTu cv ON cv.Id = ct.IdVatTu
            WHERE ct.IdNghiemThuPhuongTien = ?
            """;
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(NghiemThuPhuongTienChiTiet.class),
                idNghiemThuPhuongTien);
    }

    public NghiemThuPhuongTienChiTiet findById(String id) {
        String sql = """
            SELECT ct.*, cv.Ten AS tenVatTu, cv.DonViTinh AS donViTinh
            FROM nghiemthu_phuongtien_chitiet ct
                LEFT JOIN CCDCVatTu cv ON cv.Id = ct.IdVatTu
            WHERE ct.Id = ?
            """;
        List<NghiemThuPhuongTienChiTiet> list = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(NghiemThuPhuongTienChiTiet.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public String generateNextId() {
        return "NTPTCT_" + UUID.randomUUID().toString();
    }

    public int insert(NghiemThuPhuongTienChiTiet e) {
        if (e.getId() == null) e.setId(generateNextId());
        String sql = """
            INSERT INTO nghiemthu_phuongtien_chitiet (
                Id, IdNghiemThuPhuongTien, IdChiTietVatTu, IdVatTu,
                SoLuongThayThe, SoLuongThuHoi, PhanTramConLai,
                BienPhapXuLy, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                e.getId(), e.getIdNghiemThuPhuongTien(), e.getIdChiTietVatTu(), e.getIdVatTu(),
                e.getSoLuongThayThe(), e.getSoLuongThuHoi(), e.getPhanTramConLai(),
                e.getBienPhapXuLy(), e.getGhiChu()
        );
    }

    public int[] batchInsert(List<NghiemThuPhuongTienChiTiet> list) {
        String sql = """
            INSERT INTO nghiemthu_phuongtien_chitiet (
                Id, IdNghiemThuPhuongTien, IdChiTietVatTu, IdVatTu,
                SoLuongThayThe, SoLuongThuHoi, PhanTramConLai,
                BienPhapXuLy, GhiChu
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                NghiemThuPhuongTienChiTiet e = list.get(i);
                if (e.getId() == null) e.setId(generateNextId());
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdNghiemThuPhuongTien());
                ps.setString(3, e.getIdChiTietVatTu());
                ps.setString(4, e.getIdVatTu());
                ps.setObject(5, e.getSoLuongThayThe());
                ps.setObject(6, e.getSoLuongThuHoi());
                ps.setObject(7, e.getPhanTramConLai());
                ps.setString(8, e.getBienPhapXuLy());
                ps.setString(9, e.getGhiChu());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public int update(NghiemThuPhuongTienChiTiet e) {
        String sql = """
            UPDATE nghiemthu_phuongtien_chitiet SET
                IdChiTietVatTu = ?, IdVatTu = ?,
                SoLuongThayThe = ?, SoLuongThuHoi = ?, PhanTramConLai = ?,
                BienPhapXuLy = ?, GhiChu = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                e.getIdChiTietVatTu(), e.getIdVatTu(),
                e.getSoLuongThayThe(), e.getSoLuongThuHoi(), e.getPhanTramConLai(),
                e.getBienPhapXuLy(), e.getGhiChu(),
                e.getId()
        );
    }

    public int deleteByIdNghiemThu(String idNghiemThuPhuongTien) {
        return jdbcTemplate.update(
                "DELETE FROM nghiemthu_phuongtien_chitiet WHERE IdNghiemThuPhuongTien = ?",
                idNghiemThuPhuongTien);
    }

    public int deleteById(String id) {
        return jdbcTemplate.update(
                "DELETE FROM nghiemthu_phuongtien_chitiet WHERE Id = ?", id);
    }
}
