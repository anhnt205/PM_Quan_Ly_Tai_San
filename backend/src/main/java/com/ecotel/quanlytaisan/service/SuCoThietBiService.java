package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SuCoThietBiDao;
import com.ecotel.quanlytaisan.dao.SuCoThietBiChiTietDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.*;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;
import java.text.SimpleDateFormat;

/**
 * Service sự cố thiết bị.
 *
 * TrangThai: 0=Nháp | 1=Đã duyệt | 2=Hủy | 3=Hoàn thành
 * MucDo    : 1=Nhẹ  | 2=Trung bình | 3=Nặng | 4=Nghiêm trọng
 * Luồng ký : Người lập → NguoiKy list → Giám đốc (tương tự KeHoachSuaChua)
 */
@Service
public class SuCoThietBiService {

    @Autowired private SuCoThietBiDao suCoDao;
    @Autowired private SuCoThietBiChiTietDao chiTietDao;
    @Autowired private KyTaiLieuDao kyTaiLieuDao;
    @Autowired private TaiSanService taiSanService;

    // ==================== Find all ====================

    public List<SuCoThietBiDTO> findAll(String idCongTy) throws SQLException {
        List<SuCoThietBiDTO> list = suCoDao.findAll(idCongTy);
        for (SuCoThietBiDTO dto : list)
            dto.setDanhSachTaiSan(chiTietDao.findByIdSuCo(dto.getId()));
        return list;
    }

    // ==================== Paged ====================

    public PageResponse<SuCoThietBiDTO> findAllPaged(
            String idCongTy, int page, int size,
            String sortBy, String sortDir, String search,
            String idDonViBaoCao, Integer trangThai, Integer mucDo,
            String userid, Boolean isSign,
            String dateFrom, String dateTo
    ) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<SuCoThietBiDTO> sourceList = suCoDao.findAll(idCongTy);

        // Turn-based filter (chỉ hiển thị phiếu đến lượt user ký)
        if (userid != null && !userid.trim().isEmpty()) {
            boolean shouldFilter = !"admin".equalsIgnoreCase(userid) || (isSign != null && isSign);
            if (shouldFilter) {
                List<SuCoThietBiDTO> filtered = new ArrayList<>();
                for (SuCoThietBiDTO item : sourceList) {
                    if (isSign != null && isSign) {
                        if (isNeedToSign(item, userid)) filtered.add(item);
                    } else {
                        if (isUserTurnToSign(item, userid)) filtered.add(item);
                    }
                }
                sourceList = filtered;
            }
        }

        // Đếm theo trạng thái
        Map<String, Long> trangThaiCounts = new HashMap<>();
        for (SuCoThietBiDTO item : sourceList) {
            if (item.getTrangThai() != null) {
                String key = item.getTrangThai().toString();
                trangThaiCounts.put(key, trangThaiCounts.getOrDefault(key, 0L) + 1);
            }
        }

        // Filters
        if (idDonViBaoCao != null && !idDonViBaoCao.trim().isEmpty())
            sourceList = sourceList.stream()
                    .filter(i -> idDonViBaoCao.equalsIgnoreCase(i.getIdDonViBaoCao()))
                    .collect(Collectors.toList());
        if (trangThai != null)
            sourceList = sourceList.stream()
                    .filter(i -> trangThai.equals(i.getTrangThai()))
                    .collect(Collectors.toList());
        if (mucDo != null)
            sourceList = sourceList.stream()
                    .filter(i -> mucDo.equals(i.getMucDo()))
                    .collect(Collectors.toList());

        if (dateFrom != null && !dateFrom.isEmpty()) {
            try {
                Date from = new SimpleDateFormat("yyyy-MM-dd").parse(dateFrom);
                SimpleDateFormat fullDf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                sourceList = sourceList.stream()
                        .filter(i -> {
                            try {
                                return i.getNgayTao() != null && !fullDf.parse(i.getNgayTao()).before(from);
                            } catch (Exception e) { return false; }
                        })
                        .collect(Collectors.toList());
            } catch (Exception ignored) {}
        }
        if (dateTo != null && !dateTo.isEmpty()) {
            try {
                Date to = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dateTo + " 23:59:59");
                SimpleDateFormat fullDf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                sourceList = sourceList.stream()
                        .filter(i -> {
                            try {
                                return i.getNgayTao() != null && !fullDf.parse(i.getNgayTao()).after(to);
                            } catch (Exception e) { return false; }
                        })
                        .collect(Collectors.toList());
            } catch (Exception ignored) {}
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(i -> (i.getSoPhieu() != null && i.getSoPhieu().toLowerCase().contains(q))
                            || (i.getTenHeThongThietBi() != null && i.getTenHeThongThietBi().toLowerCase().contains(q))
                            || (i.getMoTa() != null && i.getMoTa().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to   = Math.min(from + size, sourceList.size());
        List<SuCoThietBiDTO> items = new ArrayList<>(sourceList.subList(from, to));

        // Enrich
        for (SuCoThietBiDTO item : items) {
            item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
            item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
            item.setDanhSachTaiSan(chiTietDao.findByIdSuCo(item.getId()));
        }

        PageResponse<SuCoThietBiDTO> response = new PageResponse<>(items, total, page, size);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    // ==================== CRUD ====================

    public SuCoThietBi findById(String id) { return suCoDao.findById(id); }

    public SuCoThietBiDTO findByIdDTO(String id) throws SQLException {
        SuCoThietBiDTO dto = suCoDao.findByIdDTO(id);
        if (dto != null) {
            dto.setChuKyList(kyTaiLieuDao.findById(id));
            dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id));
            dto.setDanhSachTaiSan(chiTietDao.findByIdSuCo(id));
        }
        return dto;
    }

