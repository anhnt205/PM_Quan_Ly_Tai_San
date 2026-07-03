package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.BanGiaoCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietBanGiaoCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.BanGiaoCCDCVatTu;
import com.ecotel.quanlytaisan.model.BanGiaoCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.NguoiKy;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTu;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenCCDCVatTuDTO;
import com.ecotel.quanlytaisan.dao.DieuDongCCDCVatTuDao;
import com.ecotel.quanlytaisan.service.LichSuDieuChuyenCCDCVatTuService;
import com.ecotel.quanlytaisan.service.ChiTietDonViSoHuuService;
import com.ecotel.quanlytaisan.service.S3Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.Objects;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class BanGiaoCCDCVatTuService {
    @Autowired
    private BanGiaoCCDCVatTuDao dao;

    @Autowired
    private ChiTietBanGiaoCCDCVatTuDao chiTietBanGiaoCCDCVatTuDao;

    @Autowired
    KyTaiLieuDao kyTaiLieuDao;

    @Autowired
    private ChiTietDonViSoHuuService chiTietDonViSoHuuService;

    @Autowired
    private LichSuDieuChuyenCCDCVatTuService lichSuDieuChuyenCCDCVatTuService;

    @Autowired
    private DieuDongCCDCVatTuDao dieuDongCCDCVatTuDao;

    @Autowired
    private S3Service s3Service;

    public BanGiaoCCDCVatTuService() {
    }

    public List<BanGiaoCCDCVatTuDTO> getByUserId(String userId) throws SQLException {
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = dao.getByUserId(userId);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = banGiaoCCDCVatTuDTOList.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            banGiaoCCDCVatTuDTOList.set(i, banGiaoCCDCVatTuDTO);
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> getByUserIdStatus(String userId, int trangThai) throws SQLException {
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = dao.getByUserIdStatus(userId, trangThai);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = banGiaoCCDCVatTuDTOList.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            banGiaoCCDCVatTuDTOList.set(i, banGiaoCCDCVatTuDTO);
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> getByStatus(int trangThai) throws SQLException {
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = dao.getByStatus(trangThai);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = banGiaoCCDCVatTuDTOList.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            banGiaoCCDCVatTuDTOList.set(i, banGiaoCCDCVatTuDTO);
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> findAll(String idCongTy) {
        return dao.findAll(idCongTy);
    }

    public PageResponse<BanGiaoCCDCVatTuDTO> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search, String userid, Integer trangThai, String idDonViGiao, Boolean isSign) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<BanGiaoCCDCVatTuDTO> sourceList;
        sourceList = findAll(idCongTy);

        // Filter theo lượt ký - chỉ lấy những item mà đến lượt user ký
        // Ngoại lệ: admin lấy hết, NguoiTao cũng lấy không phân biệt thứ tự
        if (userid != null && !userid.trim().isEmpty()) {
            boolean shouldFilter = !"admin".equalsIgnoreCase(userid) || (isSign != null && isSign);
            if (shouldFilter) {
                List<BanGiaoCCDCVatTuDTO> filtered = new ArrayList<>();
                for (BanGiaoCCDCVatTuDTO item : sourceList) {
                    if (isSign != null && isSign) {
                        if (isNeedToSign(item, userid)) {
                            filtered.add(item);
                        }
                    } else {
                        if (isUserTurnToSign(item, userid)) {
                            filtered.add(item);
                        }
                    }
                }
                sourceList = filtered;
            }
        }

        // Filter by idDonViGiao if provided
        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty()) {
            List<BanGiaoCCDCVatTuDTO> donViGiaoFiltered = new ArrayList<>();
            for (BanGiaoCCDCVatTuDTO item : sourceList) {
                if (item != null && item.getIdDonViGiao() != null && item.getIdDonViGiao().equals(idDonViGiao)) {
                    donViGiaoFiltered.add(item);
                }
            }
            sourceList = donViGiaoFiltered;
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            List<BanGiaoCCDCVatTuDTO> filtered = new ArrayList<>();
            for (BanGiaoCCDCVatTuDTO item : sourceList) {
                if (item != null && item.toString() != null && item.toString().toLowerCase().contains(q)) {
                    filtered.add(item);
                }
            }
            sourceList = filtered;
        }

        // --- TÍNH TOÁN COUNTS (Trước khi lọc trạng thái) ---
        Map<String, Long> groupCounts = new java.util.HashMap<>();
        for (BanGiaoCCDCVatTuDTO item : sourceList) {
            if (item != null && item.getTrangThai() != null) {
                String key = item.getTrangThai().toString();
                groupCounts.put(key, groupCounts.getOrDefault(key, 0L) + 1);
            }
        }

        // Filter by trangThaiPhieu if trangThai != 4
        if (trangThai != null && trangThai != 4) {
            List<BanGiaoCCDCVatTuDTO> trangThaiFiltered = new ArrayList<>();
            for (BanGiaoCCDCVatTuDTO item : sourceList) {
                if (item != null && item.getTrangThai() != null && item.getTrangThai().equals(trangThai)) {
                    trangThaiFiltered.add(item);
                }
            }
            sourceList = trangThaiFiltered;
        }

        // Apply sorting
        sourceList.sort(getComparator(sortBy, sortDir));
        
        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<BanGiaoCCDCVatTuDTO> items = sourceList.subList(from, to);
        if (kyTaiLieuDao != null) {
            for (BanGiaoCCDCVatTuDTO item : items) {
                item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
                item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
            }
        }
        for (int i = 0; i < items.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = items.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            items.set(i, banGiaoCCDCVatTuDTO);
        }
        PageResponse<BanGiaoCCDCVatTuDTO> response = new PageResponse<>(items, total, page, size);
        response.setGroupCounts(groupCounts);
        return response;
    }

    private Comparator<BanGiaoCCDCVatTuDTO> getComparator(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> priorityMap = new HashMap<>();
            priorityMap.put(0, 1); // Nháp
            priorityMap.put(1, 2); // Duyệt
            priorityMap.put(3, 3); // Hoàn thành
            priorityMap.put(2, 4); // Hủy

            Comparator<BanGiaoCCDCVatTuDTO> comparator = Comparator.comparingInt(
                    item -> priorityMap.getOrDefault(item.getTrangThai(), 5)
            );

            // Sau đó so sánh theo ngày tạo (mới nhất trước)
            comparator = comparator.thenComparing(
                    item -> item.getNgayTao() != null ? item.getNgayTao() : "",
                    Comparator.nullsLast(Comparator.reverseOrder())
            );
            return comparator;
        }

        // Nếu có sortBy, xử lý như cũ
        String normalizedSortBy = sortBy.trim().toLowerCase();
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");
        
        Comparator<BanGiaoCCDCVatTuDTO> comparator = null;
        
        switch (normalizedSortBy) {
            case "bangiaoccdcvatTu":
                comparator = Comparator.comparing(
                    item -> item.getBanGiaoCCDCVatTu() != null ? item.getBanGiaoCCDCVatTu() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "quyetdinhdieudongso":
                comparator = Comparator.comparing(
                    item -> item.getQuyetDinhDieuDongSo() != null ? item.getQuyetDinhDieuDongSo() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaybangiao":
                comparator = Comparator.comparing(
                    item -> item.getNgayBanGiao() != null ? item.getNgayBanGiao() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaytao":
                comparator = Comparator.comparing(
                    item -> item.getNgayTao() != null ? item.getNgayTao() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaycapnhat":
            default:
                comparator = Comparator.comparing(
                    item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "trangthai":
                comparator = Comparator.comparing(
                    item -> item.getTrangThai() != null ? item.getTrangThai() : 0,
                    Comparator.nullsLast(Integer::compareTo)
                );
                break;
            case "tendonvigiao":
                comparator = Comparator.comparing(
                    item -> item.getTenDonViGiao() != null ? item.getTenDonViGiao() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "tendonvinhan":
                comparator = Comparator.comparing(
                    item -> item.getTenDonViNhan() != null ? item.getTenDonViNhan() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
        }
        
        if (comparator == null) {
            // Default to ngayCapNhat
            comparator = Comparator.comparing(
                item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
            );
        }
        
        return ascending ? comparator : comparator.reversed();
    }

    public BanGiaoCCDCVatTu findById(String id) {
        return dao.findById(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public BanGiaoCCDCVatTu insert(BanGiaoCCDCVatTu obj) {
        if (obj.getId() == null || obj.getId().isEmpty()) {
            obj.setId(UUID.randomUUID().toString());
        }
        BanGiaoCCDCVatTu result = dao.insert(obj);
        if (result != null) {
            if (obj.getChiTietBanGiaoCCDCVatTu() != null && !obj.getChiTietBanGiaoCCDCVatTu().isEmpty()) {
                for (ChiTietBanGiaoCCDCVatTu ct : obj.getChiTietBanGiaoCCDCVatTu()) {
                    if (ct.getId() == null || ct.getId().isEmpty()) {
                        ct.setId(UUID.randomUUID().toString());
                    }
                    ct.setIdBanGiaoCCDCVatTu(result.getId());
                }
                chiTietBanGiaoCCDCVatTuDao.batchInsert(obj.getChiTietBanGiaoCCDCVatTu());
            }
            if (obj.getNguoiKyList() != null) {
                for (NguoiKy nk : obj.getNguoiKyList()) {
                    if (nk.getId() == null || nk.getId().isEmpty()) {
                        nk.setId(UUID.randomUUID().toString());
                    }
                    nk.setIdTaiLieu(result.getId());
                }
                kyTaiLieuDao.insertNguoiKyBatch(obj.getNguoiKyList());
            }

            System.out.println("result.getTrangThai(): " + result.getTrangThai());
            if (result.getTrangThai() != null && result.getTrangThai() == 3) {
                dao.updateSoLuongBanGiao(result.getLenhDieuDong(), result.getId());
                handleHoanThanhBanGiao(result.getId());
            }
        }
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    public BanGiaoCCDCVatTu update(BanGiaoCCDCVatTu obj) {
        BanGiaoCCDCVatTu oldObj = null;
        try {
            oldObj = dao.findById(obj.getId());
        } catch (Exception e) {
            System.err.println("Error finding old BanGiaoCCDCVatTu: " + e.getMessage());
        }

        List<String> keysToDelete = new ArrayList<>();
        if (oldObj != null) {
            if (oldObj.getDuongDanFile() != null && !oldObj.getDuongDanFile().isEmpty()
                    && !oldObj.getDuongDanFile().equals(obj.getDuongDanFile())) {
                keysToDelete.add(oldObj.getDuongDanFile());
            }
            if (oldObj.getTaiLieuBangKe() != null && !oldObj.getTaiLieuBangKe().isEmpty()
                    && !oldObj.getTaiLieuBangKe().equals(obj.getTaiLieuBangKe())) {
                keysToDelete.add(oldObj.getTaiLieuBangKe());
            }
        }

        BanGiaoCCDCVatTu result = dao.update(obj);
        
        if (result != null) {
            List<ChiTietBanGiaoCCDCVatTuDTO> currentDetails = chiTietBanGiaoCCDCVatTuDao.findAll(result.getId());
            if (currentDetails != null && !currentDetails.isEmpty()) {
                for (ChiTietBanGiaoCCDCVatTuDTO ct : currentDetails) {
                    chiTietBanGiaoCCDCVatTuDao.delete(ct.getId());
                }
            }

            if (obj.getChiTietBanGiaoCCDCVatTu() != null && !obj.getChiTietBanGiaoCCDCVatTu().isEmpty()) {
                for (ChiTietBanGiaoCCDCVatTu ct : obj.getChiTietBanGiaoCCDCVatTu()) {
                    if (ct.getId() == null || ct.getId().isEmpty()) {
                        ct.setId(UUID.randomUUID().toString());
                    }
                    ct.setIdBanGiaoCCDCVatTu(result.getId());
                }
                chiTietBanGiaoCCDCVatTuDao.batchInsert(obj.getChiTietBanGiaoCCDCVatTu());
            }
            
            if (obj.getNguoiKyList() != null) {
                for (NguoiKy nk : obj.getNguoiKyList()) {
                    if (nk.getId() == null || nk.getId().isEmpty()) {
                        nk.setId(UUID.randomUUID().toString());
                    }
                    nk.setIdTaiLieu(result.getId());
                }
                kyTaiLieuDao.updateNguoiKy(result.getId(), obj.getNguoiKyList());
            }

            if (!keysToDelete.isEmpty()) {
                TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            for (String key : keysToDelete) {
                                try {
                                    s3Service.deleteFile(key);
                                } catch (Exception e) {
                                    System.err.println("Lỗi xóa file S3 (Bàn giao CCDC) cũ: " + key);
                                }
                            }
                        }
                    }
                );
            }

            if (oldObj != null && oldObj.getTrangThai() != null && oldObj.getTrangThai() != 3 
                && result.getTrangThai() != null && result.getTrangThai() == 3) {
                dao.updateSoLuongBanGiao(result.getLenhDieuDong(), result.getId());
                handleHoanThanhBanGiao(result.getId());
            }
        }
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    public int delete(String id) {
        BanGiaoCCDCVatTu oldObj = null;
        List<String> keysToDelete = new ArrayList<>();

        try {
            oldObj = dao.findById(id);
            if (oldObj != null) {
                if (oldObj.getDuongDanFile() != null && !oldObj.getDuongDanFile().isEmpty()) {
                    keysToDelete.add(oldObj.getDuongDanFile());
                }
                if (oldObj.getTaiLieuBangKe() != null && !oldObj.getTaiLieuBangKe().isEmpty()) {
                    keysToDelete.add(oldObj.getTaiLieuBangKe());
                }
            }
        } catch (Exception e) {}

        if (oldObj != null) {
            List<ChiTietBanGiaoCCDCVatTuDTO> details = chiTietBanGiaoCCDCVatTuDao.findAll(id);
            if (details != null && !details.isEmpty()) {
                for (ChiTietBanGiaoCCDCVatTuDTO ct : details) {
                    chiTietBanGiaoCCDCVatTuDao.delete(ct.getId());
                }
            }
            kyTaiLieuDao.deleteAllNguoiKy(id);
            kyTaiLieuDao.delete(id);
        }

        int res = dao.delete(id);

        if (res > 0 && oldObj != null) {
            TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        for (String key : keysToDelete) {
                            try {
                                s3Service.deleteFile(key);
                            } catch (Exception e) {
                                // ignore
                            }
                        }
                    }
                }
            );
        }

        return res;
    }

    @Transactional(rollbackFor = Exception.class)
    public int updateTrangThai(String id, String userId) {
        int trangThai = dao.updateTrangThai(id, userId);
        if (trangThai == 3) {
            handleHoanThanhBanGiao(id);
        }
        return trangThai;
    }

    private void handleHoanThanhBanGiao(String idBanGiaoCCDCVatTu) {
        BanGiaoCCDCVatTu banGiao = dao.findById(idBanGiaoCCDCVatTu);
        if (banGiao == null) return;

        String idDonViNhan = banGiao.getIdDonViNhan();
        String idDonViGiao = banGiao.getIdDonViGiao();
        String lenhDieuDong = banGiao.getLenhDieuDong();
        String soQuyetDinh = banGiao.getSoQuyetDinh();

        List<ChiTietBanGiaoCCDCVatTuDTO> chiTietList = chiTietBanGiaoCCDCVatTuDao.findAll(idBanGiaoCCDCVatTu);
        List<LichSuDieuChuyenCCDCVatTuDTO> lichSuList = new ArrayList<>();
        String thoiGianBanGiao = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

        for (ChiTietBanGiaoCCDCVatTuDTO chiTiet : chiTietList) {
            chiTietDonViSoHuuService.updateSoLuong(
                chiTiet.getIdCCDCVatTu(), 
                idDonViGiao, 
                idDonViNhan,
                chiTiet.getSoLuong(), 
                idBanGiaoCCDCVatTu, 
                chiTiet.getSoChungTu(), 
                thoiGianBanGiao, 
                chiTiet.getIdChiTietCCDCVatTu()
            );

            LichSuDieuChuyenCCDCVatTuDTO ls = new LichSuDieuChuyenCCDCVatTuDTO();
            ls.setId(UUID.randomUUID().toString());
            ls.setIdBanGiaoCCDCVatTu(idBanGiaoCCDCVatTu);
            ls.setIdCCDCVatTu(chiTiet.getIdCCDCVatTu());
            ls.setIdChiTietCCDCVatTu(chiTiet.getIdChiTietCCDCVatTu());
            ls.setIdDonViNhan(idDonViNhan);
            ls.setIdDonViGiao(idDonViGiao);
            ls.setSoLuong(chiTiet.getSoLuong());
            ls.setThoiGianBanGiao(thoiGianBanGiao);
            lichSuList.add(ls);
        }

        if (!lichSuList.isEmpty()) {
            lichSuDieuChuyenCCDCVatTuService.createBatch(lichSuList);
        }

        if (lenhDieuDong != null && !lenhDieuDong.isEmpty()) {
            dieuDongCCDCVatTuDao.updateTrangThaiBanGiao(lenhDieuDong, true);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public int huyTrangThai(String id) {
        kyTaiLieuDao.delete(id);
        return dao.huyTrangThai(id);
    }

    /**
     * Kiểm tra xem có phải lượt ký của user không
     * Thứ tự ký:
     * 1. Đại diện bên giao (check userId với IdDaiDienBenGiao)
     * 2. Đại diện bên nhận (sau khi DaiDienBenGiaoXacNhan = true)
     * 3. NguoiKy từ bảng NguoiKy (sau khi DaiDienBenNhanXacNhan = true)
     * 4. Giám đốc ký (sau khi toàn bộ NguoiKy TrangThai = 1)
     *
     * Điều kiện:
     * - Share phải = true để hiển thị phiếu
     * - Admin và NguoiTao luôn được xem
     * - Người đã hoàn thành bước của mình vẫn hiển thị
     *
     * Ngoại lệ:
     * - userId = "admin" → lấy hết
     * - userId = NguoiTao → lấy không phân biệt thứ tự
     */
    public boolean isNeedToSign(BanGiaoCCDCVatTuDTO item, String userId) {
        if (userId == null || userId.isEmpty()) return false;
        
        // ===== Trạng thái nháp/hoàn thành/hủy bỏ (trangThai 2, 3 bỏ qua) =====
        if (item.getTrangThai() != null && (item.getTrangThai() == 2 || item.getTrangThai() == 3)) {
            return false;
        }

        // ===== Kiểm tra điều kiện share / người tạo ký trước khi share =====
        if (!Boolean.TRUE.equals(item.getShare())) {
            // Nếu chưa share, chỉ cho phép ký nếu userId là người tạo trùng với người ký đầu tiên và người đó chưa ký.
            boolean isCreatorAndFirstSigner = false;

            // 1. Kiểm tra bên giao (người ký đầu tiên)
            if (item.getIdDaiDienBenGiao() != null && !item.getIdDaiDienBenGiao().isEmpty()) {
                if (userId.equalsIgnoreCase(item.getNguoiTao()) && userId.equalsIgnoreCase(item.getIdDaiDienBenGiao())) {
                    if (!Boolean.TRUE.equals(item.getDaiDienBenGiaoXacNhan())) {
                        isCreatorAndFirstSigner = true;
                    }
                }
            } else if (item.getIdDaiDienBenNhan() != null && !item.getIdDaiDienBenNhan().isEmpty()) {
                // 2. Nếu không có bên giao, bên nhận là người ký đầu tiên
                if (userId.equalsIgnoreCase(item.getNguoiTao()) && userId.equalsIgnoreCase(item.getIdDaiDienBenNhan())) {
                    if (!Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())) {
                        isCreatorAndFirstSigner = true;
                    }
                }
            } else {
                // 3. Nếu không có cả hai, kiểm tra người ký đầu tiên trong danh sách NguoiKy
                List<NguoiKy> kyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
                if (kyList != null && !kyList.isEmpty()) {
                    kyList.sort((a, b) -> {
                        String idA = a.getId() != null ? a.getId() : "";
                        String idB = b.getId() != null ? b.getId() : "";
                        return idA.compareTo(idB);
                    });
                    
                    NguoiKy firstUnsigned = null;
                    for (NguoiKy nk : kyList) {
                        if (nk.getTrangThai() != 1) {
                            firstUnsigned = nk;
                            break;
                        }
                    }
                    if (firstUnsigned != null) {
                        if (userId.equalsIgnoreCase(item.getNguoiTao()) && userId.equalsIgnoreCase(firstUnsigned.getIdNguoiKy())) {
                            isCreatorAndFirstSigner = true;
                        }
                    }
                }
            }

            if (!isCreatorAndFirstSigner) {
                return false;
            }
        }

        // ===== Lượt ký tuần tự =====

        // 1. Đại diện bên giao
        if (item.getIdDaiDienBenGiao() != null && !item.getIdDaiDienBenGiao().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getDaiDienBenGiaoXacNhan())) {
                return userId.equalsIgnoreCase(item.getIdDaiDienBenGiao());
            }
        }

        // 2. Đại diện bên nhận
        boolean benGiaoDone = item.getIdDaiDienBenGiao() == null || item.getIdDaiDienBenGiao().isEmpty() || Boolean.TRUE.equals(item.getDaiDienBenGiaoXacNhan());
        if (benGiaoDone && item.getIdDaiDienBenNhan() != null && !item.getIdDaiDienBenNhan().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())) {
                return userId.equalsIgnoreCase(item.getIdDaiDienBenNhan());
            }
        }

        // 3. Danh sách người ký (kyList)
        boolean benNhanDone = benGiaoDone && (item.getIdDaiDienBenNhan() == null || item.getIdDaiDienBenNhan().isEmpty() || Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan()));
        if (benNhanDone) {
            List<NguoiKy> kyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
            if (kyList != null && !kyList.isEmpty()) {
                kyList.sort((a, b) -> {
                    String idA = a.getId() != null ? a.getId() : "";
                    String idB = b.getId() != null ? b.getId() : "";
                    return idA.compareTo(idB);
                });

                NguoiKy firstUnsigned = null;
                boolean allSigned = true;
                for (NguoiKy nk : kyList) {
                    if (nk.getTrangThai() != 1) {
                        allSigned = false;
                        if (firstUnsigned == null) firstUnsigned = nk;
                    }
                }
                if (firstUnsigned != null) return userId.equalsIgnoreCase(firstUnsigned.getIdNguoiKy());
                
                // 4. Giám đốc ký (sau khi tất cả NguoiKy đã ký)
                if (allSigned && item.getIdGiamDoc() != null && !item.getIdGiamDoc().isEmpty()) {
                    if (!Boolean.TRUE.equals(item.getGiamDocKy())) {
                        return userId.equalsIgnoreCase(item.getIdGiamDoc());
                    }
                }
            } else {
                // Không có người ký trong danh sách, chuyển thẳng sang Giám đốc
                if (item.getIdGiamDoc() != null && !item.getIdGiamDoc().isEmpty()) {
                    if (!Boolean.TRUE.equals(item.getGiamDocKy())) {
                        return userId.equalsIgnoreCase(item.getIdGiamDoc());
                    }
                }
            }
        }

        return false;
    }

    public boolean isUserTurnToSign(BanGiaoCCDCVatTuDTO item, String userId) {
        // Người tạo luôn được xem
        if (userId != null && userId.equals(item.getNguoiTao())) {
            return true;
        }

        // Kiểm tra điều kiện Share = true (trừ admin và người tạo)
        if (!Boolean.TRUE.equals(item.getShare())) {
            return false;
        }

        // Bước 1: Đại diện bên giao
        if (!Boolean.TRUE.equals(item.getDaiDienBenGiaoXacNhan())) {
            // Chỉ đại diện bên giao mới thấy
            return userId != null && userId.equals(item.getIdDaiDienBenGiao());
        }
        // Đại diện bên giao đã ký vẫn được xem
        if (userId != null && userId.equals(item.getIdDaiDienBenGiao())) {
            return true;
        }

        // Bước 2: Đại diện bên nhận (sau khi bên giao đã ký)
        if (Boolean.TRUE.equals(item.getDaiDienBenGiaoXacNhan()) && !Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())) {
            // Chỉ đại diện bên nhận mới thấy
            return userId != null && userId.equals(item.getIdDaiDienBenNhan());
        }
        // Đại diện bên nhận đã ký vẫn được xem
        if (Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())
            && userId != null && userId.equals(item.getIdDaiDienBenNhan())) {
            return true;
        }

        // Bước 3: NguoiKy từ bảng NguoiKy (sau khi bên nhận đã ký) - ký theo thứ tự
        if (Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())) {
            // Lấy danh sách người ký theo IdTaiLieu
            List<NguoiKy> nguoiKyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());

            if (nguoiKyList != null && !nguoiKyList.isEmpty()) {
                // Tìm người ký đầu tiên chưa ký (theo thứ tự trong danh sách)
                NguoiKy firstUnsignedNguoiKy = null;
                boolean allNguoiKySigned = true;

                for (NguoiKy nguoiKy : nguoiKyList) {
                    if (nguoiKy.getTrangThai() != 1) {
                        allNguoiKySigned = false;
                        if (firstUnsignedNguoiKy == null) {
                            firstUnsignedNguoiKy = nguoiKy;
                        }
                    }
                }

                // Kiểm tra xem user có phải là người ký trong danh sách không
                boolean isUserInNguoiKyList = false;
                boolean userAlreadySigned = false;
                for (NguoiKy nguoiKy : nguoiKyList) {
                    if (userId != null && userId.equals(nguoiKy.getIdNguoiKy())) {
                        isUserInNguoiKyList = true;
                        if (nguoiKy.getTrangThai() == 1) {
                            userAlreadySigned = true;
                        }
                        break;
                    }
                }

                // Nếu user đã ký rồi thì vẫn hiển thị
                if (userAlreadySigned) {
                    return true;
                }

                // Chỉ người ký tiếp theo (đầu tiên chưa ký) mới thấy
                if (firstUnsignedNguoiKy != null && isUserInNguoiKyList) {
                    if (userId != null && userId.equals(firstUnsignedNguoiKy.getIdNguoiKy())) {
                        return true;
                    }
                }

                // Bước 4: Giám đốc ký (sau khi tất cả NguoiKy đã ký)
                if (allNguoiKySigned && !Boolean.TRUE.equals(item.getGiamDocKy())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdGiamDoc());
                }
                // Giám đốc đã ký vẫn được xem
                if (Boolean.TRUE.equals(item.getGiamDocKy())
                    && userId != null && userId.equals(item.getIdGiamDoc())) {
                    return true;
                }
            } else {
                // Không có người ký nào trong danh sách, chuyển thẳng sang Giám đốc
                if (!Boolean.TRUE.equals(item.getGiamDocKy())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdGiamDoc());
                }
                // Giám đốc đã ký vẫn được xem
                if (Boolean.TRUE.equals(item.getGiamDocKy())
                    && userId != null && userId.equals(item.getIdGiamDoc())) {
                    return true;
                }
            }
        }

        return false;
    }

    public List<BanGiaoCCDCVatTu> readCsv(MultipartFile file) throws IOException {
        List<BanGiaoCCDCVatTu> list = new ArrayList<>();

        // Sử dụng InputStreamReader với UTF-8
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true; // bỏ qua header
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1); // giữ giá trị rỗng
                BanGiaoCCDCVatTu ts = BanGiaoCCDCVatTu.mapToBanGiaoCCDCVatTu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<BanGiaoCCDCVatTu> readExcel(MultipartFile file) throws IOException {
        List<BanGiaoCCDCVatTu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            BanGiaoCCDCVatTu ts = BanGiaoCCDCVatTu.mapToBanGiaoCCDCVatTu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
