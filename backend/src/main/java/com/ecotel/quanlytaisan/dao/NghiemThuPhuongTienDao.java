package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NghiemThuPhuongTien;
import com.ecotel.quanlytaisan.model.NghiemThuPhuongTienDTO;
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
public class NghiemThuPhuongTienDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    private static List<NghiemThuPhuongTienDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private String buildSelectSql() {
        return """
            SELECT
                nt.Id, nt.IdCongTy, nt.IdBienPhapPhuongTien, nt.IdTaiSan,
                nt.SoPhieu, nt.NoiDung, nt.TinhTrang, nt.CongViecPhatSinh,
                nt.ChiPhiNhanCong, nt.KetLuan, nt.GhiChuBienBan,
                nt.IdNguoiLap, nt.NguoiLapXacNhan,
                nt.IdGiamDoc, nt.GiamDocXacNhan,
                nt.Share, nt.TrangThai,
                nt.NgayTao, nt.NgayCapNhat, nt.NguoiTao, nt.NguoiCapNhat,
                nvLap.HoTen AS tenNguoiLap,
                nvGD.HoTen  AS tenGiamDoc,
                bp.SoBienBan  AS soPhieuBienPhapPhuongTien,
                ts.TenTaiSan AS tenTaiSan,
                (SELECT COUNT(*) FROM danhgia_vattu dg WHERE dg.IdNghiemThu = nt.Id) AS daCoDanhGiaVatTu
            FROM nghiemthu_phuongtien nt
                LEFT JOIN bienphap_phuongtien bp ON nt.IdBienPhapPhuongTien = bp.Id
                LEFT JOIN TaiSan ts ON nt.IdTaiSan = ts.Id
                LEFT JOIN NhanVien nvLap ON nt.IdNguoiLap = nvLap.Id
                LEFT JOIN NhanVien nvGD  ON nt.IdGiamDoc  = nvGD.Id
            """;
    }

    private void refreshCache() {
        try {
            cache = jdbcTemplate.query(buildSelectSql(),
                    new BeanPropertyRowMapper<>(NghiemThuPhuongTienDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<NghiemThuPhuongTienDTO> findAll(String idCongTy) {
        refreshCache();
        if (idCongTy == null) return new java.util.ArrayList<>(cache);
        return cache.stream()
                .filter(d -> idCongTy.equalsIgnoreCase(d.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public NghiemThuPhuongTien findById(String id) {
        String sql = "SELECT * FROM nghiemthu_phuongtien WHERE Id = ?";
        List<NghiemThuPhuongTien> r = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(NghiemThuPhuongTien.class), id);
        return r.isEmpty() ? null : r.get(0);
    }

    public NghiemThuPhuongTienDTO findByIdDTO(String id) {
        String sql = buildSelectSql() + " WHERE nt.Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql,
                    new BeanPropertyRowMapper<>(NghiemThuPhuongTienDTO.class), id);
        } catch (Exception e) { return null; }
    }

    public List<NghiemThuPhuongTienDTO> findByIdBienPhapPhuongTien(String idBienPhapPhuongTien) {
        String sql = buildSelectSql() + " WHERE nt.IdBienPhapPhuongTien = ?";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(NghiemThuPhuongTienDTO.class), idBienPhapPhuongTien);
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName  = "NGHIEMTHU_PHUONGTIEN";
        String prefix   = "NGHIEMTHU-PT-" + currentYear + "-";
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
                    "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 16) AS UNSIGNED)), 0) FROM nghiemthu_phuongtien WHERE Id LIKE ?",
                    Integer.class, prefix + "%");
            int init = maxSeq == null ? 0 : maxSeq;
            jdbcTemplate.update(
                    "INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) " +
                    "ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    seqName, currentYear, init, init);
        }
        jdbcTemplate.update(
                "UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?",
                seqName, currentYear);
        Integer next = jdbcTemplate.queryForObject(
                "SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);
        return prefix + String.format("%04d", next);
    }

    public NghiemThuPhuongTien insert(NghiemThuPhuongTien e) {
        e.setId(generateNextId());
        String sql = """
            INSERT INTO nghiemthu_phuongtien (
                Id, IdCongTy, IdBienPhapPhuongTien, IdTaiSan, SoPhieu,
                NoiDung, TinhTrang, CongViecPhatSinh, ChiPhiNhanCong, KetLuan,
                IdNguoiLap, NguoiLapXacNhan, IdGiamDoc, GiamDocXacNhan,
                Share, TrangThai, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, GhiChuBienBan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        int r = jdbcTemplate.update(sql,
                e.getId(), e.getIdCongTy(), e.getIdBienPhapPhuongTien(), e.getIdTaiSan(), e.getSoPhieu(),
                e.getNoiDung(), e.getTinhTrang(), e.getCongViecPhatSinh(), e.getChiPhiNhanCong(), e.getKetLuan(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(), e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai() != null ? e.getTrangThai() : 0,
                e.getNgayTao(), e.getNgayCapNhat(), e.getNguoiTao(), e.getNguoiCapNhat(), e.getGhiChuBienBan()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public NghiemThuPhuongTien update(NghiemThuPhuongTien e) {
        String sql = """
            UPDATE nghiemthu_phuongtien SET
                IdBienPhapPhuongTien = ?, IdTaiSan = ?, SoPhieu = ?,
                NoiDung = ?, TinhTrang = ?, CongViecPhatSinh = ?,
                ChiPhiNhanCong = ?, KetLuan = ?,
                IdNguoiLap = ?, NguoiLapXacNhan = ?,
                IdGiamDoc = ?, GiamDocXacNhan = ?,
                Share = ?, TrangThai = ?,
                NgayCapNhat = ?, NguoiCapNhat = ?, GhiChuBienBan = ?
            WHERE Id = ?
            """;
        int r = jdbcTemplate.update(sql,
                e.getIdBienPhapPhuongTien(), e.getIdTaiSan(), e.getSoPhieu(),
                e.getNoiDung(), e.getTinhTrang(), e.getCongViecPhatSinh(),
                e.getChiPhiNhanCong(), e.getKetLuan(),
                e.getIdNguoiLap(), e.getNguoiLapXacNhan(),
                e.getIdGiamDoc(), e.getGiamDocXacNhan(),
                e.getShare(), e.getTrangThai(),
                e.getNgayCapNhat(), e.getNguoiCapNhat(), e.getGhiChuBienBan(),
                e.getId()
        );
        if (r > 0) { CompletableFuture.runAsync(this::refreshCache); return findById(e.getId()); }
        return null;
    }

    public int updateTrangThai(String id, Integer trangThai) {
        int r = jdbcTemplate.update(
                "UPDATE nghiemthu_phuongtien SET TrangThai = ? WHERE Id = ?", trangThai, id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public int huy(String id) {
        final int STATUS_CANCELLED = 0;
        int r = jdbcTemplate.update(
                "UPDATE nghiemthu_phuongtien SET TrangThai = ?, Share = 0, NgayCapNhat = ? WHERE Id = ?",
                STATUS_CANCELLED, LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), id);
        if (r > 0) {
            kyTaiLieuDao.delete(id);
            CompletableFuture.runAsync(this::refreshCache);
        }
        return r;
    }

    public int delete(String id) {
        int r = jdbcTemplate.update("DELETE FROM nghiemthu_phuongtien WHERE Id = ?", id);
        if (r > 0) CompletableFuture.runAsync(this::refreshCache);
        return r;
    }

    public void batchDelete(List<String> ids) {
        jdbcTemplate.batchUpdate("DELETE FROM nghiemthu_phuongtien WHERE Id = ?",
                ids, 50, (ps, id) -> ps.setString(1, id));
        CompletableFuture.runAsync(this::refreshCache);
    }
}
