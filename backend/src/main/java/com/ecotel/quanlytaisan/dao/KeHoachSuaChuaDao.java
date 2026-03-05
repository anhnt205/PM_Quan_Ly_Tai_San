package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KeHoachSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.time.Year;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Repository
public class KeHoachSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static List<KeHoachSuaChuaDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private void refreshCache() {
        String sql = """
            SELECT 
                kh.Id,
                kh.IdCongTy,
                kh.TenKeHoach,
                kh.LoaiKeHoach,
                kh.ChuKyNgay,
                kh.MocGioMay,
                kh.IdDonViThucHien,
                pb.TenPhongBan AS tenDonViThucHien,
                kh.IdNguoiPhuTrach,
                nv.HoTen AS tenNguoiPhuTrach,
                kh.NgayBatDau,
                kh.NgayKetThuc,
                kh.LoaiDoiTuong,
                kh.NgayTao,
                kh.NgayCapNhat,
                kh.GhiChu,
                kh.TrangThai
            FROM KeHoachSuaChua kh
                LEFT JOIN PhongBan pb ON kh.IdDonViThucHien = pb.Id
                LEFT JOIN NhanVien nv ON kh.IdNguoiPhuTrach = nv.Id
        """;
        try {
            cache = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<KeHoachSuaChuaDTO> findAll(String idCongTy) {

        refreshCache();
        if (idCongTy == null) {
            return new java.util.ArrayList<>(cache);
        }
        return cache.stream()
                .filter(dto -> idCongTy.equalsIgnoreCase(dto.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM KeHoachSuaChua WHERE UPPER(IdCongTy) = UPPER(?)";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public List<KeHoachSuaChuaDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tenkehoach":
                orderColumn = "kh.TenKeHoach";
                break;
            case "loaikehoach":
                orderColumn = "kh.LoaiKeHoach";
                break;
            case "ngaybatdau":
                orderColumn = "kh.NgayBatDau";
                break;
            case "ngayketthuc":
                orderColumn = "kh.NgayKetThuc";
                break;
            case "ngaytao":
            default:
                orderColumn = "kh.NgayTao";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String sql = """
            SELECT 
                kh.Id,
                kh.IdCongTy,
                kh.TenKeHoach,
                kh.LoaiKeHoach,
                kh.ChuKyNgay,
                kh.MocGioMay,
                kh.IdDonViThucHien,
                pb.TenPhongBan AS tenDonViThucHien,
                kh.IdNguoiPhuTrach,
                nv.HoTen AS tenNguoiPhuTrach,
                kh.NgayBatDau,
                kh.NgayKetThuc,
                kh.LoaiDoiTuong,
                kh.NgayTao,
                kh.NgayCapNhat,
                kh.GhiChu,
                kh.TrangThai
            FROM KeHoachSuaChua kh
                LEFT JOIN PhongBan pb ON kh.IdDonViThucHien = pb.Id
                LEFT JOIN NhanVien nv ON kh.IdNguoiPhuTrach = nv.Id
            WHERE UPPER(kh.IdCongTy) = UPPER(?)
            ORDER BY %s %s
            LIMIT ? OFFSET ?
        """;
        String finalSql = String.format(sql, orderColumn, direction);
        return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(KeHoachSuaChuaDTO.class),
                idCongTy, limit, offset);
    }

    public KeHoachSuaChua findById(String id) {
        String sql = "SELECT * FROM KeHoachSuaChua WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KeHoachSuaChua.class), id);
    }

    public KeHoachSuaChuaDTO findByIdDTO(String id) {
        String sql = """
            SELECT 
                kh.Id,
                kh.IdCongTy,
                kh.TenKeHoach,
                kh.LoaiKeHoach,
                kh.ChuKyNgay,
                kh.MocGioMay,
                kh.IdDonViThucHien,
                pb.TenPhongBan AS tenDonViThucHien,
                kh.IdNguoiPhuTrach,
                nv.HoTen AS tenNguoiPhuTrach,
                kh.NgayBatDau,
                kh.NgayKetThuc,
                kh.LoaiDoiTuong,
                kh.NgayTao,
                kh.NgayCapNhat,
                kh.GhiChu,
                kh.TrangThai
            FROM KeHoachSuaChua kh
                LEFT JOIN PhongBan pb ON kh.IdDonViThucHien = pb.Id
                LEFT JOIN NhanVien nv ON kh.IdNguoiPhuTrach = nv.Id
            WHERE kh.Id = ?
        """;
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KeHoachSuaChuaDTO.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "KEHOACH";
        String prefix = "KH-" + currentYear + "-";

        String checkSql = "SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?";
        try {
            var result = jdbcTemplate.queryForMap(checkSql, seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            String maxSql = "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 8) AS UNSIGNED)), 0) FROM KeHoachSuaChua WHERE Id LIKE ?";
            Integer maxSeq = jdbcTemplate.queryForObject(maxSql, Integer.class, prefix + "%");
            int initValue = (maxSeq == null) ? 0 : maxSeq;
            jdbcTemplate.update("INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    seqName, currentYear, initValue, initValue);
        }

        jdbcTemplate.update("UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?", seqName, currentYear);
        Integer nextSeq = jdbcTemplate.queryForObject("SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);

        return prefix + String.format("%04d", nextSeq);
    }

    // insert nhieu
    public void batchInsert(List<KeHoachSuaChua> list) {

        String sql = """
        INSERT INTO KeHoachSuaChua (
            Id, IdCongTy, TenKeHoach, LoaiKeHoach, ChuKyNgay, MocGioMay,
            IdDonViThucHien, IdNguoiPhuTrach, NgayBatDau, NgayKetThuc,
            LoaiDoiTuong, NgayTao, NgayCapNhat, GhiChu, TrangThai
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {
            entity.setId(generateNextId());
            entity.setNgayTao(now);
            entity.setNgayCapNhat(now);

            ps.setString(1, entity.getId());
            ps.setString(2, entity.getIdCongTy());
            ps.setString(3, entity.getTenKeHoach());
            ps.setString(4, entity.getLoaiKeHoach());
            ps.setObject(5, entity.getChuKyNgay());
            ps.setObject(6, entity.getMocGioMay());
            ps.setString(7, entity.getIdDonViThucHien());
            ps.setString(8, entity.getIdNguoiPhuTrach());
            ps.setObject(9, entity.getNgayBatDau());
            ps.setObject(10, entity.getNgayKetThuc());
            ps.setString(11, entity.getLoaiDoiTuong());
            ps.setObject(12, entity.getNgayTao());
            ps.setObject(13, entity.getNgayCapNhat());
            ps.setString(14, entity.getGhiChu());
            ps.setString(15, entity.getTrangThai() != null ? entity.getTrangThai() : "CHUA_THUC_HIEN");
        });

        CompletableFuture.runAsync(this::refreshCache);
    }

    // update nhieu
    public void batchUpdate(List<KeHoachSuaChua> list) {

        String sql = """
        UPDATE KeHoachSuaChua SET
            TenKeHoach = ?, LoaiKeHoach = ?, ChuKyNgay = ?, MocGioMay = ?,
            IdDonViThucHien = ?, IdNguoiPhuTrach = ?, NgayBatDau = ?, NgayKetThuc = ?,
            LoaiDoiTuong = ?, NgayCapNhat = ?, GhiChu = ?, TrangThai = ?
        WHERE Id = ?
    """;

        Date now = new Date();

        jdbcTemplate.batchUpdate(sql, list, 50, (ps, entity) -> {
            entity.setNgayCapNhat(now);

            ps.setString(1, entity.getTenKeHoach());
            ps.setString(2, entity.getLoaiKeHoach());
            ps.setObject(3, entity.getChuKyNgay());
            ps.setObject(4, entity.getMocGioMay());
            ps.setString(5, entity.getIdDonViThucHien());
            ps.setString(6, entity.getIdNguoiPhuTrach());
            ps.setObject(7, entity.getNgayBatDau());
            ps.setObject(8, entity.getNgayKetThuc());
            ps.setString(9, entity.getLoaiDoiTuong());
            ps.setObject(10, entity.getNgayCapNhat());
            ps.setString(11, entity.getGhiChu());
            ps.setString(12, entity.getTrangThai());
            ps.setString(13, entity.getId());
        });

        CompletableFuture.runAsync(this::refreshCache);
    }

    // xoa nhieu
    public void batchDelete(List<String> ids) {

        String sql = "DELETE FROM KeHoachSuaChua WHERE Id = ?";

        jdbcTemplate.batchUpdate(sql, ids, 50,
                (ps, id) -> ps.setString(1, id));

        CompletableFuture.runAsync(this::refreshCache);
    }

    public KeHoachSuaChua insert(KeHoachSuaChua entity) {
        entity.setId(generateNextId());
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());

        String sql = """
        INSERT INTO KeHoachSuaChua (
            Id, IdCongTy, TenKeHoach, LoaiKeHoach, ChuKyNgay, MocGioMay,
            IdDonViThucHien, IdNguoiPhuTrach, NgayBatDau, NgayKetThuc,
            LoaiDoiTuong, NgayTao, NgayCapNhat, GhiChu, TrangThai
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;
        int result = jdbcTemplate.update(sql,
                entity.getId(), entity.getIdCongTy(), entity.getTenKeHoach(), entity.getLoaiKeHoach(),
                entity.getChuKyNgay(), entity.getMocGioMay(),
                entity.getIdDonViThucHien(), entity.getIdNguoiPhuTrach(),
                entity.getNgayBatDau(), entity.getNgayKetThuc(),
                entity.getLoaiDoiTuong(), entity.getNgayTao(), entity.getNgayCapNhat(),
                entity.getGhiChu(),
                entity.getTrangThai() != null ? entity.getTrangThai() : "CHUA_THUC_HIEN"
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
            return findById(entity.getId());
        }
        return null;
    }

    public KeHoachSuaChua update(KeHoachSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE KeHoachSuaChua SET
                TenKeHoach = ?, LoaiKeHoach = ?, ChuKyNgay = ?, MocGioMay = ?,
                IdDonViThucHien = ?, IdNguoiPhuTrach = ?, NgayBatDau = ?, NgayKetThuc = ?,
                LoaiDoiTuong = ?, NgayCapNhat = ?, GhiChu = ?, TrangThai = ?
            WHERE Id = ?
        """;
        int result = jdbcTemplate.update(sql,
                entity.getTenKeHoach(), entity.getLoaiKeHoach(), entity.getChuKyNgay(), entity.getMocGioMay(),
                entity.getIdDonViThucHien(), entity.getIdNguoiPhuTrach(),
                entity.getNgayBatDau(), entity.getNgayKetThuc(),
                entity.getLoaiDoiTuong(), entity.getNgayCapNhat(), entity.getGhiChu(),
                entity.getTrangThai(),
                entity.getId()
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
            return findById(entity.getId());
        }
        return null;
    }

    public int delete(String id) {
        String sql = "DELETE FROM KeHoachSuaChua WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
    }
}