package com.ecotel.quanlytaisan.dao;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DieuDongCCDCVatTuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;
    @Autowired
    private ConfigDao configDao;

    public List<DieuDongCCDCVatTuDTO> findAll(String idCongTy) {
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
                
                    -- Người ký nháy (map từ cột IdNguoiKyNhay)
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
                    ddts.NguoiCapNhat,
                    ddts.CoHieuLuc,
                    ddts.Loai,
                    ddts.Share,
                    ddts.TrichYeu,
                    ddts.DuongDanFile,
                    ddts.TenFile,
                    ddts.NgayKy,
                    ddts.ByStep,
                    ddts.DaBanGiao,
                    ddts.CoPhieuBanGiao

                FROM DieuDongCCDCVatTu ddts
                    LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                    LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                    LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                    LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id

                    LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                    LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                    LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id

                WHERE ddts.IdCongTy = ?;
                """;
        List<DieuDongCCDCVatTuDTO> dieuDongCCDCVatTuDTOList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DieuDongCCDCVatTuDTO.class), idCongTy);
        for (int i = 0; i < dieuDongCCDCVatTuDTOList.size(); i++) {
            int status = updateDate(dieuDongCCDCVatTuDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(dieuDongCCDCVatTuDTOList.get(i));
            dieuDongCCDCVatTuDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                dieuDongCCDCVatTuDTOList.get(i).setTrangThai(2);
                dieuDongCCDCVatTuDTOList.get(i).setTrinhDuyetCapPhongXacNhan(false);
                dieuDongCCDCVatTuDTOList.get(i).setTrinhDuyetGiamDocXacNhan(false);
            }
            // Tính trạng thái phiếu điều động
            int trangThaiPhieuDieuDong = getTrangThaiPhieuDieuDong(dieuDongCCDCVatTuDTOList.get(i), trangThaiPhieu, status);
            dieuDongCCDCVatTuDTOList.get(i).setTrangThaiPhieuDieuDong(trangThaiPhieuDieuDong);
        }
        return dieuDongCCDCVatTuDTOList;
    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM DieuDongCCDCVatTu ddts WHERE ddts.IdCongTy = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public Map<Integer, Long> getCountByTrangThai(String idCongTy) {
        String sql = """
                SELECT ddts.TrangThai, COUNT(*) AS soLuong
                FROM DieuDongCCDCVatTu ddts
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
                FROM DieuDongCCDCVatTu ddts
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

    public List<DieuDongCCDCVatTuDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
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
                    ddts.NguoiCapNhat,
                    ddts.CoHieuLuc,
                    ddts.Loai,
                    ddts.Share,
                    ddts.TrichYeu,
                    ddts.DuongDanFile,
                    ddts.TenFile,
                    ddts.NgayKy,
                    ddts.ByStep,
                    ddts.DaBanGiao,
                    ddts.CoPhieuBanGiao
                FROM DieuDongCCDCVatTu ddts
                    LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                    LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                    LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                    LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
                    LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                    LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                    LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                WHERE ddts.IdCongTy = ?
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """;
        String finalSql = String.format(sql, orderColumn, direction);
        List<DieuDongCCDCVatTuDTO> list = jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(DieuDongCCDCVatTuDTO.class), idCongTy, limit, offset);
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

    public List<DieuDongCCDCVatTuDTO> findByUserId(String userId) {
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
                
                    -- Người ký nháy (map từ cột IdNguoiKyNhay)
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
                    ddts.NguoiCapNhat,
                    ddts.CoHieuLuc,
                    ddts.Loai,
                    ddts.Share,
                    ddts.TrichYeu,
                    ddts.DuongDanFile,
                    ddts.TenFile,
                    ddts.NgayKy,
                    ddts.ByStep,
                    ddts.DaBanGiao,
                    ddts.CoPhieuBanGiao
                FROM DieuDongCCDCVatTu ddts
                    LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                    LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                    LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                    LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id

                    LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                    LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                    LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
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

        List<DieuDongCCDCVatTuDTO> dieuDongCCDCVatTuDTOList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DieuDongCCDCVatTuDTO.class), userId, userId, userId, userId, userId);
        for (int i = 0; i < dieuDongCCDCVatTuDTOList.size(); i++) {
            int status = updateDate(dieuDongCCDCVatTuDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(dieuDongCCDCVatTuDTOList.get(i));
            dieuDongCCDCVatTuDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                dieuDongCCDCVatTuDTOList.get(i).setTrangThai(2);
                dieuDongCCDCVatTuDTOList.get(i).setTrinhDuyetCapPhongXacNhan(false);
                dieuDongCCDCVatTuDTOList.get(i).setTrinhDuyetGiamDocXacNhan(false);
            }
        }
        return dieuDongCCDCVatTuDTOList;
    }

    public int getTrangThaiPhieu(DieuDongCCDCVatTuDTO dieuDongCCDCVatTuDTO) {
        int trangThai = 0;
        String idNguoiTao = dieuDongCCDCVatTuDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);
        String ngayTao = dieuDongCCDCVatTuDTO.getNgayTao();
        int thoiHanTaiLieu = 60;
        int ngayBaoHetHan = 3;
        if (config != null) {
            thoiHanTaiLieu = config.getThoiHanTaiLieu();
            ngayBaoHetHan = config.getNgayBaoHetHan();
        }

        if (dieuDongCCDCVatTuDTO.getTrangThai() == 3) {
            trangThai = 2;
        } else {
            LocalDateTime createdDate = LocalDateTime.now();
            try {
                createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            } catch (Exception e) {
                try {
                    createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                } catch (Exception ex) {
                    createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS"));
                }
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

    public int updateDate(DieuDongCCDCVatTuDTO dieuDongCCDCVatTuDTO) {
        String idNguoiTao = dieuDongCCDCVatTuDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);
        String ngayTao = dieuDongCCDCVatTuDTO.getNgayTao();
        int soNgay = 60;
        if (config != null) soNgay = config.getThoiHanTaiLieu();

        LocalDateTime createdDate = LocalDateTime.now();
        try {
            // Try ISO 8601 format first
            createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
        } catch (Exception e) {
            try {
                // Fallback to space format
                createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            } catch (Exception ex) {
                // Last fallback with milliseconds
                createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS"));
            }
        }


        LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
        long daysBetween = ChronoUnit.DAYS.between(createdDate, now);
        if (daysBetween >= soNgay && dieuDongCCDCVatTuDTO.getTrangThai() != 3) {
            huyDieuDong(dieuDongCCDCVatTuDTO.getId());
            return 1;
        }
        return 0;
    }

    /**
     * Tính trạng thái phiếu điều động:
     * 1: Chưa tạo phiếu bàn giao từ phiếu điều động
     * 2: Có biên bản bàn giao nhưng chưa bàn giao hết CCDC/Vật tư
     * 3: Đã bàn giao hết tất cả
     * 4: Sắp quá hạn điều động
     * 5: Đã quá hạn điều động
     */
    public int getTrangThaiPhieuDieuDong(DieuDongCCDCVatTuDTO dto, int trangThaiPhieu, int statusQuaHan) {
        // 5: Đã quá hạn điều động (status = 1 nghĩa là đã bị hủy do quá hạn)
        if (statusQuaHan == 1) {
            return 5;
        }

        // 4: Sắp quá hạn điều động (trangThaiPhieu = 1 là gần hết hạn)
        if (trangThaiPhieu == 1) {
            return 4;
        }

        // Chỉ tính trạng thái bàn giao cho phiếu đã hoàn thành (trangThai = 3) và loại điều động (loai = 2)
        if (dto.getTrangThai() != 3 || dto.getLoai() != 2) {
            return 1; // Mặc định: chưa tạo phiếu bàn giao
        }

        // Kiểm tra có phiếu bàn giao không
        boolean coPhieuBanGiao = Boolean.TRUE.equals(dto.getCoPhieuBanGiao()) || hasPhieuBanGiao(dto.getId());

        if (!coPhieuBanGiao) {
            return 1; // Chưa tạo phiếu bàn giao
        }

        // Kiểm tra đã bàn giao hết chưa
        boolean daBanGiaoHet = kiemTraDaBanGiaoHetCCDCVatTu(dto.getId());

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
        String sql = "SELECT COUNT(*) FROM BanGiaoCCDCVatTu WHERE QuyetDinhDieuDongSo = ?";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idDieuDong);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Kiểm tra phiếu điều động đã bàn giao hết CCDC/Vật tư chưa
     * Logic: Kiểm tra còn chi tiết nào có SoLuongConLai > 0 không
     */
    private boolean kiemTraDaBanGiaoHetCCDCVatTu(String idDieuDong) {
        String sql = """
                SELECT COUNT(*) FROM ChiTietDieuDongCCDCVatTu ctdd
                WHERE ctdd.IdDieuDongCCDCVatTu = ?
                  AND ctdd.IsActive = 1
                  AND COALESCE(ctdd.SoLuongConLai, 0) > 0
                """;
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idDieuDong);
            return count == null || count == 0; // Nếu không còn CCDC/Vật tư nào chưa bàn giao thì đã bàn giao hết
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Sinh tự động Id và SoQuyetDinh theo format:
     * - loai = 1 (QĐ cấp phát CCDCVatTu): CPDC-Năm-STT (3 số) VD: CPDC-2025-001
     * - loai = 2 (QĐ điều động CCDCVatTu): DDDC-Năm-STT (3 số) VD: DDDC-2025-001
     * - loai = 3 (QĐ thu hồi CCDCVatTu): THDC-Năm-STT (3 số) VD: THDC-2025-001
     * Sử dụng bảng Sequence để đảm bảo không bị trùng khi xóa record
     */
    public String generateIdAndSoQuyetDinh(Integer loai) {
        String prefix;
        switch (loai) {
            case 1:
                prefix = "CPDC";
                break;
            case 2:
                prefix = "DDDC";
                break;
            case 3:
                prefix = "THDC";
                break;
            default:
                prefix = "DDDC";
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
            String maxSql = "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0) FROM DieuDongCCDCVatTu WHERE Id LIKE ?";
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

    public DieuDongCCDCVatTu insert(DieuDongCCDCVatTu obj) {
        // Tự động sinh Id và SoQuyetDinh nếu chưa có

        String generatedId = generateIdAndSoQuyetDinh(obj.getLoai());
        obj.setId(generatedId);
        obj.setSoQuyetDinh(generatedId);
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM DieuDongCCDCVatTu WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            obj.setNgayTao(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            obj.setTrinhDuyetGiamDocXacNhan(false);
            String sql = """
                    INSERT INTO DieuDongCCDCVatTu (
                        Id, SoQuyetDinh, TenPhieu, IdDonViGiao, IdDonViNhan,
                        IdNguoiKyNhay, TrangThaiKyNhay, NguoiLapPhieuKyNhay,
                        IdDonViDeNghi, TGGNTuNgay, TGGNDenNgay,
                        IdTrinhDuyetCapPhong, TrinhDuyetCapPhongXacNhan,
                        IdTrinhDuyetGiamDoc, TrinhDuyetGiamDocXacNhan,
                        DiaDiemGiaoNhan, IdPhongBanXemPhieu, NoiNhan, TrangThai,
                        IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat,
                        CoHieuLuc, Loai, Share, TrichYeu, DuongDanFile, TenFile, NgayKy,DaBanGiao,ByStep
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,False,?)
                    """;

            int result = jdbcTemplate.update(sql,
                    obj.getId(),
                    obj.getSoQuyetDinh(),
                    obj.getTenPhieu(),
                    obj.getIdDonViGiao(),
                    obj.getIdDonViNhan(),
                    obj.getIdNguoiKyNhay(),
                    obj.getTrangThaiKyNhay(),
                    obj.getNguoiLapPhieuKyNhay(),
                    obj.getIdDonViDeNghi(),
                    obj.getTgGnTuNgay(),
                    obj.getTgGnDenNgay(),
                    obj.getIdTrinhDuyetCapPhong(),
                    obj.getTrinhDuyetCapPhongXacNhan(),
                    obj.getIdTrinhDuyetGiamDoc(),
                    obj.getTrinhDuyetGiamDocXacNhan(),
                    obj.getDiaDiemGiaoNhan(),
                    obj.getIdPhongBanXemPhieu(),
                    obj.getNoiNhan(),
                    obj.getTrangThai(),
                    "CT001",
                    obj.getNgayTao(),
                    obj.getNgayCapNhat(),
                    obj.getNguoiTao(),
                    obj.getNguoiCapNhat(),
                    obj.getCoHieuLuc(),
                    obj.getLoai(),
                    obj.getShare(),
                    obj.getTrichYeu(),
                    obj.getDuongDanFile(),
                    obj.getTenFile(),
                    obj.getNgayKy(),
                    obj.getByStep()
            );
            return obj;
        }
    }

    public int updateCoPhieuBanGiao(String id, boolean coPhieuBanGiao) {
        String sql = "UPDATE DieuDongCCDCVatTu SET CoPhieuBanGiao = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, coPhieuBanGiao, id);
    }

    public int updateTrangThaiBanGiao(String id, boolean daBanGiao) {
        String sql = """
                UPDATE DieuDongCCDCVatTu
                SET DaBanGiao=?
                WHERE Id=?
                """;

        return jdbcTemplate.update(sql,
                daBanGiao,
                id  // điều kiện WHERE
        );
    }

    public DieuDongCCDCVatTu update(DieuDongCCDCVatTu obj) {
        String sql = """
                UPDATE DieuDongCCDCVatTu
                SET SoQuyetDinh=?, TenPhieu=?, IdDonViGiao=?, IdDonViNhan=?,
                    IdNguoiKyNhay=?, TrangThaiKyNhay=?, NguoiLapPhieuKyNhay=?,
                    IdDonViDeNghi=?, TGGNTuNgay=?, TGGNDenNgay=?,
                    IdTrinhDuyetCapPhong=?, TrinhDuyetCapPhongXacNhan=?,
                    IdTrinhDuyetGiamDoc=?, TrinhDuyetGiamDocXacNhan=?,
                    DiaDiemGiaoNhan=?, IdPhongBanXemPhieu=?, NoiNhan=?, TrangThai=?,
                    IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?,
                    CoHieuLuc=?, Loai=?, Share=?, TrichYeu=?, DuongDanFile=?, TenFile=?, NgayKy=?,ByStep=?
                WHERE Id=?
                """;

        int result = jdbcTemplate.update(sql,
                obj.getSoQuyetDinh(),
                obj.getTenPhieu(),
                obj.getIdDonViGiao(),
                obj.getIdDonViNhan(),
                obj.getIdNguoiKyNhay(),
                obj.getTrangThaiKyNhay(),
                obj.getNguoiLapPhieuKyNhay(),
                obj.getIdDonViDeNghi(),
                obj.getTgGnTuNgay(),
                obj.getTgGnDenNgay(),
                obj.getIdTrinhDuyetCapPhong(),
                obj.getTrinhDuyetCapPhongXacNhan(),
                obj.getIdTrinhDuyetGiamDoc(),
                obj.getTrinhDuyetGiamDocXacNhan(),
                obj.getDiaDiemGiaoNhan(),
                obj.getIdPhongBanXemPhieu(),
                obj.getNoiNhan(),
                obj.getTrangThai(),
                "CT001",
                obj.getNgayTao(),
                obj.getNgayCapNhat(),
                obj.getNguoiTao(),
                obj.getNguoiCapNhat(),
                obj.getCoHieuLuc(),
                obj.getLoai(),
                obj.getShare(),
                obj.getTrichYeu(),
                obj.getDuongDanFile(),
                obj.getTenFile(),
                obj.getNgayKy(),
                obj.getByStep(),
                obj.getId()  // điều kiện WHERE
        );
        return result > 0 ? findById(obj.getId()) : null;
    }


    public DieuDongCCDCVatTu findById(String id) {
        String sql = """
                select * from DieuDongCCDCVatTu as ddts
                WHERE ddts.id = ?;
                """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(DieuDongCCDCVatTu.class), id);
    }


    // DELETE
    public int delete(String id) {
        String sql = "DELETE FROM DieuDongCCDCVatTu WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
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
        DieuDongCCDCVatTu dieuDongCCDCVatTu = findById(id);
        int trangThai = dieuDongCCDCVatTu.getTrangThai();

        // Nếu có ký nháy ngoài (bên bảng khác)
        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1;
        }

        // Người ký nháy
        if (Objects.equals(userId, dieuDongCCDCVatTu.getIdNguoiKyNhay())) {
            dieuDongCCDCVatTu.setTrangThaiKyNhay(true);
            trangThai = 1;
        }

        // Trình duyệt cấp phòng
        if (Objects.equals(userId, dieuDongCCDCVatTu.getIdTrinhDuyetCapPhong())) {
            dieuDongCCDCVatTu.setTrinhDuyetCapPhongXacNhan(true);
            trangThai = 1;
        }

        // Trình duyệt giám đốc
        if (Objects.equals(userId, dieuDongCCDCVatTu.getIdTrinhDuyetGiamDoc())) {
            dieuDongCCDCVatTu.setTrinhDuyetGiamDocXacNhan(true);
            trangThai = 1;
        }

        // Kiểm tra đã ký đủ chưa
        boolean allKy = dieuDongCCDCVatTu.getTrinhDuyetCapPhongXacNhan()
                && dieuDongCCDCVatTu.getTrinhDuyetGiamDocXacNhan();

        if (dieuDongCCDCVatTu.getNguoiLapPhieuKyNhay()) {
            allKy = allKy && dieuDongCCDCVatTu.getTrangThaiKyNhay();
        }

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        if (allKy) {
            trangThai = 3;
        }

        dieuDongCCDCVatTu.setTrangThai(trangThai);
        DieuDongCCDCVatTu result = update(dieuDongCCDCVatTu);
        if (result != null) {
            return trangThai;
        }
        return 0;

    }


    public int huyDieuDong(String id) {
        String sql = """
                UPDATE DieuDongCCDCVatTu
                SET TrinhDuyetCapPhongXacNhan = 0,
                    TrinhDuyetGiamDocXacNhan = 0,
                    TrangThai = 2
                WHERE Id = ?
                """;

        return jdbcTemplate.update(sql, id);
    }

    /**
     * Đếm số lượng DieuDongCCDCVatTu theo TrangThai và IdDonViGiao
     */
    public long countByTrangThaiAndDonViGiao(int trangThai, String idDonViGiao) {
        String sql = "SELECT COUNT(*) FROM DieuDongCCDCVatTu WHERE TrangThai = ? AND IdDonViGiao = ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, trangThai, idDonViGiao);
        return count != null ? count : 0;
    }

    /**
     * Lấy danh sách DieuDongCCDCVatTu (loại Điều động) đã hoàn thành nhưng chưa bàn giao hết.
     *
     * Logic: Một phiếu điều động được coi là chưa bàn giao hết khi:
     * - TrangThai = 3 (hoàn thành)
     * - Loai = 2 (Điều động)
     * - Có ít nhất 1 chi tiết điều động mà:
     *   + SoLuongXuat > Tổng(SoLuong) từ ChiTietBanGiaoCCDCVatTu liên kết qua IdChiTietDieuDong
     *   + Tính tất cả chi tiết bàn giao (không cần phiếu bàn giao hoàn thành)
     */
    public List<DieuDongCCDCVatTuDTO> findAllChuaBanGiaoHet(String idCongTy) {
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
                    ddts.NguoiCapNhat,
                    ddts.CoHieuLuc,
                    ddts.Loai,
                    ddts.Share,
                    ddts.TrichYeu,
                    ddts.DuongDanFile,
                    ddts.TenFile,
                    ddts.NgayKy,
                    ddts.DaBanGiao,
                    ddts.ByStep,
                    ddts.CoPhieuBanGiao

                FROM DieuDongCCDCVatTu ddts
                    LEFT JOIN PhongBan pbGiao ON ddts.IdDonViGiao = pbGiao.Id
                    LEFT JOIN PhongBan pbNhan ON ddts.IdDonViNhan = pbNhan.Id
                    LEFT JOIN PhongBan pbDeNghi ON ddts.IdDonViDeNghi = pbDeNghi.Id
                    LEFT JOIN PhongBan pbXem ON ddts.IdPhongBanXemPhieu = pbXem.Id
                    LEFT JOIN NhanVien nvKyNhay ON ddts.IdNguoiKyNhay = nvKyNhay.Id
                    LEFT JOIN NhanVien nvCapPhong ON ddts.IdTrinhDuyetCapPhong = nvCapPhong.Id
                    LEFT JOIN NhanVien nvGiamDoc ON ddts.IdTrinhDuyetGiamDoc = nvGiamDoc.Id

                WHERE ddts.IdCongTy = ?
                  AND ddts.TrangThai = 3
                  AND ddts.Loai = 2
                  AND EXISTS (
                    SELECT 1 FROM ChiTietDieuDongCCDCVatTu ctdd
                    WHERE ctdd.IdDieuDongCCDCVatTu = ddts.Id
                      AND ctdd.IsActive = 1
                      AND COALESCE(ctdd.SoLuongConLai, 0) > 0
                  )
                ORDER BY ddts.NgayCapNhat DESC
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DieuDongCCDCVatTuDTO.class), idCongTy);
    }

    /**
     * Lấy danh sách IDs của DieuDongCCDCVatTu chưa bàn giao hết.
     * Sử dụng cho việc filter trong findAllPaged.
     *
     * Logic: Một phiếu điều động được coi là chưa bàn giao hết khi:
     * - TrangThai = 3 (hoàn thành)
     * - Có ít nhất 1 chi tiết điều động mà SoLuongConLai > 0
     */
    public java.util.Set<String> getIdsChuaBanGiaoHet(String idCongTy) {
        String sql = """
                SELECT DISTINCT ddts.Id
                FROM DieuDongCCDCVatTu ddts
                WHERE ddts.IdCongTy = ?
                  AND ddts.TrangThai = 3
                  AND EXISTS (
                    SELECT 1 FROM ChiTietDieuDongCCDCVatTu ctdd
                    WHERE ctdd.IdDieuDongCCDCVatTu = ddts.Id
                      AND ctdd.IsActive = 1
                      AND COALESCE(ctdd.SoLuongConLai, 0) > 0
                  )
                """;
        List<String> ids = jdbcTemplate.queryForList(sql, String.class, idCongTy);
        return new java.util.HashSet<>(ids);
    }
}
