package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.time.Year;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Repository
public class SuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ChiTietSuaChuaDao chiTietSuaChuaDao;

    @Autowired
    private KetQuaSuaChuaDao ketQuaSuaChuaDao;

    @Autowired
    private TaiSanDao taiSanDao;

    @Autowired
    private ConfigDao configDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    private static List<SuaChuaDTO> cache = new java.util.ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private void refreshCache() {
        String sql = """
            SELECT 
                sc.Id,
                sc.IdCongTy,
                
                sc.IdKeHoach,
                keHoach.TenKeHoach AS tenKeHoach,

                sc.IdLoaiSuaChua,
                loaiSC.Ten AS tenLoaiSuaChua,
                
                sc.MaSuaChua,
                sc.TenSuaChua,
                sc.MucDoSuCo,
                sc.MucDoUuTien,

                sc.IdDonViGiao,
                pbGiao.TenPhongBan AS tenDonViGiao,
                sc.IdDonViNhan,
                pbNhan.TenPhongBan AS tenDonViNhan,
                sc.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS tenDonViDeNghi,

                sc.IdNguoiKyNhay,
                sc.TrangThaiKyNhay,
                sc.NguoiLapPhieuKyNhay,

                sc.NgayKetThucDuKien,

                sc.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS tenTrinhDuyetCapPhong,
                sc.TrinhDuyetCapPhongXacNhan,

                sc.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS tenTrinhDuyetGiamDoc,
                sc.TrinhDuyetGiamDocXacNhan,

                sc.DuongDanFile,
                sc.TenFile,
                sc.TaiLieuBanGhi,
                sc.ByStep,
                sc.SoQuyetDinh,
                sc.NguoiTao,
                sc.Share,
                sc.NgayTao,
                sc.DaBanGiao,
                sc.CoPhieuBanGiao,
                sc.TaiLieuCuoi,
                sc.ghiChu,
                sc.Loai

            FROM SuaChua sc
                LEFT JOIN PhongBan pbGiao ON sc.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON sc.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON sc.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN NhanVien nvCapPhong ON sc.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON sc.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN KeHoachSuaChua keHoach ON sc.IdKeHoach = keHoach.Id
                LEFT JOIN LoaiSCBD loaiSC ON sc.IdLoaiSuaChua = loaiSC.Id
        """;
        try {
            cache = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SuaChuaDTO.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<SuaChuaDTO> findAll(String idCongTy) {
        if (cache == null || cache.isEmpty()) {
            refreshCache();
        }
        if (idCongTy == null) {
            return new java.util.ArrayList<>(cache);
        }
        return cache.stream()
                .filter(dto -> idCongTy.equals(dto.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM SuaChua WHERE IdCongTy = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public Map<Integer, Long> getCountByTrangThai(String idCongTy) {
        String sql = """
        SELECT TrangThai, COUNT(*) as total
        FROM SuaChua
        WHERE IdCongTy = ?
        GROUP BY TrangThai
        """;
        Map<Integer, Long> result = new HashMap<>();
        jdbcTemplate.query(sql, rs -> {
            result.put(rs.getInt("TrangThai"), rs.getLong("total"));
        }, idCongTy);
        return result;
    }

    public List<SuaChuaDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        String orderColumn;
        switch (normalizedSortBy) {
            case "masuachua":
                orderColumn = "sc.MaSuaChua";
                break;
            case "tensuachua":
                orderColumn = "sc.TenSuaChua";
                break;
            case "ngayketthuc":
                orderColumn = "sc.NgayKetThucDuKien";
                break;
            case "ngaytao":
                orderColumn = "sc.NgayTao";
                break;
            default:
                orderColumn = "sc.NgayTao";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String sql = """
            SELECT 
                sc.Id,
                sc.IdCongTy,
                sc.MaSuaChua,
                sc.TenSuaChua,
                sc.MucDoSuCo,
                sc.MucDoUuTien,

                sc.IdLoaiSuaChua,
                loaiSC.Ten AS tenLoaiSuaChua,

                sc.IdDonViGiao,
                pbGiao.TenPhongBan AS tenDonViGiao,
                sc.IdDonViNhan,
                pbNhan.TenPhongBan AS tenDonViNhan,
                sc.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS tenDonViDeNghi,

                sc.IdNguoiKyNhay,
                sc.TrangThaiKyNhay,
                sc.NguoiLapPhieuKyNhay,

                sc.NgayKetThucDuKien,

                sc.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS tenTrinhDuyetCapPhong,
                sc.TrinhDuyetCapPhongXacNhan,

                sc.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS tenTrinhDuyetGiamDoc,
                sc.TrinhDuyetGiamDocXacNhan,

                sc.DuongDanFile,
                sc.TenFile,
                sc.TaiLieuBanGhi,
                sc.ByStep,
                sc.SoQuyetDinh,
                sc.NguoiTao,
                sc.Share,
                sc.NgayTao,
                sc.DaBanGiao,
                sc.CoPhieuBanGiao,
                sc.TaiLieuCuoi,
                sc.GhiChu,
                sc.Loai

            FROM SuaChua sc
                LEFT JOIN PhongBan pbGiao ON sc.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON sc.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON sc.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN NhanVien nvCapPhong ON sc.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON sc.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN LoaiSCBD loaiSC ON sc.IdLoaiSuaChua = loaiSC.Id
            WHERE sc.IdCongTy = ?
            ORDER BY %s %s
            LIMIT ? OFFSET ?
        """;
        String finalSql = String.format(sql, orderColumn, direction);
        return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(SuaChuaDTO.class),
                idCongTy, limit, offset);
    }

    public SuaChua findById(String id) {
        String sql = "SELECT * FROM SuaChua WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(SuaChua.class), id);
    }

    public SuaChuaDTO findByIdDTO(String id) {
        String sql = """
            SELECT 
                sc.Id,
                sc.IdCongTy,
                sc.MaSuaChua,
                sc.TenSuaChua,
                sc.MucDoSuCo,
                sc.MucDoUuTien,

                sc.IdLoaiSuaChua,
                loaiSC.Ten AS tenLoaiSuaChua,

                sc.IdDonViGiao,
                pbGiao.TenPhongBan AS tenDonViGiao,
                sc.IdDonViNhan,
                pbNhan.TenPhongBan AS tenDonViNhan,
                sc.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS tenDonViDeNghi,

                sc.IdNguoiKyNhay,
                sc.TrangThaiKyNhay,
                sc.NguoiLapPhieuKyNhay,

                sc.NgayKetThucDuKien,

                sc.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS tenTrinhDuyetCapPhong,
                sc.TrinhDuyetCapPhongXacNhan,

                sc.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS tenTrinhDuyetGiamDoc,
                sc.TrinhDuyetGiamDocXacNhan,

                sc.DuongDanFile,
                sc.TenFile,
                sc.TaiLieuBanGhi,
                sc.ByStep,
                sc.SoQuyetDinh,
                sc.NguoiTao,
                sc.Share,
                sc.NgayTao,
                sc.DaBanGiao,
                sc.CoPhieuBanGiao,
                sc.TaiLieuCuoi,
                sc.GhiChu,
                sc.Loai

            FROM SuaChua sc
                LEFT JOIN PhongBan pbGiao ON sc.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON sc.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON sc.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN NhanVien nvCapPhong ON sc.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON sc.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN LoaiSCBD loaiSC ON sc.IdLoaiSuaChua = loaiSC.Id
            WHERE sc.Id = ?
        """;
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(SuaChuaDTO.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    // Sinh ID tự động: SC-YYYY-xxxx
    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "SUACHUA";
        String prefix = "SC-" + currentYear + "-";

        String checkSql = "SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?";
        try {
            var result = jdbcTemplate.queryForMap(checkSql, seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return prefix + String.format("%04d", 1);
            }
        } catch (Exception e) {
            String maxSql = "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 8) AS UNSIGNED)), 0) FROM SuaChua WHERE Id LIKE ?";
            Integer maxSeq = jdbcTemplate.queryForObject(maxSql, Integer.class, prefix + "%");
            int initValue = (maxSeq == null) ? 0 : maxSeq;
            jdbcTemplate.update("INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    seqName, currentYear, initValue, initValue);
        }

        jdbcTemplate.update("UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?", seqName, currentYear);
        Integer nextSeq = jdbcTemplate.queryForObject("SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);

        return prefix + String.format("%04d", nextSeq);
    }

    public SuaChua insert(SuaChua entity) {
        entity.setId(generateNextId());
        entity.setNgayTao(new Date());
        // Set các giá trị mặc định
        if (entity.getTrangThaiKyNhay() == null) entity.setTrangThaiKyNhay(false);
        if (entity.getNguoiLapPhieuKyNhay() == null) entity.setNguoiLapPhieuKyNhay(false);
        if (entity.getTrinhDuyetCapPhongXacNhan() == null) entity.setTrinhDuyetCapPhongXacNhan(false);
        if (entity.getTrinhDuyetGiamDocXacNhan() == null) entity.setTrinhDuyetGiamDocXacNhan(false);
        if (entity.getByStep() == null) entity.setByStep(false);
        if (entity.getShare() == null) entity.setShare(false);
        if (entity.getDaBanGiao() == null) entity.setDaBanGiao(false);
        if (entity.getCoPhieuBanGiao() == null) entity.setCoPhieuBanGiao(false);
        if (entity.getLoai() == null) entity.setLoai(0);

        String sql = """
            INSERT INTO SuaChua (
                Id, IdCongTy, IdLoaiSuaChua,
                MaSuaChua, TenSuaChua, MucDoSuCo, MucDoUuTien,
                IdDonViGiao, IdDonViNhan, IdNguoiKyNhay, TrangThaiKyNhay, NguoiLapPhieuKyNhay,
                NgayKetThucDuKien, IdTrinhDuyetCapPhong, TrinhDuyetCapPhongXacNhan,
                IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan, IdDonViDeNghi,
                DuongDanFile, TenFile, TaiLieuBanGhi, ByStep, SoQuyetDinh,
                NguoiTao, Share, NgayTao, NgayCapNhat, DaBanGiao, CoPhieuBanGiao, TaiLieuCuoi, Loai, TrangThai, GhiChu,
                IdKeHoach
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """;
        int result = jdbcTemplate.update(sql,
                entity.getId(), entity.getIdCongTy(), entity.getIdLoaiSuaChua(), entity.getMaSuaChua(), entity.getTenSuaChua(),
                entity.getMucDoSuCo(), entity.getMucDoUuTien(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay(), entity.getNguoiLapPhieuKyNhay(),
                entity.getNgayKetThucDuKien(),
                entity.getIdTrinhDuyetCapPhong(), entity.getTrinhDuyetCapPhongXacNhan(),
                entity.getIdTrinhDuyetGiamDoc(), entity.getTrinhDuyetGiamDocXacNhan(),
                entity.getIdDonViDeNghi(),
                entity.getDuongDanFile(), entity.getTenFile(), entity.getTaiLieuBanGhi(),
                entity.getByStep(), entity.getSoQuyetDinh(), entity.getNguoiTao(),
                entity.getShare(), entity.getNgayTao(), entity.getNgayCapNhat(),
                entity.getDaBanGiao(), entity.getCoPhieuBanGiao(), entity.getTaiLieuCuoi(), entity.getLoai(), entity.getTrangThai(), entity.getGhiChu(),
                entity.getIdKeHoach()
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
            return findById(entity.getId());
        }
        return null;
    }

    public SuaChua update(SuaChua entity) {
        // Không có NgayCapNhat, nên không cập nhật
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE SuaChua SET
                IdLoaiSuaChua = ?, MaSuaChua = ?, TenSuaChua = ?, MucDoSuCo = ?, MucDoUuTien = ?,
                IdDonViGiao = ?, IdDonViNhan = ?, IdNguoiKyNhay = ?, TrangThaiKyNhay = ?, NguoiLapPhieuKyNhay = ?,
                NgayKetThucDuKien = ?,
                IdTrinhDuyetCapPhong = ?, TrinhDuyetCapPhongXacNhan = ?,
                IdTrinhDuyetGiamDoc = ?, TrinhDuyetGiamDocXacNhan = ?,
                IdDonViDeNghi = ?, DuongDanFile = ?, TenFile = ?, TaiLieuBanGhi = ?,
                ByStep = ?, SoQuyetDinh = ?, NguoiTao = ?, Share = ?,
                NgayCapNhat = ?, DaBanGiao = ?, CoPhieuBanGiao = ?, TaiLieuCuoi = ?, Loai = ?, TrangThai = ?, GhiChu = ?,
                IdKeHoach = ?
            WHERE Id = ?
        """;
        int result = jdbcTemplate.update(sql,
                entity.getIdLoaiSuaChua(), entity.getMaSuaChua(), entity.getTenSuaChua(), entity.getMucDoSuCo(), entity.getMucDoUuTien(),
                entity.getIdDonViGiao(), entity.getIdDonViNhan(), entity.getIdNguoiKyNhay(),
                entity.getTrangThaiKyNhay(), entity.getNguoiLapPhieuKyNhay(),
                entity.getNgayKetThucDuKien(),
                entity.getIdTrinhDuyetCapPhong(), entity.getTrinhDuyetCapPhongXacNhan(),
                entity.getIdTrinhDuyetGiamDoc(), entity.getTrinhDuyetGiamDocXacNhan(),
                entity.getIdDonViDeNghi(),
                entity.getDuongDanFile(), entity.getTenFile(), entity.getTaiLieuBanGhi(),
                entity.getByStep(), entity.getSoQuyetDinh(), entity.getNguoiTao(), entity.getShare(),
                entity.getNgayCapNhat(),
                entity.getDaBanGiao(), entity.getCoPhieuBanGiao(), entity.getTaiLieuCuoi(), entity.getLoai(), entity.getTrangThai(), entity.getGhiChu(),
                entity.getIdKeHoach(),
                entity.getId()
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
            return findById(entity.getId());
        }
        return null;
    }

    public int delete(String id) {
        String sql = "DELETE FROM SuaChua WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
    }

    // Các phương thức xử lý ký duyệt theo quy trình mới
    public int updateKyNhay(String id, String userId) {
        // Cập nhật trạng thái ký nháy: có thể cần parse JSON IdNguoiKyNhay
        // Tạm thời giả sử chỉ có một người, hoặc xử lý đơn giản: set TrangThaiKyNhay = true
        String sql = "UPDATE SuaChua SET TrangThaiKyNhay = 1 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int updateNguoiLapPhieuKyNhay(String id) {
        String sql = "UPDATE SuaChua SET NguoiLapPhieuKyNhay = 1 WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int updateDuyetCapPhong(String id, String userId, boolean xacNhan) {
        String sql = "UPDATE SuaChua SET TrinhDuyetCapPhongXacNhan = ? WHERE Id = ? AND IdTrinhDuyetCapPhong = ?";
        return jdbcTemplate.update(sql, xacNhan, id, userId);
    }

    public int updateDuyetGiamDoc(String id, String userId, boolean xacNhan) {
        String sql = "UPDATE SuaChua SET TrinhDuyetGiamDocXacNhan = ? WHERE Id = ? AND IdTrinhDuyetGiamDoc = ?";
        return jdbcTemplate.update(sql, xacNhan, id, userId);
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

    // 0:nháp, 1: chờ duyệt, 2: hủy, 3: hoàn thành
    // 0: nháp, 1: chờ duyệt, 2: hủy, 3: hoàn thành
    public int updateTrangThai(String id, String userId) {
        SuaChua sc = findById(id);
        if (sc == null) return 0;

        int trangThai = sc.getTrangThai() != null ? sc.getTrangThai() : 0;

        // Bước 1: Ký từ bảng NguoiKy (người ký phụ)
        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1;
        }

        // Bước 2: Người ký nháy
        if (Objects.equals(userId, sc.getIdNguoiKyNhay())) {
            sc.setTrangThaiKyNhay(true);
            trangThai = 1;
        }

        // Bước 3: Duyệt cấp phòng
        if (Objects.equals(userId, sc.getIdTrinhDuyetCapPhong())) {
            sc.setTrinhDuyetCapPhongXacNhan(true);
            trangThai = 1;
        }

        // Bước 4: Duyệt giám đốc
        if (Objects.equals(userId, sc.getIdTrinhDuyetGiamDoc())) {
            sc.setTrinhDuyetGiamDocXacNhan(true);
            trangThai = 1;
        }

        // Kiểm tra tất cả đã ký chưa
        boolean allKy = true;
        if (sc.getIdNguoiKyNhay() != null && !sc.getIdNguoiKyNhay().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(sc.getTrangThaiKyNhay());
        if (sc.getIdTrinhDuyetCapPhong() != null && !sc.getIdTrinhDuyetCapPhong().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(sc.getTrinhDuyetCapPhongXacNhan());
        if (sc.getIdTrinhDuyetGiamDoc() != null && !sc.getIdTrinhDuyetGiamDoc().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(sc.getTrinhDuyetGiamDocXacNhan());

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        if (allKy) {
            trangThai = 3; // Hoàn thành
        }

        sc.setTrangThai(trangThai);
        SuaChua result = update(sc);
        if (result != null) {
            CompletableFuture.runAsync(this::refreshCache);
            return trangThai;
        }
        return 0;
    }

    public int huyTrangThai(String id) {
        String sql = """
            UPDATE SuaChua
            SET TrangThaiKyNhay = 0,
                TrinhDuyetCapPhongXacNhan = 0,
                TrinhDuyetGiamDocXacNhan = 0,
                TrangThai = 2
            WHERE Id = ?
            """;
        return jdbcTemplate.update(sql, id);
    }
}