package com.ecotel.quanlytaisan.dao;

import java.time.LocalDateTime;
import java.time.Year;
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
public class BanGiaoCCDCVatTuDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ChiTietBanGiaoCCDCVatTuDao chiTietBanGiaoCCDCVatTuDao;
    @Autowired
    private ChiTietDieuDongCCDCVatTuDao chiTietDieuDongCCDCVatTuDao;
    @Autowired
    private DieuDongCCDCVatTuDao dieuDongCCDCVatTuDao;

    public List<BanGiaoCCDCVatTuDTO> findAll(String idCongTy) {
        String sql = """
                SELECT bgts.Id,
                       bgts.BanGiaoCCDCVatTu,
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
                FROM BanGiaoCCDCVatTu AS bgts

                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id


                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id
                        LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id

                WHERE bgts.IdCongTy=?;""";
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoCCDCVatTuDTO.class), idCongTy);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            int status = updateDate(banGiaoCCDCVatTuDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoCCDCVatTuDTOList.get(i));
            banGiaoCCDCVatTuDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoCCDCVatTuDTOList.get(i).setTrangThai(2);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> getByUserId(String userId) {
        String sql = """
                SELECT DISTINCT bgts.Id,
                       bgts.BanGiaoCCDCVatTu,
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

                FROM BanGiaoCCDCVatTu AS bgts

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
                        OR (nk.IdNguoiKy = ?)
                    )
                )
                """;
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoCCDCVatTuDTO.class), userId, userId, userId, userId, userId);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            int status = updateDate(banGiaoCCDCVatTuDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoCCDCVatTuDTOList.get(i));
            banGiaoCCDCVatTuDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoCCDCVatTuDTOList.get(i).setTrangThai(2);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> getByUserIdStatus(String userId, int trangThai) {
        String sql = """
                SELECT DISTINCT bgts.Id,
                       bgts.BanGiaoCCDCVatTu,
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

                FROM BanGiaoCCDCVatTu AS bgts

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
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoCCDCVatTuDTO.class), userId, userId, userId, userId, userId,
                trangThai);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            int status = updateDate(banGiaoCCDCVatTuDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoCCDCVatTuDTOList.get(i));
            banGiaoCCDCVatTuDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoCCDCVatTuDTOList.get(i).setTrangThai(2);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> getByStatus(int trangThai) {
        String sql = """
                SELECT bgts.Id,
                       bgts.BanGiaoCCDCVatTu,
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

                FROM BanGiaoCCDCVatTu AS bgts

                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id

                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id
                        LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                                           LEFT JOIN NhanVien as nvGiamDoc ON bgts.IdGiamDoc = nvGiamDoc.Id
                WHERE bgts.TrangThai=?""";
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoCCDCVatTuDTO.class), trangThai);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            int status = updateDate(banGiaoCCDCVatTuDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoCCDCVatTuDTOList.get(i));
            banGiaoCCDCVatTuDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoCCDCVatTuDTOList.get(i).setTrangThai(2);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public int getTrangThaiPhieu(BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO) {
        int trangThai = 0;
        String idNguoiTao = banGiaoCCDCVatTuDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);
        String ngayTao = banGiaoCCDCVatTuDTO.getNgayTao();
        int thoiHanTaiLieu = 60;
        int ngayBaoHetHan = 3;
        if (config != null) {
            thoiHanTaiLieu = config.getThoiHanTaiLieu();
            ngayBaoHetHan = config.getNgayBaoHetHan();
        }

        if (banGiaoCCDCVatTuDTO.getTrangThai() == 3) {
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

    public int updateDate(BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO) {
        String idNguoiTao = banGiaoCCDCVatTuDTO.getNguoiTao();
        Config config = configDao.findByIdAccount(idNguoiTao);
        String ngayTao = banGiaoCCDCVatTuDTO.getNgayTao();
        int soNgay = 60;
        if (config != null) {
            soNgay = config.getThoiHanTaiLieu();
        }
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
        if (daysBetween >= soNgay && banGiaoCCDCVatTuDTO.getTrangThai() != 3) {
            huyTrangThai(banGiaoCCDCVatTuDTO.getId());
            return 1;
        }
        return 0;
    }

    public BanGiaoCCDCVatTu findById(String id) {
        String sql = """
                SELECT *
                FROM BanGiaoCCDCVatTu AS bgts

                WHERE  bgts.Id=?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(BanGiaoCCDCVatTu.class), id);
    }

    public List<BanGiaoCCDCVatTu> findByIdDieuDong(String idDieuDong) {
        String sql = "SELECT * FROM BanGiaoCCDCVatTu WHERE QuyetDinhDieuDongSo = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BanGiaoCCDCVatTu.class), idDieuDong);
    }

    /**
     * Sinh ID tự động theo format: BGDC-Năm hiện tại-STT (3 số)
     * Ví dụ: BGDC-2025-001, BGDC-2025-002, ...
     * Sử dụng bảng Sequence để đảm bảo không bị trùng khi xóa record
     */
    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "BGDC";
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
            String maxSql = "SELECT COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0) FROM BanGiaoCCDCVatTu WHERE Id LIKE ?";
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

    public BanGiaoCCDCVatTu insert(BanGiaoCCDCVatTu entity) {
        // Luôn tự động sinh ID mới, bỏ qua ID từ input
        entity.setId(generateNextId());

        entity.setNgayTao(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        if (entity.getByStep() != null && entity.getByStep()) {
            entity.setGiamDocKy(false);
        }
        String sql = """
                INSERT INTO BanGiaoCCDCVatTu (
                    Id, IdCongTy, BanGiaoCCDCVatTu, QuyetDinhDieuDongSo, LenhDieuDong,
                    IdDonViGiao, IdDonViNhan, NgayBanGiao, IdLanhDao, IdDaiDiendonviBanHanhQD, DaXacNhan,
                    IdDaiDienBenGiao, DaiDienBenGiaoXacNhan,
                    IdDaiDienBenNhan, DaiDienBenNhanXacNhan,
                    TrangThai, Note, NgayTao, NgayCapNhat,
                    NguoiTao, NguoiCapNhat, IsActive, Share, DuongDanFile, TenFile, ByStep, NgayTaoChungTu,
                    IdGiamDoc, GiamDocKy, SoQuyetDinh, NgayQuyetDinh, DiaDiemQuyetDinh, taiLieuBangKe
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """;
        int result = jdbcTemplate.update(sql, entity.getId(), "CT001", entity.getBanGiaoCCDCVatTu(),
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
            // Cập nhật CoPhieuBanGiao = true cho phiếu điều động
            if (entity.getQuyetDinhDieuDongSo() != null && !entity.getQuyetDinhDieuDongSo().isEmpty()) {
                dieuDongCCDCVatTuDao.updateCoPhieuBanGiao(entity.getQuyetDinhDieuDongSo(), true);
            }
        }
        return entity;
    }

    // Update
    public BanGiaoCCDCVatTu update(BanGiaoCCDCVatTu entity) {
        String sql = """
                UPDATE BanGiaoCCDCVatTu
                SET IdCongTy=?, BanGiaoCCDCVatTu=?, QuyetDinhDieuDongSo=?, LenhDieuDong=?,
                    IdDonViGiao=?, IdDonViNhan=?, NgayBanGiao=?, IdLanhDao=?, IdDaiDiendonviBanHanhQD=?, DaXacNhan=?,
                    IdDaiDienBenGiao=?, DaiDienBenGiaoXacNhan=?,
                    IdDaiDienBenNhan=?, DaiDienBenNhanXacNhan=?,
                    TrangThai=?, Note=?, NgayTao=?, NgayCapNhat=?,
                    NguoiTao=?, NguoiCapNhat=?, IsActive=?, Share=?, DuongDanFile=?, TenFile=?, ByStep=?, NgayTaoChungTu=?,
                    IdGiamDoc=?, GiamDocKy=?, SoQuyetDinh=?, NgayQuyetDinh=?, DiaDiemQuyetDinh=?, taiLieuBangKe=?
                WHERE Id=?
                """;

        int result = jdbcTemplate.update(sql, "CT001", entity.getBanGiaoCCDCVatTu(),
                entity.getQuyetDinhDieuDongSo(), entity.getLenhDieuDong(), entity.getIdDonViGiao(),
                entity.getIdDonViNhan(), entity.getNgayBanGiao(), entity.getIdLanhDao(),
                entity.getIdDaiDiendonviBanHanhQD(), entity.getDaXacNhan(), entity.getIdDaiDienBenGiao(),
                entity.getDaiDienBenGiaoXacNhan(), entity.getIdDaiDienBenNhan(), entity.getDaiDienBenNhanXacNhan(),
                entity.getTrangThai(), entity.getNote(), entity.getNgayTao(), entity.getNgayCapNhat(),
                entity.getNguoiTao(), entity.getNguoiCapNhat(), entity.getIsActive(), entity.getShare(),
                entity.getDuongDanFile(), entity.getTenFile(), entity.getByStep(), entity.getNgayTaoChungTu(),
                entity.getIdGiamDoc(), entity.getGiamDocKy(), entity.getSoQuyetDinh(), entity.getNgayQuyetDinh(),
                entity.getDiaDiemQuyetDinh(), entity.getTaiLieuBangKe(), entity.getId());
        return result > 0 ? findById(entity.getId()) : null;
    }

    public int delete(String id) {
        // Lấy thông tin phiếu trước khi xóa để biết QuyetDinhDieuDongSo
        BanGiaoCCDCVatTu entity = findById(id);
        String quyetDinhDieuDongSo = entity != null ? entity.getQuyetDinhDieuDongSo() : null;

        String sql = "DELETE FROM BanGiaoCCDCVatTu WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            // Cập nhật CoPhieuBanGiao = false cho phiếu điều động nếu không còn phiếu bàn giao nào khác sử dụng
            if (quyetDinhDieuDongSo != null && !quyetDinhDieuDongSo.isEmpty()) {
                int remainingCount = countByQuyetDinhDieuDongSo(quyetDinhDieuDongSo);
                if (remainingCount == 0) {
                    dieuDongCCDCVatTuDao.updateCoPhieuBanGiao(quyetDinhDieuDongSo, false);
                }
            }
        }
        return result;
    }

    /**
     * Đếm số lượng phiếu bàn giao CCDC/Vật tư sử dụng một phiếu điều động
     */
    public int countByQuyetDinhDieuDongSo(String quyetDinhDieuDongSo) {
        String sql = "SELECT COUNT(*) FROM BanGiaoCCDCVatTu WHERE QuyetDinhDieuDongSo = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, quyetDinhDieuDongSo);
        return count != null ? count : 0;
    }

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

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
        System.out.println("==== updateTrangThai START ====");
        System.out.println("Input id: " + id + ", userId: " + userId);

        BanGiaoCCDCVatTu banGiaoCCDCVatTu = findById(id);
        int trangThai = banGiaoCCDCVatTu.getTrangThai();
        System.out.println("Ban đầu trangThai = " + trangThai);

        // Nếu có ký nháy ngoài (bên bảng khác)
        int status = updateTrangThaiKy(id, userId);
        System.out.println("updateTrangThaiKy return = " + status);
        if (status == 1) {
            trangThai = 1;
            System.out.println("TrangThai set từ ký ngoài = " + trangThai);
        }

        // don vi giao
        if (Objects.equals(userId, banGiaoCCDCVatTu.getIdDaiDienBenGiao())) {
            banGiaoCCDCVatTu.setDaiDienBenGiaoXacNhan(true);
            trangThai = 1;
            System.out.println("Xác nhận bởi Đại diện bên Giao -> trangThai = " + trangThai);
        }

        // Trình duyệt giám đốc
        if (Objects.equals(userId, banGiaoCCDCVatTu.getIdDaiDienBenNhan())) {
            banGiaoCCDCVatTu.setDaiDienBenNhanXacNhan(true);
            trangThai = 1;
            System.out.println("Xác nhận bởi Đại diện bên Nhận -> trangThai = " + trangThai);
        }

        if (Objects.equals(userId, banGiaoCCDCVatTu.getIdGiamDoc())) {
            banGiaoCCDCVatTu.setGiamDocKy(true);
            trangThai = 1;

        }
        // Kiểm tra đã ký đủ chưa
        boolean allKy = banGiaoCCDCVatTu.getDaiDienBenNhanXacNhan() && banGiaoCCDCVatTu.getDaiDienBenGiaoXacNhan()
                && banGiaoCCDCVatTu.getGiamDocKy();
        System.out.println("Check all ký (3 bên) = " + allKy);

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
            System.out.println("Check allOtherNguoiKy = " + allKy);
        }

        if (allKy) {
            trangThai = 3;
            System.out.println("Tất cả đã ký -> trangThai = " + trangThai);
            updateSoLuongBanGiao(banGiaoCCDCVatTu.getLenhDieuDong(), banGiaoCCDCVatTu.getId());
        }

        banGiaoCCDCVatTu.setTrangThai(trangThai);
        System.out.println("Final trangThai set = " + trangThai);

        BanGiaoCCDCVatTu result = update(banGiaoCCDCVatTu);
        System.out.println("Update DB result = " + result);

        if (result != null) {
            System.out.println("==== updateTrangThai SUCCESS, return = " + trangThai + " ====");
            return trangThai;
        }
        System.out.println("==== updateTrangThai FAIL, return = 0 ====");
        return 0;
    }

    private void updateSoLuongBanGiao(String idDieuDong, String idBanGiao) {
        System.out.println("==== updateSoLuongBanGiao START ====");
        System.out.println("Input idDieuDong = " + idDieuDong + ", idBanGiao = " + idBanGiao);

        DieuDongCCDCVatTu dieuDongCCDCVatTu = dieuDongCCDCVatTuDao.findById(idDieuDong);
        System.out.println("Tìm thấy dieuDongCCDCVatTu: " + dieuDongCCDCVatTu);

        List<ChiTietDieuDongCCDCVatTu> chiTietDieuDongCCDCVatTuDTOList = chiTietDieuDongCCDCVatTuDao
                .findAllChiTietDD(dieuDongCCDCVatTu.getId());
        System.out.println("Số lượng chi tiết Điều động = " + chiTietDieuDongCCDCVatTuDTOList.size());

        List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOList = chiTietBanGiaoCCDCVatTuDao.findAll(idBanGiao);
        System.out.println("Số lượng chi tiết Bàn giao = " + chiTietBanGiaoCCDCVatTuDTOList.size());

        for (ChiTietBanGiaoCCDCVatTuDTO chiTietBanGiaoCCDCVatTuDTO : chiTietBanGiaoCCDCVatTuDTOList) {
            System.out.println(
                    "--> Đang xử lý chiTietBanGiao: IdCCDCVatTu = " + chiTietBanGiaoCCDCVatTuDTO.getIdCCDCVatTu()
                            + ", SoLuong = " + chiTietBanGiaoCCDCVatTuDTO.getSoLuong());

            for (ChiTietDieuDongCCDCVatTu chiTietDieuDongCCDCVatTuDTO : chiTietDieuDongCCDCVatTuDTOList) {
                System.out.println(
                        "   So sánh với chiTietDieuDong: IdCCDCVatTu = " + chiTietDieuDongCCDCVatTuDTO.getIdCCDCVatTu()
                                + ", SoLuongXuat = " + chiTietDieuDongCCDCVatTuDTO.getSoLuongXuat()
                                + ", SoLuongDaBanGiao = " + chiTietDieuDongCCDCVatTuDTO.getSoLuongDaBanGiao());

                if (chiTietBanGiaoCCDCVatTuDTO.getIdCCDCVatTu().equals(chiTietDieuDongCCDCVatTuDTO.getIdCCDCVatTu())) {
                    double soLuongDaBanGiao = chiTietDieuDongCCDCVatTuDTO.getSoLuongDaBanGiao()
                            + chiTietBanGiaoCCDCVatTuDTO.getSoLuong();
                    double soLuongCon = chiTietDieuDongCCDCVatTuDTO.getSoLuongXuat()
                            - chiTietBanGiaoCCDCVatTuDTO.getSoLuong();

                    System.out.println("   MATCH -> Update số lượng:");
                    System.out.println("      soLuongDaBanGiao (mới) = " + soLuongDaBanGiao);
                    System.out.println("      soLuongCon (mới) = " + soLuongCon);

                    chiTietDieuDongCCDCVatTuDTO.setSoLuongDaBanGiao(soLuongDaBanGiao);
                    // chiTietDieuDongCCDCVatTuDTO.setSoLuongXuat((int) soLuongCon);

                    int rs = chiTietDieuDongCCDCVatTuDao.update(chiTietDieuDongCCDCVatTuDTO);
                    System.out.println("      Update DB result = " + rs);
                }
            }
        }

        System.out.println("==== updateSoLuongBanGiao END ====");
    }

    public int huyTrangThai(String id) {
        String sql = """
                UPDATE BanGiaoCCDCVatTu
                SET DaiDienBenGiaoXacNhan = 0,
                    DaiDienBenNhanXacNhan = 0,
                    TrangThai =2
                WHERE Id = ?
                """;

        return jdbcTemplate.update(sql, id);
    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM BanGiaoCCDCVatTu bgts WHERE bgts.IdCongTy = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public Map<Integer, Long> getCountByTrangThai(String idCongTy) {
        String sql = """
                SELECT bgts.TrangThai, COUNT(*) AS soLuong
                FROM BanGiaoCCDCVatTu bgts
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
                FROM BanGiaoCCDCVatTu bgts
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

    public List<BanGiaoCCDCVatTuDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy,
            String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        String orderColumn;
        switch (normalizedSortBy) {
            case "banggiaoccdcvattu":
                orderColumn = "bgts.BanGiaoCCDCVatTu";
                break;
            case "quyetdinhdieudongso":
                orderColumn = "bgts.QuyetDinhDieuDongSo";
                break;
            case "ngaybangiao":
                orderColumn = "bgts.NgayBanGiao";
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
                       bgts.BanGiaoCCDCVatTu,
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
                FROM BanGiaoCCDCVatTu AS bgts

                -- JOIN Phòng ban
                         LEFT JOIN PhongBan AS pbGiao ON bgts.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON bgts.IdDonViNhan = pbNhan.Id

                -- JOIN Nhân viên
                         LEFT JOIN NhanVien AS nvLanhDao ON bgts.IdLanhDao = nvLanhDao.Id
                         LEFT JOIN NhanVien AS nvBenGiao ON bgts.IdDaiDienBenGiao = nvBenGiao.Id
                         LEFT JOIN NhanVien AS nvBenNhan ON bgts.IdDaiDienBenNhan = nvBenNhan.Id

                WHERE bgts.IdCongTy = ?
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """.formatted(orderColumn, direction);

        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(BanGiaoCCDCVatTuDTO.class), idCongTy, limit, offset);

        // Apply the same processing logic as in findAll method
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            int status = updateDate(banGiaoCCDCVatTuDTOList.get(i));
            int trangThaiPhieu = getTrangThaiPhieu(banGiaoCCDCVatTuDTOList.get(i));
            banGiaoCCDCVatTuDTOList.get(i).setTrangThaiPhieu(trangThaiPhieu);
            if (status > 0) {
                banGiaoCCDCVatTuDTOList.get(i).setTrangThai(2);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenGiaoXacNhan(false);
                banGiaoCCDCVatTuDTOList.get(i).setDaiDienBenNhanXacNhan(false);
            }
        }

        return banGiaoCCDCVatTuDTOList;
    }

}
