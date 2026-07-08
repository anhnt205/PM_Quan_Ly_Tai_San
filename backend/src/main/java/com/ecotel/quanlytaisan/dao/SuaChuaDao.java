package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.SuaChua;
import com.ecotel.quanlytaisan.model.SuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Repository
public class SuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    private static List<SuaChuaDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                sc.Id,
                sc.IdCongTy,
                sc.CongTy,
                sc.TenMauBienBan,
                sc.SoPhieu,
                sc.IdKeHoach,
                sc.Thang,
                sc.Nam,
                sc.GhiChu,
                sc.GhiChuBienBan,
                sc.IdNguoiLap,
                nvLap.HoTen AS tenNguoiLap,
                sc.NguoiLapXacNhan,
                sc.IdGiamDoc,
                nvGD.HoTen AS tenGiamDoc,
                sc.GiamDocXacNhan,
                sc.Share,
                sc.TrangThai,
                sc.NgayTao,
                sc.NgayCapNhat,
                sc.NguoiTao,
                sc.NguoiCapNhat,
                kh.TenKeHoach AS tenKeHoach,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM giamdinh gd
                        WHERE gd.IdBienBan = sc.id
                    ) THEN 1 ELSE 0 
                END as daCoGiamDinh
            FROM suachua sc
                LEFT JOIN kehoachsuachua kh ON sc.IdKeHoach = kh.Id
                LEFT JOIN NhanVien nvLap ON sc.IdNguoiLap = nvLap.Id
                LEFT JOIN NhanVien nvGD ON sc.IdGiamDoc = nvGD.Id
            """;
    }

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(SuaChuaDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<SuaChuaDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public SuaChua findById(String id) {
        String sql = "SELECT * FROM suachua WHERE Id = ?";
        List<SuaChua> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChua.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public SuaChuaDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE sc.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(SuaChuaDTO.class), id);
        } catch (Exception e) { return null; }
    }

    public List<SuaChuaDTO> findByIdKeHoach(String idKeHoach) {
        refreshCache();
        return cache.stream()
                .filter(d -> idKeHoach != null && idKeHoach.equalsIgnoreCase(d.getIdKeHoach()))
                .collect(Collectors.toList());
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "SUACHUA";
        String prefix = "SUACHUA-" + currentYear + "-";
        try {
            var result = jdbcTemplate.queryForMap("SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?", seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            Integer maxSeq = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 8) AS UNSIGNED)), 0) FROM suachua WHERE Id LIKE ?",
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

    public SuaChua insert(SuaChua e) {
        e.setId(generateNextId());
        String sql = """
            INSERT INTO suachua (
                Id, IdCongTy, CongTy, TenMauBienBan, SoPhieu, IdKeHoach, Thang, Nam, GhiChu,
                IdNguoiLap, NguoiLapXacNhan, IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, GhiChuBienBan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getCongTy(), e.getTenMauBienBan(), e.getSoPhieu(), e.getIdKeHoach(), e.getThang(), e.getNam(), e.getGhiChu(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai() != null ? e.getTrangThai() : 0, 
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat(), e.getGhiChuBienBan()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public SuaChua update(SuaChua e) {
        String sql = """
            UPDATE suachua SET
                CongTy = ?, TenMauBienBan = ?, SoPhieu = ?, IdKeHoach = ?, Thang = ?, Nam = ?, GhiChu = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?, IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?, GhiChuBienBan = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getCongTy(), e.getTenMauBienBan(), e.getSoPhieu(), e.getIdKeHoach(), e.getThang(), e.getNam(), e.getGhiChu(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(), e.getNgayCapNhat(), e.getNguoiCapNhat(), e.getGhiChuBienBan(),
                e.getId()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public int updateTrangThai(String id, Integer trangThai) {
        int r = jdbcTemplate.update("UPDATE suachua SET TrangThai = ? WHERE Id = ?", trangThai, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int updateGhiChu(String id, String ghiChuBienBan) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        int r = jdbcTemplate.update("UPDATE suachua SET GhiChuBienBan = ?, NgayCapNhat = ? WHERE Id = ?",
                ghiChuBienBan, now, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int huySuaChua(String id) {
        final int STATUS_CANCELLED = 0;
        int r = jdbcTemplate.update(
                "UPDATE suachua SET TrangThai = ?, Share = 0, NgayCapNhat = ? WHERE Id = ?",
                STATUS_CANCELLED, LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), id);
        if (r > 0) {
            kyTaiLieuDao.delete(id);
            CompletableFuture.runAsync(this::refreshCache);
        }
        return r;
    }

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM suachua WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM suachua WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
