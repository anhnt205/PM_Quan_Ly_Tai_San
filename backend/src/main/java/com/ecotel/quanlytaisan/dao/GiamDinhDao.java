package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GiamDinh;
import com.ecotel.quanlytaisan.model.GiamDinhDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.time.Year;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Repository
public class GiamDinhDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static List<GiamDinhDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                gd.Id, gd.IdCongTy, gd.IdSuaChua, gd.SoPhieu, gd.NgayGiamDinh, gd.ViTri,
                gd.SoDeLaiPhucHoi, gd.SoDeLamPheLieu, gd.SoLuongHuy,
                gd.IdNguoiLap, gd.NguoiLapXacNhan, gd.IdGiamDoc, gd.GiamDocXacNhan,
                gd.Share, gd.TrangThai, gd.NgayTao, gd.NgayCapNhat, gd.NguoiTao, gd.NguoiCapNhat,
                nvLap.HoTen AS tenNguoiLap,
                nvGD.HoTen AS tenGiamDoc,
                sc.SoPhieu AS soPhieuSuaChua
            FROM giamdinh gd
                LEFT JOIN suachua sc ON gd.IdSuaChua = sc.Id
                LEFT JOIN NhanVien nvLap ON gd.IdNguoiLap = nvLap.Id
                LEFT JOIN NhanVien nvGD ON gd.IdGiamDoc = nvGD.Id
            """;
    }

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(GiamDinhDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<GiamDinhDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public GiamDinh findById(String id) {
        String sql = "SELECT * FROM giamdinh WHERE Id = ?";
        List<GiamDinh> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinh.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public GiamDinhDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE gd.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(GiamDinhDTO.class), id);
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
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 9) AS UNSIGNED)), 0) FROM giamdinh WHERE Id LIKE ?",
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

    public GiamDinh insert(GiamDinh e) {
        e.setId(generateNextId());
        String sql = """
            INSERT INTO giamdinh (
                Id, IdCongTy, IdSuaChua, SoPhieu, NgayGiamDinh, ViTri,
                SoDeLaiPhucHoi, SoDeLamPheLieu, SoLuongHuy,
                IdNguoiLap, NguoiLapXacNhan, IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getIdSuaChua(), e.getSoPhieu(), e.getNgayGiamDinh(), e.getViTri(),
                e.getSoDeLaiPhucHoi(), e.getSoDeLamPheLieu(), e.getSoLuongHuy(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai() != null ? e.getTrangThai() : 0, 
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public GiamDinh update(GiamDinh e) {
        String sql = """
            UPDATE giamdinh SET
                IdSuaChua = ?, SoPhieu = ?, NgayGiamDinh = ?, ViTri = ?,
                SoDeLaiPhucHoi = ?, SoDeLamPheLieu = ?, SoLuongHuy = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?, IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getIdSuaChua(), e.getSoPhieu(), e.getNgayGiamDinh(), e.getViTri(),
                e.getSoDeLaiPhucHoi(), e.getSoDeLamPheLieu(), e.getSoLuongHuy(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(), e.getNgayCapNhat(), e.getNguoiCapNhat(),
                e.getId()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public int updateTrangThai(String id, Integer trangThai) {
        int r = jdbcTemplate.update("UPDATE giamdinh SET TrangThai = ? WHERE Id = ?", trangThai, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM giamdinh WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM giamdinh WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
