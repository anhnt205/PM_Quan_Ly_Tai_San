package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.SuCoThietBiChiTiet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

/**
 * DAO chi tiết tài sản trong phiếu sự cố thiết bị.
 *
 * Bảng: suco_thietbi_chitiet
 */
@Repository
public class SuCoThietBiChiTietDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==================== Query ====================

    /** Lấy tất cả chi tiết (không filter) */
    public List<SuCoThietBiChiTiet> findAll() {
        return jdbcTemplate.query(
                "SELECT * FROM suco_thietbi_chitiet",
                new BeanPropertyRowMapper<>(SuCoThietBiChiTiet.class));
    }

    /** Lấy chi tiết theo ID dòng */
    public SuCoThietBiChiTiet findById(String id) {
        List<SuCoThietBiChiTiet> list = jdbcTemplate.query(
                """
                        SELECT stct.* ,
                        CASE
                            WHEN (UPPER(COALESCE(kh.NhomTaiSan, ts.IdNhomTaiSan)) LIKE '%MAY_MOC%' OR UPPER(COALESCE(kh.NhomTaiSan, ts.IdNhomTaiSan)) LIKE '%MAYMOC%') THEN (
                                CASE
                                    WHEN EXISTS (
                                        SELECT 1 FROM danhgia_vattu dg
                                        INNER JOIN nghiemthu_maymoc ntmm ON dg.IdNghiemThu = ntmm.Id
                                        LEFT JOIN bienphap_maymoc bpm ON ntmm.IdBienPhapMayMoc = bpm.Id
                                    INNER JOIN giamdinh_maymoc gdmm ON (bpm.IdGiamDinhMayMoc = gdmm.Id OR ntmm.IdGiamDinhMayMoc = gdmm.Id)
                                        INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                        INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND dg.TrangThai != 2
                                    ) THEN 5
                                    WHEN EXISTS (
                                        SELECT 1 FROM nghiemthu_maymoc ntmm
                                        LEFT JOIN bienphap_maymoc bpm ON ntmm.IdBienPhapMayMoc = bpm.Id
                                    INNER JOIN giamdinh_maymoc gdmm ON (bpm.IdGiamDinhMayMoc = gdmm.Id OR ntmm.IdGiamDinhMayMoc = gdmm.Id)
                                        INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                        INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND ntmm.TrangThai != 2
                                    ) THEN 4
                                    WHEN EXISTS (
                                        SELECT 1 FROM bienphap_maymoc bpm
                                        INNER JOIN giamdinh_maymoc gdmm ON bpm.IdGiamDinhMayMoc = gdmm.Id
                                        INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                        INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND bpm.TrangThai != 2
                                    ) THEN 3
                                    WHEN EXISTS (
                                        SELECT 1 FROM giamdinh_maymoc gdmm
                                        INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                        INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND gdmm.TrangThai != 2
                                    ) THEN 2
                                    WHEN EXISTS (
                                        SELECT 1 FROM kiemtra_suco_chitiet ktct
                                        INNER JOIN kiemtra_suco ktsc ON ktct.IdKiemTraSuCo = ktsc.Id
                                        WHERE ktct.IdSuCoChiTiet = stct.Id
                                          AND ktsc.TrangThai != 2
                                    ) THEN 1
                                    ELSE 0
                                END
                            )
                            ELSE (
                                CASE
                                    WHEN EXISTS (
                                        SELECT 1 FROM danhgia_vattu dg
                                        INNER JOIN nghiemthu_phuongtien ntpt ON dg.IdNghiemThu = ntpt.Id
                                        LEFT JOIN bienphap_phuongtien bpp ON ntpt.IdBienPhapPhuongTien = bpp.Id
                                    INNER JOIN giamdinh_phuongtien gdpt ON (bpp.IdGiamDinhPhuongTien = gdpt.Id OR ntpt.IdGiamDinhPhuongTien = gdpt.Id)
                                        INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND dg.TrangThai != 2
                                    ) THEN 5
                                    WHEN EXISTS (
                                        SELECT 1 FROM nghiemthu_phuongtien ntpt
                                        LEFT JOIN bienphap_phuongtien bpp ON ntpt.IdBienPhapPhuongTien = bpp.Id
                                    INNER JOIN giamdinh_phuongtien gdpt ON (bpp.IdGiamDinhPhuongTien = gdpt.Id OR ntpt.IdGiamDinhPhuongTien = gdpt.Id)
                                        INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND ntpt.TrangThai != 2
                                    ) THEN 4
                                    WHEN EXISTS (
                                        SELECT 1 FROM bienphap_phuongtien bpp
                                        INNER JOIN giamdinh_phuongtien gdpt ON bpp.IdGiamDinhPhuongTien = gdpt.Id
                                        INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND bpp.TrangThai != 2
                                    ) THEN 3
                                    WHEN EXISTS (
                                        SELECT 1 FROM giamdinh_phuongtien gdpt
                                        INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                        INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                        WHERE ktscct.IdSuCoChiTiet = stct.Id
                                          AND gdpt.TrangThai != 2
                                    ) THEN 2
                                    WHEN EXISTS (
                                        SELECT 1 FROM kiemtra_suco_chitiet ktct
                                        INNER JOIN kiemtra_suco ktsc ON ktct.IdKiemTraSuCo = ktsc.Id
                                        WHERE ktct.IdSuCoChiTiet = stct.Id
                                          AND ktsc.TrangThai != 2
                                    ) THEN 1
                                    ELSE 0
                                END
                            )
                        END as daKiemTraSuCo
                        FROM suco_thietbi_chitiet stct
                        LEFT JOIN suco_thietbi sc ON stct.IdSuCo = sc.Id
                        LEFT JOIN kehoachsuachua kh ON sc.IdKeHoach = kh.Id
                        LEFT JOIN TaiSan ts ON stct.IdTaiSan = ts.Id
                        WHERE stct.Id = ?
                    """,
                new BeanPropertyRowMapper<>(SuCoThietBiChiTiet.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * Lấy danh sách chi tiết theo ID phiếu sự cố,
     * kèm join tên tài sản và tên đơn vị quản lý kỹ thuật.
     */
    public List<SuCoThietBiChiTiet> findByIdSuCo(String idSuCo) {
        String sql = """
            SELECT ct.*,
                   ts.TenTaiSan         AS tenTaiSan,
                   ts.DonViTinh         AS donViTinh,
                   nts.TenNhom          AS tenNhomTaiSan,
                   pb.TenPhongBan       AS tenDonViQuanLyKyThuat,
                   CASE
                       WHEN (UPPER(COALESCE(kh.NhomTaiSan, ts.IdNhomTaiSan)) LIKE '%MAY_MOC%' OR UPPER(COALESCE(kh.NhomTaiSan, ts.IdNhomTaiSan)) LIKE '%MAYMOC%') THEN (
                           CASE
                               WHEN EXISTS (
                                   SELECT 1 FROM danhgia_vattu dg
                                   INNER JOIN nghiemthu_maymoc ntmm ON dg.IdNghiemThu = ntmm.Id
                                   LEFT JOIN bienphap_maymoc bpm ON ntmm.IdBienPhapMayMoc = bpm.Id
                                    INNER JOIN giamdinh_maymoc gdmm ON (bpm.IdGiamDinhMayMoc = gdmm.Id OR ntmm.IdGiamDinhMayMoc = gdmm.Id)
                                   INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                   INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND dg.TrangThai != 2
                               ) THEN 5
                               WHEN EXISTS (
                                   SELECT 1 FROM nghiemthu_maymoc ntmm
                                   LEFT JOIN bienphap_maymoc bpm ON ntmm.IdBienPhapMayMoc = bpm.Id
                                    INNER JOIN giamdinh_maymoc gdmm ON (bpm.IdGiamDinhMayMoc = gdmm.Id OR ntmm.IdGiamDinhMayMoc = gdmm.Id)
                                   INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                   INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND ntmm.TrangThai != 2
                               ) THEN 4
                               WHEN EXISTS (
                                   SELECT 1 FROM bienphap_maymoc bpm
                                   INNER JOIN giamdinh_maymoc gdmm ON bpm.IdGiamDinhMayMoc = gdmm.Id
                                   INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                   INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND bpm.TrangThai != 2
                               ) THEN 3
                               WHEN EXISTS (
                                   SELECT 1 FROM giamdinh_maymoc gdmm
                                   INNER JOIN giamdinh_maymoc_chitiet gdmmct ON gdmm.Id = gdmmct.IdGiamDinhMayMoc
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON gdmmct.IdBienBanChiTiet = ktscct.Id
                                   INNER JOIN kiemtra_suco ktsc ON ktscct.IdKiemTraSuCo = ktsc.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND gdmm.TrangThai != 2
                               ) THEN 2
                               WHEN EXISTS (
                                   SELECT 1 FROM kiemtra_suco_chitiet ktct
                                   INNER JOIN kiemtra_suco ktsc ON ktct.IdKiemTraSuCo = ktsc.Id
                                   WHERE ktct.IdSuCoChiTiet = ct.Id
                                     AND ktsc.TrangThai != 2
                               ) THEN 1
                               ELSE 0
                           END
                       )
                       ELSE (
                           CASE
                               WHEN EXISTS (
                                   SELECT 1 FROM danhgia_vattu dg
                                   INNER JOIN nghiemthu_phuongtien ntpt ON dg.IdNghiemThu = ntpt.Id
                                   LEFT JOIN bienphap_phuongtien bpp ON ntpt.IdBienPhapPhuongTien = bpp.Id
                                    INNER JOIN giamdinh_phuongtien gdpt ON (bpp.IdGiamDinhPhuongTien = gdpt.Id OR ntpt.IdGiamDinhPhuongTien = gdpt.Id)
                                   INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND dg.TrangThai != 2
                               ) THEN 5
                               WHEN EXISTS (
                                   SELECT 1 FROM nghiemthu_phuongtien ntpt
                                   LEFT JOIN bienphap_phuongtien bpp ON ntpt.IdBienPhapPhuongTien = bpp.Id
                                    INNER JOIN giamdinh_phuongtien gdpt ON (bpp.IdGiamDinhPhuongTien = gdpt.Id OR ntpt.IdGiamDinhPhuongTien = gdpt.Id)
                                   INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND ntpt.TrangThai != 2
                               ) THEN 4
                               WHEN EXISTS (
                                   SELECT 1 FROM bienphap_phuongtien bpp
                                   INNER JOIN giamdinh_phuongtien gdpt ON bpp.IdGiamDinhPhuongTien = gdpt.Id
                                   INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND bpp.TrangThai != 2
                               ) THEN 3
                               WHEN EXISTS (
                                   SELECT 1 FROM giamdinh_phuongtien gdpt
                                   INNER JOIN kiemtra_suco ON gdpt.IdBienBan = kiemtra_suco.Id AND gdpt.LoaiBienBan = 'su_co'
                                   INNER JOIN kiemtra_suco_chitiet ktscct ON ktscct.IdKiemTraSuCo = kiemtra_suco.Id
                                   WHERE ktscct.IdSuCoChiTiet = ct.Id
                                     AND gdpt.TrangThai != 2
                               ) THEN 2
                               WHEN EXISTS (
                                   SELECT 1 FROM kiemtra_suco_chitiet ktct
                                   INNER JOIN kiemtra_suco ktsc ON ktct.IdKiemTraSuCo = ktsc.Id
                                   WHERE ktct.IdSuCoChiTiet = ct.Id
                                     AND ktsc.TrangThai != 2
                               ) THEN 1
                               ELSE 0
                           END
                       )
                   END as daKiemTraSuCo
            FROM suco_thietbi_chitiet ct
                LEFT JOIN suco_thietbi sc ON ct.IdSuCo = sc.Id
                LEFT JOIN kehoachsuachua kh ON sc.IdKeHoach = kh.Id
                LEFT JOIN TaiSan ts   ON ct.IdTaiSan              = ts.Id
                LEFT JOIN NhomTaiSan nts ON ts.IdNhomTaiSan       = nts.Id
                LEFT JOIN PhongBan pb ON ct.IdDonViQuanLyKyThuat  = pb.Id
            WHERE ct.IdSuCo = ?
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuCoThietBiChiTiet.class), idSuCo);
    }

    // ==================== ID ====================

    public String generateNextId() {
        return "SUCO_CT_" + UUID.randomUUID().toString();
    }

    // ==================== Insert đơn ====================

    public int insert(SuCoThietBiChiTiet e) {
        if (e.getId() == null || e.getId().isBlank()) {
            e.setId(generateNextId());
        }
        String sql = """
            INSERT INTO suco_thietbi_chitiet (
                Id, IdSuCo, IdTaiSan,
                ThuocHeThong, TinhTrang, IdDonViQuanLyKyThuat,
                NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, ViTri, SoLuong
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.update(sql,
                e.getId(), e.getIdSuCo(), e.getIdTaiSan(),
                e.getThuocHeThong(), e.getTinhTrang(), e.getIdDonViQuanLyKyThuat(),
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat(), e.getViTri(), e.getSoLuong()
        );
    }

    // ==================== Batch Insert ====================

    public int[] batchInsert(List<SuCoThietBiChiTiet> list) {
        System.out.println("Insert " + list);
        String sql = """
            INSERT INTO suco_thietbi_chitiet (
                Id, IdSuCo, IdTaiSan,
                ThuocHeThong, TinhTrang, IdDonViQuanLyKyThuat,
                NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, ViTri, SoLuong
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuCoThietBiChiTiet e = list.get(i);
                if (e.getId() == null || e.getId().isBlank()) {
                    e.setId(generateNextId());
                }
                ps.setString(1, e.getId());
                ps.setString(2, e.getIdSuCo());
                ps.setString(3, e.getIdTaiSan());
                ps.setString(4, e.getThuocHeThong());
                ps.setString(5, e.getTinhTrang());
                ps.setString(6, e.getIdDonViQuanLyKyThuat());
                ps.setString(7, e.getNgayTao());
                ps.setString(8, e.getNgayCapNhat());
                ps.setString(9, e.getNguoiTao());
                ps.setString(10, e.getNguoiCapNhat());
                ps.setString(11, e.getViTri());
                ps.setObject(12, e.getSoLuong());
            }

            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    // ==================== Update đơn ====================

    public int update(SuCoThietBiChiTiet e) {
        String sql = """
            UPDATE suco_thietbi_chitiet SET
                IdTaiSan = ?,
                ThuocHeThong = ?, TinhTrang = ?, IdDonViQuanLyKyThuat = ?, ViTri = ?, SoLuong = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql,
                e.getIdTaiSan(),
                e.getThuocHeThong(), e.getTinhTrang(), e.getIdDonViQuanLyKyThuat(), e.getViTri(), e.getSoLuong(),
                e.getNgayCapNhat(), e.getNguoiCapNhat(),
                e.getId()
        );
    }

    // ==================== Batch Update ====================

    public int[] batchUpdate(List<SuCoThietBiChiTiet> list) {
        String sql = """
            UPDATE suco_thietbi_chitiet SET
                IdTaiSan = ?,
                ThuocHeThong = ?, TinhTrang = ?, IdDonViQuanLyKyThuat = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, ViTri = ?, SoLuong = ?
            WHERE Id = ?
            """;
        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SuCoThietBiChiTiet e = list.get(i);
                ps.setString(1, e.getIdTaiSan());
                ps.setString(2, e.getThuocHeThong());
                ps.setString(3, e.getTinhTrang());
                ps.setString(4, e.getIdDonViQuanLyKyThuat());
                ps.setString(5, e.getNgayCapNhat());
                ps.setString(6, e.getNguoiCapNhat());
                ps.setString(7, e.getViTri());
                ps.setObject(8, e.getSoLuong());
                ps.setString(9, e.getId());
            }

            @Override
            public int getBatchSize() { return list.size(); }
        });
    }

    // ==================== Delete ====================

    /** Xóa theo ID phiếu sự cố (dùng khi xóa phiếu cha) */
    public int deleteByIdSuCo(String idSuCo) {
        return jdbcTemplate.update("DELETE FROM suco_thietbi_chitiet WHERE IdSuCo = ?", idSuCo);
    }

    /** Xóa một dòng chi tiết */
    public int deleteById(String id) {
        return jdbcTemplate.update("DELETE FROM suco_thietbi_chitiet WHERE Id = ?", id);
    }

    /** Xóa nhiều dòng chi tiết theo danh sách ID */
    public int[] batchDelete(List<String> ids) {
        return jdbcTemplate.batchUpdate(
                "DELETE FROM suco_thietbi_chitiet WHERE Id = ?",
                new BatchPreparedStatementSetter() {
                    @Override
                    public void setValues(PreparedStatement ps, int i) throws SQLException {
                        ps.setString(1, ids.get(i));
                    }

                    @Override
                    public int getBatchSize() { return ids.size(); }
                });
    }
}
