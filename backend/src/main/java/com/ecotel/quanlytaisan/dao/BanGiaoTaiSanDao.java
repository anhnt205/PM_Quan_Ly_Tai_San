package com.ecotel.quanlytaisan.dao;

import java.time.LocalDateTime;
import java.time.Year;
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
import com.ecotel.quanlytaisan.utils.ParserHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BanGiaoTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static List<BanGiaoTaiSanDTO> cache = new ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private void refreshCache() {
        String sql = """
                SELECT bgts.Id,
                       bgts.BanGiaoTaiSan,
                       bgts.QuyetDinhDieuDongSo,
                       bgts.LenhDieuDong,
                
                       bgts.IdDonViGiao,
                       pbGiao.TenPhongBan    AS TenDonViGiao,
                
                       bgts.IdDonViNhan,
                       pbNhan.TenPhongBan    AS TenDonViNhan,
                
                
                       bgts.NgayBanGiao,
                
                       bgts.IdLanhDao,
                       nvLanhDao.HoTen       AS TenLanhDao,
                
                       bgts.IdDaiDienBenGiao,
                       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
                       bgts.DaiDienBenGiaoXacNhan,
                
                       bgts.IdDaiDienBenNhan,
                       nvBenNhan.HoTen       AS TenDaiDienBenNhan,
                       bgts.DaiDienBenNhanXacNhan,
                
                       bgts.TrangThai,
                       bgts.Note,
                
                       bgts.NgayTao,
                       bgts.NgayCapNhat,
                       bgts.NguoiTao,
                       bgts.NguoiCapNhat,
                       bgts.IsActive,
                       bgts.Share,
                       bgts.DuongDanFile,
                       bgts.TenFile,
                       bgts.ByStep,
                       bgts.NgayTaoChungTu,
                           bgts.IdGiamDoc,
                           bgts.GiamDocKy,
                           nvGiamDoc.HoTen as TenGiamDoc,
                                                       bgts.SoQuyetDinh,
                            bgts.NgayQuyetDinh,
                            bgts.DiaDiemQuyetDinh,
                            bgts.taiLieuBangKe
                
                
                FROM BanGiaoTaiSan AS bgts
                
                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id
                
                
                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id
                LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id
                """;
        try {
            List<BanGiaoTaiSanDTO> data = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BanGiaoTaiSanDTO.class));
            cache = data;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<BanGiaoTaiSanDTO> findAll(String idCongTy) {
        if (cache == null || cache.isEmpty()) {
            refreshCache();
        }
        List<BanGiaoTaiSanDTO> banGiaoTaiSanDTOList = cache.stream()
                .collect(Collectors.toList());

        for (int i = 0; i < banGiaoTaiSanDTOList.size(); i++) {
            int status = updateDate(banGiaoTaiSanDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoTaiSanDTOList.get(i));
            banGiaoTaiSanDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoTaiSanDTOList.get(i).setTrangThai(2);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoTaiSanDTOList;
    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM BanGiaoTaiSan bgts WHERE bgts.IdCongTy = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public Map<Integer, Long> getCountByTrangThai(String idCongTy) {
        String sql = """
                SELECT bgts.TrangThai, COUNT(*) AS soLuong
                FROM BanGiaoTaiSan bgts
                WHERE bgts.IdCongTy = ?
                GROUP BY bgts.TrangThai
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
                SELECT bgts.TrangThai, COUNT(DISTINCT bgts.Id) AS soLuong
                FROM BanGiaoTaiSan bgts
                LEFT JOIN NguoiKy as nk on bgts.Id = nk.IdTaiLieu
                WHERE bgts.IdCongTy = ?
                AND (
                    bgts.NguoiTao = ?
                    OR (
                        bgts.Share = 1 AND (
                            (bgts.IdDaiDienBenGiao = ?)
                            OR (bgts.IdDaiDienBenNhan = ? AND bgts.DaiDienBenGiaoXacNhan = 1)
                            OR (bgts.IdGiamDoc = ? AND bgts.DaiDienBenNhanXacNhan = 1)
                            OR (nk.IdNguoiKy = ?)
                        )
                    )
                )
                GROUP BY bgts.TrangThai
                """;
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, idCongTy, userId, userId, userId, userId,
                userId);
        Map<Integer, Long> counts = new java.util.HashMap<>();
        for (Map<String, Object> row : results) {
            Integer trangThai = ((Number) row.get("TrangThai")).intValue();
            Long count = ((Number) row.get("soLuong")).longValue();
            counts.put(trangThai, count);
        }
        return counts;
    }

    public List<BanGiaoTaiSanDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tenfile":
                orderColumn = "bgts.TenFile";
                break;
            case "ngaytao":
                orderColumn = "bgts.NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "bgts.NgayCapNhat";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String sql = """
                 SELECT bgts.Id,
                        bgts.BanGiaoTaiSan,
                        bgts.QuyetDinhDieuDongSo,
                        bgts.LenhDieuDong,
                        bgts.IdDonViGiao,
                        pbGiao.TenPhongBan    AS TenDonViGiao,
                        bgts.IdDonViNhan,
                        pbNhan.TenPhongBan    AS TenDonViNhan,
                        bgts.NgayBanGiao,
                        bgts.IdLanhDao,
                        nvLanhDao.HoTen       AS TenLanhDao,
                        bgts.IdDaiDienBenGiao,
                        nvBenGiao.HoTen       AS TenDaiDienBenGiao,
                        bgts.DaiDienBenGiaoXacNhan,
                        bgts.IdDaiDienBenNhan,
                        nvBenNhan.HoTen       AS TenDaiDienBenNhan,
                        bgts.DaiDienBenNhanXacNhan,
                        bgts.TrangThai,
                        bgts.Note,
                        bgts.NgayTao,
                        bgts.NgayCapNhat,
                        bgts.NguoiTao,
                        bgts.NguoiCapNhat,
                        bgts.IsActive,
                        bgts.Share,
                        bgts.DuongDanFile,
                        bgts.TenFile,
                        bgts.ByStep,
                        bgts.NgayTaoChungTu,
                            bgts.IdGiamDoc,
                            bgts.GiamDocKy,
                            nvGiamDoc.HoTen as TenGiamDoc,\r\n                            bgts.SoQuyetDinh,\r\n                            bgts.NgayQuyetDinh,\r\n                            bgts.DiaDiemQuyetDinh,
                            bgts.SoQuyetDinh,
                            bgts.NgayQuyetDinh,
                            bgts.DiaDiemQuyetDinh,
                            bgts.taiLieuBangKe

                 FROM BanGiaoTaiSan AS bgts
                 LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                 LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id
                 LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                 LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                 LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id
                LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id
                 WHERE bgts.IdCongTy=?
                 ORDER BY %s %s
                 LIMIT ? OFFSET ?
                """;
        String finalSql = String.format(sql, orderColumn, direction);
        List<BanGiaoTaiSanDTO> list = jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(BanGiaoTaiSanDTO.class),
                idCongTy, limit, offset);
        for (int i = 0; i < list.size(); i++) {
            int status = updateDate(list.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(list.get(i));
            list.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                list.get(i).setTrangThai(2);
                list.get(i).setDaiDienBenGiaoXacNhan(false);
                list.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return list;
    }

    public List<BanGiaoTaiSanDTO> getByUserId(String userId) {
        String sql = """
                SELECT DISTINCT bgts.Id,
                       bgts.BanGiaoTaiSan,
                       bgts.QuyetDinhDieuDongSo,
                       bgts.LenhDieuDong,

                       bgts.IdDonViGiao,
                       pbGiao.TenPhongBan    AS TenDonViGiao,

                       bgts.IdDonViNhan,
                       pbNhan.TenPhongBan    AS TenDonViNhan,



                       bgts.NgayBanGiao,

                       bgts.IdLanhDao,
                       nvLanhDao.HoTen       AS TenLanhDao,

                       bgts.IdDaiDienBenGiao,
                       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
                       bgts.DaiDienBenGiaoXacNhan,

                       bgts.IdDaiDienBenNhan,
                       nvBenNhan.HoTen       AS TenDaiDienBenNhan,

                       bgts.DaiDienBenNhanXacNhan,

                       bgts.TrangThai,
                       bgts.Note,

                       bgts.NgayTao,
                       bgts.NgayCapNhat,
                       bgts.NguoiTao,
                       bgts.NguoiCapNhat,
                       bgts.IsActive,
                       bgts.Share,
                       bgts.DuongDanFile,
                       bgts.TenFile,
                       bgts.ByStep,
                       bgts.NgayTaoChungTu,
                       bgts.IdGiamDoc,
                       bgts.GiamDocKy,
                       nvGiamDoc.HoTen as TenGiamDoc,
                       bgts.SoQuyetDinh,
                       bgts.NgayQuyetDinh,
                       bgts.DiaDiemQuyetDinh,
                       bgts.taiLieuBangKe
                FROM BanGiaoTaiSan AS bgts

                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id

                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id
                        LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                        LEFT JOIN NguoiKy as nk on  bgts.Id = nk.IdTaiLieu
                               LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id

                WHERE bgts.NguoiTao = ?
                OR (
                    bgts.Share = 1 AND (
                                             (bgts.IdDaiDienBenGiao = ?)
                                             OR (bgts.IdDaiDienBenNhan = ? AND bgts.DaiDienBenGiaoXacNhan = 1)
                                             OR (bgts.IdGiamDoc = ? AND bgts.DaiDienBenNhanXacNhan = 1)
                                             OR (bgts.IdDaiDienBenNhan = ? )
                                             OR (bgts.IdGiamDoc = ?)
                                             OR (nk.IdNguoiKy = ?)
                                         )
                )
                """;
        List<BanGiaoTaiSanDTO> banGiaoTaiSanDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoTaiSanDTO.class), userId, userId, userId, userId, userId, userId,
                userId);
        for (int i = 0; i < banGiaoTaiSanDTOList.size(); i++) {
            int status = updateDate(banGiaoTaiSanDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoTaiSanDTOList.get(i));
            banGiaoTaiSanDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoTaiSanDTOList.get(i).setTrangThai(2);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoTaiSanDTOList;
    }

    public List<BanGiaoTaiSanDTO> getByUserIdStatus(String userId, int trangThai) {
        String sql = """
                SELECT bgts.Id,
                       bgts.BanGiaoTaiSan,
                       bgts.QuyetDinhDieuDongSo,
                       bgts.LenhDieuDong,

                       bgts.IdDonViGiao,
                       pbGiao.TenPhongBan    AS TenDonViGiao,

                       bgts.IdDonViNhan,
                       pbNhan.TenPhongBan    AS TenDonViNhan,



                       bgts.NgayBanGiao,

                       bgts.IdLanhDao,
                       nvLanhDao.HoTen       AS TenLanhDao,

                       bgts.IdDaiDienBenGiao,
                       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
                       bgts.DaiDienBenGiaoXacNhan,

                       bgts.IdDaiDienBenNhan,
                       nvBenNhan.HoTen       AS TenDaiDienBenNhan,
                       bgts.DaiDienBenNhanXacNhan,

                       bgts.TrangThai,
                       bgts.Note,

                       bgts.NgayTao,
                       bgts.NgayCapNhat,
                       bgts.NguoiTao,
                       bgts.NguoiCapNhat,
                       bgts.IsActive,
                       bgts.Share,
                       bgts.DuongDanFile,
                       bgts.TenFile,
                       bgts.ByStep,
                       bgts.NgayTaoChungTu,
                        bgts.IdGiamDoc,
                        bgts.GiamDocKy,
                    nvGiamDoc.HoTen as TenGiamDoc,
                    bgts.SoQuyetDinh,
                    bgts.NgayQuyetDinh,
                    bgts.DiaDiemQuyetDinh,
                    bgts.taiLieuBangKe

                FROM BanGiaoTaiSan AS bgts

                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id

                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id
                        LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                        LEFT JOIN NguoiKy as nk on  bgts.Id = nk.IdTaiLieu
                                    LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id
                WHERE (
                    bgts.NguoiTao = ?
                    OR (
                        bgts.Share = 1 AND (
                            (bgts.IdDaiDienBenGiao = ?)
                            OR (bgts.IdDaiDienBenNhan = ? AND bgts.DaiDienBenGiaoXacNhan = 1)
                            OR (bgts.IdGiamDoc = ? AND bgts.DaiDienBenNhanXacNhan = 1)
                            OR (nk.IdNguoiKy = ?)
                        )
                    )
                ) AND bgts.TrangThai = ?
                """;
        List<BanGiaoTaiSanDTO> banGiaoTaiSanDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoTaiSanDTO.class), userId, userId, userId, userId, userId, trangThai);
        for (int i = 0; i < banGiaoTaiSanDTOList.size(); i++) {
            int status = updateDate(banGiaoTaiSanDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoTaiSanDTOList.get(i));
            banGiaoTaiSanDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoTaiSanDTOList.get(i).setTrangThai(2);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoTaiSanDTOList;
    }

    public List<BanGiaoTaiSanDTO> getByStatus(int trangThai) {
        String sql = """
                SELECT bgts.Id,
                       bgts.BanGiaoTaiSan,
                       bgts.QuyetDinhDieuDongSo,
                       bgts.LenhDieuDong,

                       bgts.IdDonViGiao,
                       pbGiao.TenPhongBan    AS TenDonViGiao,

                       bgts.IdDonViNhan,
                       pbNhan.TenPhongBan    AS TenDonViNhan,

                       bgts.NgayBanGiao,

                       bgts.IdLanhDao,
                       nvLanhDao.HoTen       AS TenLanhDao,

                       bgts.IdDaiDienBenGiao,
                       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
                       bgts.DaiDienBenGiaoXacNhan,

                       bgts.IdDaiDienBenNhan,
                       nvBenNhan.HoTen       AS TenDaiDienBenNhan,
                       bgts.DaiDienBenNhanXacNhan,

                       bgts.TrangThai,
                       bgts.Note,

                       bgts.NgayTao,
                       bgts.NgayCapNhat,
                       bgts.NguoiTao,
                       bgts.NguoiCapNhat,
                       bgts.IsActive,
                       bgts.Share,
                       bgts.DuongDanFile,
                       bgts.TenFile,
                       bgts.ByStep,
                       bgts.NgayTaoChungTu,
                       bgts.IdGiamDoc,
                       bgts.GiamDocKy,
                        nvGiamDoc.HoTen as TenGiamDoc,
                        bgts.SoQuyetDinh,
                        bgts.NgayQuyetDinh,
                        bgts.DiaDiemQuyetDinh,
                        bgts.taiLieuBangKe
                FROM BanGiaoTaiSan AS bgts

                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id

                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id
                        LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                 LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id

                WHERE bgts.TrangThai=?""";
        List<BanGiaoTaiSanDTO> banGiaoTaiSanDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoTaiSanDTO.class), trangThai);
        for (int i = 0; i < banGiaoTaiSanDTOList.size(); i++) {
            int status = updateDate(banGiaoTaiSanDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoTaiSanDTOList.get(i));
            banGiaoTaiSanDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoTaiSanDTOList.get(i).setTrangThai(2);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoTaiSanDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoTaiSanDTOList;
    }

    public int getTrangThaiPhieu(BanGiaoTaiSanDTO banGiaoTaiSanDTO) {
        int trangThai = 0;
        String idNguoiTao = banGiaoTaiSanDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);
        String ngayTao = banGiaoTaiSanDTO.getNgayTao();
        int thoiHanTaiLieu = 60;
        int ngayBaoHetHan = 3;
        if (config != null) {
            thoiHanTaiLieu = config.getThoiHanTaiLieu();
            ngayBaoHetHan = config.getNgayBaoHetHan();
        }

        if (banGiaoTaiSanDTO.getTrangThai() == 3) {
            trangThai = 2;
        } else {
            LocalDateTime createdDate = LocalDateTime.now();
            try {
                createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            } catch (Exception e) {
                try {
                    createdDate = LocalDateTime.parse(ngayTao, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                } catch (Exception ex) {
                    createdDate = LocalDateTime.parse(ngayTao,
                            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS"));
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

    @Autowired
    private ConfigDao configDao;

    public int updateDate(BanGiaoTaiSanDTO banGiaoTaiSanDTO) {
        String idNguoiTao = banGiaoTaiSanDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);

        String ngayTao = banGiaoTaiSanDTO.getNgayTao().toString(); // Ví dụ: 2025-09-13 21:36:26
        int soNgay = 60;
        if (config != null) {
            soNgay = config.getThoiHanTaiLieu();
        }

        LocalDateTime createdDate = ParserHelper.parseDateTime(ngayTao);

        LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
        long daysBetween = ChronoUnit.DAYS.between(createdDate, now);

        if (daysBetween >= soNgay && banGiaoTaiSanDTO.getTrangThai() != 3 && banGiaoTaiSanDTO.getTrangThai() != 2) {
            huyTrangThai(banGiaoTaiSanDTO.getId());
            return 1; // Hết hạn
        }
        return 0; // Còn hạn
    }

    public BanGiaoTaiSan findById(String id) {
        String sql = """
                SELECT *
                FROM BanGiaoTaiSan AS bgts
                WHERE  bgts.Id=?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(BanGiaoTaiSan.class), id);
    }

    public BanGiaoTaiSanDTO findByIdDTO(String id) {
        String sql = """
                SELECT bgts.Id,
                       bgts.BanGiaoTaiSan,
                       bgts.QuyetDinhDieuDongSo,
                       bgts.LenhDieuDong,

                       bgts.IdDonViGiao,
                       pbGiao.TenPhongBan    AS TenDonViGiao,

                       bgts.IdDonViNhan,
                       pbNhan.TenPhongBan    AS TenDonViNhan,

                       bgts.NgayBanGiao,

                       bgts.IdLanhDao,
                       nvLanhDao.HoTen       AS TenLanhDao,

                       bgts.IdDaiDienBenGiao,
                       nvBenGiao.HoTen       AS TenDaiDienBenGiao,
                       bgts.DaiDienBenGiaoXacNhan,

                       bgts.IdDaiDienBenNhan,
                       nvBenNhan.HoTen       AS TenDaiDienBenNhan,
                       bgts.DaiDienBenNhanXacNhan,

                       bgts.TrangThai,
                       bgts.Note,

                       bgts.NgayTao,
                       bgts.NgayCapNhat,
                       bgts.NguoiTao,
                       bgts.NguoiCapNhat,
                       bgts.IsActive,
                       bgts.Share,
                       bgts.DuongDanFile,
                       bgts.TenFile,
                       bgts.ByStep,
                       bgts.NgayTaoChungTu,
                        bgts.IdGiamDoc,
                       bgts.GiamDocKy,
                    nvGiamDoc.HoTen as TenGiamDoc,
                    bgts.SoQuyetDinh,
                    bgts.NgayQuyetDinh,
                    bgts.DiaDiemQuyetDinh,
                    bgts.taiLieuBangKe

                FROM BanGiaoTaiSan AS bgts

                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id
                          LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id

                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id

                WHERE bgts.Id = ?""";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(BanGiaoTaiSanDTO.class), id);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Sinh ID tự động theo format: BGTS-Năm hiện tại-STT (3 số)
     * Ví dụ: BGTS-2025-001, BGTS-2025-002, ...
     * Sử dụng bảng Sequence để đảm bảo không bị trùng khi xóa record
     */
    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "BGTS";
        String prefix = seqName + "-" + currentYear + "-";

        // Kiểm tra và reset sequence nếu sang năm mới, hoặc tạo mới nếu chưa có
        String checkSql = "SELECT SeqYear, SeqValue FROM Sequence WHERE SeqName = ?";
        try {
            var result = jdbcTemplate.queryForMap(checkSql, seqName);
            int seqYear = ((Number) result.get("SeqYear")).intValue();
            if (seqYear != currentYear) {
                // Sang năm mới, reset sequence
                jdbcTemplate.update("UPDATE Sequence SET SeqYear = ?, SeqValue = 1 WHERE SeqName = ?", currentYear, seqName);
                return String.format("%s%04d", prefix, 1);
            }
        } catch (Exception e) {
            // Sequence chưa tồn tại, tạo mới với giá trị từ MAX hiện tại
            String maxSql = "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0) FROM BanGiaoTaiSan WHERE Id LIKE ?";
            Integer maxSeq = jdbcTemplate.queryForObject(maxSql, Integer.class, prefix + "%");
            int initValue = (maxSeq == null) ? 0 : maxSeq;
            jdbcTemplate.update("INSERT INTO Sequence (SeqName, SeqYear, SeqValue) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, ?)",
                    seqName, currentYear, initValue, initValue);
        }

        // Tăng sequence và lấy giá trị mới
        jdbcTemplate.update("UPDATE Sequence SET SeqValue = SeqValue + 1 WHERE SeqName = ? AND SeqYear = ?", seqName, currentYear);
        Integer nextSeq = jdbcTemplate.queryForObject("SELECT SeqValue FROM Sequence WHERE SeqName = ?", Integer.class, seqName);

        return String.format("%s%04d", prefix, nextSeq);
    }

    public BanGiaoTaiSan insert(BanGiaoTaiSan entity) {
        // Luôn tự động sinh ID mới, bỏ qua ID từ input
        entity.setId(generateNextId());

        entity.setNgayTao(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        if (entity.getByStep() != null && entity.getByStep()) {
            entity.setGiamDocKy(false);
        }
        String sql = """
                INSERT INTO BanGiaoTaiSan (
                    Id, IdCongTy, BanGiaoTaiSan, QuyetDinhDieuDongSo, LenhDieuDong,
                    IdDonViGiao, IdDonViNhan, NgayBanGiao, IdLanhDao, IdDaiDiendonviBanHanhQD, DaXacNhan,
                    IdDaiDienBenGiao, DaiDienBenGiaoXacNhan,
                    IdDaiDienBenNhan, DaiDienBenNhanXacNhan,
                    TrangThai, Note, NgayTao, NgayCapNhat,
                    NguoiTao, NguoiCapNhat, IsActive, Share, DuongDanFile, TenFile, ByStep, NgayTaoChungTu,
                    IdGiamDoc, GiamDocKy, SoQuyetDinh, NgayQuyetDinh, DiaDiemQuyetDinh, taiLieuBangKe
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """;
        int result = jdbcTemplate.update(sql, entity.getId(), "CT001", entity.getBanGiaoTaiSan(),
                entity.getQuyetDinhDieuDongSo(), entity.getLenhDieuDong(), entity.getIdDonViGiao(),
                entity.getIdDonViNhan(), entity.getNgayBanGiao(), entity.getIdLanhDao(),
                entity.getIdDaiDiendonviBanHanhQD(), entity.getDaXacNhan(), entity.getIdDaiDienBenGiao(),
                entity.getDaiDienBenGiaoXacNhan(), entity.getIdDaiDienBenNhan(), entity.getDaiDienBenNhanXacNhan(),
                entity.getTrangThai(), entity.getNote(), entity.getNgayTao(), entity.getNgayCapNhat(),
                entity.getNguoiTao(), entity.getNguoiCapNhat(), entity.getIsActive(), entity.getShare(),
                entity.getDuongDanFile(), entity.getTenFile(), entity.getByStep(), entity.getNgayTaoChungTu(),
                entity.getIdGiamDoc(), entity.getGiamDocKy(), entity.getSoQuyetDinh(), entity.getNgayQuyetDinh(),
                entity.getDiaDiemQuyetDinh(), entity.getTaiLieuBangKe());
        if (result > 0) {
            this.refreshCache();
            // Cập nhật CoPhieuBanGiao = true cho phiếu điều động
            if (entity.getQuyetDinhDieuDongSo() != null && !entity.getQuyetDinhDieuDongSo().isEmpty()) {
                dieuDongTaiSanDao.updateCoPhieuBanGiao(entity.getQuyetDinhDieuDongSo(), true);
            }
            return entity;
        }
        return null;
    }

    // Update
    public BanGiaoTaiSan update(BanGiaoTaiSan entity) {
        String sql = """
                UPDATE BanGiaoTaiSan
                SET IdCongTy=?, BanGiaoTaiSan=?, QuyetDinhDieuDongSo=?, LenhDieuDong=?,
                    IdDonViGiao=?, IdDonViNhan=?, NgayBanGiao=?, IdLanhDao=?, IdDaiDiendonviBanHanhQD=?, DaXacNhan=?,
                    IdDaiDienBenGiao=?, DaiDienBenGiaoXacNhan=?,
                    IdDaiDienBenNhan=?, DaiDienBenNhanXacNhan=?,
                    TrangThai=?, Note=?, NgayTao=?, NgayCapNhat=?,
                    NguoiTao=?, NguoiCapNhat=?, IsActive=?, Share=?, DuongDanFile=?, TenFile=?, ByStep=?, NgayTaoChungTu=?,
                    IdGiamDoc=?, GiamDocKy=?, SoQuyetDinh=?, NgayQuyetDinh=?, DiaDiemQuyetDinh=?, taiLieuBangKe=?
                WHERE Id=?
                """;

        int result = jdbcTemplate.update(sql, "CT001", entity.getBanGiaoTaiSan(),
                entity.getQuyetDinhDieuDongSo(), entity.getLenhDieuDong(), entity.getIdDonViGiao(),
                entity.getIdDonViNhan(), entity.getNgayBanGiao(), entity.getIdLanhDao(),
                entity.getIdDaiDiendonviBanHanhQD(), entity.getDaXacNhan(), entity.getIdDaiDienBenGiao(),
                entity.getDaiDienBenGiaoXacNhan(), entity.getIdDaiDienBenNhan(), entity.getDaiDienBenNhanXacNhan(),
                entity.getTrangThai(), entity.getNote(), entity.getNgayTao(), entity.getNgayCapNhat(),
                entity.getNguoiTao(), entity.getNguoiCapNhat(), entity.getIsActive(), entity.getShare(),
                entity.getDuongDanFile(), entity.getTenFile(), entity.getByStep(), entity.getNgayTaoChungTu(),
                entity.getIdGiamDoc(), entity.getGiamDocKy(), entity.getSoQuyetDinh(), entity.getNgayQuyetDinh(),
                entity.getDiaDiemQuyetDinh(), entity.getTaiLieuBangKe(), entity.getId());
        if (result > 0) {
            this.refreshCache();
            return findById(entity.getId());
        }
        return null;
    }

    public int delete(String id) {
        // Lấy thông tin phiếu trước khi xóa để biết QuyetDinhDieuDongSo
        BanGiaoTaiSan entity = findById(id);
        String quyetDinhDieuDongSo = entity != null ? entity.getQuyetDinhDieuDongSo() : null;

        String sql = "DELETE FROM BanGiaoTaiSan WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            this.refreshCache();
            // Cập nhật CoPhieuBanGiao = false cho phiếu điều động nếu không còn phiếu bàn giao nào khác sử dụng
            if (quyetDinhDieuDongSo != null && !quyetDinhDieuDongSo.isEmpty()) {
                int remainingCount = countByQuyetDinhDieuDongSo(quyetDinhDieuDongSo);
                if (remainingCount == 0) {
                    dieuDongTaiSanDao.updateCoPhieuBanGiao(quyetDinhDieuDongSo, false);
                }
            }
        }
        return result;
    }

    /**
     * Đếm số lượng phiếu bàn giao tài sản sử dụng một phiếu điều động
     */
    public int countByQuyetDinhDieuDongSo(String quyetDinhDieuDongSo) {
        String sql = "SELECT COUNT(*) FROM BanGiaoTaiSan WHERE QuyetDinhDieuDongSo = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, quyetDinhDieuDongSo);
        return count != null ? count : 0;
    }

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    @Autowired
    private ChiTietBanGiaoTaiSanDao chiTietBanGiaoTaiSanDao;

    @Autowired
    private DieuDongTaiSanDao dieuDongTaiSanDao;

    @Autowired
    private TaiSanDao taiSanDao;

    @Autowired
    private LichSuDieuChuyenTaiSanDao lichSuDieuChuyenTaiSanDao;

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

    // 0:nháp, 1: chờ duyet, 2: hủy, 3: hoàn thành
    public int updateTrangThai(String id, String userId) {
        BanGiaoTaiSan banGiaoTaiSan = findById(id);
        int trangThai = banGiaoTaiSan.getTrangThai();

        System.out.println("id" + id);
        System.out.println("userid" + userId);
        // Nếu có ký nháy ngoài (bên bảng khác)
        int status = updateTrangThaiKy(id, userId);
        if (status == 1) {
            trangThai = 1;
        }

        // don vi giao
        if (Objects.equals(userId, banGiaoTaiSan.getIdDaiDienBenGiao())) {
            System.out.println("ok");
            banGiaoTaiSan.setDaiDienBenGiaoXacNhan(true);
            trangThai = 1;
        }

        // Trình duyệt giám đốc
        if (Objects.equals(userId, banGiaoTaiSan.getIdDaiDienBenNhan())) {
            banGiaoTaiSan.setDaiDienBenNhanXacNhan(true);
            trangThai = 1;
        }
        if (Objects.equals(userId, banGiaoTaiSan.getIdGiamDoc())) {
            banGiaoTaiSan.setGiamDocKy(true);
            trangThai = 1;
        }

        // Kiểm tra đã ký đủ chưa
        boolean allKy = banGiaoTaiSan.getDaiDienBenNhanXacNhan() && banGiaoTaiSan.getDaiDienBenGiaoXacNhan()
                && banGiaoTaiSan.getGiamDocKy();

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        if (allKy) {
            trangThai = 3;
        }
        System.out.println("trangThai = " + trangThai);
        banGiaoTaiSan.setTrangThai(trangThai);
        BanGiaoTaiSan result = update(banGiaoTaiSan);
        if (result != null) {
            this.refreshCache();
            return trangThai;
        }
        return 0;
    }



    public int huyTrangThai(String id) {
        String sql = """
                UPDATE BanGiaoTaiSan
                SET DaiDienBenGiaoXacNhan = 0,
                    DaiDienBenNhanXacNhan = 0,
                    TrangThai =2
                WHERE Id = ?
                """;

        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            this.refreshCache();
        }
        return result;
    }

}
