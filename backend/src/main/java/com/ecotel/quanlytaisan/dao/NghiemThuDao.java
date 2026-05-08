package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NghiemThu;
import com.ecotel.quanlytaisan.model.NghiemThuDTO;
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
public class NghiemThuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static List<NghiemThuDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                nt.Id, nt.IdCongTy, nt.IdGiamDinh, nt.SoPhieu, nt.NgayNghiemThu,
                nt.ViTri, nt.TenThietBi, nt.SoDangKi, nt.CapSuaChua,
                nt.KetQua, nt.NoiDung,
                nt.IdNguoiLap, nt.NguoiLapXacNhan, nt.IdGiamDoc, nt.GiamDocXacNhan,
                nt.Share, nt.TrangThai, nt.NgayTao, nt.NgayCapNhat, nt.NguoiTao, nt.NguoiCapNhat,
                nvLap.HoTen AS tenNguoiLap,
                nvGD.HoTen AS tenGiamDoc,
                gd.SoPhieu AS soPhieuGiamDinh,
                (SELECT COUNT(*) FROM danhgia_vattu dg WHERE dg.IdNghiemThu = nt.Id) AS daCoDanhGiaVatTu
            FROM nghiemthu nt
                LEFT JOIN giamdinh gd ON nt.IdGiamDinh = gd.Id
                LEFT JOIN NhanVien nvLap ON nt.IdNguoiLap = nvLap.Id
                LEFT JOIN NhanVien nvGD ON nt.IdGiamDoc = nvGD.Id
            """;
    }

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(NghiemThuDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<NghiemThuDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public NghiemThu findById(String id) {
        String sql = "SELECT * FROM nghiemthu WHERE Id = ?";
        List<NghiemThu> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NghiemThu.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public NghiemThuDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE nt.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(NghiemThuDTO.class), id);
        } catch (Exception e) { return null; }
    }

    public List<NghiemThuDTO> findByIdGiamDinh(String idGiamDinh) {
        String sql = buildSelectSql() + " WHERE nt.IdGiamDinh = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NghiemThuDTO.class), idGiamDinh);
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "NGHIEMTHU";
        String prefix = "NGHIEMTHU-" + currentYear + "-";
        try {
            var result = jdbcTemplate.queryForMap("SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?", seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            Integer maxSeq = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 12) AS UNSIGNED)), 0) FROM nghiemthu WHERE Id LIKE ?",
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

    public NghiemThu insert(NghiemThu e) {
        e.setId(generateNextId());
        String sql = """
            INSERT INTO nghiemthu (
                Id, IdCongTy, IdGiamDinh, SoPhieu, NgayNghiemThu, ViTri,
                TenThietBi, SoDangKi, CapSuaChua, KetQua, NoiDung,
                IdNguoiLap, NguoiLapXacNhan, IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getIdGiamDinh(), e.getSoPhieu(), e.getNgayNghiemThu(), e.getViTri(),
                e.getTenThietBi(), e.getSoDangKi(), e.getCapSuaChua(), e.getKetQua(), e.getNoiDung(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai() != null ? e.getTrangThai() : 0,
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public NghiemThu update(NghiemThu e) {
        String sql = """
            UPDATE nghiemthu SET
                IdGiamDinh = ?, SoPhieu = ?, NgayNghiemThu = ?, ViTri = ?,
                TenThietBi = ?, SoDangKi = ?, CapSuaChua = ?, KetQua = ?, NoiDung = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?, IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getIdGiamDinh(), e.getSoPhieu(), e.getNgayNghiemThu(), e.getViTri(),
                e.getTenThietBi(), e.getSoDangKi(), e.getCapSuaChua(), e.getKetQua(), e.getNoiDung(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(), e.getNgayCapNhat(), e.getNguoiCapNhat(),
                e.getId()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public int updateTrangThai(String id, Integer trangThai) {
        int r = jdbcTemplate.update("UPDATE nghiemthu SET TrangThai = ? WHERE Id = ?", trangThai, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM nghiemthu WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM nghiemthu WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
