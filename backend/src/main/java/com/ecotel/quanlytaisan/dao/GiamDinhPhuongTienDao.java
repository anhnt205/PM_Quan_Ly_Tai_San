package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.GiamDinhPhuongTien;
import com.ecotel.quanlytaisan.model.GiamDinhPhuongTienDTO;
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
public class GiamDinhPhuongTienDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    private static List<GiamDinhPhuongTienDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                gd.Id, gd.IdCongTy, gd.IdBienBan, gd.LoaiBienBan, gd.SoPhieu, gd.NgayGiamDinh, gd.ViTri,
                gd.TinhTrang, gd.NoiDungKhac, gd.IdTaiSan, gd.CapBaoDuong, gd.DonViSuaChua, gd.GhiChuBienBan,
                gd.IdNguoiLap, gd.NguoiLapXacNhan, gd.IdGiamDoc, gd.GiamDocXacNhan,
                gd.Share, gd.TrangThai, gd.NgayTao, gd.NgayCapNhat, gd.NguoiTao, gd.NguoiCapNhat,
                nvLap.HoTen AS tenNguoiLap,
                nvGD.HoTen AS tenGiamDoc,
                COALESCE(sc.SoPhieu, ktsc.SoPhieu) AS soPhieuBienBan,
                (SELECT COUNT(*) FROM bienphap_phuongtien nt WHERE nt.IdGiamDinhPhuongTien = gd.Id) AS daCoBienPhap,
                ts.TenTaiSan AS tenTaiSan
            FROM giamdinh_phuongtien gd
                LEFT JOIN suachua sc ON gd.IdBienBan = sc.Id AND gd.LoaiBienBan = 'sua_chua'
                LEFT JOIN kiemtra_suco ktsc ON gd.IdBienBan = ktsc.Id AND gd.LoaiBienBan = 'su_co'
                LEFT JOIN NhanVien nvLap ON gd.IdNguoiLap = nvLap.Id
                LEFT JOIN NhanVien nvGD ON gd.IdGiamDoc = nvGD.Id
                LEFT JOIN TaiSan ts ON gd.IdTaiSan = ts.Id
            """;
    }

    public void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(), new BeanPropertyRowMapper<>(GiamDinhPhuongTienDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<GiamDinhPhuongTienDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public GiamDinhPhuongTien findById(String id) {
        String sql = "SELECT * FROM giamdinh_phuongtien WHERE Id = ?";
        List<GiamDinhPhuongTien> r = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(GiamDinhPhuongTien.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public GiamDinhPhuongTienDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE gd.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(GiamDinhPhuongTienDTO.class), id);
        } catch (Exception e) { return null; }
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "GIAMDINH_PHUONGTIEN";
        String prefix = "GIAMDINH-PT-" + currentYear + "-";
        try {
            var result = jdbcTemplate.queryForMap("SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?", seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            Integer maxSeq = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 18) AS UNSIGNED)), 0) FROM giamdinh_phuongtien WHERE Id LIKE ?",
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

    public GiamDinhPhuongTien insert(GiamDinhPhuongTien e) {
        e.setId(generateNextId());
        String sql = """
            INSERT INTO giamdinh_phuongtien (
                Id, IdCongTy, IdBienBan, LoaiBienBan, SoPhieu, NgayGiamDinh, ViTri,
                TinhTrang, NoiDungKhac, IdTaiSan, CapBaoDuong, DonViSuaChua,
                IdNguoiLap, NguoiLapXacNhan, IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, GhiChuBienBan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getIdBienBan(), e.getLoaiBienBan(), e.getSoPhieu(), e.getNgayGiamDinh(), e.getViTri(),
                e.getTinhTrang(), e.getNoiDungKhac(), e.getIdTaiSan(), e.getCapBaoDuong(), e.getDonViSuaChua(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai() != null ? e.getTrangThai() : 0, 
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat(), e.getGhiChuBienBan()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public GiamDinhPhuongTien update(GiamDinhPhuongTien e) {
        String sql = """
            UPDATE giamdinh_phuongtien SET
                IdBienBan = ?, LoaiBienBan = ?, SoPhieu = ?, NgayGiamDinh = ?, ViTri = ?,
                TinhTrang = ?, NoiDungKhac = ?, IdTaiSan = ?, CapBaoDuong = ?, DonViSuaChua = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?, IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?, NgayCapNhat = ?, NguoiCapNhat = ?, GhiChuBienBan = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getIdBienBan(), e.getLoaiBienBan(), e.getSoPhieu(), e.getNgayGiamDinh(), e.getViTri(),
                e.getTinhTrang(), e.getNoiDungKhac(), e.getIdTaiSan(), e.getCapBaoDuong(), e.getDonViSuaChua(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(), e.getNgayCapNhat(), e.getNguoiCapNhat(), e.getGhiChuBienBan(),
                e.getId()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public int updateTrangThai(String id, Integer trangThai) {
        int r = jdbcTemplate.update("UPDATE giamdinh_phuongtien SET TrangThai = ? WHERE Id = ?", trangThai, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int huy(String id) {
        final int STATUS_CANCELLED = 0;
        int r = jdbcTemplate.update(
                "UPDATE giamdinh_phuongtien SET TrangThai = ?, Share = 0, NgayCapNhat = ? WHERE Id = ?",
                STATUS_CANCELLED, LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), id);
        if (r > 0) {
            kyTaiLieuDao.delete(id);
            CompletableFuture.runAsync(this::refreshCache);
        }
        return r;
    }

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM giamdinh_phuongtien WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM giamdinh_phuongtien WHERE Id = ?", ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
