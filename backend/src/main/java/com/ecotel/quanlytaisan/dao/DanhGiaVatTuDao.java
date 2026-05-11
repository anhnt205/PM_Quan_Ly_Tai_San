package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DanhGiaVatTu;
import com.ecotel.quanlytaisan.model.ChiTietVatTuThuHoi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Repository
public class DanhGiaVatTuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<DanhGiaVatTu> findAll(String idCongTy) {
        String sql = """
            SELECT dvt.*, 
                   nvLap.HoTen as tenNguoiLap, 
                   nvGD.HoTen as tenGiamDoc,
                   pb.TenPhongBan as tenDonViQuanLy
            FROM danhgia_vattu dvt
            LEFT JOIN NhanVien nvLap ON dvt.IdNguoiLap = nvLap.Id
            LEFT JOIN NhanVien nvGD ON dvt.IdGiamDoc = nvGD.Id
            LEFT JOIN PhongBan pb ON dvt.IdDonViQuanLy = pb.Id
            WHERE dvt.IdCongTy = ?
            ORDER BY dvt.NgayTao DESC
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DanhGiaVatTu.class), idCongTy);
    }

    public DanhGiaVatTu findById(String id) {
        String sql = """
            SELECT dvt.*, 
                   nvLap.HoTen as tenNguoiLap, 
                   nvGD.HoTen as tenGiamDoc,
                   pb.TenPhongBan as tenDonViQuanLy
            FROM danhgia_vattu dvt
            LEFT JOIN NhanVien nvLap ON dvt.IdNguoiLap = nvLap.Id
            LEFT JOIN NhanVien nvGD ON dvt.IdGiamDoc = nvGD.Id
            LEFT JOIN PhongBan pb ON dvt.IdDonViQuanLy = pb.Id
            WHERE dvt.Id = ?
            """;
        List<DanhGiaVatTu> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DanhGiaVatTu.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<DanhGiaVatTu> findByIdNghiemThu(String idNghiemThu) {
        String sql = """
            SELECT dvt.*, 
                   nvLap.HoTen as tenNguoiLap, 
                   nvGD.HoTen as tenGiamDoc,
                   pb.TenPhongBan as tenDonViQuanLy
            FROM danhgia_vattu dvt
            LEFT JOIN NhanVien nvLap ON dvt.IdNguoiLap = nvLap.Id
            LEFT JOIN NhanVien nvGD ON dvt.IdGiamDoc = nvGD.Id
            LEFT JOIN PhongBan pb ON dvt.IdDonViQuanLy = pb.Id
            WHERE dvt.IdNghiemThu = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DanhGiaVatTu.class), idNghiemThu);
    }

    public List<ChiTietVatTuThuHoi> findDetailsByParentId(String idDanhGiaVatTu) {
        String sql = """
            SELECT ct.*, cv.Ten as tenVatTu, cv.DonVitinh as donViTinh
            FROM danhgia_vattu_chitiet ct
                LEFT JOIN CCDCVatTu cv ON cv.Id = ct.IdVatTu
            WHERE ct.IdDanhGiaVatTu = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietVatTuThuHoi.class), idDanhGiaVatTu);
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "DANHGIA_VATTU";
        String prefix = "DGVT-" + currentYear + "-";
        try {
            jdbcTemplate.update("UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?", seqName, currentYear);
            Integer next = jdbcTemplate.queryForObject("SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);
            return prefix + String.format("%04d", next);
        } catch (Exception e) {
            return "DGVT-" + UUID.randomUUID().toString().substring(0, 8);
        }
    }

    public DanhGiaVatTu insert(DanhGiaVatTu e) {
        if (e.getId() == null) e.setId(generateNextId());
        String sql = """
            INSERT INTO danhgia_vattu (
                Id, IdCongTy, SoPhieu, NgayDanhGia, ViTri, CapSuaChua,
                TenThietBi, Kieu, SoDangKi, IdDonViQuanLy, IdNghiemThu,
                SoLuongPhucHoi, SoLuongPheLieu, SoLuongHuy,
                IdNguoiLap, NguoiLapXacNhan, IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getSoPhieu(), e.getNgayDanhGia(), e.getViTri(), e.getCapSuaChua(),
                e.getTenThietBi(), e.getKieu(), e.getSoDangKi(), e.getIdDonViQuanLy(), e.getIdNghiemThu(),
                e.getSoLuongPhucHoi(), e.getSoLuongPheLieu(), e.getSoLuongHuy(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(), e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat()
        );
        return e;
    }

    public DanhGiaVatTu update(DanhGiaVatTu e) {
        String sql = """
            UPDATE danhgia_vattu SET
                SoPhieu = ?, NgayDanhGia = ?, ViTri = ?, CapSuaChua = ?,
                TenThietBi = ?, Kieu = ?, SoDangKi = ?, IdDonViQuanLy = ?, IdNghiemThu = ?,
                SoLuongPhucHoi = ?, SoLuongPheLieu = ?, SoLuongHuy = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?, IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        jdbcTemplate.update(sql,
                e.getSoPhieu(), e.getNgayDanhGia(), e.getViTri(), e.getCapSuaChua(),
                e.getTenThietBi(), e.getKieu(), e.getSoDangKi(), e.getIdDonViQuanLy(), e.getIdNghiemThu(),
                e.getSoLuongPhucHoi(), e.getSoLuongPheLieu(), e.getSoLuongHuy(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(), e.getNgayCapNhat(), e.getNguoiCapNhat(),
                e.getId()
        );
        return e;
    }

    public void insertDetails(List<ChiTietVatTuThuHoi> list, String parentId) {
        String sql = "INSERT INTO danhgia_vattu_chitiet (Id, IdDanhGiaVatTu, IdChiTietVatTu, IdVatTu, SoLuong, TinhTrang, BienPhapXuLy, GhiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ChiTietVatTuThuHoi item = list.get(i);
                ps.setString(1, UUID.randomUUID().toString());
                ps.setString(2, parentId);
                ps.setString(3, item.getIdChiTietVatTu());
                ps.setString(4, item.getIdVatTu());
                ps.setObject(5, item.getSoLuong());
                ps.setString(6, item.getTinhTrang());
                ps.setString(7, item.getBienPhapXuLy());
                ps.setString(8, item.getGhiChu());
            }
            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    public void deleteDetailsByParentId(String parentId) {
        jdbcTemplate.update("DELETE FROM danhgia_vattu_chitiet WHERE IdDanhGiaVatTu = ?", parentId);
    }

    public int updateTrangThai(String id, Integer trangThai) {
        return jdbcTemplate.update("UPDATE danhgia_vattu SET TrangThai = ? WHERE Id = ?", trangThai, id);
    }

    public int delete(String id) {
        deleteDetailsByParentId(id);
        return jdbcTemplate.update("DELETE FROM danhgia_vattu WHERE Id = ?", id);
    }
}
