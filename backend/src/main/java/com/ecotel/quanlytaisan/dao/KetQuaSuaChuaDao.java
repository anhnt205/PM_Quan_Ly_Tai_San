package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
import com.ecotel.quanlytaisan.model.NguoiKy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class KetQuaSuaChuaDao {

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ==================== FINDERS ====================

    public KetQuaSuaChuaDTO findByIdSuaChua(String idSuaChua) {
        String sql = """
            SELECT
                kq.Id,
                kq.IdCongTy,
                kq.TenPhieu,
                kq.IdSuaChua,
                kq.IdLoaiSuaChua,
                kq.NgayBatDauThucTe,
                kq.NgayKetThucThucTe,
                kq.IdDonViGiao,
                pbGiao.TenPhongBan   AS tenDonViGiao,
                kq.IdDonViNhan,
                pbNhan.TenPhongBan   AS tenDonViNhan,
                kq.IdNguoiKyNhay,
                nvKyNhay.HoTen       AS tenNguoiKyNhay,
                kq.TrangThaiKyNhay,
                kq.NguoiLapPhieuKyNhay,
                kq.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen     AS tenTrinhDuyetCapPhong,
                kq.TrinhDuyetCapPhongXacNhan,
                kq.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen      AS tenTrinhDuyetGiamDoc,
                kq.TrinhDuyetGiamDocXacNhan,
                kq.IdDonViDeNghi,
                kq.DuongDanFile,
                kq.TenFile,
                kq.TaiLieuBanGhi,
                kq.ByStep,
                kq.SoQuyetDinh,
                kq.NguoiTao,
                kq.Share,
                kq.NgayTao,
                kq.CoPhieuBanGiao,
                kq.TaiLieuCuoi,
                kq.TrangThai,
                kq.ChiPhiPhanCong,
                kq.ChiPhiThueNgoai
            FROM ketquasuachua kq
                LEFT JOIN PhongBan pbGiao    ON kq.IdDonViGiao            = pbGiao.Id
                LEFT JOIN PhongBan pbNhan    ON kq.IdDonViNhan            = pbNhan.Id
                LEFT JOIN NhanVien nvKyNhay  ON kq.IdNguoiKyNhay          = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON kq.IdTrinhDuyetCapPhong  = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc  ON kq.IdTrinhDuyetGiamDoc   = nvGiamDoc.Id
            WHERE kq.IdSuaChua = ?
        """;
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaDTO.class), idSuaChua);
        } catch (Exception e) {
            return null;
        }
    }

    public KetQuaSuaChua findById(String id) {
        String sql = "SELECT * FROM ketquasuachua WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChua.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public List<KetQuaSuaChuaDTO> findByFilters(String idCongTy, Integer trangThai,
                                                LocalDateTime fromDate, LocalDateTime toDate,
                                                String idDonViGiao,
                                                int offset, int limit) {
        String sql = """
        SELECT
            kq.Id,
            kq.IdCongTy,
            kq.TenPhieu,
            kq.IdSuaChua,
            kq.IdLoaiSuaChua,
            kq.NgayBatDauThucTe,
            kq.NgayKetThucThucTe,
            kq.IdDonViGiao,
            pbGiao.TenPhongBan   AS tenDonViGiao,
            kq.IdDonViNhan,
            pbNhan.TenPhongBan   AS tenDonViNhan,
            kq.IdNguoiKyNhay,
            nvKyNhay.HoTen       AS tenNguoiKyNhay,
            kq.TrangThaiKyNhay,
            kq.NguoiLapPhieuKyNhay,
            kq.IdTrinhDuyetCapPhong,
            nvCapPhong.HoTen     AS tenTrinhDuyetCapPhong,
            kq.TrinhDuyetCapPhongXacNhan,
            kq.IdTrinhDuyetGiamDoc,
            nvGiamDoc.HoTen      AS tenTrinhDuyetGiamDoc,
            kq.TrinhDuyetGiamDocXacNhan,
            kq.IdDonViDeNghi,
            kq.DuongDanFile,
            kq.TenFile,
            kq.TaiLieuBanGhi,
            kq.ByStep,
            kq.SoQuyetDinh,
            kq.NguoiTao,
            kq.Share,
            kq.NgayTao,
            kq.CoPhieuBanGiao,
            kq.TaiLieuCuoi,
            kq.TrangThai,
            kq.ChiPhiPhanCong,
            kq.ChiPhiThueNgoai
        FROM ketquasuachua kq
            LEFT JOIN PhongBan pbGiao     ON kq.IdDonViGiao           = pbGiao.Id
            LEFT JOIN PhongBan pbNhan     ON kq.IdDonViNhan           = pbNhan.Id
            LEFT JOIN NhanVien nvKyNhay   ON kq.IdNguoiKyNhay         = nvKyNhay.Id
            LEFT JOIN NhanVien nvCapPhong ON kq.IdTrinhDuyetCapPhong  = nvCapPhong.Id
            LEFT JOIN NhanVien nvGiamDoc  ON kq.IdTrinhDuyetGiamDoc   = nvGiamDoc.Id
        WHERE 1=1
            AND (? IS NULL OR kq.IdCongTy = ?)
            AND (? IS NULL OR kq.TrangThai = ?)
            AND (? IS NULL OR kq.NgayTao >= ?)
            AND (? IS NULL OR kq.NgayTao <= ?)
            AND (? IS NULL OR kq.IdDonViGiao = ?)
        ORDER BY kq.NgayTao DESC
        LIMIT ? OFFSET ?
        """;

        int offsetCalc = offset;
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(KetQuaSuaChuaDTO.class),
                idCongTy, idCongTy,
                trangThai, trangThai,
                fromDate, fromDate,
                toDate, toDate,
                idDonViGiao, idDonViGiao,
                limit, offsetCalc);
    }

    public long countByFilters(String idCongTy, Integer trangThai,
                               LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
        SELECT COUNT(*)
        FROM ketquasuachua kq
        WHERE 1=1
            AND (? IS NULL OR kq.IdCongTy = ?)
            AND (? IS NULL OR kq.TrangThai = ?)
            AND (? IS NULL OR kq.NgayTao >= ?)
            AND (? IS NULL OR kq.NgayTao <= ?)
        """;

        return jdbcTemplate.queryForObject(sql, Long.class,
                idCongTy, idCongTy,
                trangThai, trangThai,
                fromDate, fromDate,
                toDate, toDate);
    }

    public Map<Integer, Long> countByTrangThai(String idCongTy, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
        SELECT TrangThai, COUNT(*)
        FROM ketquasuachua
        WHERE 1=1
            AND (? IS NULL OR IdCongTy = ?)
            AND (? IS NULL OR NgayTao >= ?)
            AND (? IS NULL OR NgayTao <= ?)
        GROUP BY TrangThai
        """;
        return jdbcTemplate.query(sql, rs -> {
            Map<Integer, Long> map = new HashMap<>();
            while (rs.next()) {
                map.put(rs.getInt(1), rs.getLong(2));
            }
            return map;
        }, idCongTy, idCongTy, fromDate, fromDate, toDate, toDate);
    }

    // ==================== ID GENERATOR ====================

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String prefix = "KQSC-" + currentYear + "-";
        String sql = """
            SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(Id, '-', -1) AS UNSIGNED)), 0) + 1
            FROM ketquasuachua
            WHERE Id LIKE ?
        """;
        try {
            Integer nextSeq = jdbcTemplate.queryForObject(sql, Integer.class, prefix + "%");
            return prefix + String.format("%04d", nextSeq != null ? nextSeq : 1);
        } catch (Exception e) {
            return prefix + "0001";
        }
    }

    // ==================== INSERT ====================

    public KetQuaSuaChua insert(KetQuaSuaChua entity) {
        entity.setId(generateNextId());

        String sql = """
            INSERT INTO ketquasuachua (
                Id, IdCongTy, TenPhieu, IdSuaChua, IdLoaiSuaChua,
                NgayBatDauThucTe, NgayKetThucThucTe,
                IdDonViGiao, IdDonViNhan, IdNguoiKyNhay,
                TrangThaiKyNhay, NguoiLapPhieuKyNhay,
                IdTrinhDuyetCapPhong, TrinhDuyetCapPhongXacNhan,
                IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan,
                IdDonViDeNghi, DuongDanFile, TenFile, TaiLieuBanGhi,
                ByStep, SoQuyetDinh, NguoiTao, Share, NgayTao,
                CoPhieuBanGiao, TaiLieuCuoi, TrangThai,
                ChiPhiPhanCong, ChiPhiThueNgoai
            ) VALUES (
                ?, ?, ?, ?, ?,
                ?, ?,
                ?, ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?
            )
        """;

        jdbcTemplate.update(sql,
                entity.getId(), entity.getIdCongTy(), entity.getTenPhieu(),
                entity.getIdSuaChua(), entity.getIdLoaiSuaChua(),
                entity.getNgayBatDauThucTe(), entity.getNgayKetThucThucTe(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay() != null && entity.getTrangThaiKyNhay() ? 1 : 0,
                entity.getNguoiLapPhieuKyNhay() != null && entity.getNguoiLapPhieuKyNhay() ? 1 : 0,
                entity.getIdTrinhDuyetCapPhong(),
                entity.getTrinhDuyetCapPhongXacNhan() != null && entity.getTrinhDuyetCapPhongXacNhan() ? 1 : 0,
                entity.getIdTrinhDuyetGiamDoc(),
                entity.getTrinhDuyetGiamDocXacNhan() != null && entity.getTrinhDuyetGiamDocXacNhan() ? 1 : 0,
                entity.getIdDonViDeNghi(), entity.getDuongDanFile(), entity.getTenFile(),
                entity.getTaiLieuBanGhi(),
                entity.getByStep() != null && entity.getByStep() ? 1 : 0,
                entity.getSoQuyetDinh(), entity.getNguoiTao(),
                entity.getShare() != null && entity.getShare() ? 1 : 0,
                entity.getNgayTao(),
                entity.getCoPhieuBanGiao() != null && entity.getCoPhieuBanGiao() ? 1 : 0,
                entity.getTaiLieuCuoi(),
                entity.getTrangThai() != null ? entity.getTrangThai() : 0,
                entity.getChiPhiPhanCong(),
                entity.getChiPhiThueNgoai()
        );

        return entity;
    }

    // ==================== UPDATE ====================

    public KetQuaSuaChua update(KetQuaSuaChua entity) {
        String sql = """
            UPDATE ketquasuachua SET
                IdCongTy = ?, TenPhieu = ?, IdSuaChua = ?, IdLoaiSuaChua = ?,
                NgayBatDauThucTe = ?, NgayKetThucThucTe = ?,
                IdDonViGiao = ?, IdDonViNhan = ?, IdNguoiKyNhay = ?,
                TrangThaiKyNhay = ?, NguoiLapPhieuKyNhay = ?,
                IdTrinhDuyetCapPhong = ?, TrinhDuyetCapPhongXacNhan = ?,
                IdTrinhDuyetGiamDoc = ?, TrinhDuyetGiamDocXacNhan = ?,
                IdDonViDeNghi = ?, DuongDanFile = ?, TenFile = ?, TaiLieuBanGhi = ?,
                ByStep = ?, SoQuyetDinh = ?, NguoiTao = ?, Share = ?,
                NgayTao = ?, CoPhieuBanGiao = ?, TaiLieuCuoi = ?, TrangThai = ?,
                ChiPhiPhanCong = ?, ChiPhiThueNgoai = ?
            WHERE Id = ?
        """;

        jdbcTemplate.update(sql,
                entity.getIdCongTy(), entity.getTenPhieu(), entity.getIdSuaChua(), entity.getIdLoaiSuaChua(),
                entity.getNgayBatDauThucTe(), entity.getNgayKetThucThucTe(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay() != null && entity.getTrangThaiKyNhay() ? 1 : 0,
                entity.getNguoiLapPhieuKyNhay() != null && entity.getNguoiLapPhieuKyNhay() ? 1 : 0,
                entity.getIdTrinhDuyetCapPhong(),
                entity.getTrinhDuyetCapPhongXacNhan() != null && entity.getTrinhDuyetCapPhongXacNhan() ? 1 : 0,
                entity.getIdTrinhDuyetGiamDoc(),
                entity.getTrinhDuyetGiamDocXacNhan() != null && entity.getTrinhDuyetGiamDocXacNhan() ? 1 : 0,
                entity.getIdDonViDeNghi(), entity.getDuongDanFile(), entity.getTenFile(),
                entity.getTaiLieuBanGhi(),
                entity.getByStep() != null && entity.getByStep() ? 1 : 0,
                entity.getSoQuyetDinh(), entity.getNguoiTao(),
                entity.getShare() != null && entity.getShare() ? 1 : 0,
                entity.getNgayTao(),
                entity.getCoPhieuBanGiao() != null && entity.getCoPhieuBanGiao() ? 1 : 0,
                entity.getTaiLieuCuoi(),
                entity.getTrangThai() != null ? entity.getTrangThai() : 0,
                entity.getChiPhiPhanCong(),
                entity.getChiPhiThueNgoai(),
                entity.getId()
        );

        return entity;
    }

    // ==================== DELETE ====================

    public int delete(String id) {
        String sql = "DELETE FROM ketquasuachua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // ==================== TRẠNG THÁI KÝ DUYỆT ====================

    public int updateTrangThai(String id, String userId) {
        KetQuaSuaChua kq = findById(id);
        if (kq == null) return 0;

        int trangThai = kq.getTrangThai() != null ? kq.getTrangThai() : 0;

        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1;
        }

        if (userId != null && userId.equals(kq.getIdNguoiKyNhay())) {
            kq.setTrangThaiKyNhay(true);
            trangThai = 1;
        }

        if (userId != null && userId.equals(kq.getIdTrinhDuyetCapPhong())) {
            kq.setTrinhDuyetCapPhongXacNhan(true);
            trangThai = 1;
        }

        if (userId != null && userId.equals(kq.getIdTrinhDuyetGiamDoc())) {
            kq.setTrinhDuyetGiamDocXacNhan(true);
            trangThai = 1;
        }

        boolean allKy = true;
        if (kq.getIdNguoiKyNhay() != null && !kq.getIdNguoiKyNhay().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(kq.getTrangThaiKyNhay());
        if (kq.getIdTrinhDuyetCapPhong() != null && !kq.getIdTrinhDuyetCapPhong().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(kq.getTrinhDuyetCapPhongXacNhan());
        if (kq.getIdTrinhDuyetGiamDoc() != null && !kq.getIdTrinhDuyetGiamDoc().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(kq.getTrinhDuyetGiamDocXacNhan());

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        if (allKy) {
            trangThai = 3;
        }

        kq.setTrangThai(trangThai);
        KetQuaSuaChua result = update(kq);
        if (result != null) {
            return trangThai;
        }
        return 0;
    }

    public int huyTrangThai(String id) {
        String sql = """
        UPDATE ketquasuachua
        SET TrangThaiKyNhay = 0,
            TrinhDuyetCapPhongXacNhan = 0,
            TrinhDuyetGiamDocXacNhan = 0,
            TrangThai = 2
        WHERE Id = ?
        """;
        return jdbcTemplate.update(sql, id);
    }

    public boolean checkAllOtherNguoiKy(String idTaiLieu) {
        List<NguoiKy> nguoiKyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(idTaiLieu);
        boolean flag = true;
        for (NguoiKy nguoiKy : nguoiKyList) {
            if (nguoiKy.getTrangThai() != 1) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    public int updateTrangThaiKy(String id, String userId) {
        NguoiKy nguoiKy = kyTaiLieuDao.getNguoiKy(userId, id);
        if (nguoiKy != null) {
            nguoiKy.setTrangThai(1);
            return kyTaiLieuDao.updateTrangThai(nguoiKy.getId(), "1");
        }
        return 0;
    }
}