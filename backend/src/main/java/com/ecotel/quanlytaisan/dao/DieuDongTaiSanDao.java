package com.ecotel.quanlytaisan.dao;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import static com.ecotel.quanlytaisan.utils.ParserHelper.parseDateTime;

@Repository
public class DieuDongTaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    private static List<DieuDongTaiSanDTO> cache = new ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private void refreshCache() {
        String sql = """
            SELECT 
                ddts.Id,
                ddts.SoQuyetDinh,
                ddts.TenPhieu,
            
                -- Đơn vị giao
                ddts.IdDonViGiao,
                pbGiao.TenPhongBan AS TenDonViGiao,
            
                -- Đơn vị nhận
                ddts.IdDonViNhan,
                pbNhan.TenPhongBan AS TenDonViNhan,
            
                -- Người ký nháy
                ddts.IdNguoiKyNhay,
                nvKyNhay.HoTen AS TenNguoiKyNhay,
                ddts.TrangThaiKyNhay,
                ddts.NguoiLapPhieuKyNhay,
            
                -- Đơn vị đề nghị
                ddts.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS TenDonViDeNghi,
            
                -- Thời gian giao nhận
                ddts.TGGNTuNgay,
                ddts.TGGNDenNgay,
            
                -- Trình duyệt cấp phòng
                ddts.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS TenTrinhDuyetCapPhong,
                ddts.TrinhDuyetCapPhongXacNhan,
            
                -- Trình duyệt giám đốc
                ddts.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS TenTrinhDuyetGiamDoc,
                ddts.TrinhDuyetGiamDocXacNhan,
            
                -- Phòng ban xem phiếu
                ddts.IdPhongBanXemPhieu,
                pbXem.TenPhongBan AS TenPhongBanXemPhieu,
            
                -- Thông tin chung
                ddts.DiaDiemGiaoNhan,
                ddts.NoiNhan,
                ddts.TrangThai,
                ddts.IdCongTy,
                ddts.NgayTao,
                ddts.NgayCapNhat,
                ddts.NguoiTao,
                nvNguoiTao.HoTen AS TenNguoiTao,
                ddts.NguoiCapNhat,
                nvNguoiCapNhat.HoTen AS TenNguoiCapNhat,
                ddts.CoHieuLuc,
                ddts.Loai,
                ddts.Share,
                ddts.TrichYeu,
                ddts.DuongDanFile,
                ddts.TenFile,
                ddts.NgayKy,
                ddts.DaBanGiao,
                ddts.ByStep,
                ddts.CoPhieuBanGiao,
                ddts.taiLieuCuoi

            FROM DieuDongTaiSan ddts
                LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id

                LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN NhanVien nvNguoiTao ON ddts.NguoiTao = nvNguoiTao.Id
                LEFT JOIN NhanVien nvNguoiCapNhat ON ddts.NguoiCapNhat = nvNguoiCapNhat.Id
            """;
        try {
            List<DieuDongTaiSanDTO> data = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DieuDongTaiSanDTO.class));
            cache = data;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<DieuDongTaiSanDTO> findAll(String idCongTy) {
        if (cache == null || cache.isEmpty()) {
            refreshCache();
        }
        List<DieuDongTaiSanDTO> dieuDongTaiSanDTOList = cache.stream()
                .filter(item -> idCongTy.equalsIgnoreCase(item.getIdCongTy()))
                .collect(Collectors.toList());

        for (int i = 0; i < dieuDongTaiSanDTOList.size(); i++) {
            int status = updateDate(dieuDongTaiSanDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(dieuDongTaiSanDTOList.get(i));
            dieuDongTaiSanDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                dieuDongTaiSanDTOList.get(i).setTrangThai(2);
                dieuDongTaiSanDTOList.get(i).setTrinhDuyetCapPhongXacNhan(false);
                dieuDongTaiSanDTOList.get(i).setTrinhDuyetGiamDocXacNhan(false);
            }
            // Tính trạng thái phiếu điều động
            int trangThaiPhieuDieuDong = getTrangThaiPhieuDieuDong(dieuDongTaiSanDTOList.get(i), trangThaiPhieu, status);
            dieuDongTaiSanDTOList.get(i).setTrangThaiPhieuDieuDong(trangThaiPhieuDieuDong);
        }
        return dieuDongTaiSanDTOList;
    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM DieuDongTaiSan ddts WHERE ddts.IdCongTy = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public Map<Integer, Long> getCountByTrangThai(String idCongTy) {
        String sql = """
                SELECT ddts.TrangThai, COUNT(*) AS soLuong
                FROM DieuDongTaiSan ddts
                WHERE ddts.IdCongTy = ?
                GROUP BY ddts.TrangThai
                """;
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, idCongTy);
        Map<Integer, Long> counts = new java.util.HashMap<>();
        for (Map<String, Object> row : results) {
            Integer trangThai = ((Number) row.get("TrangThai")).intValue();
            Long count = ((Number) row.get("soLuong")).longValue();
            counts.put(trangThai, count);
        }
        return counts;
    }

    public Map<Integer, Long> getCountByTrangThaiAndUserId(String idCongTy, String userId) {
        String sql = """
                SELECT ddts.TrangThai, COUNT(DISTINCT ddts.Id) AS soLuong
                FROM DieuDongTaiSan ddts
                LEFT JOIN NguoiKy as nk on ddts.Id = nk.IdTaiLieu
                WHERE ddts.IdCongTy = ? 
                AND (ddts.IdNguoiKyNhay = ? OR ddts.IdTrinhDuyetCapPhong = ? OR ddts.IdTrinhDuyetGiamDoc = ? OR ddts.NguoiTao = ? OR nk.IdNguoiKy = ?)
                GROUP BY ddts.TrangThai
                """;
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, idCongTy, userId, userId, userId, userId, userId);
        Map<Integer, Long> counts = new java.util.HashMap<>();
        for (Map<String, Object> row : results) {
            Integer trangThai = ((Number) row.get("TrangThai")).intValue();
            Long count = ((Number) row.get("soLuong")).longValue();
            counts.put(trangThai, count);
        }
        return counts;
    }

    public List<DieuDongTaiSanDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tenphieu":
                orderColumn = "ddts.TenPhieu";
                break;
            case "soquyetdinh":
                orderColumn = "ddts.SoQuyetDinh";
                break;
            case "ngaytao":
                orderColumn = "ddts.NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "ddts.NgayCapNhat";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String sql = """
            SELECT 
                ddts.Id,
                ddts.SoQuyetDinh,
                ddts.TenPhieu,
                ddts.IdDonViGiao,
                pbGiao.TenPhongBan AS TenDonViGiao,
                ddts.IdDonViNhan,
                pbNhan.TenPhongBan AS TenDonViNhan,
                ddts.IdNguoiKyNhay,
                nvKyNhay.HoTen AS TenNguoiKyNhay,
                ddts.TrangThaiKyNhay,
                ddts.NguoiLapPhieuKyNhay,
                ddts.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS TenDonViDeNghi,
                ddts.TGGNTuNgay,
                ddts.TGGNDenNgay,
                ddts.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS TenTrinhDuyetCapPhong,
                ddts.TrinhDuyetCapPhongXacNhan,
                ddts.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS TenTrinhDuyetGiamDoc,
                ddts.TrinhDuyetGiamDocXacNhan,
                ddts.IdPhongBanXemPhieu,
                pbXem.TenPhongBan AS TenPhongBanXemPhieu,
                ddts.DiaDiemGiaoNhan,
                ddts.NoiNhan,
                ddts.TrangThai,
                ddts.IdCongTy,
                ddts.NgayTao,
                ddts.NgayCapNhat,
                ddts.NguoiTao,
                nvNguoiTao.HoTen AS TenNguoiTao,
                ddts.NguoiCapNhat,
                nvNguoiCapNhat.HoTen AS TenNguoiCapNhat,
                ddts.CoHieuLuc,
                ddts.Loai,
                ddts.Share,
                ddts.TrichYeu,
                ddts.DuongDanFile,
                ddts.TenFile,
                ddts.NgayKy,
                ddts.DaBanGiao,
                ddts.ByStep,
                ddts.CoPhieuBanGiao,
                ddts.taiLieuCuoi
            FROM DieuDongTaiSan ddts
                LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
                LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN NhanVien nvNguoiTao ON ddts.NguoiTao = nvNguoiTao.Id
                LEFT JOIN NhanVien nvNguoiCapNhat ON ddts.NguoiCapNhat = nvNguoiCapNhat.Id
            WHERE ddts.IdCongTy = ?
            ORDER BY %s %s
            LIMIT ? OFFSET ?
            """;
        String finalSql = String.format(sql, orderColumn, direction);
        List<DieuDongTaiSanDTO> list = jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(DieuDongTaiSanDTO.class), idCongTy, limit, offset);
        for (int i = 0; i < list.size(); i++) {
            int status = updateDate(list.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(list.get(i));
            list.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                list.get(i).setTrangThai(2);
                list.get(i).setTrinhDuyetCapPhongXacNhan(false);
                list.get(i).setTrinhDuyetGiamDocXacNhan(false);
            }
        }
        return list;
    }

    public List<DieuDongTaiSanDTO> findByUserId(String userId) {
        String sql = """
             SELECT 
                ddts.Id,
                ddts.SoQuyetDinh,
                ddts.TenPhieu,
            
                -- Đơn vị giao
                ddts.IdDonViGiao,
                pbGiao.TenPhongBan AS TenDonViGiao,
            
                -- Đơn vị nhận
                ddts.IdDonViNhan,
                pbNhan.TenPhongBan AS TenDonViNhan,
            
                -- Người ký nháy
                ddts.IdNguoiKyNhay,
                nvKyNhay.HoTen AS TenNguoiKyNhay,
                ddts.TrangThaiKyNhay,
                ddts.NguoiLapPhieuKyNhay,
            
                -- Đơn vị đề nghị
                ddts.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS TenDonViDeNghi,
            
                -- Thời gian giao nhận
                ddts.TGGNTuNgay,
                ddts.TGGNDenNgay,
            
                -- Trình duyệt cấp phòng
                ddts.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS TenTrinhDuyetCapPhong,
                ddts.TrinhDuyetCapPhongXacNhan,
            
                -- Trình duyệt giám đốc
                ddts.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS TenTrinhDuyetGiamDoc,
                ddts.TrinhDuyetGiamDocXacNhan,
            
                -- Phòng ban xem phiếu
                ddts.IdPhongBanXemPhieu,
                pbXem.TenPhongBan AS TenPhongBanXemPhieu,
            
                -- Thông tin chung
                ddts.DiaDiemGiaoNhan,
                ddts.NoiNhan,
                ddts.TrangThai,
                ddts.IdCongTy,
                ddts.NgayTao,
                ddts.NgayCapNhat,
                ddts.NguoiTao,
                nvNguoiTao.HoTen AS TenNguoiTao,
                ddts.NguoiCapNhat,
                nvNguoiCapNhat.HoTen AS TenNguoiCapNhat,
                ddts.CoHieuLuc,
                ddts.Loai,
                ddts.Share,
                ddts.TrichYeu,
                ddts.DuongDanFile,
                ddts.TenFile,
                ddts.NgayKy,
                ddts.DaBanGiao,
                ddts.ByStep,
                ddts.CoPhieuBanGiao,
                ddts.taiLieuCuoi
            FROM DieuDongTaiSan ddts
                LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
                LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN NhanVien nvNguoiTao ON ddts.NguoiTao = nvNguoiTao.Id
                LEFT JOIN NhanVien nvNguoiCapNhat ON ddts.NguoiCapNhat = nvNguoiCapNhat.Id
                LEFT JOIN NguoiKy as nk on  ddts.Id = nk.IdTaiLieu
            WHERE (
                ddts.NguoiTao = ?
                OR (
                    ddts.Share = 1
                    AND (
                        ddts.IdNguoiKyNhay = ?
                        OR ddts.IdTrinhDuyetCapPhong = ?
                        OR ddts.IdTrinhDuyetGiamDoc = ?
                        OR nk.IdNguoiKy = ?
                    )
                )
            );
            """;
        List<DieuDongTaiSanDTO> dieuDongTaiSanDTOList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DieuDongTaiSanDTO.class), userId, userId, userId, userId, userId);
        for (int i = 0; i < dieuDongTaiSanDTOList.size(); i++) {
            int status = updateDate(dieuDongTaiSanDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(dieuDongTaiSanDTOList.get(i));
            dieuDongTaiSanDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                dieuDongTaiSanDTOList.get(i).setTrangThai(2);
                dieuDongTaiSanDTOList.get(i).setTrinhDuyetCapPhongXacNhan(false);
                dieuDongTaiSanDTOList.get(i).setTrinhDuyetGiamDocXacNhan(false);
            }
        }
        return dieuDongTaiSanDTOList;
    }

    public int getTrangThaiPhieu(DieuDongTaiSanDTO dieuDongTaiSanDTO) {
        int trangThai = 0;
        String idNguoiTao = dieuDongTaiSanDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);
        String ngayTao = dieuDongTaiSanDTO.getNgayTao();
        int thoiHanTaiLieu = 60;
        int ngayBaoHetHan = 3;
        if (config != null) {
            thoiHanTaiLieu = config.getThoiHanTaiLieu();
            ngayBaoHetHan = config.getNgayBaoHetHan();
        }

        if (dieuDongTaiSanDTO.getTrangThai() == 3) {
            trangThai = 2;
        } else {
            LocalDateTime createdDate = LocalDateTime.now();
            try {
                // Thử parse với các định dạng khác nhau
                createdDate = parseDateTime(ngayTao);
            } catch (Exception e) {
                System.err.println("Error parsing date: " + ngayTao + " - " + e.getMessage());
                // Nếu parse lỗi, dùng thời gian hiện tại
                createdDate = LocalDateTime.now();
            }

            LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
            LocalDateTime expiredDate = createdDate.plusDays(thoiHanTaiLieu);

            long daysToExpire = ChronoUnit.DAYS.between(now, expiredDate);

            if (daysToExpire <= ngayBaoHetHan && daysToExpire >= 0) {
                // Gần hết hạn
                trangThai = 1;
            }
        }
        return trangThai;
    }

    @Autowired
    ConfigDao configDao;

    private LocalDateTime parseDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
            return LocalDateTime.now();
        }

        // Danh sách các định dạng có thể
        DateTimeFormatter[] formatters = {
                DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd")
        };

        // Thử parse với từng formatter
        for (DateTimeFormatter formatter : formatters) {
            try {
                // Nếu chỉ có ngày (yyyy-MM-dd), thêm thời gian 00:00:00
                if (dateTimeString.length() == 10) {
                    LocalDate date = LocalDate.parse(dateTimeString, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                    return date.atStartOfDay();
                }
                return LocalDateTime.parse(dateTimeString, formatter);
            } catch (Exception e) {
                // Tiếp tục thử formatter tiếp theo
            }
        }

        // Nếu tất cả đều fail, throw exception
        throw new java.time.format.DateTimeParseException("Unable to parse date: " + dateTimeString, dateTimeString, 0);
    }

    public int updateDate(DieuDongTaiSanDTO dieuDongTaiSanDTO) {
        String idNguoiTao = dieuDongTaiSanDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);
        String ngayTao = dieuDongTaiSanDTO.getNgayTao();
        int soNgay = 60;
        if (config != null) {
            soNgay = config.getThoiHanTaiLieu();
        }

        LocalDateTime createdDate = LocalDateTime.now();
        try {
            // Thử parse với các định dạng khác nhau
            createdDate = parseDateTime(ngayTao);
        } catch (Exception e) {
            System.err.println("Error parsing date: " + ngayTao + " - " + e.getMessage());
            // Nếu parse lỗi, dùng thời gian hiện tại
            createdDate = LocalDateTime.now();
        }

        LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
        long daysBetween = ChronoUnit.DAYS.between(createdDate, now);
        if (daysBetween >= soNgay && dieuDongTaiSanDTO.getTrangThai() != 3 && dieuDongTaiSanDTO.getTrangThai() != 2) {
            huyDieuDong(dieuDongTaiSanDTO.getId());
            return 1;
        }
        return 0;
    }

    /**
     * Tính trạng thái phiếu điều động:
     * 1: Chưa tạo phiếu bàn giao từ phiếu điều động
     * 2: Có biên bản bàn giao nhưng chưa bàn giao hết tài sản
     * 3: Đã bàn giao hết tất cả
     * 4: Sắp quá hạn điều động
     * 5: Đã quá hạn điều động
     */
    public int getTrangThaiPhieuDieuDong(DieuDongTaiSanDTO dto, int trangThaiPhieu, int statusQuaHan) {
        // 5: Đã quá hạn điều động (status = 1 nghĩa là đã bị hủy do quá hạn)
        if (statusQuaHan == 1) {
            return 5;
        }

        // 4: Sắp quá hạn điều động (trangThaiPhieu = 1 là gần hết hạn)
        if (trangThaiPhieu == 1) {
            return 4;
        }

        // Chỉ tính trạng thái bàn giao cho phiếu đã hoàn thành (trangThai = 3) và loại điều động (loai = 2)
        if (dto.getTrangThai() != 3) {
            return 1; // Mặc định: chưa tạo phiếu bàn giao
        }

        // Kiểm tra có phiếu bàn giao không
        boolean coPhieuBanGiao = Boolean.TRUE.equals(dto.getCoPhieuBanGiao()) || hasPhieuBanGiao(dto.getId());

        if (!coPhieuBanGiao) {
            return 1; // Chưa tạo phiếu bàn giao
        }

        // Kiểm tra đã bàn giao hết chưa
        boolean daBanGiaoHet = kiemTraDaBanGiaoHetTaiSan(dto.getId());

        if (daBanGiaoHet) {
            return 3; // Đã bàn giao hết tất cả
        } else {
            return 2; // Có biên bản bàn giao nhưng chưa bàn giao hết
        }
    }

    /**
     * Kiểm tra phiếu điều động có phiếu bàn giao không
     */
    private boolean hasPhieuBanGiao(String idDieuDong) {
        String sql = "SELECT COUNT(*) FROM BanGiaoTaiSan WHERE QuyetDinhDieuDongSo = ?";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idDieuDong);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Kiểm tra phiếu điều động đã bàn giao hết tài sản chưa
     * Logic: So sánh tổng số lượng trong ChiTietDieuDongTaiSan với tổng số lượng đã bàn giao trong ChiTietBanGiaoTaiSan
     */
    private boolean kiemTraDaBanGiaoHetTaiSan(String idDieuDong) {
        String sql = """
                SELECT COUNT(*) FROM ChiTietDieuDongTaiSan ctdd
                WHERE ctdd.IdDieuDongTaiSan = ?
                  AND ctdd.IsActive = 1
                  AND (ctdd.DaBanGiao = 0 OR ctdd.DaBanGiao IS NULL)
                """;
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idDieuDong);
            return count == null || count == 0; // Nếu không còn tài sản nào chưa bàn giao thì đã bàn giao hết
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Sinh tự động Id và SoQuyetDinh theo format:
     * - loai = 1 (QĐ cấp phát Tài sản): CPTS-Năm-STT (3 số) VD: CPTS-2025-001
     * - loai = 2 (QĐ điều động Tài sản): DDTS-Năm-STT (3 số) VD: DDTS-2025-001
     * - loai = 3 (QĐ thu hồi Tài sản): THTS-Năm-STT (3 số) VD: THTS-2025-001
     */
    /**
     * Sinh ID tự động theo format: PREFIX-Năm-STT
     * Sử dụng bảng Sequence để đảm bảo không bị trùng khi xóa record
     */
    public String generateIdAndSoQuyetDinh(Integer loai) {
        String prefix;
        switch (loai) {
            case 1:
                prefix = "CPTS";
                break;
            case 2:
                prefix = "DDTS";
                break;
            case 3:
                prefix = "THTS";
                break;
            default:
                prefix = "DDTS";
        }

        int currentYear = java.time.Year.now().getValue();
        String prefixWithYear = prefix + "-" + currentYear + "-";

        // Kiểm tra và reset sequence nếu sang năm mới, hoặc tạo mới nếu chưa có
        String checkSql = "SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?";
        try {
            var result = jdbcTemplate.queryForMap(checkSql, prefix);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                // Sang năm mới, reset sequence
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, prefix);
                return prefixWithYear + "0001";
            }
        } catch (Exception e) {
            // Sequence chưa tồn tại, tạo mới với giá trị từ MAX hiện tại
            String maxSql = "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0) FROM DieuDongTaiSan WHERE Id LIKE ?";
            Integer maxSeq = jdbcTemplate.queryForObject(maxSql, Integer.class, prefixWithYear + "%");
            int initValue = (maxSeq == null) ? 0 : maxSeq;
            jdbcTemplate.update("INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    prefix, currentYear, initValue, initValue);
        }

        // Tăng sequence và lấy giá trị mới
        jdbcTemplate.update("UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?", prefix, currentYear);
        Integer nextSeq = jdbcTemplate.queryForObject("SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, prefix);

        return String.format("%s%03d", prefixWithYear, nextSeq);
    }

    public DieuDongTaiSan insert(DieuDongTaiSan obj) {
        // Tự động sinh Id và SoQuyetDinh nếu chưa có
        String generatedId = generateIdAndSoQuyetDinh(obj.getLoai());
        obj.setId(generatedId);
        // obj.setSoQuyetDinh(generatedId);

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM DieuDongTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            obj.setNgayTao(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            obj.setTrinhDuyetGiamDocXacNhan(false);
            String sql = """
                    INSERT INTO DieuDongTaiSan (
                        Id, SoQuyetDinh, TenPhieu, IdDonViGiao, IdDonViNhan,
                        IdNguoiKyNhay, TrangThaiKyNhay, NguoiLapPhieuKyNhay,
                        IdDonViDeNghi, TGGNTuNgay, TGGNDenNgay,
                        IdTrinhDuyetCapPhong, TrinhDuyetCapPhongXacNhan,
                        IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan,
                        DiaDiemGiaoNhan, IdPhongBanXemPhieu, NoiNhan, TrangThai,
                        IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat,
                        CoHieuLuc, Loai, Share, TrichYeu, DuongDanFile, TenFile, NgayKy,DaBanGiao,ByStep, taiLieuCuoi
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,False,?,?)
                    """;

            int result = jdbcTemplate.update(sql, obj.getId(), obj.getSoQuyetDinh(), obj.getTenPhieu(), obj.getIdDonViGiao(), obj.getIdDonViNhan(), obj.getIdNguoiKyNhay(), obj.getTrangThaiKyNhay(), obj.getNguoiLapPhieuKyNhay(), obj.getIdDonViDeNghi(), obj.getTgGnTuNgay(), obj.getTgGnDenNgay(), obj.getIdTrinhDuyetCapPhong(), obj.getTrinhDuyetCapPhongXacNhan(), obj.getIdTrinhDuyetGiamDoc(), obj.getTrinhDuyetGiamDocXacNhan(), obj.getDiaDiemGiaoNhan(), obj.getIdPhongBanXemPhieu(), obj.getNoiNhan(), obj.getTrangThai(), "CT001", obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getCoHieuLuc(), obj.getLoai(), obj.getShare(), obj.getTrichYeu(), obj.getDuongDanFile(), obj.getTenFile(), obj.getNgayKy(), obj.getByStep(), obj.getTaiLieuCuoi());
            if (result > 0) {
                CompletableFuture.runAsync(this::refreshCache);
            }
            return obj;
        }
    }

    public DieuDongTaiSan update(DieuDongTaiSan obj) {
        String sql = """
                UPDATE DieuDongTaiSan
                SET SoQuyetDinh=?, TenPhieu=?, IdDonViGiao=?, IdDonViNhan=?,
                    IdNguoiKyNhay=?, TrangThaiKyNhay=?, NguoiLapPhieuKyNhay=?,
                    IdDonViDeNghi=?, TGGNTuNgay=?, TGGNDenNgay=?,
                    IdTrinhDuyetCapPhong=?, TrinhDuyetCapPhongXacNhan=?,
                    IdTrinhDuyetGiamDoc=?, TrinhDuyetGiamDocXacNhan=?,
                    DiaDiemGiaoNhan=?, IdPhongBanXemPhieu=?, NoiNhan=?, TrangThai=?,
                    IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?,
                    CoHieuLuc=?, Loai=?, Share=?, TrichYeu=?, DuongDanFile=?, TenFile=?, NgayKy=?, ByStep=?, taiLieuCuoi=?
                WHERE Id=?
                """;

        int result = jdbcTemplate.update(sql, obj.getSoQuyetDinh(), obj.getTenPhieu(), obj.getIdDonViGiao(), obj.getIdDonViNhan(), obj.getIdNguoiKyNhay(), obj.getTrangThaiKyNhay(), obj.getNguoiLapPhieuKyNhay(), obj.getIdDonViDeNghi(), obj.getTgGnTuNgay(), obj.getTgGnDenNgay(), obj.getIdTrinhDuyetCapPhong(), obj.getTrinhDuyetCapPhongXacNhan(), obj.getIdTrinhDuyetGiamDoc(), obj.getTrinhDuyetGiamDocXacNhan(), obj.getDiaDiemGiaoNhan(), obj.getIdPhongBanXemPhieu(), obj.getNoiNhan(), obj.getTrangThai(), "CT001", obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getCoHieuLuc(), obj.getLoai(), obj.getShare(), obj.getTrichYeu(), obj.getDuongDanFile(), obj.getTenFile(), obj.getNgayKy(), obj.getByStep(), obj.getTaiLieuCuoi(), obj.getId()  // điều kiện WHERE
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
            return findById(obj.getId());
        }
        return null;
    }

    public int updateCoPhieuBanGiao(String id, boolean coPhieuBanGiao) {
        String sql = "UPDATE DieuDongTaiSan SET CoPhieuBanGiao = ? WHERE Id = ?";
        int result = jdbcTemplate.update(sql, coPhieuBanGiao, id);
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
    }

    public int updateTrangThaiBanGiao(String id, boolean daBanGiao) {
        String sql = """
                UPDATE DieuDongTaiSan
                SET DaBanGiao=?
                WHERE Id=?
                """;

        int result = jdbcTemplate.update(sql, daBanGiao, id  // điều kiện WHERE
        );
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
    }
   public int[] banHanhQuyetDinh(List<BanHanhRequest> requests) {
    String sql = """
            UPDATE DieuDongTaiSan
            SET TrangThai = ?, soQuyetDinh = ?
            WHERE Id = ?
            """;

        int[] results = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                BanHanhRequest item = requests.get(i);
                ps.setInt(1, 4); // TrangThai = 4
                ps.setString(2, item.getSoQuyetDinh());
                ps.setString(3, item.getId());
            }

            @Override
            public int getBatchSize() {
                return requests.size();
            }
        });

        // --- THÊM LOGIC REFRESH CACHE Ở ĐÂY ---
        // Kiểm tra xem có ít nhất 1 dòng được update thành công (giá trị > 0 hoặc SUCCESS_NO_INFO)
        boolean isUpdated = java.util.Arrays.stream(results).anyMatch(r -> r > 0 || r == -2); 
        
        if (isUpdated) {
            CompletableFuture.runAsync(this::refreshCache);
        }

        return results;
    }

    public DieuDongTaiSan findById(String id) {
        String sql = """
                select * from DieuDongTaiSan as ddts
                WHERE ddts.id = ?;
                """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(DieuDongTaiSan.class), id);
    }

    public DieuDongTaiSanDTO findByIdDTO(String id) {
        String sql = """
            SELECT 
                ddts.Id,
                ddts.SoQuyetDinh,
                ddts.TenPhieu,
            
                -- Đơn vị giao
                ddts.IdDonViGiao,
                pbGiao.TenPhongBan AS TenDonViGiao,
            
                -- Đơn vị nhận
                ddts.IdDonViNhan,
                pbNhan.TenPhongBan AS TenDonViNhan,
            
                -- Người ký nháy
                ddts.IdNguoiKyNhay,
                nvKyNhay.HoTen AS TenNguoiKyNhay,
                ddts.TrangThaiKyNhay,
                ddts.NguoiLapPhieuKyNhay,
            
                -- Đơn vị đề nghị
                ddts.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS TenDonViDeNghi,
            
                -- Thời gian giao nhận
                ddts.TGGNTuNgay,
                ddts.TGGNDenNgay,
            
                -- Trình duyệt cấp phòng
                ddts.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS TenTrinhDuyetCapPhong,
                ddts.TrinhDuyetCapPhongXacNhan,
            
                -- Trình duyệt giám đốc
                ddts.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS TenTrinhDuyetGiamDoc,
                ddts.TrinhDuyetGiamDocXacNhan,
            
                -- Phòng ban xem phiếu
                ddts.IdPhongBanXemPhieu,
                pbXem.TenPhongBan AS TenPhongBanXemPhieu,
            
                -- Thông tin chung
                ddts.DiaDiemGiaoNhan,
                ddts.NoiNhan,
                ddts.TrangThai,
                ddts.IdCongTy,
                ddts.NgayTao,
                ddts.NgayCapNhat,
                ddts.NguoiTao,
                nvNguoiTao.HoTen AS TenNguoiTao,
                ddts.NguoiCapNhat,
                nvNguoiCapNhat.HoTen AS TenNguoiCapNhat,
                ddts.CoHieuLuc,
                ddts.Loai,
                ddts.Share,
                ddts.TrichYeu,
                ddts.DuongDanFile,
                ddts.TenFile,
                ddts.NgayKy,
                ddts.DaBanGiao,
                ddts.ByStep,
                ddts.CoPhieuBanGiao,
                ddts.taiLieuCuoi

            FROM DieuDongTaiSan ddts
                LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
                LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN NhanVien nvNguoiTao ON ddts.NguoiTao = nvNguoiTao.Id
                LEFT JOIN NhanVien nvNguoiCapNhat ON ddts.NguoiCapNhat = nvNguoiCapNhat.Id

            WHERE ddts.Id = ?;
            """;
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(DieuDongTaiSanDTO.class), id);
        } catch (Exception e) {
            return null;
        }
    }


    // DELETE
    public int delete(String id) {
        String sql = "DELETE FROM DieuDongTaiSan WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
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

    //    0:nháp, 1: chờ duyet, 2: hủy, 3: hoàn thành
    public int updateTrangThai(String id, String userId) {
        DieuDongTaiSan dieuDongTaiSan = findById(id);
        int trangThai = dieuDongTaiSan.getTrangThai();

        // Nếu có ký nháy ngoài (bên bảng khác)
        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1;
        }

        // Người ký nháy
        if (Objects.equals(userId, dieuDongTaiSan.getIdNguoiKyNhay())) {
            dieuDongTaiSan.setTrangThaiKyNhay(true);
            trangThai = 1;
        }

        // Trình duyệt cấp phòng
        if (Objects.equals(userId, dieuDongTaiSan.getIdTrinhDuyetCapPhong())) {
            dieuDongTaiSan.setTrinhDuyetCapPhongXacNhan(true);
            trangThai = 1;
        }

        // Trình duyệt giám đốc
        if (Objects.equals(userId, dieuDongTaiSan.getIdTrinhDuyetGiamDoc())) {
            dieuDongTaiSan.setTrinhDuyetGiamDocXacNhan(true);
            trangThai = 1;
        }

        // Kiểm tra đã ký đủ chưa
        boolean allKy = dieuDongTaiSan.getTrinhDuyetCapPhongXacNhan() && dieuDongTaiSan.getTrinhDuyetGiamDocXacNhan();

        if (dieuDongTaiSan.getNguoiLapPhieuKyNhay()) {
            allKy = allKy && dieuDongTaiSan.getTrangThaiKyNhay();
        }

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        if (allKy) {
            trangThai = 3;
        }

        dieuDongTaiSan.setTrangThai(trangThai);
        DieuDongTaiSan result = update(dieuDongTaiSan);
        if (result != null) {
            CompletableFuture.runAsync(this::refreshCache);
            return trangThai;
        }
        return 0;
    }


    public int huyDieuDong(String id) {
        String sql = """
                UPDATE DieuDongTaiSan
                SET TrinhDuyetCapPhongXacNhan = 0,
                    TrinhDuyetGiamDocXacNhan = 0,
                    TrangThai = 2
                WHERE Id = ?
                """;

        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
    }

    /**
     * Đếm số lượng DieuDongTaiSan theo TrangThai và IdDonViGiao
     */
    public long countByTrangThaiAndDonViGiao(int trangThai, String idDonViGiao) {
        String sql = "SELECT COUNT(*) FROM DieuDongTaiSan WHERE TrangThai = ? AND IdDonViGiao = ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, trangThai, idDonViGiao);
        return count != null ? count : 0;
    }

    /**
     * Lấy danh sách DieuDongTaiSan (loại Điều động) đã hoàn thành nhưng chưa bàn giao hết tài sản.
     * Logic: Kiểm tra có chi tiết nào còn DaBanGiao = false hoặc NULL không
     */
    public List<DieuDongTaiSanDTO> findAllChuaBanGiaoHet(String idCongTy) {
        String sql = """
            SELECT DISTINCT
                ddts.Id,
                ddts.SoQuyetDinh,
                ddts.TenPhieu,

                ddts.IdDonViGiao,
                pbGiao.TenPhongBan AS TenDonViGiao,

                ddts.IdDonViNhan,
                pbNhan.TenPhongBan AS TenDonViNhan,

                ddts.IdNguoiKyNhay,
                nvKyNhay.HoTen AS TenNguoiKyNhay,
                ddts.TrangThaiKyNhay,
                ddts.NguoiLapPhieuKyNhay,

                ddts.IdDonViDeNghi,
                pbDeNghi.TenPhongBan AS TenDonViDeNghi,

                ddts.TGGNTuNgay,
                ddts.TGGNDenNgay,

                ddts.IdTrinhDuyetCapPhong,
                nvCapPhong.HoTen AS TenTrinhDuyetCapPhong,
                ddts.TrinhDuyetCapPhongXacNhan,

                ddts.IdTrinhDuyetGiamDoc,
                nvGiamDoc.HoTen AS TenTrinhDuyetGiamDoc,
                ddts.TrinhDuyetGiamDocXacNhan,

                ddts.IdPhongBanXemPhieu,
                pbXem.TenPhongBan AS TenPhongBanXemPhieu,

                ddts.DiaDiemGiaoNhan,
                ddts.NoiNhan,
                ddts.TrangThai,
                ddts.IdCongTy,
                ddts.NgayTao,
                ddts.NgayCapNhat,
                ddts.NguoiTao,
                nvNguoiTao.HoTen AS TenNguoiTao,
                ddts.NguoiCapNhat,
                nvNguoiCapNhat.HoTen AS TenNguoiCapNhat,
                ddts.CoHieuLuc,
                ddts.Loai,
                ddts.Share,
                ddts.TrichYeu,
                ddts.DuongDanFile,
                ddts.TenFile,
                ddts.NgayKy,
                ddts.DaBanGiao,
                ddts.ByStep,
                ddts.CoPhieuBanGiao,
                ddts.taiLieuCuoi

            FROM DieuDongTaiSan ddts
                LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
                LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                LEFT JOIN NhanVien nvNguoiTao ON ddts.NguoiTao = nvNguoiTao.Id
                LEFT JOIN NhanVien nvNguoiCapNhat ON ddts.NguoiCapNhat = nvNguoiCapNhat.Id

            WHERE ddts.IdCongTy = ?
              AND ddts.TrangThai = 4
              AND ddts.Loai = 2
              AND EXISTS (
                SELECT 1 FROM ChiTietDieuDongTaiSan ctdd
                WHERE ctdd.IdDieuDongTaiSan = ddts.Id
                  AND ctdd.IsActive = 1
                  AND (ctdd.DaBanGiao = 0 OR ctdd.DaBanGiao IS NULL)
              )
            ORDER BY ddts.NgayCapNhat DESC
            """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DieuDongTaiSanDTO.class), idCongTy);
    }

    /**
     * Lấy danh sách IDs của DieuDongTaiSan chưa bàn giao hết tài sản.
     * Logic: Kiểm tra có chi tiết nào còn DaBanGiao = false hoặc NULL không
     * Sử dụng cho việc filter trong findAllPaged
     */
    public java.util.Set<String> getIdsChuaBanGiaoHet(String idCongTy) {
        String sql = """
                SELECT DISTINCT ddts.Id
                FROM DieuDongTaiSan ddts
                WHERE ddts.IdCongTy = ?
                  AND ddts.TrangThai = 4
                  AND EXISTS (
                    SELECT 1 FROM ChiTietDieuDongTaiSan ctdd
                    WHERE ctdd.IdDieuDongTaiSan = ddts.Id
                      AND ctdd.IsActive = 1
                      AND (ctdd.DaBanGiao = 0 OR ctdd.DaBanGiao IS NULL)
                  )
                """;
        List<String> ids = jdbcTemplate.queryForList(sql, String.class, idCongTy);
        return new java.util.HashSet<>(ids);
    }

    /**
     * Lấy danh sách IdTaiSan đã được bàn giao cho một phiếu điều động cụ thể.
     * Dùng để lọc chi tiết khi chuaBanGiaoHet=true
     */
    public java.util.Set<String> getIdsTaiSanDaBanGiao(String idDieuDongTaiSan) {
        String sql = """
                SELECT DISTINCT ctbg.IdTaiSan
                FROM ChiTietBanGiaoTaiSan ctbg
                INNER JOIN BanGiaoTaiSan bgts ON ctbg.IdBanGiaoTaiSan = bgts.Id
                WHERE bgts.QuyetDinhDieuDongSo = ?
                """;
        List<String> ids = jdbcTemplate.queryForList(sql, String.class, idDieuDongTaiSan);
        return new java.util.HashSet<>(ids);
    }
}
