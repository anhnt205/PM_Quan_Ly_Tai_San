package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.NghiemThuPhuongTienDao;
import com.ecotel.quanlytaisan.dao.NghiemThuPhuongTienChiTietDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NghiemThuPhuongTienService {

    @Autowired
    private NghiemThuPhuongTienDao nghiemThuPhuongTienDao;

    @Autowired
    private NghiemThuPhuongTienChiTietDao chiTietDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    // ─── Queries ─────────────────────────────────────────────────────────────

    public List<NghiemThuPhuongTienDTO> findAll(String idCongTy) {
        List<NghiemThuPhuongTienDTO> list = nghiemThuPhuongTienDao.findAll(idCongTy);
        for (NghiemThuPhuongTienDTO item : list) enrichData(item);
        return list;
    }

    public NghiemThuPhuongTienDTO findByIdDTO(String id) {
        NghiemThuPhuongTienDTO dto = nghiemThuPhuongTienDao.findByIdDTO(id);
        if (dto != null) enrichData(dto);
        return dto;
    }

    public List<NghiemThuPhuongTienDTO> findByIdBienPhapPhuongTien(String idBienPhapPhuongTien) {
        List<NghiemThuPhuongTienDTO> list = nghiemThuPhuongTienDao.findByIdBienPhapPhuongTien(idBienPhapPhuongTien);
        for (NghiemThuPhuongTienDTO item : list) enrichData(item);
        return list;
    }

    private void enrichData(NghiemThuPhuongTienDTO item) {
        item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
        item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
        item.setDanhSachChiTiet(chiTietDao.findByIdNghiemThu(item.getId()));
    }

    // ─── Commands ────────────────────────────────────────────────────────────

    @Transactional
    public NghiemThuPhuongTien insert(NghiemThuPhuongTien entity) {
        NghiemThuPhuongTien saved = nghiemThuPhuongTienDao.insert(entity);
        if (saved != null) {
            // Insert chi tiết vật tư
            if (entity.getDanhSachChiTiet() != null && !entity.getDanhSachChiTiet().isEmpty()) {
                for (NghiemThuPhuongTienChiTiet ct : entity.getDanhSachChiTiet()) {
                    ct.setIdNghiemThuPhuongTien(saved.getId());
                    ct.setId(chiTietDao.generateNextId());
                    chiTietDao.insert(ct);
                }
            }
            // Update người ký
            if (entity.getNguoiKyList() != null && !entity.getNguoiKyList().isEmpty()) {
                entity.getNguoiKyList().forEach(nk -> nk.setIdTaiLieu(saved.getId()));
                kyTaiLieuDao.updateNguoiKy(saved.getId(), entity.getNguoiKyList());
            }
        }
        return saved;
    }

    @Transactional
    public NghiemThuPhuongTien update(NghiemThuPhuongTien entity) {
        NghiemThuPhuongTien updated = nghiemThuPhuongTienDao.update(entity);
        if (updated != null) {
            // Xoá chi tiết cũ rồi insert lại
            chiTietDao.deleteByIdNghiemThu(entity.getId());
            if (entity.getDanhSachChiTiet() != null && !entity.getDanhSachChiTiet().isEmpty()) {
                for (NghiemThuPhuongTienChiTiet ct : entity.getDanhSachChiTiet()) {
                    ct.setIdNghiemThuPhuongTien(entity.getId());
                    ct.setId(chiTietDao.generateNextId());
                    chiTietDao.insert(ct);
                }
            }
            // Update người ký
            if (entity.getNguoiKyList() != null) {
                entity.getNguoiKyList().forEach(nk -> nk.setIdTaiLieu(entity.getId()));
                kyTaiLieuDao.updateNguoiKy(entity.getId(), entity.getNguoiKyList());
            }
        }
        return updated;
    }

    @Transactional
    public int updateTrangThai(String id, String userId) {
        NghiemThuPhuongTien nt = nghiemThuPhuongTienDao.findById(id);
        if (nt == null) return 0;

        int trangThai = nt.getTrangThai() != null ? nt.getTrangThai() : 0;

        // Cập nhật trạng thái ký trong bảng NguoiKy
        NguoiKy nk = kyTaiLieuDao.getNguoiKy(userId, id);
        if (nk != null) kyTaiLieuDao.updateTrangThai(nk.getId(), "1");

        // Người lập xác nhận
        if (Objects.equals(userId, nt.getIdNguoiLap())) {
            nt.setNguoiLapXacNhan(true);
            trangThai = 1;
        }

        // Giám đốc xác nhận
        if (Objects.equals(userId, nt.getIdGiamDoc())) {
            nt.setGiamDocXacNhan(true);
            trangThai = 1;
        }

        // Kiểm tra tất cả đã ký
        boolean allKy = true;
        if (nt.getIdNguoiLap() != null && !nt.getIdNguoiLap().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(nt.getNguoiLapXacNhan());
        if (nt.getIdGiamDoc() != null && !nt.getIdGiamDoc().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(nt.getGiamDocXacNhan());

        if (allKy) {
            List<NguoiKy> nkList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id);
            if (nkList != null && !nkList.isEmpty()) {
                for (NguoiKy n : nkList) {
                    if (n.getTrangThai() != 1) { allKy = false; break; }
                }
            }
        }

        if (allKy) trangThai = 3;
        nt.setTrangThai(trangThai);
        NghiemThuPhuongTien result = nghiemThuPhuongTienDao.update(nt);
        return result != null ? result.getTrangThai() : 0;
    }

    @Transactional
    public int huyNghiemThu(String id) {
        return nghiemThuPhuongTienDao.huy(id);
    }

    @Transactional
    public void bulkUpdate(List<NghiemThuPhuongTien> list) {
        for (NghiemThuPhuongTien e : list) nghiemThuPhuongTienDao.update(e);
    }

    @Transactional
    public int delete(String id) {
        chiTietDao.deleteByIdNghiemThu(id);
        kyTaiLieuDao.delete(id);
        return nghiemThuPhuongTienDao.delete(id);
    }

    // ─── Paged ───────────────────────────────────────────────────────────────

    public PageResponse<NghiemThuPhuongTienDTO> findAllPaged(
            String idCongTy, int page, int size,
            String sortBy, String sortDir, String search,
            Integer trangThai, String userid, Boolean isSign,
            String dateFrom, String dateTo
    ) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<NghiemThuPhuongTienDTO> sourceList = nghiemThuPhuongTienDao.findAll(idCongTy);

        // Lọc theo user
        if (userid != null && !userid.trim().isEmpty()) {
            boolean shouldFilter = !"admin".equalsIgnoreCase(userid) || (isSign != null && isSign);
            if (shouldFilter) {
                List<NghiemThuPhuongTienDTO> filtered = new ArrayList<>();
                for (NghiemThuPhuongTienDTO item : sourceList) {
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
        for (NghiemThuPhuongTienDTO item : sourceList) {
            if (item.getTrangThai() != null) {
                String key = item.getTrangThai().toString();
                trangThaiCounts.put(key, trangThaiCounts.getOrDefault(key, 0L) + 1);
            }
        }

        // Filters
        if (trangThai != null)
            sourceList = sourceList.stream()
                    .filter(i -> trangThai.equals(i.getTrangThai()))
                    .collect(Collectors.toList());

        if (dateFrom != null && !dateFrom.isEmpty())
            sourceList = sourceList.stream()
                    .filter(i -> i.getNgayTao() != null && i.getNgayTao().compareTo(dateFrom) >= 0)
                    .collect(Collectors.toList());

        if (dateTo != null && !dateTo.isEmpty()) {
            String dateToEnd = dateTo + " 23:59:59";
            sourceList = sourceList.stream()
                    .filter(i -> i.getNgayTao() != null && i.getNgayTao().compareTo(dateToEnd) <= 0)
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(i -> (i.getSoPhieu() != null && i.getSoPhieu().toLowerCase().contains(q))
                            || (i.getNoiDung() != null && i.getNoiDung().toLowerCase().contains(q))
                            || (i.getTinhTrang() != null && i.getTinhTrang().toLowerCase().contains(q))
                            || (i.getKetLuan() != null && i.getKetLuan().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to   = Math.min(from + size, sourceList.size());
        List<NghiemThuPhuongTienDTO> items = new ArrayList<>(sourceList.subList(from, to));

        for (NghiemThuPhuongTienDTO item : items) enrichData(item);

        PageResponse<NghiemThuPhuongTienDTO> response = new PageResponse<>(items, total, page, size);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    // ─── Signing helpers ─────────────────────────────────────────────────────

    public boolean isNeedToSign(NghiemThuPhuongTienDTO item, String userId) {
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
                return userId.equalsIgnoreCase(item.getIdNguoiLap());
        }

        // Bước 2: NguoiKy list & Giám đốc
        boolean lapDone = item.getIdNguoiLap() == null || item.getIdNguoiLap().isEmpty()
                || Boolean.TRUE.equals(item.getNguoiLapXacNhan());
        if (lapDone) {
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
                if (allSigned && !Boolean.TRUE.equals(item.getGiamDocXacNhan()))
                    return userId.equalsIgnoreCase(item.getIdGiamDoc());
            } else {
                if (!Boolean.TRUE.equals(item.getGiamDocXacNhan()))
                    return userId.equalsIgnoreCase(item.getIdGiamDoc());
            }
        }
        return false;
    }

    public boolean isUserTurnToSign(NghiemThuPhuongTienDTO item, String userId) {
        if (userId != null && userId.equals(item.getNguoiTao())) return true;
        if (!Boolean.TRUE.equals(item.getShare())) return false;

        if (item.getIdNguoiLap() != null && !item.getIdNguoiLap().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getNguoiLapXacNhan()))
                return userId != null && userId.equals(item.getIdNguoiLap());
            if (userId != null && userId.equals(item.getIdNguoiLap())) return true;
        }

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

    public int getPermissionSigning(NghiemThuPhuongTienDTO item, String tenDangNhap) {
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
        if (Objects.equals(item.getNguoiTao(), tenDangNhap) && signedObj != null)
            return signed ? 4 : 5;
        if (signed) return 3;
        boolean prevNotSigned = flow.subList(0, idx).stream()
                .anyMatch(s -> Boolean.FALSE.equals(s.get("signed")));
        return prevNotSigned ? 1 : 0;
    }

    // ─── Comparator ──────────────────────────────────────────────────────────

    private Comparator<NghiemThuPhuongTienDTO> getComparator(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> pm = new HashMap<>();
            pm.put(0, 1); pm.put(1, 2); pm.put(3, 3); pm.put(2, 4);
            return Comparator.<NghiemThuPhuongTienDTO>comparingInt(i -> pm.getOrDefault(i.getTrangThai(), 5))
                    .thenComparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                            Comparator.nullsLast(Comparator.reverseOrder()));
        }
        boolean asc = "asc".equalsIgnoreCase(sortDir);
        Comparator<NghiemThuPhuongTienDTO> comp;
        switch (sortBy.trim().toLowerCase()) {
            case "sophieu":
                comp = Comparator.comparing(i -> i.getSoPhieu() != null ? i.getSoPhieu() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)); break;
            case "trangthai":
                comp = Comparator.comparing(i -> i.getTrangThai() != null ? i.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo)); break;
            case "ngaytao": default:
                comp = Comparator.comparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                        Comparator.nullsLast(String::compareTo)); break;
        }
        return asc ? comp : comp.reversed();
    }
}
