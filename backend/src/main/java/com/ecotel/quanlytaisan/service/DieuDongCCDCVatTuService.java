package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietDieuDongCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.DieuDongCCDCVatTuDao;
import com.ecotel.quanlytaisan.model.*;

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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class DieuDongCCDCVatTuService {
    @Autowired
    private final DieuDongCCDCVatTuDao dao;
    @Autowired
    private KyTaiLieuService kyTaiLieuService;
    @Autowired
    private ChiTietDieuDongCCDCVatTuDao chiTietDieuDongCCDCVatTuDao;
    @Autowired
    private PhongBanService phongBanService;

    @Autowired
    private NhanVienService nhanVienService;

    @Autowired
    private ChucVuService chucVuService;

    @Autowired
    private S3Service s3Service;

    public DieuDongCCDCVatTuService() {
        this.dao = new DieuDongCCDCVatTuDao();
    }

    public List<DieuDongCCDCVatTuDTO> findAll(String idCongTy) throws SQLException {
        return dao.findAll(idCongTy);
    }

    public PageResponse<DieuDongCCDCVatTuDTO> findAllPaged(String idCongTy, int page, int size, String sortBy,
                                                           String sortDir, String search, Integer loai, String userid, Integer trangThai, String idDonViGiao,
                                                           Boolean chuaBanGiaoHet, Boolean isSign) throws SQLException {
        if (page < 0)
            page = 0;
        if (size <= 0)
            size = 20;

        List<DieuDongCCDCVatTuDTO> sourceList;
        sourceList = dao.findAll(idCongTy);

        // ========== 1. Xác định quyền đặc biệt cho người dùng ==========
        boolean skipTurnFilter = false;
        boolean hasBanHanhQuyetDinh = false;

        // Filter theo lượt ký - chỉ lấy những item mà đến lượt user ký
        // Ngoại lệ: admin lấy hết, NguoiTao cũng lấy không phân biệt thứ tự
        if (userid != null && !userid.trim().isEmpty()) {
            // 1. Admin always skips turn filter and does NOT get status restriction for general view
            if ("admin".equalsIgnoreCase(userid)) {
                skipTurnFilter = true;
            } else {
                // 2. Check BanHanhQuyetDinh permission
                try {
                    NhanVien nv = nhanVienService.findEntityById(userid);
                    if (nv != null && nv.getChucVu() != null) {
                        ChucVu cv = chucVuService.findById(nv.getChucVu());
                        if (cv != null && Boolean.TRUE.equals(cv.getBanHanhQuyetDinh())) {
                            skipTurnFilter = true;
                            hasBanHanhQuyetDinh = true;
                        }
                    }
                } catch (Exception e) {
                    // ignore
                }
            }

            // Apply filters
            if (isSign != null && isSign) {
                List<DieuDongCCDCVatTuDTO> signFiltered = new ArrayList<>();
                for (DieuDongCCDCVatTuDTO item : sourceList) {
                    if (isNeedToSign(item, userid)) {
                        signFiltered.add(item);
                    }
                }
                sourceList = signFiltered;
            } else if (!skipTurnFilter) {
                List<DieuDongCCDCVatTuDTO> turnFiltered = new ArrayList<>();
                for (DieuDongCCDCVatTuDTO item : sourceList) {
                    if (isUserTurnToSign(item, userid)) {
                        turnFiltered.add(item);
                    }
                }
                sourceList = turnFiltered;
            }
        }

        // ========== 2. Áp dụng các bộ lọc khác ==========
        // Filter by chuaBanGiaoHet - chỉ lấy những phiếu chưa bàn giao hết
        if (Boolean.TRUE.equals(chuaBanGiaoHet)) {
            Set<String> idsChuaBanGiaoHet = dao.getIdsChuaBanGiaoHet(idCongTy);
            List<DieuDongCCDCVatTuDTO> chuaBanGiaoHetFiltered = new ArrayList<>();
            for (DieuDongCCDCVatTuDTO item : sourceList) {
                if (item != null && idsChuaBanGiaoHet.contains(item.getId())) {
                    chuaBanGiaoHetFiltered.add(item);
                }
            }
            sourceList = chuaBanGiaoHetFiltered;
        }

        // Filter by idDonViGiao
        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty()) {
            // 1. Kiểm tra đơn vị truyền vào có phải là Kho Loại 1 hay không
            PhongBanDTO phongBanTarget = phongBanService.getById(idDonViGiao);
            boolean isKhoLoai1Target = phongBanTarget != null
                    && Boolean.TRUE.equals(phongBanTarget.getIsKho())
                    && Integer.valueOf(1).equals(phongBanTarget.getLoaiKho());

            List<DieuDongCCDCVatTuDTO> donViGiaoFiltered = new ArrayList<>();

            if (isKhoLoai1Target) {
                // 2. Nếu là Kho Loại 1: Lấy tất cả các phiếu mà đơn vị giao cũng là Kho Loại 1
                for (DieuDongCCDCVatTuDTO item : sourceList) {
                    PhongBanDTO pbItem = phongBanService.getById(item.getIdDonViGiao());
                    if (pbItem != null
                            && Boolean.TRUE.equals(pbItem.getIsKho())
                            && Integer.valueOf(1).equals(pbItem.getLoaiKho())) {
                        donViGiaoFiltered.add(item);
                    }
                }
            } else {
                // 3. Nếu không phải Kho Loại 1: Lọc chính xác theo ID đơn vị như cũ
                for (DieuDongCCDCVatTuDTO item : sourceList) {
                    if (idDonViGiao.equalsIgnoreCase(item.getIdDonViGiao())) {
                        donViGiaoFiltered.add(item);
                    }
                }
            }
            sourceList = donViGiaoFiltered;
        }

        // Filter by search
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            List<DieuDongCCDCVatTuDTO> filtered = new ArrayList<>();
            for (DieuDongCCDCVatTuDTO item : sourceList) {
                if (item != null && item.toString() != null && item.toString().toLowerCase().contains(q)) {
                    filtered.add(item);
                }
            }
            sourceList = filtered;
        }

        // Filter by loai
        if (loai != null) {
            List<DieuDongCCDCVatTuDTO> loaiFiltered = new ArrayList<>();
            for (DieuDongCCDCVatTuDTO item : sourceList) {
                if (item != null && item.getLoai() != null && item.getLoai().equals(loai)) {
                    loaiFiltered.add(item);
                }
            }
            sourceList = loaiFiltered;
        }

        // ========== 4. Lọc trạng thái 3 và 4 cho người có BanHanhQuyetDinh ==========
        if (hasBanHanhQuyetDinh) {
            List<DieuDongCCDCVatTuDTO> finalFiltered = new ArrayList<>();
            for (DieuDongCCDCVatTuDTO item : sourceList) {
                if (item != null && item.getTrangThai() != null
                        && (item.getTrangThai() == 3 || item.getTrangThai() == 4)) {
                    finalFiltered.add(item);
                }
            }
            sourceList = finalFiltered;
        }

        // ========== 3. Tính toán counts (Trước khi lọc trạng thái) ==========
        Map<String, Long> loaiCounts = new java.util.HashMap<>();
        Map<String, Long> trangThaiCounts = new java.util.HashMap<>();

        for (DieuDongCCDCVatTuDTO item : sourceList) {
            if (item != null) {
                // Tính loaiCounts (đếm tổng quát)
                if (item.getLoai() != null) {
                    String key = item.getLoai().toString();
                    loaiCounts.put(key, loaiCounts.getOrDefault(key, 0L) + 1);
                }
                // Tính trangThaiCounts
                if (item.getTrangThai() != null) {
                    String key = item.getTrangThai().toString();
                    trangThaiCounts.put(key, trangThaiCounts.getOrDefault(key, 0L) + 1);
                }
            }
        }

        // Filter by trangThaiPhieu if trangThai != 4
        if (trangThai != null && trangThai != 5) {
            List<DieuDongCCDCVatTuDTO> trangThaiFiltered = new ArrayList<>();
            for (DieuDongCCDCVatTuDTO item : sourceList) {
                if (item != null && item.getTrangThai() != null && item.getTrangThai().equals(trangThai)) {
                    trangThaiFiltered.add(item);
                }
            }
            sourceList = trangThaiFiltered;
        }

        // ========== 5. Sắp xếp ==========
        sourceList.sort(getComparator(sortBy, sortDir));

        // ========== 6. Phân trang ==========
        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<DieuDongCCDCVatTuDTO> items = sourceList.subList(from, to);

        // ========== 7. Làm giàu dữ liệu cho các item ==========
        for (DieuDongCCDCVatTuDTO item : items) {
            item.setChuKyList(kyTaiLieuService.getList(item.getId()));
            item.setNguoiKyList(kyTaiLieuService.getAllNguoiKyByIdTaiLieu(item.getId()));

            List<ChiTietDieuDongCCDCVatTuDTO> chiTietList;
            if (Boolean.TRUE.equals(chuaBanGiaoHet)) {
                // Lấy chi tiết chưa bàn giao đủ số lượng (tính tổng từ ChiTietBanGiaoCCDCVatTu)
                chiTietList = chiTietDieuDongCCDCVatTuDao.findAllChuaBanGiaoDu(item.getId());
            } else {
                chiTietList = chiTietDieuDongCCDCVatTuDao.findAll(item.getId());
            }
            item.setChiTietDieuDongCCDCVatTuDTOS(chiTietList);
        }

        // ========== 8. Xây dựng response ==========
        PageResponse<DieuDongCCDCVatTuDTO> response = new PageResponse<>(items, total, page, size);
        response.setLoaiCounts(loaiCounts);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    /**
     * Comparator cho DieuDongCCDCVatTuDTO.
     * - Nếu sortBy null hoặc rỗng: sắp xếp mặc định theo trạng thái ưu tiên (0,1,3,2) rồi ngày tạo giảm dần.
     * - Ngược lại, sắp xếp theo trường được chỉ định.
     */
    private Comparator<DieuDongCCDCVatTuDTO> getComparator(String sortBy, String sortDir) {
        // Nếu không có sortBy, dùng sắp xếp mặc định: theo trạng thái ưu tiên, rồi ngày tạo giảm dần
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> priorityMap = new HashMap<>();
            priorityMap.put(0, 1); // Nháp
            priorityMap.put(1, 2); // Duyệt
            priorityMap.put(3, 3); // Hoàn thành
            priorityMap.put(2, 4); // Hủy

            Comparator<DieuDongCCDCVatTuDTO> comparator = Comparator.comparingInt(
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

        Comparator<DieuDongCCDCVatTuDTO> comparator = null;

        switch (normalizedSortBy) {
            case "tenphieu":
                comparator = Comparator.comparing(
                        item -> item.getTenPhieu() != null ? item.getTenPhieu() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "soquyetdinh":
                comparator = Comparator.comparing(
                        item -> item.getSoQuyetDinh() != null ? item.getSoQuyetDinh() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "ngaytao":
                comparator = Comparator.comparing(
                        item -> item.getNgayTao() != null ? item.getNgayTao() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "ngaycapnhat":
            default:
                comparator = Comparator.comparing(
                        item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "trangthai":
                comparator = Comparator.comparing(
                        item -> item.getTrangThai() != null ? item.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo));
                break;
            case "tendonvigiao":
                comparator = Comparator.comparing(
                        item -> item.getTenDonViGiao() != null ? item.getTenDonViGiao() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "tendonvinhan":
                comparator = Comparator.comparing(
                        item -> item.getTenDonViNhan() != null ? item.getTenDonViNhan() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
        }

        if (comparator == null) {
            // Default to ngayCapNhat
            comparator = Comparator.comparing(
                    item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
        }

        return ascending ? comparator : comparator.reversed();
    }

    public List<DieuDongCCDCVatTuDTO> findByUserId(String userId) throws SQLException {
        return dao.findByUserId(userId);
    }

    public int updateTrangThaiBanGiao(String id, boolean daBanGiao) {
        return dao.updateTrangThaiBanGiao(id, daBanGiao);
    }

    public DieuDongCCDCVatTu findById(String id) throws SQLException {
        return dao.findById(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public DieuDongCCDCVatTu insert(DieuDongCCDCVatTu obj) throws SQLException {
        DieuDongCCDCVatTu result = dao.insert(obj);
        if (result != null) {
            if (obj.getChiTietDieuDongCCDCVatTuDTOS() != null && !obj.getChiTietDieuDongCCDCVatTuDTOS().isEmpty()) {
                List<ChiTietDieuDongCCDCVatTu> insertList = new ArrayList<>();
                for (ChiTietDieuDongCCDCVatTuDTO dto : obj.getChiTietDieuDongCCDCVatTuDTOS()) {
                    ChiTietDieuDongCCDCVatTu ct = new ChiTietDieuDongCCDCVatTu();
                    ct.setId(dto.getId());
                    ct.setIdDieuDongCCDCVatTu(result.getId());
                    ct.setIdCCDCVatTu(dto.getIdCCDCVatTu());
                    ct.setSoChungTu(dto.getSoChungTu());
                    ct.setSoLuong(dto.getSoLuong() != null ? dto.getSoLuong().doubleValue() : 0.0);
                    ct.setSoLuongXuat(dto.getSoLuongXuat() != null ? dto.getSoLuongXuat().doubleValue() : 0.0);
                    ct.setGhiChu(dto.getGhiChu());
                    ct.setNgayTao(dto.getNgayTao());
                    ct.setNgayCapNhat(dto.getNgayCapNhat());
                    ct.setNguoiTao(dto.getNguoiTao());
                    ct.setNguoiCapNhat(dto.getNguoiCapNhat());
                    ct.setIsActive(dto.getIsActive());
                    ct.setIdChiTietCCDCVatTu(dto.getIdChiTietCCDCVatTu());
                    ct.setHienTrang(dto.getHienTrang());
                    ct.setMoTa(dto.getMoTa());
                    insertList.add(ct);
                }
                chiTietDieuDongCCDCVatTuDao.batchInsert(insertList);
            }
            if (obj.getNguoiKyList() != null && !obj.getNguoiKyList().isEmpty()) {
                kyTaiLieuService.insertNguoiKyBatch(obj.getNguoiKyList());
            }
        }
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    public DieuDongCCDCVatTu update(DieuDongCCDCVatTu obj) throws SQLException {
        DieuDongCCDCVatTu oldObj = dao.findById(obj.getId());
        List<String> keysToDelete = new ArrayList<>();
        if (oldObj != null) {
            if (oldObj.getDuongDanFile() != null && !oldObj.getDuongDanFile().isEmpty() 
                    && !oldObj.getDuongDanFile().equals(obj.getDuongDanFile())) {
                keysToDelete.add(oldObj.getDuongDanFile());
            }
            if (oldObj.getTaiLieuCuoi() != null && !oldObj.getTaiLieuCuoi().isEmpty() 
                    && !oldObj.getTaiLieuCuoi().equals(obj.getTaiLieuCuoi())) {
                keysToDelete.add(oldObj.getTaiLieuCuoi());
            }
        }

        DieuDongCCDCVatTu result = dao.update(obj);
        if (result != null) {
            if (obj.getChiTietDieuDongCCDCVatTuDTOS() != null) {
                List<ChiTietDieuDongCCDCVatTuDTO> currentDetails = chiTietDieuDongCCDCVatTuDao.findAll(obj.getId());
                Set<String> newIds = new HashSet<>();
                for (ChiTietDieuDongCCDCVatTuDTO ct : obj.getChiTietDieuDongCCDCVatTuDTOS()) {
                    if (ct.getId() != null && !ct.getId().isEmpty()) {
                        newIds.add(ct.getId());
                    }
                }
                
                List<String> idsToDelete = new ArrayList<>();
                for (ChiTietDieuDongCCDCVatTuDTO current : currentDetails) {
                    if (!newIds.contains(current.getId())) {
                        idsToDelete.add(current.getId());
                    }
                }
                if (!idsToDelete.isEmpty()) {
                    chiTietDieuDongCCDCVatTuDao.batchDelete(idsToDelete);
                }

                List<ChiTietDieuDongCCDCVatTu> itemsToInsert = new ArrayList<>();
                List<ChiTietDieuDongCCDCVatTu> itemsToUpdate = new ArrayList<>();
                Set<String> currentIds = new HashSet<>();
                for (ChiTietDieuDongCCDCVatTuDTO c : currentDetails) currentIds.add(c.getId());

                for (ChiTietDieuDongCCDCVatTuDTO dto : obj.getChiTietDieuDongCCDCVatTuDTOS()) {
                    ChiTietDieuDongCCDCVatTu ct = new ChiTietDieuDongCCDCVatTu();
                    ct.setId(dto.getId());
                    ct.setIdDieuDongCCDCVatTu(result.getId());
                    ct.setIdCCDCVatTu(dto.getIdCCDCVatTu());
                    ct.setSoChungTu(dto.getSoChungTu());
                    ct.setSoLuong(dto.getSoLuong() != null ? dto.getSoLuong().doubleValue() : 0.0);
                    ct.setSoLuongXuat(dto.getSoLuongXuat() != null ? dto.getSoLuongXuat().doubleValue() : 0.0);
                    ct.setGhiChu(dto.getGhiChu());
                    ct.setNgayTao(dto.getNgayTao());
                    ct.setNgayCapNhat(dto.getNgayCapNhat());
                    ct.setNguoiTao(dto.getNguoiTao());
                    ct.setNguoiCapNhat(dto.getNguoiCapNhat());
                    ct.setIsActive(dto.getIsActive());
                    ct.setIdChiTietCCDCVatTu(dto.getIdChiTietCCDCVatTu());
                    ct.setHienTrang(dto.getHienTrang());
                    ct.setMoTa(dto.getMoTa());
                    
                    if (currentIds.contains(dto.getId())) {
                        itemsToUpdate.add(ct);
                    } else {
                        itemsToInsert.add(ct);
                    }
                }
                if (!itemsToInsert.isEmpty()) chiTietDieuDongCCDCVatTuDao.batchInsert(itemsToInsert);
                if (!itemsToUpdate.isEmpty()) chiTietDieuDongCCDCVatTuDao.batchUpdate(itemsToUpdate);
            }

            if (obj.getNguoiKyList() != null) {
                kyTaiLieuService.deleteAllNguoiKy(obj.getId());
                if (!obj.getNguoiKyList().isEmpty()) {
                    kyTaiLieuService.insertNguoiKyBatch(obj.getNguoiKyList());
                }
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
                                    // ignore
                                }
                            }
                        }
                    }
                );
            }
        }
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    public int delete(String id) throws SQLException {
        DieuDongCCDCVatTu oldObj = dao.findById(id);
        List<String> keysToDelete = new ArrayList<>();
        if (oldObj != null) {
            if (oldObj.getDuongDanFile() != null && !oldObj.getDuongDanFile().isEmpty()) {
                keysToDelete.add(oldObj.getDuongDanFile());
            }
            if (oldObj.getTaiLieuCuoi() != null && !oldObj.getTaiLieuCuoi().isEmpty()) {
                keysToDelete.add(oldObj.getTaiLieuCuoi());
            }
        }
        kyTaiLieuService.deleteAllNguoiKy(id);
        kyTaiLieuService.delete(id);
        int rows = dao.delete(id);
        if (rows > 0 && !keysToDelete.isEmpty()) {
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
        return rows;
    }

    public int[] banHanhQuyetDinh(List<BanHanhRequest> requests) {
        return dao.banHanhQuyetDinh(requests);
    }

    public int updateTrangThai(String id, String userId) {
        return dao.updateTrangThai(id, userId);
    }

    @Transactional(rollbackFor = Exception.class)
    public int huyTrangThai(String id) {
        kyTaiLieuService.delete(id);
        return dao.huyDieuDong(id);
    }

    /**
     * Kiểm tra xem có phải lượt ký của user không
     * Thứ tự ký:
     * 1. Người lập phiếu ký nháy (nếu NguoiLapPhieuKyNhay = true, check userId với
     * IdNguoiKyNhay)
     * 2. Người trình duyệt cấp phòng (sau khi TrangThaiKyNhay = true hoặc
     * NguoiLapPhieuKyNhay = false)
     * 3. NguoiKy từ bảng NguoiKy (sau khi TrinhDuyetCapPhongXacNhan = true)
     * 4. Trình duyệt Giám đốc (sau khi tất cả NguoiKy đã ký)
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

    /**
     * Lọc theo lượt ký - chỉ lấy những item mà user CẦN phải ký
     */
    public boolean isNeedToSign(DieuDongCCDCVatTuDTO item, String userId) {
        if (userId == null || userId.isEmpty()) return false;
        
        // ===== Trạng thái nháp/hoàn thành/hủy bỏ (trangThai 2, 3 bỏ qua) =====
        if (item.getTrangThai() != null && (item.getTrangThai() == 2 || item.getTrangThai() == 3||item.getTrangThai() == 4)) {
            return false;
        }

        // ===== Kiểm tra điều kiện share / người tạo ký trước khi share =====
        if (!Boolean.TRUE.equals(item.getShare())) {
            // Nếu chưa share, chỉ cho phép ký nếu userId là người tạo trùng với người ký đầu tiên và người đó chưa ký.
            boolean isCreatorAndFirstSigner = false;

            // 1. Kiểm tra người lập/ký nháy (người ký đầu tiên)
            if (Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay()) && item.getIdNguoiKyNhay() != null && !item.getIdNguoiKyNhay().isEmpty()) {
                if (userId.equalsIgnoreCase(item.getNguoiTao()) && userId.equalsIgnoreCase(item.getIdNguoiKyNhay())) {
                    if (!Boolean.TRUE.equals(item.getTrangThaiKyNhay())) {
                        isCreatorAndFirstSigner = true;
                    }
                }
            } else if (item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()) {
                // 2. Nếu không có ký nháy, thì người duyệt cấp phòng là người ký đầu tiên
                if (userId.equalsIgnoreCase(item.getNguoiTao()) && userId.equalsIgnoreCase(item.getIdTrinhDuyetCapPhong())) {
                    if (!Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
                        isCreatorAndFirstSigner = true;
                    }
                }
            } else {
                // 3. Nếu không có cả hai, kiểm tra người ký đầu tiên trong danh sách NguoiKy
                List<NguoiKy> kyList = kyTaiLieuService.getAllNguoiKyByIdTaiLieu(item.getId());
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

        // 1. Ký nháy
        if (Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay()) && item.getIdNguoiKyNhay() != null && !item.getIdNguoiKyNhay().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getTrangThaiKyNhay())) {
                return userId.equalsIgnoreCase(item.getIdNguoiKyNhay());
            }
        }

        // 2. Trình duyệt cấp phòng
        boolean kyNhayDone = !Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay()) || Boolean.TRUE.equals(item.getTrangThaiKyNhay());
        if (kyNhayDone && item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
                return userId.equalsIgnoreCase(item.getIdTrinhDuyetCapPhong());
            }
        }

        // 3. Danh sách người ký (kyList)
        boolean capPhongDone = kyNhayDone && (item.getIdTrinhDuyetCapPhong() == null || item.getIdTrinhDuyetCapPhong().isEmpty() || Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan()));
        if (capPhongDone) {
            List<NguoiKy> kyList = kyTaiLieuService.getAllNguoiKyByIdTaiLieu(item.getId());
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
                
                // 4. Trình duyệt Giám đốc (sau khi tất cả NguoiKy đã ký)
                if (allSigned && item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()) {
                    if (!Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                        return userId.equalsIgnoreCase(item.getIdTrinhDuyetGiamDoc());
                    }
                }
            } else {
                // Không có người ký trong danh sách, chuyển thẳng sang Giám đốc
                if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()) {
                    if (!Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                        return userId.equalsIgnoreCase(item.getIdTrinhDuyetGiamDoc());
                    }
                }
            }
        }

        return false;
    }

    public boolean isUserTurnToSign(DieuDongCCDCVatTuDTO item, String userId) {
        // Nếu đã hủy hoặc hoàn thành thì không hiển thị trong lượt ký (trừ người tạo)
        if (item.getTrangThai() == 2 || item.getTrangThai() == 3) {
            if (userId == null || !userId.equals(item.getNguoiTao()))
                return false;
        }

        // Người tạo luôn được xem
        if (userId != null && userId.equals(item.getNguoiTao())) {
            return true;
        }

        // Kiểm tra điều kiện Share = true (trừ admin và người tạo)
        if (!Boolean.TRUE.equals(item.getShare())) {
            return false;
        }

        // Bước 1: Người lập phiếu ký nháy
        if (Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay())) {
            // Nếu chưa ký nháy
            if (!Boolean.TRUE.equals(item.getTrangThaiKyNhay())) {
                // Chỉ người ký nháy mới thấy
                return userId != null && userId.equals(item.getIdNguoiKyNhay());
            }
            // Người đã ký nháy vẫn được xem
            if (userId != null && userId.equals(item.getIdNguoiKyNhay())) {
                return true;
            }
        }

        // Bước 2: Người trình duyệt cấp phòng (sau khi ký nháy xong hoặc không cần ký
        // nháy)
        boolean kyNhayDone = !Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay())
                || Boolean.TRUE.equals(item.getTrangThaiKyNhay());
        if (kyNhayDone && !Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
            // Chỉ người trình duyệt cấp phòng mới thấy
            return userId != null && userId.equals(item.getIdTrinhDuyetCapPhong());
        }
        // Người cấp phòng đã duyệt vẫn được xem
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())
                && userId != null && userId.equals(item.getIdTrinhDuyetCapPhong())) {
            return true;
        }

        // Bước 3: NguoiKy từ bảng NguoiKy (sau khi cấp phòng duyệt) - ký theo thứ tự
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
            // Lấy danh sách người ký theo IdTaiLieu
            List<NguoiKy> nguoiKyList = kyTaiLieuService.getAllNguoiKyByIdTaiLieu(item.getId());

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

                // Bước 4: Trình duyệt Giám đốc (sau khi tất cả NguoiKy đã ký)
                if (allNguoiKySigned && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
                }
                // Giám đốc đã duyệt vẫn được xem
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
                        && userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc())) {
                    return true;
                }
            } else {
                // Không có người ký nào trong danh sách, chuyển thẳng sang Giám đốc
                if (!Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
                }
                // Giám đốc đã duyệt vẫn được xem
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
                        && userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc())) {
                    return true;
                }
            }
        }

        return false;
    }

    public List<DieuDongCCDCVatTu> readCsv(MultipartFile file) throws IOException {
        List<DieuDongCCDCVatTu> list = new ArrayList<>();

        // Sử dụng InputStreamReader với UTF-8
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true; // bỏ qua header
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1); // giữ giá trị rỗng
                DieuDongCCDCVatTu ts = DieuDongCCDCVatTu.mapToDieuDongCCDCVatTu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }

    public List<DieuDongCCDCVatTu> readExcel(MultipartFile file) throws IOException {
        List<DieuDongCCDCVatTu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            DieuDongCCDCVatTu ts = DieuDongCCDCVatTu.mapToDieuDongCCDCVatTu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }

    /**
     * Đếm số lượng DieuDongCCDCVatTu theo TrangThai và IdDonViGiao
     */
    public long countByTrangThaiAndDonViGiao(int trangThai, String idDonViGiao) {
        return dao.countByTrangThaiAndDonViGiao(trangThai, idDonViGiao);
    }

    /**
     * Lấy danh sách DieuDongCCDCVatTu (loại Điều động) đã hoàn thành nhưng chưa bàn
     * giao hết
     */
    public List<DieuDongCCDCVatTuDTO> findAllChuaBanGiaoHet(String idCongTy) {
        return dao.findAllChuaBanGiaoHet(idCongTy);
    }
}