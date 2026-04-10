package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KeHoachSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KeHoachSuaChuaChiTietTaiSanDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.dao.NhanVienDao;
import com.ecotel.quanlytaisan.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service kế hoạch sửa chữa – mirror DieuDongTaiSanService.
 * TrangThai: 0=Nháp | 1=Chờ duyệt | 2=Đã hủy | 3=Đã duyệt/Hoàn thành
 */
@Service
public class KeHoachSuaChuaService {

    @Autowired
    private KeHoachSuaChuaDao keHoachSuaChuaDao;

    @Autowired
    private KeHoachSuaChuaChiTietTaiSanDao suaChuaChiTietTaiSanDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    @Autowired
    private NhanVienDao nhanVienDao;

    @Autowired
    private NhanVienService nhanVienService;

    @Autowired
    private ChucVuService chucVuService;

    // ==================== Find all ====================

    public List<KeHoachSuaChuaDTO> findAll(String idCongTy) throws SQLException {
        List<KeHoachSuaChuaDTO> list = keHoachSuaChuaDao.findAll(idCongTy);
        for (KeHoachSuaChuaDTO dto : list) {
            dto.setDanhSachTaiSan(suaChuaChiTietTaiSanDao.findByIdKeHoach(dto.getId()));
        }
        return list;
    }

    // ==================== Paged ====================

    public PageResponse<KeHoachSuaChuaDTO> findAllPaged(
            String idCongTy, int page, int size,
            String sortBy, String sortDir, String search,
            String loaiKeHoach, String idDonViLap, String idDonViThucHien,
            Integer trangThai, Integer nam, String userid
    ) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<KeHoachSuaChuaDTO> sourceList = keHoachSuaChuaDao.findAll(idCongTy);

        // Xác định quyền user (mirror DieuDong)
        boolean skipTurnFilter = false;
        boolean hasBanHanhQuyetDinh = false;

        if (userid != null && !userid.trim().isEmpty()) {
            if ("admin".equalsIgnoreCase(userid)) {
                skipTurnFilter = true;
            } else {
                try {
                    NhanVien nv = nhanVienService.findEntityById(userid);
                    if (nv != null && nv.getChucVu() != null) {
                        ChucVu cv = chucVuService.findById(nv.getChucVu());
                        if (cv != null && Boolean.TRUE.equals(cv.getBanHanhQuyetDinh())) {
                            skipTurnFilter = true;
                            hasBanHanhQuyetDinh = true;
                        }
                    }
                } catch (Exception ignored) {}
            }
            if (!skipTurnFilter) {
                List<KeHoachSuaChuaDTO> turnFiltered = new ArrayList<>();
                for (KeHoachSuaChuaDTO item : sourceList) {
                    if (isUserTurnToSign(item, userid)) turnFiltered.add(item);
                }
                sourceList = turnFiltered;
            }
        }

        // Bộ đếm trạng thái (tính trước khi filter)
        Map<String, Long> trangThaiCounts = new HashMap<>();
        for (KeHoachSuaChuaDTO item : sourceList) {
            if (item.getTrangThai() != null) {
                String key = item.getTrangThai().toString();
                trangThaiCounts.put(key, trangThaiCounts.getOrDefault(key, 0L) + 1);
            }
        }

        // Filter người có quyền ban hành: chỉ hiện trangThai 3
        if (hasBanHanhQuyetDinh) {
            sourceList = sourceList.stream()
                    .filter(i -> i.getTrangThai() != null && i.getTrangThai() == 3)
                    .collect(Collectors.toList());
        }

        // Lọc loại kế hoạch
        if (loaiKeHoach != null && !loaiKeHoach.trim().isEmpty())
            sourceList = sourceList.stream().filter(i -> loaiKeHoach.equals(i.getIdLoaiKeHoach())).collect(Collectors.toList());

        // Lọc đơn vị lập
        if (idDonViLap != null && !idDonViLap.trim().isEmpty())
            sourceList = sourceList.stream().filter(i -> idDonViLap.equalsIgnoreCase(i.getIdDonViLap())).collect(Collectors.toList());

        // Lọc đơn vị thực hiện
        if (idDonViThucHien != null && !idDonViThucHien.trim().isEmpty())
            sourceList = sourceList.stream().filter(i -> idDonViThucHien.equalsIgnoreCase(i.getIdDonViThucHien())).collect(Collectors.toList());

        // Lọc trạng thái
        if (trangThai != null)
            sourceList = sourceList.stream().filter(i -> trangThai.equals(i.getTrangThai())).collect(Collectors.toList());

        // Lọc năm
        if (nam != null)
            sourceList = sourceList.stream().filter(i -> nam.equals(i.getNam())).collect(Collectors.toList());