    public List<SuCoThietBiDTO> findByIdKeHoach(String idKeHoach) throws SQLException {
        List<SuCoThietBiDTO> list = suCoDao.findByIdKeHoach(idKeHoach);
        for (SuCoThietBiDTO dto : list) {
            dto.setChuKyList(kyTaiLieuDao.findById(dto.getId()));
            dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(dto.getId()));
            dto.setDanhSachTaiSan(chiTietDao.findByIdSuCo(dto.getId()));
        }
        return list;
    }

    @Transactional
    public SuCoThietBi insert(SuCoThietBiDTO dto) throws SQLException {
        SuCoThietBi entity = new SuCoThietBi();
        BeanUtils.copyProperties(dto, entity);
        SuCoThietBi result = suCoDao.insert(entity);
        if (result != null) {
            String sucoId = result.getId();
            
            if (dto.getDanhSachTaiSan() != null && !dto.getDanhSachTaiSan().isEmpty()) {
                for (SuCoThietBiChiTiet chiTiet : dto.getDanhSachTaiSan()) {
                    if (chiTiet.getIdTaiSan() != null && !chiTiet.getIdTaiSan().isEmpty()) {
                        if (taiSanService.getById(chiTiet.getIdTaiSan()) == null) {
                            throw new IllegalArgumentException("Tài sản không tồn tại: " + chiTiet.getIdTaiSan());
                        }
                    }
                    chiTiet.setId(chiTietDao.generateNextId());
                    chiTiet.setIdSuCo(sucoId);
                }
                chiTietDao.batchInsert(dto.getDanhSachTaiSan());
            }

            // 2. Insert signers
            if (dto.getNguoiKyList() != null && !dto.getNguoiKyList().isEmpty()) {
                for (NguoiKy nk : dto.getNguoiKyList()) {
                    nk.setIdTaiLieu(sucoId);
                }
                kyTaiLieuDao.insertNguoiKyBatch(dto.getNguoiKyList());
            }
        }
        return result;
    }

    @Transactional
    public SuCoThietBi update(SuCoThietBiDTO dto) throws SQLException {
        SuCoThietBi entity = new SuCoThietBi();
        BeanUtils.copyProperties(dto, entity);
        SuCoThietBi result = suCoDao.update(entity);
        if (result != null) {
            String sucoId = result.getId();

            // 1. Re-insert details
            chiTietDao.deleteByIdSuCo(sucoId);
            if (dto.getDanhSachTaiSan() != null && !dto.getDanhSachTaiSan().isEmpty()) {
                for (SuCoThietBiChiTiet chiTiet : dto.getDanhSachTaiSan()) {
                    if (chiTiet.getIdTaiSan() != null && !chiTiet.getIdTaiSan().isEmpty()) {
                        if (taiSanService.getById(chiTiet.getIdTaiSan()) == null) {
                            throw new IllegalArgumentException("Tài sản không tồn tại: " + chiTiet.getIdTaiSan());
                        }
                    }
                    chiTiet.setId(chiTietDao.generateNextId());
                    chiTiet.setIdSuCo(sucoId);
                }
                chiTietDao.batchInsert(dto.getDanhSachTaiSan());
            }

            // 2. Re-insert signers
            kyTaiLieuDao.delete(sucoId); // Clear existing drawn signatures
            if (dto.getNguoiKyList() != null) {
                for (NguoiKy nk : dto.getNguoiKyList()) {
                    nk.setIdTaiLieu(sucoId);
                }
                kyTaiLieuDao.updateNguoiKy(sucoId, dto.getNguoiKyList());
            } else {
                kyTaiLieuDao.deleteAllNguoiKy(sucoId);
            }
        }
        return result;
    }

    public int updateGhiChu(String id, String ghiChuBienBan) {
        return suCoDao.updateGhiChu(id, ghiChuBienBan);
    }

    public int updateTrangThai(String id, String userId) {
        return suCoDao.updateTrangThai(id, userId);
    }

    public int huySuCo(String id) { return suCoDao.huySuCo(id); }

    @Transactional
    public int delete(String id) throws SQLException {
        chiTietDao.deleteByIdSuCo(id);
        kyTaiLieuDao.deleteAllNguoiKy(id);
        kyTaiLieuDao.delete(id);
        return suCoDao.delete(id);
    }

    @Transactional
    public void bulkDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) return;
        for (String id : ids) {
            chiTietDao.deleteByIdSuCo(id);
            kyTaiLieuDao.deleteAllNguoiKy(id);
            kyTaiLieuDao.delete(id);
        }
        suCoDao.batchDelete(ids);
    }

    // ==================== Workflow: turn-filter ====================

    public boolean isNeedToSign(SuCoThietBiDTO item, String userId) {
        if (userId == null || userId.isEmpty()) return false;
        
        // ===== Trạng thái nháp/hoàn thành/hủy bỏ (trangThai 2, 3 bỏ qua) =====
        if (item.getTrangThai() != null && (item.getTrangThai() == 2 || item.getTrangThai() == 3)) {
            return false;
        }

        // ===== Kiểm tra điều kiện share / người tạo ký trước khi share =====
        if (!Boolean.TRUE.equals(item.getShare())) {
            // Nếu chưa share, chỉ cho phép ký nếu userId là người tạo trùng với người ký đầu tiên và người đó chưa ký.
            boolean isCreatorAndFirstSigner = false;

            // 1. Kiểm tra người lập (người ký đầu tiên)
            if (item.getIdNguoiLap() != null && !item.getIdNguoiLap().isEmpty()) {
                if (userId.equalsIgnoreCase(item.getNguoiTao()) && userId.equalsIgnoreCase(item.getIdNguoiLap())) {
                    if (!Boolean.TRUE.equals(item.getNguoiLapXacNhan())) {
                        isCreatorAndFirstSigner = true;
                    }
                }
            } else {
                // 2. Nếu không có người lập, kiểm tra người ký đầu tiên trong danh sách NguoiKy
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

        // Bước 1: Người lập
        if (item.getIdNguoiLap() != null && !item.getIdNguoiLap().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getNguoiLapXacNhan()))
                return userId.equals(item.getIdNguoiLap());
        }

        // Bước 2: NguoiKy list & Giám đốc
        boolean lapDone = item.getIdNguoiLap() == null || item.getIdNguoiLap().isEmpty()
                || Boolean.TRUE.equals(item.getNguoiLapXacNhan());
        if (lapDone) {
            List<NguoiKy> kyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
            if (kyList != null && !kyList.isEmpty()) {
                NguoiKy firstUnsigned = null;
                boolean allSigned = true;
                for (NguoiKy nk : kyList) {
                    if (nk.getTrangThai() != 1) {
                        allSigned = false;
                        if (firstUnsigned == null) firstUnsigned = nk;
                    }
                }
                if (firstUnsigned != null) return userId.equals(firstUnsigned.getIdNguoiKy());
                if (allSigned && !Boolean.TRUE.equals(item.getGiamDocXacNhan()))
                    return userId.equals(item.getIdGiamDoc());
            } else {
                if (!Boolean.TRUE.equals(item.getGiamDocXacNhan()))
                    return userId.equals(item.getIdGiamDoc());
            }
        }
        return false;
    }

    public boolean isUserTurnToSign(SuCoThietBiDTO item, String userId) {
        if (userId != null && userId.equals(item.getNguoiTao())) return true;
        if (!Boolean.TRUE.equals(item.getShare())) return false;

        // Bước 1: Người lập
        if (item.getIdNguoiLap() != null && !item.getIdNguoiLap().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getNguoiLapXacNhan()))
                return userId != null && userId.equals(item.getIdNguoiLap());
            if (userId != null && userId.equals(item.getIdNguoiLap())) return true;
        }

        // Bước 2: NguoiKy list & Giám đốc
        boolean lapDone = item.getIdNguoiLap() == null || item.getIdNguoiLap().isEmpty()
                || Boolean.TRUE.equals(item.getNguoiLapXacNhan());
        if (lapDone) {
            List<NguoiKy> kyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
            if (kyList != null && !kyList.isEmpty()) {
                NguoiKy firstUnsigned = null;
                boolean allSigned = true, userSigned = false, userInList = false;
                for (NguoiKy nk : kyList) {
                    if (nk.getTrangThai() != 1) { allSigned = false; if (firstUnsigned == null) firstUnsigned = nk; }
                    if (userId != null && userId.equals(nk.getIdNguoiKy())) {
                        userInList = true;
                        if (nk.getTrangThai() == 1) userSigned = true;
                    }
                }
                if (userSigned) return true;
                if (firstUnsigned != null && userInList && userId != null && userId.equals(firstUnsigned.getIdNguoiKy())) return true;
                if (allSigned && !Boolean.TRUE.equals(item.getGiamDocXacNhan()))
                    return userId != null && userId.equals(item.getIdGiamDoc());
            } else {
                if (!Boolean.TRUE.equals(item.getGiamDocXacNhan()))
                    return userId != null && userId.equals(item.getIdGiamDoc());
            }
        }
        if (Boolean.TRUE.equals(item.getGiamDocXacNhan())
                && userId != null && userId.equals(item.getIdGiamDoc()))
            return true;

        return false;
    }

    // ==================== Permission signing ====================

    public int getPermissionSigning(SuCoThietBiDTO item, String tenDangNhap) {
        List<Map<String, Object>> flow = new ArrayList<>();

        if (item.getIdNguoiLap() != null && !item.getIdNguoiLap().isEmpty()) {
            Map<String, Object> s = new HashMap<>();
            s.put("id", item.getIdNguoiLap());
            s.put("signed", Boolean.TRUE.equals(item.getNguoiLapXacNhan()));
            s.put("label", "Người lập: " + item.getTenNguoiLap());
            flow.add(s);
        }

        List<NguoiKy> kyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
        if (kyList != null) {
            for (int i = 0; i < kyList.size(); i++) {
                NguoiKy nk = kyList.get(i);
                if (nk.getIdNguoiKy() != null && !nk.getIdNguoiKy().isEmpty()) {
                    Map<String, Object> s = new HashMap<>();
                    s.put("id", nk.getIdNguoiKy());
                    s.put("signed", nk.getTrangThai() == 1);
                    s.put("label", "Người ký " + (i + 1) + ": " + nk.getTenNguoiKy());
                    flow.add(s);
                }
            }
        }

        if (item.getIdGiamDoc() != null && !item.getIdGiamDoc().isEmpty()) {
            Map<String, Object> s = new HashMap<>();
            s.put("id", item.getIdGiamDoc());
            s.put("signed", Boolean.TRUE.equals(item.getGiamDocXacNhan()));
            s.put("label", "Giám đốc duyệt: " + item.getTenGiamDoc());
            flow.add(s);
        }

        flow = flow.stream()
                .filter(s -> s.get("id") != null && !((String) s.get("id")).isEmpty())
                .collect(Collectors.toList());

        int idx = -1;
        for (int i = 0; i < flow.size(); i++)
            if (Objects.equals(flow.get(i).get("id"), tenDangNhap)) { idx = i; break; }
        if (idx == -1) return 2;

        Object signedObj = flow.get(idx).get("signed");
        boolean signed = signedObj instanceof Boolean && (Boolean) signedObj;
        if (Objects.equals(item.getNguoiTao(), tenDangNhap) && signedObj != null) return signed ? 4 : 5;
        if (signed) return 3;
        boolean prevNotSigned = flow.subList(0, idx).stream().anyMatch(s -> Boolean.FALSE.equals(s.get("signed")));
        return prevNotSigned ? 1 : 0;
    }

    // ==================== Comparator ====================

    private Comparator<SuCoThietBiDTO> getComparator(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> pm = new HashMap<>();
            pm.put(0, 1); pm.put(1, 2); pm.put(3, 3); pm.put(2, 4);
            return Comparator.<SuCoThietBiDTO>comparingInt(i -> pm.getOrDefault(i.getTrangThai(), 5))
                    .thenComparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                            Comparator.nullsLast(Comparator.reverseOrder()));
        }
        boolean asc = "asc".equalsIgnoreCase(sortDir);
        Comparator<SuCoThietBiDTO> comp;
        switch (sortBy.trim().toLowerCase()) {
            case "sophieu":
                comp = Comparator.comparing(i -> i.getSoPhieu() != null ? i.getSoPhieu() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)); break;
            case "mucdo":
                comp = Comparator.comparing(i -> i.getMucDo() != null ? i.getMucDo() : 0,
                        Comparator.nullsLast(Integer::compareTo)); break;
            case "trangthai":
                comp = Comparator.comparing(i -> i.getTrangThai() != null ? i.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo)); break;
            case "ngayphatHien":
                comp = Comparator.comparing(i -> i.getNgayPhatHien() != null ? i.getNgayPhatHien() : "",
                        Comparator.nullsLast(String::compareTo)); break;
            case "ngaytao": default:
                comp = Comparator.comparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                        Comparator.nullsLast(String::compareTo)); break;
        }
        return asc ? comp : comp.reversed();
    }
}
