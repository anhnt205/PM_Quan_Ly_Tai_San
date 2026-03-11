package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
import com.ecotel.quanlytaisan.model.NguoiKy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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

    public KetQuaSuaChuaDTO findByIdSuaChua(String idSuaChua) {
        String sql = """
            SELECT
                kq.Id,
                kq.IdCongTy,
                kq.MaSuaChua,
                kq.TenSuaChua,
                kq.MucDoSuCo,
                kq.MucDoUuTien,
                kq.IdDonViGiao,
                pbGiao.TenPhongBan   AS tenDonViGiao,
                kq.IdDonViNhan,
                pbNhan.TenPhongBan   AS tenDonViNhan,
                kq.IdNguoiKyNhay,
                nvKyNhay.HoTen       AS tenNguoiKyNhay,
                kq.TrangThaiKyNhay,
                kq.NguoiLapPhieuKyNhay,
                kq.NgayKetThucDuKien,
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
                kq.DaBanGiao,
                kq.CoPhieuBanGiao,
                kq.TaiLieuCuoi,
                kq.Loai,
                kq.TrangThai,
                kq.IdKeHoach,
                kq.NgayCapNhat,
                kq.idLoaiSuaChua,
                kq.GhiChu,
                kq.IdSuaChua,
                kq.ChiPhiPhanCong,
                kq.ChiPhiThueNgoai
            FROM ketquasuachua kq
                LEFT JOIN PhongBan pbGiao    ON kq.IdDonViGiao            = pbGiao.Id
                LEFT JOIN PhongBan pbNhan    ON kq.IdDonViNhan             = pbNhan.Id
                LEFT JOIN NhanVien nvKyNhay  ON kq.IdNguoiKyNhay          = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON kq.IdTrinhDuyetCapPhong   = nvCapPhong.Id
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

    public List<KetQuaSuaChuaDTO> findByFilters(String idCongTy, Integer trangThai,
                                                LocalDateTime fromDate, LocalDateTime toDate,
                                                String idDonViGiao,
                                                int page, int size) {
        String sql = """
        SELECT
            kq.Id,
            kq.IdCongTy,
            kq.MaSuaChua,
            kq.TenSuaChua,
            kq.MucDoSuCo,
            kq.MucDoUuTien,
            kq.IdDonViGiao,
            pbGiao.TenPhongBan   AS tenDonViGiao,
            kq.IdDonViNhan,
            pbNhan.TenPhongBan   AS tenDonViNhan,
            kq.IdNguoiKyNhay,
            nvKyNhay.HoTen       AS tenNguoiKyNhay,
            kq.TrangThaiKyNhay,
            kq.NguoiLapPhieuKyNhay,
            kq.NgayKetThucDuKien,
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
            kq.DaBanGiao,
            kq.CoPhieuBanGiao,
            kq.TaiLieuCuoi,
            kq.Loai,
            kq.TrangThai,
            kq.IdKeHoach,
            kq.NgayCapNhat,
            kq.idLoaiSuaChua,
            kq.GhiChu,
            kq.IdSuaChua,
            kq.ChiPhiPhanCong,
            kq.ChiPhiThueNgoai
        FROM ketquasuachua kq
            LEFT JOIN PhongBan pbGiao     ON kq.IdDonViGiao           = pbGiao.Id
            LEFT JOIN PhongBan pbNhan     ON kq.IdDonViNhan            = pbNhan.Id
            LEFT JOIN NhanVien nvKyNhay   ON kq.IdNguoiKyNhay         = nvKyNhay.Id
            LEFT JOIN NhanVien nvCapPhong ON kq.IdTrinhDuyetCapPhong   = nvCapPhong.Id
            LEFT JOIN NhanVien nvGiamDoc  ON kq.IdTrinhDuyetGiamDoc    = nvGiamDoc.Id
        WHERE 1=1
            AND (? IS NULL OR kq.IdCongTy = ?)
            AND (? IS NULL OR kq.TrangThai = ?)
            AND (? IS NULL OR kq.NgayTao >= ?)
            AND (? IS NULL OR kq.NgayTao <= ?)
            AND (? IS NULL OR kq.IdDonViGiao = ?)
        ORDER BY kq.NgayTao DESC
        LIMIT ? OFFSET ?
    """;

        int offset = page * size;
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(KetQuaSuaChuaDTO.class),
                idCongTy, idCongTy,
                trangThai, trangThai,
                fromDate, fromDate,
                toDate, toDate,
                idDonViGiao, idDonViGiao,
                size, offset);
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

    public KetQuaSuaChua insert(KetQuaSuaChua entity) {
        entity.setId(generateNextId());

        String sql = """
            INSERT INTO ketquasuachua (
                Id, IdCongTy, MaSuaChua, TenSuaChua, MucDoSuCo, MucDoUuTien,
                IdDonViGiao, IdDonViNhan, IdNguoiKyNhay, TrangThaiKyNhay,
                NguoiLapPhieuKyNhay, NgayKetThucDuKien, IdTrinhDuyetCapPhong,
                TrinhDuyetCapPhongXacNhan, IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan,
                IdDonViDeNghi, DuongDanFile, TenFile, TaiLieuBanGhi, ByStep,
                SoQuyetDinh, NguoiTao, Share, NgayTao, DaBanGiao, CoPhieuBanGiao,
                TaiLieuCuoi, Loai, TrangThai, IdKeHoach, NgayCapNhat,
                idLoaiSuaChua, GhiChu, IdSuaChua, ChiPhiPhanCong, ChiPhiThueNgoai
            ) VALUES (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?
            )
        """;

        jdbcTemplate.update(sql,
                entity.getId(), entity.getIdCongTy(), entity.getMaSuaChua(),
                entity.getTenSuaChua(), entity.getMucDoSuCo(), entity.getMucDoUuTien(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay() ? 1 : 0,
                entity.getNguoiLapPhieuKyNhay() ? 1 : 0,
                entity.getNgayKetThucDuKien(), entity.getIdTrinhDuyetCapPhong(),
                entity.getTrinhDuyetCapPhongXacNhan() ? 1 : 0,
                entity.getIdTrinhDuyetGiamDoc(),
                entity.getTrinhDuyetGiamDocXacNhan() ? 1 : 0,
                entity.getIdDonViDeNghi(), entity.getDuongDanFile(), entity.getTenFile(),
                entity.getTaiLieuBanGhi(), entity.getByStep() ? 1 : 0,
                entity.getSoQuyetDinh(), entity.getNguoiTao(),
                entity.getShare() ? 1 : 0,
                entity.getNgayTao(),
                entity.getDaBanGiao() ? 1 : 0,
                entity.getCoPhieuBanGiao() ? 1 : 0,
                entity.getTaiLieuCuoi(), entity.getLoai(), entity.getTrangThai(),
                entity.getIdKeHoach(), entity.getNgayCapNhat(),
                entity.getIdLoaiSuaChua(), entity.getGhiChu(), entity.getIdSuaChua(),
                entity.getChiPhiPhanCong(), entity.getChiPhiThueNgoai()
        );

        return entity;
    }

    public KetQuaSuaChua update(KetQuaSuaChua entity) {
        String sql = """
            UPDATE ketquasuachua SET
                IdCongTy = ?, MaSuaChua = ?, TenSuaChua = ?, MucDoSuCo = ?, MucDoUuTien = ?,
                IdDonViGiao = ?, IdDonViNhan = ?, IdNguoiKyNhay = ?, TrangThaiKyNhay = ?,
                NguoiLapPhieuKyNhay = ?, NgayKetThucDuKien = ?, IdTrinhDuyetCapPhong = ?,
                TrinhDuyetCapPhongXacNhan = ?, IdTrinhDuyetGiamDoc = ?, TrinhDuyetGiamDocXacNhan = ?,
                IdDonViDeNghi = ?, DuongDanFile = ?, TenFile = ?, TaiLieuBanGhi = ?, ByStep = ?,
                SoQuyetDinh = ?, NguoiTao = ?, Share = ?, NgayTao = ?, DaBanGiao = ?,
                CoPhieuBanGiao = ?, TaiLieuCuoi = ?, Loai = ?, TrangThai = ?, IdKeHoach = ?,
                NgayCapNhat = ?, idLoaiSuaChua = ?, GhiChu = ?, IdSuaChua = ?,
                ChiPhiPhanCong = ?, ChiPhiThueNgoai = ?
            WHERE Id = ?
        """;

        jdbcTemplate.update(sql,
                entity.getIdCongTy(), entity.getMaSuaChua(), entity.getTenSuaChua(),
                entity.getMucDoSuCo(), entity.getMucDoUuTien(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay() ? 1 : 0,
                entity.getNguoiLapPhieuKyNhay() ? 1 : 0,
                entity.getNgayKetThucDuKien(), entity.getIdTrinhDuyetCapPhong(),
                entity.getTrinhDuyetCapPhongXacNhan() ? 1 : 0,
                entity.getIdTrinhDuyetGiamDoc(),
                entity.getTrinhDuyetGiamDocXacNhan() ? 1 : 0,
                entity.getIdDonViDeNghi(), entity.getDuongDanFile(), entity.getTenFile(),
                entity.getTaiLieuBanGhi(), entity.getByStep() ? 1 : 0,
                entity.getSoQuyetDinh(), entity.getNguoiTao(),
                entity.getShare() ? 1 : 0,
                entity.getNgayTao(),
                entity.getDaBanGiao() ? 1 : 0,
                entity.getCoPhieuBanGiao() ? 1 : 0,
                entity.getTaiLieuCuoi(), entity.getLoai(), entity.getTrangThai(),
                entity.getIdKeHoach(), entity.getNgayCapNhat(),
                entity.getIdLoaiSuaChua(), entity.getGhiChu(), entity.getIdSuaChua(),
                entity.getChiPhiPhanCong(), entity.getChiPhiThueNgoai(),
                entity.getId()
        );

        return entity;
    }

    public int delete(String id) {
        String sql = "DELETE FROM ketquasuachua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }


    /**
     * Cập nhật trạng thái ký theo quy trình
     * 0: nháp, 1: chờ duyệt, 2: hủy, 3: hoàn thành
     */
    public int updateTrangThai(String id, String userId) {
        KetQuaSuaChua kq = findById(id);
        if (kq == null) return 0;

        int trangThai = kq.getTrangThai() != null ? kq.getTrangThai() : 0;

        // Bước 1: Ký từ bảng NguoiKy (người ký phụ)
        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1; // Chờ duyệt
        }

        // Bước 2: Người ký nháy
        if (userId != null && userId.equals(kq.getIdNguoiKyNhay())) {
            kq.setTrangThaiKyNhay(true);
            trangThai = 1; // Chờ duyệt
        }

        // Bước 3: Duyệt cấp phòng
        if (userId != null && userId.equals(kq.getIdTrinhDuyetCapPhong())) {
            kq.setTrinhDuyetCapPhongXacNhan(true);
            trangThai = 1; // Chờ duyệt
        }

        // Bước 4: Duyệt giám đốc
        if (userId != null && userId.equals(kq.getIdTrinhDuyetGiamDoc())) {
            kq.setTrinhDuyetGiamDocXacNhan(true);
            trangThai = 1; // Chờ duyệt
        }

        // Kiểm tra tất cả đã ký chưa
        boolean allKy = true;
        if (kq.getIdNguoiKyNhay() != null && !kq.getIdNguoiKyNhay().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(kq.getTrangThaiKyNhay());
        if (kq.getIdTrinhDuyetCapPhong() != null && !kq.getIdTrinhDuyetCapPhong().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(kq.getTrinhDuyetCapPhongXacNhan());
        if (kq.getIdTrinhDuyetGiamDoc() != null && !kq.getIdTrinhDuyetGiamDoc().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(kq.getTrinhDuyetGiamDocXacNhan());

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id); // Kiểm tra người ký phụ
        }

        if (allKy) {
            trangThai = 3; // Hoàn thành
        }

        kq.setTrangThai(trangThai);
        KetQuaSuaChua result = update(kq);
        if (result != null) {
            return trangThai;
        }
        return 0;
    }

    /**
     * Hủy phiếu kết quả sửa chữa
     */
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