        // Tìm kiếm
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(i -> (i.getTenKeHoach() != null && i.getTenKeHoach().toLowerCase().contains(q))
                            || (i.getSoKeHoach() != null && i.getSoKeHoach().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<KeHoachSuaChuaDTO> items = new ArrayList<>(sourceList.subList(from, to));

        // Enrich: chữ ký + chi tiết
        for (KeHoachSuaChuaDTO item : items) {
            item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
            item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
            item.setDanhSachTaiSan(suaChuaChiTietTaiSanDao.findByIdKeHoach(item.getId()));
        }

        PageResponse<KeHoachSuaChuaDTO> response = new PageResponse<>(items, total, page, size);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    private Comparator<KeHoachSuaChuaDTO> getComparator(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> priorityMap = new HashMap<>();
            priorityMap.put(0, 1); priorityMap.put(1, 2); priorityMap.put(3, 3); priorityMap.put(2, 4);
            return Comparator.<KeHoachSuaChuaDTO>comparingInt(i -> priorityMap.getOrDefault(i.getTrangThai(), 5))
                    .thenComparing(i -> i.getNgayTao() != null ? i.getNgayTao() : new Date(0),
                            Comparator.nullsLast(Comparator.reverseOrder()));
        }
        String by = sortBy.trim().toLowerCase();
        boolean asc = "asc".equalsIgnoreCase(sortDir);
        Comparator<KeHoachSuaChuaDTO> comp;
        switch (by) {
            case "tenkehoach":
                comp = Comparator.comparing(i -> i.getTenKeHoach() != null ? i.getTenKeHoach() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "nam":
                comp = Comparator.comparing(i -> i.getNam() != null ? i.getNam() : 0,
                        Comparator.nullsLast(Integer::compareTo));
                break;
            case "ngaybatdau":
                comp = Comparator.comparing(i -> i.getNgayBatDau() != null ? i.getNgayBatDau() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
            case "ngayketthuc":
                comp = Comparator.comparing(i -> i.getNgayKetThuc() != null ? i.getNgayKetThuc() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
            case "trangthai":
                comp = Comparator.comparing(i -> i.getTrangThai() != null ? i.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo));
                break;
            case "ngaytao": default:
                comp = Comparator.comparing(i -> i.getNgayTao() != null ? i.getNgayTao() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
        }
        return asc ? comp : comp.reversed();
    }

    // ==================== CRUD ====================

    public KeHoachSuaChua findById(String id) {
        return keHoachSuaChuaDao.findById(id);
    }

    public KeHoachSuaChuaDTO findByIdDTO(String id) throws SQLException {
        KeHoachSuaChuaDTO dto = keHoachSuaChuaDao.findByIdDTO(id);
        if (dto != null) {
            dto.setChuKyList(kyTaiLieuDao.findById(id));
            dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id));
            dto.setDanhSachTaiSan(suaChuaChiTietTaiSanDao.findByIdKeHoach(id));
        }
        return dto;
    }

    public KeHoachSuaChua insert(KeHoachSuaChua entity) throws SQLException {
        return keHoachSuaChuaDao.insert(entity);
    }

    public KeHoachSuaChua update(KeHoachSuaChua entity) throws SQLException {
        return keHoachSuaChuaDao.update(entity);
    }

    /**
     * Cập nhật trạng thái.
     * Chỉ cho phép: 0=Nháp | 1=Chờ duyệt | 2=Đã hủy | 3=Đã duyệt
     */
    public int updateTrangThai(String id, Integer trangThai) {
        List<Integer> validValues = List.of(0, 1, 2, 3);
        if (!validValues.contains(trangThai))
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + trangThai);
        KeHoachSuaChua existing = keHoachSuaChuaDao.findById(id);
        if (existing == null)
            throw new IllegalArgumentException("Không tìm thấy kế hoạch với ID: " + id);
        if (Integer.valueOf(3).equals(existing.getTrangThai()))
            throw new IllegalStateException("Kế hoạch đã hoàn thành, không thể thay đổi trạng thái");
        return keHoachSuaChuaDao.updateTrangThai(id, trangThai);
    }

    /**
     * Hủy kế hoạch (đặt trangThai = 2)
     */
    public int huyKeHoach(String id) {
        return keHoachSuaChuaDao.huyKeHoach(id);
    }

    @Transactional
    public int delete(String id) throws SQLException {
        suaChuaChiTietTaiSanDao.deleteByIdKeHoach(id);
        return keHoachSuaChuaDao.delete(id);
    }

    @Transactional
    public void bulkDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) return;
        for (String id : ids) suaChuaChiTietTaiSanDao.deleteByIdKeHoach(id);
        keHoachSuaChuaDao.batchDelete(ids);
    }

    // ==================== Workflow: turn-filter (mirror DieuDong) ====================

    public boolean isUserTurnToSign(KeHoachSuaChuaDTO item, String userId) {
        if ("admin".equalsIgnoreCase(userId)) return true;
        if (userId != null && userId.equals(item.getNguoiTao())) return true;
        if (!Boolean.TRUE.equals(item.getShare())) return false;

        // Bước 1: Người lập phiếu ký nháy
        if (Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay())) {
            if (!Boolean.TRUE.equals(item.getTrangThaiKyNhay()))
                return userId != null && userId.equals(item.getIdNguoiKyNhay());
            if (userId != null && userId.equals(item.getIdNguoiKyNhay())) return true;
        }

        // Bước 2: Trình duyệt cấp phòng
        boolean kyNhayDone = !Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay())
                || Boolean.TRUE.equals(item.getTrangThaiKyNhay());
        if (kyNhayDone && !Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan()))
            return userId != null && userId.equals(item.getIdTrinhDuyetCapPhong());
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())
                && userId != null && userId.equals(item.getIdTrinhDuyetCapPhong()))
            return true;

        // Bước 3: NguoiKy theo thứ tự
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
            List<NguoiKy> nguoiKyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
            if (nguoiKyList != null && !nguoiKyList.isEmpty()) {
                NguoiKy firstUnsigned = null;
                boolean allSigned = true;
                boolean userInList = false, userSigned = false;
                for (NguoiKy nk : nguoiKyList) {
                    if (nk.getTrangThai() != 1) {
                        allSigned = false;
                        if (firstUnsigned == null) firstUnsigned = nk;
                    }
                    if (userId != null && userId.equals(nk.getIdNguoiKy())) {
                        userInList = true;
                        if (nk.getTrangThai() == 1) userSigned = true;
                    }
                }
                if (userSigned) return true;
                if (firstUnsigned != null && userInList && userId.equals(firstUnsigned.getIdNguoiKy())) return true;
                if (allSigned && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()))
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
                        && userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc()))
                    return true;
            } else {
                if (!Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()))
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
                        && userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc()))
                    return true;
            }
        }
        return false;
    }

    // ==================== Permission signing (mirror DieuDong) ====================

    public int getPermissionSigning(KeHoachSuaChuaDTO item, String tenDangNhap) {
        List<Map<String, Object>> signatureFlow = new ArrayList<>();

        if (Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay())) {
            Map<String, Object> step = new HashMap<>();
            step.put("id", item.getIdNguoiKyNhay());
            step.put("signed", Boolean.TRUE.equals(item.getTrangThaiKyNhay()));
            NhanVienDTO nv = nhanVienDao.findById(item.getIdNguoiKyNhay() != null ? item.getIdNguoiKyNhay() : "");
            step.put("label", "Người lập phiếu: " + (nv != null ? nv.getHoTen() : ""));
            signatureFlow.add(step);
        }
        if (item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()) {
            Map<String, Object> step = new HashMap<>();
            step.put("id", item.getIdTrinhDuyetCapPhong());
            step.put("signed", Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan()));
            step.put("label", "Người duyệt: " + item.getTenTrinhDuyetCapPhong());
            signatureFlow.add(step);
        }
        List<NguoiKy> kyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
        if (kyList != null) {
            for (int i = 0; i < kyList.size(); i++) {
                NguoiKy sign = kyList.get(i);
                if (sign.getIdNguoiKy() != null && !sign.getIdNguoiKy().isEmpty()) {
                    Map<String, Object> step = new HashMap<>();
                    step.put("id", sign.getIdNguoiKy());
                    step.put("signed", sign.getTrangThai() == 1);
                    step.put("label", "Người ký " + (i + 1) + ": " + sign.getTenNguoiKy());
                    signatureFlow.add(step);
                }
            }
        }
        if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()) {
            Map<String, Object> step = new HashMap<>();
            step.put("id", item.getIdTrinhDuyetGiamDoc());
            step.put("signed", Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()));
            step.put("label", "Người phê duyệt: " + item.getTenTrinhDuyetGiamDoc());
            signatureFlow.add(step);
        }

        signatureFlow = signatureFlow.stream()
                .filter(s -> s.get("id") != null && !((String) s.get("id")).isEmpty())
                .collect(Collectors.toList());

        int currentIndex = -1;
        for (int i = 0; i < signatureFlow.size(); i++) {
            if (Objects.equals(signatureFlow.get(i).get("id"), tenDangNhap)) { currentIndex = i; break; }
        }
        if (currentIndex == -1) return 2;

        Object signedObj = signatureFlow.get(currentIndex).get("signed");
        boolean signed = signedObj instanceof Boolean && (Boolean) signedObj;

        if (Objects.equals(item.getNguoiTao(), tenDangNhap) && signedObj != null) return signed ? 4 : 5;
        if (signed) return 3;
        boolean previousNotSigned = signatureFlow.subList(0, currentIndex).stream()
                .anyMatch(s -> Boolean.FALSE.equals(s.get("signed")));
        return previousNotSigned ? 1 : 0;
    }
}