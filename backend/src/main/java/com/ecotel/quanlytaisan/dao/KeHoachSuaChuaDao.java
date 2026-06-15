package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KeHoachSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachSuaChuaDTO;
import com.ecotel.quanlytaisan.model.NguoiKy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Repository
public class KeHoachSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    private static List<KeHoachSuaChuaDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                kh.Id,
                kh.IdCongTy,
                kh.CongTy,
                kh.SoKeHoach,
                kh.TenKeHoach,
                kh.SoQuyetDinh,
                kh.IdLoaiKeHoach,
                lkh.TenLoai        AS tenLoaiKeHoach,
                kh.IdLoaiSuaChua,
                lsc.Ten            AS tenLoaiSuaChua,
                kh.Nam,
                kh.NhomTaiSan,

                kh.IdDonViGiao,
                pbGiao.TenPhongBan AS tenDonViGiao,

                kh.IdDonViNhan,
                pbNhan.TenPhongBan AS tenDonViNhan,

                kh.IdNguoiLapBieu,
                nvLap.HoTen        AS tenNguoiLapBieu,
                kh.NguoiLapBieuXacNhan,

                kh.IdTrinhDuyetGiamDoc,
                nvGD.HoTen         AS tenTrinhDuyetGiamDoc,
                kh.TrinhDuyetGiamDocXacNhan,

                kh.TrangThai,
                kh.NgayTao,
                kh.NgayCapNhat,
                kh.NguoiTao,
                nvNT.HoTen         AS tenNguoiTao,
                kh.NguoiCapNhat,

                kh.GhiChu,
                kh.GhiChuBienBan,
                kh.DuongDanFile,
                kh.TenFile,
                kh.NgayKy,
                kh.DuongDanTaiLieuBangKe,

                kh.Share,
                kh.ByStep,
                kh.TenMauBienBanSuaChua,

                (SELECT COUNT(*) FROM suco_thietbi sc WHERE sc.IdKeHoach = kh.Id) AS soLuongSuCo

            FROM kehoachsuachua kh
                LEFT JOIN PhongBan pbGiao ON kh.IdDonViGiao          = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON kh.IdDonViNhan           = pbNhan.Id
                LEFT JOIN NhanVien nvLap  ON kh.IdNguoiLapBieu        = nvLap.Id
                LEFT JOIN NhanVien nvGD   ON kh.IdTrinhDuyetGiamDoc   = nvGD.Id
                LEFT JOIN NhanVien nvNT   ON kh.NguoiTao              = nvNT.Id
                LEFT JOIN loaikehoach lkh ON kh.IdLoaiKeHoach         = lkh.Id
                LEFT JOIN LoaiSCBD lsc    ON kh.IdLoaiSuaChua         = lsc.Id
            """;
    }

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(KeHoachSuaChuaDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<KeHoachSuaChuaDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public KeHoachSuaChua findById(String id) {
        String sql = "SELECT * FROM kehoachsuachua WHERE Id = ?";
        List<KeHoachSuaChua> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChua.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public KeHoachSuaChuaDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE kh.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaDTO.class), id);
        } catch (Exception e) { return null; }
    }

    // ==================== ID generation ====================

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "KEHOACH";
        String prefix = "KH-" + currentYear + "-";
        try {
            var result = jdbcTemplate.queryForMap("SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?", seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            Integer maxSeq = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 8) AS UNSIGNED)), 0) FROM kehoachsuachua WHERE Id LIKE ?",
                    Integer.class, prefix + "%");
            int init = maxSeq == null ? 0 : maxSeq;
            jdbcTemplate.update(
                    "INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    seqName, currentYear, init, init);
        }
        jdbcTemplate.update("UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?", seqName, currentYear);
        Integer next = jdbcTemplate.queryForObject("SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);
        return prefix + String.format("%04d", next);
    }

    // ==================== INSERT ====================

    public KeHoachSuaChua insert(KeHoachSuaChua e) {
        e.setId(generateNextId());
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        e.setNgayTao(now);
        e.setNgayCapNhat(now);
        String sql = """
            INSERT INTO kehoachsuachua (
                Id, IdCongTy, CongTy, SoKeHoach, TenKeHoach, SoQuyetDinh, IdLoaiKeHoach, IdLoaiSuaChua, Nam,
                IdDonViGiao, IdDonViNhan,
                IdNguoiLapBieu, NguoiLapBieuXacNhan,
                IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan,
                TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat,
                GhiChu, GhiChuBienBan, DuongDanFile, TenFile, NgayKy, DuongDanTaiLieuBangKe,
                Share, ByStep, NhomTaiSan, TenMauBienBanSuaChua
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getCongTy(), e.getSoKeHoach(), e.getTenKeHoach(), e.getSoQuyetDinh(),
                e.getIdLoaiKeHoach(), e.getIdLoaiSuaChua(), e.getNam(),
                e.getIdDonViGiao(), e.getIdDonViNhan(),
                e.getIdNguoiLapBieu(), e.getNguoiLapBieuXacNhan(),
                e.getIdTrinhDuyetGiamDoc(), e.getTrinhDuyetGiamDocXacNhan(),
                e.getTrangThai() != null ? e.getTrangThai() : 0,
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat(),
                e.getGhiChu(), e.getGhiChuBienBan(), e.getDuongDanFile(), e.getTenFile(), e.getNgayKy(),
                e.getDuongDanTaiLieuBangKe(),
                e.getShare(), e.getByStep(), e.getNhomTaiSan(), e.getTenMauBienBanSuaChua()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    // ==================== UPDATE ====================

    public KeHoachSuaChua update(KeHoachSuaChua e) {
        e.setNgayCapNhat(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        String sql = """
            UPDATE kehoachsuachua SET
                CongTy = ?, SoKeHoach = ?, TenKeHoach = ?, SoQuyetDinh = ?, IdLoaiKeHoach = ?, IdLoaiSuaChua = ?, Nam = ?,
                IdDonViGiao = ?, IdDonViNhan = ?,
                IdNguoiLapBieu = ?, NguoiLapBieuXacNhan = ?,
                IdTrinhDuyetGiamDoc = ?, TrinhDuyetGiamDocXacNhan = ?,
                TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?,
                GhiChu = ?, GhiChuBienBan = ?, DuongDanFile = ?, TenFile = ?, NgayKy = ?, DuongDanTaiLieuBangKe = ?,
                Share = ?, ByStep = ?, NhomTaiSan = ?, TenMauBienBanSuaChua = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getCongTy(), e.getSoKeHoach(), e.getTenKeHoach(), e.getSoQuyetDinh(), e.getIdLoaiKeHoach(),
                e.getIdLoaiSuaChua(), e.getNam(),
                e.getIdDonViGiao(), e.getIdDonViNhan(),
                e.getIdNguoiLapBieu(), e.getNguoiLapBieuXacNhan(),
                e.getIdTrinhDuyetGiamDoc(), e.getTrinhDuyetGiamDocXacNhan(),
                e.getTrangThai(), e.getNgayCapNhat(), e.getNguoiCapNhat(),
                e.getGhiChu(), e.getGhiChuBienBan(), e.getDuongDanFile(), e.getTenFile(),
                e.getNgayKy(), e.getDuongDanTaiLieuBangKe(),
                e.getShare(), e.getByStep(), e.getNhomTaiSan(), e.getTenMauBienBanSuaChua(),
                e.getId()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    // ==================== Trạng thái / Hủy ====================

    public boolean checkAllOtherNguoiKy(String idTaiLieu) {
        List<NguoiKy> nguoiKyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(idTaiLieu);
        if (nguoiKyList == null || nguoiKyList.isEmpty()) return true;
        for (NguoiKy nguoiKy : nguoiKyList) {
            if (nguoiKy.getTrangThai() != 1) return false;
        }
        return true;
    }

    public int updateTrangThaiKy(String id, String userId) {
        NguoiKy nguoiKy = kyTaiLieuDao.getNguoiKy(userId, id);
        if (nguoiKy != null) {
            nguoiKy.setTrangThai(1);
            return kyTaiLieuDao.updateTrangThai(nguoiKy.getId(), "1");
        }
        return 0;
    }

    // 0: Nháp, 1: Chờ duyệt, 2: Hủy, 3: Đã duyệt/Hoàn thành
    public int updateTrangThai(String id, String userId) {
        KeHoachSuaChua kh = findById(id);
        if (kh == null) return 0;
        
        int trangThai = kh.getTrangThai() != null ? kh.getTrangThai() : 0;

        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1;
        }

        if (Objects.equals(userId, kh.getIdNguoiLapBieu())) {
            kh.setNguoiLapBieuXacNhan(true);
            trangThai = 1;
        }

        if (Objects.equals(userId, kh.getIdTrinhDuyetGiamDoc())) {
            kh.setTrinhDuyetGiamDocXacNhan(true);
            trangThai = 1;
        }

        boolean allKy = true;
        if (kh.getIdNguoiLapBieu() != null && !kh.getIdNguoiLapBieu().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(kh.getNguoiLapBieuXacNhan());
        }
        if (kh.getIdTrinhDuyetGiamDoc() != null && !kh.getIdTrinhDuyetGiamDoc().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(kh.getTrinhDuyetGiamDocXacNhan());
        }

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        if (allKy) {
            trangThai = 3;
        }

        kh.setTrangThai(trangThai);
        KeHoachSuaChua result = update(kh);
        
        if (result != null) {
            CompletableFuture.runAsync(this::refreshCache);
            return trangThai;
        }
        return 0;
    }

    public int updateGhiChu(String id, String ghiChuBienBan) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        int r = jdbcTemplate.update(
                "UPDATE kehoachsuachua SET GhiChuBienBan = ?, NgayCapNhat = ? WHERE Id = ?",
                ghiChuBienBan, now, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int huyKeHoach(String id) {
        final int STATUS_CANCELLED = 0;
        int r = jdbcTemplate.update(
                "UPDATE kehoachsuachua SET TrangThai = ?, Share = 0, NgayCapNhat = ? WHERE Id = ?",
                STATUS_CANCELLED, LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), id);
        if (r > 0) {
            kyTaiLieuDao.delete(id);
            CompletableFuture.runAsync(this::refreshCache);
        }
        return r;
    }

    // ==================== DELETE ====================

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM kehoachsuachua WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM kehoachsuachua WHERE Id = ?",
                ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
