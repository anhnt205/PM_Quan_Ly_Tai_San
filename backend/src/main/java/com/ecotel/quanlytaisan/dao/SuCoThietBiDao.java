package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.SuCoThietBi;
import com.ecotel.quanlytaisan.model.SuCoThietBiDTO;
import com.ecotel.quanlytaisan.model.NguoiKy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.time.Year;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * DAO sự cố thiết bị.
 *
 * Bảng: suco_thietbi
 * TrangThai: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành
 * MucDo    : 1=Nhẹ  | 2=Trung bình | 3=Nặng | 4=Nghiêm trọng
 */
@Repository
public class SuCoThietBiDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    /** Cache toàn bộ danh sách DTO (join sẵn) */
    private static List<SuCoThietBiDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    // ==================== SQL SELECT với JOIN ====================

    private String buildSelectSql() {
        return """
            SELECT
                sc.Id,
                sc.IdCongTy,
                sc.IdKeHoach,
                sc.SoPhieu,

                sc.IdDonViBaoCao,
                pb.TenPhongBan          AS tenDonViBaoCao,

                sc.NgayPhatHien,
                sc.TenHeThongThietBi,
                sc.PhanHeViTri,
                sc.MucDo,
                sc.MoTa,
                sc.GhiChuBienBan,

                sc.IdNguoiLap,
                nvLap.HoTen             AS tenNguoiLap,
                sc.NguoiLapXacNhan,

                sc.IdGiamDoc,
                nvGD.HoTen              AS tenGiamDoc,
                sc.GiamDocXacNhan,

                sc.Share,
                sc.TrangThai,

                sc.NgayTao,
                sc.NgayCapNhat,
                sc.NguoiTao,
                nvNT.HoTen              AS tenNguoiTao,
                sc.NguoiCapNhat,
                CASE
                    WHEN EXISTS (SELECT 1 FROM kiemtra_suco kt WHERE kt.IdSuCo = sc.Id AND kt.TrangThai != 2) THEN 1
                    ELSE 0
                END AS daCoGiamDinh

            FROM suco_thietbi sc
                LEFT JOIN PhongBan pb   ON sc.IdDonViBaoCao = pb.Id
                LEFT JOIN NhanVien nvLap ON sc.IdNguoiLap   = nvLap.Id
                LEFT JOIN NhanVien nvGD  ON sc.IdGiamDoc    = nvGD.Id
                LEFT JOIN NhanVien nvNT  ON sc.NguoiTao     = nvNT.Id
            """;
    }

    // ==================== Cache ====================

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(SuCoThietBiDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ==================== Query ====================

    public List<SuCoThietBiDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public SuCoThietBi findById(String id) {
        String sql = "SELECT * FROM suco_thietbi WHERE Id = ?";
        List<SuCoThietBi> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuCoThietBi.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public SuCoThietBiDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE sc.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(SuCoThietBiDTO.class), id);
        } catch (Exception e) { return null; }
    }

    public List<SuCoThietBiDTO> findByIdKeHoach(String idKeHoach) {
        String sql = buildSelectSql() + " WHERE sc.IdKeHoach = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuCoThietBiDTO.class), idKeHoach);
    }

    // ==================== ID generation ====================

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName  = "SUCO";
        String prefix   = "SC-" + currentYear + "-";
        try {
            var result = jdbcTemplate.queryForMap(
                    "SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?", seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update(
                        "UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?",
                        currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            Integer maxSeq = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 8) AS UNSIGNED)), 0) FROM suco_thietbi WHERE Id LIKE ?",
                    Integer.class, prefix + "%");
            int init = maxSeq == null ? 0 : maxSeq;
            jdbcTemplate.update(
                    "INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) "
                    + "ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    seqName, currentYear, init, init);
        }
        jdbcTemplate.update(
                "UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?",
                seqName, currentYear);
        Integer next = jdbcTemplate.queryForObject(
                "SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);
        return prefix + String.format("%04d", next);
    }

    // ==================== INSERT ====================

    public SuCoThietBi insert(SuCoThietBi e) {
        String now = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        e.setId(generateNextId());
        e.setNgayTao(now);
        e.setNgayCapNhat(now);
        String sql = """
            INSERT INTO suco_thietbi (
                Id, IdCongTy, IdKeHoach, SoPhieu,
                IdDonViBaoCao, NgayPhatHien,
                TenHeThongThietBi, PhanHeViTri, MucDo, MoTa,
                IdNguoiLap, NguoiLapXacNhan,
                IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai,
                NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, GhiChuBienBan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getIdKeHoach(), e.getSoPhieu(),
                e.getIdDonViBaoCao(), e.getNgayPhatHien(),
                e.getTenHeThongThietBi(), e.getPhanHeViTri(),
                e.getMucDo() != null ? e.getMucDo() : 1,
                e.getMoTa(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(),
                e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(),
                e.getTrangThai() != null ? e.getTrangThai() : 0,
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat(), e.getGhiChuBienBan()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    // ==================== UPDATE ====================

    public SuCoThietBi update(SuCoThietBi e) {
        String now = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        e.setNgayCapNhat(now);
        String sql = """
            UPDATE suco_thietbi SET
                IdKeHoach = ?, SoPhieu = ?,
                IdDonViBaoCao = ?, NgayPhatHien = ?,
                TenHeThongThietBi = ?, PhanHeViTri = ?, MucDo = ?, MoTa = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?,
                IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, GhiChuBienBan = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getIdKeHoach(), e.getSoPhieu(),
                e.getIdDonViBaoCao(), e.getNgayPhatHien(),
                e.getTenHeThongThietBi(), e.getPhanHeViTri(), e.getMucDo(), e.getMoTa(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(),
                e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(),
                e.getNgayCapNhat(), e.getNguoiCapNhat(), e.getGhiChuBienBan(),
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

    // 0: Nháp, 1: Đã duyệt, 2: Hủy, 3: Hoàn thành
    public int updateTrangThai(String id, String userId) {
        SuCoThietBi sc = findById(id);
        if (sc == null) return 0;
        
        int trangThai = sc.getTrangThai() != null ? sc.getTrangThai() : 0;

        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1;
        }

        if (Objects.equals(userId, sc.getIdNguoiLap())) {
            sc.setNguoiLapXacNhan(true);
            trangThai = 1;
        }

        if (Objects.equals(userId, sc.getIdGiamDoc())) {
            sc.setGiamDocXacNhan(true);
            trangThai = 1;
        }

        boolean allKy = true;
        if (sc.getIdNguoiLap() != null && !sc.getIdNguoiLap().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(sc.getNguoiLapXacNhan());
        }
        if (sc.getIdGiamDoc() != null && !sc.getIdGiamDoc().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(sc.getGiamDocXacNhan());
        }

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        if (allKy) {
            trangThai = 3;
        }

        sc.setTrangThai(trangThai);
        SuCoThietBi result = update(sc);
        
        if (result != null) {
            CompletableFuture.runAsync(this::refreshCache);
            return trangThai;
        }
        return 0;
    }

    public int huySuCo(String id) {
        final int STATUS_CANCELLED = 0;
        String now = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
        int r = jdbcTemplate.update(
                "UPDATE suco_thietbi SET TrangThai = ?, Share = 0, NgayCapNhat = ? WHERE Id = ?",
                STATUS_CANCELLED, now, id);
        if (r > 0) {
            kyTaiLieuDao.delete(id);
            CompletableFuture.runAsync(this::refreshCache);
        }
        return r;
    }

    // ==================== DELETE ====================

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM suco_thietbi WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM suco_thietbi WHERE Id = ?",
                ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
