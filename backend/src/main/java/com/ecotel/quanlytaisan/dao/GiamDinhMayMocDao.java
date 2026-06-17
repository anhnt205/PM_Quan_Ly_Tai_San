package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GiamDinhMayMoc;
import com.ecotel.quanlytaisan.model.GiamDinhMayMocDTO;
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
public class GiamDinhMayMocDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    private static List<GiamDinhMayMocDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                gd.Id, gd.IdCongTy, gd.CongTy, gd.TenMauBienBan, gd.IdBienBan, gd.LoaiBienBan, gd.SoPhieu, gd.NgayGiamDinh, gd.ViTri,
                gd.SoDeLaiPhucHoi, gd.SoDeLamPheLieu, gd.SoLuongHuy, gd.GhiChuBienBan,
                gd.IdNguoiLap, gd.NguoiLapXacNhan, gd.IdGiamDoc, gd.GiamDocXacNhan,
                gd.Share, gd.TrangThai, gd.NgayTao, gd.NgayCapNhat, gd.NguoiTao, gd.NguoiCapNhat,
                nvLap.HoTen AS tenNguoiLap,
                nvGD.HoTen AS tenGiamDoc,
                COALESCE(sc.SoPhieu, ktsc.SoPhieu) AS soPhieuBienBan,
                (SELECT COUNT(*) FROM bienphap_maymoc nt WHERE nt.IdGiamDinhMayMoc = gd.Id) AS daCoBienPhap
            FROM giamdinh_maymoc gd
                LEFT JOIN suachua sc ON gd.IdBienBan = sc.Id AND gd.LoaiBienBan = 'sua_chua'
                LEFT JOIN kiemtra_suco ktsc ON gd.IdBienBan = ktsc.Id AND gd.LoaiBienBan = 'su_co'
                LEFT JOIN NhanVien nvLap ON gd.IdNguoiLap = nvLap.Id
                LEFT JOIN NhanVien nvGD ON gd.IdGiamDoc = nvGD.Id
            """;
    }

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(GiamDinhMayMocDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<GiamDinhMayMocDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public GiamDinhMayMoc findById(String id) {
        String sql = "SELECT * FROM giamdinh_maymoc WHERE Id = ?";
        List<GiamDinhMayMoc> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhMayMoc.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public GiamDinhMayMocDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE gd.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(GiamDinhMayMocDTO.class), id);
        } catch (Exception e) { return null; }
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "GIAMDINH";
        String prefix = "GIAMDINH-" + currentYear + "-";
        try {
            var result = jdbcTemplate.queryForMap("SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?", seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            Integer maxSeq = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 9) AS UNSIGNED)), 0) FROM giamdinh_maymoc WHERE Id LIKE ?",
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

    public GiamDinhMayMoc insert(GiamDinhMayMoc e) {
        e.setId(generateNextId());
        String sql = """
            INSERT INTO giamdinh_maymoc (
                Id, IdCongTy, CongTy, TenMauBienBan, IdBienBan, LoaiBienBan, SoPhieu, NgayGiamDinh, ViTri,
                SoDeLaiPhucHoi, SoDeLamPheLieu, SoLuongHuy,
                IdNguoiLap, NguoiLapXacNhan, IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, GhiChuBienBan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getCongTy(), e.getTenMauBienBan(), e.getIdBienBan(), e.getLoaiBienBan(), e.getSoPhieu(), e.getNgayGiamDinh(), e.getViTri(),
                e.getSoDeLaiPhucHoi(), e.getSoDeLamPheLieu(), e.getSoLuongHuy(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai() != null ? e.getTrangThai() : 0, 
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat(), e.getGhiChuBienBan()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public GiamDinhMayMoc update(GiamDinhMayMoc e) {
        String sql = """
            UPDATE giamdinh_maymoc SET
                CongTy = ?, TenMauBienBan = ?, IdBienBan = ?, LoaiBienBan = ?, SoPhieu = ?, NgayGiamDinh = ?, ViTri = ?,
                SoDeLaiPhucHoi = ?, SoDeLamPheLieu = ?, SoLuongHuy = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?, IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?, GhiChuBienBan = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getCongTy(), e.getTenMauBienBan(), e.getIdBienBan(), e.getLoaiBienBan(), e.getSoPhieu(), e.getNgayGiamDinh(), e.getViTri(),
                e.getSoDeLaiPhucHoi(), e.getSoDeLamPheLieu(), e.getSoLuongHuy(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(), e.getNgayCapNhat(), e.getNguoiCapNhat(), e.getGhiChuBienBan(),
                e.getId()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public int updateTrangThai(String id, Integer trangThai) {
        int r = jdbcTemplate.update("UPDATE giamdinh_maymoc SET TrangThai = ? WHERE Id = ?", trangThai, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int updateGhiChu(String id, String ghiChuBienBan) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        int r = jdbcTemplate.update(
                "UPDATE giamdinh_maymoc SET GhiChuBienBan = ?, NgayCapNhat = ? WHERE Id = ?",
                ghiChuBienBan, now, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int huy(String id) {
        final int STATUS_CANCELLED = 0;
        int r = jdbcTemplate.update(
                "UPDATE giamdinh_maymoc SET TrangThai = ?, Share = 0, NgayCapNhat = ? WHERE Id = ?",
                STATUS_CANCELLED, LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), id);
        if (r > 0) {
            kyTaiLieuDao.delete(id);
            CompletableFuture.runAsync(this::refreshCache);
        }
        return r;
    }

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM giamdinh_maymoc WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM giamdinh_maymoc WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
