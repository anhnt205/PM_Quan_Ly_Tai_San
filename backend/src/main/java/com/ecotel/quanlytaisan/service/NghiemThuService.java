package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.NghiemThuDao;
import com.ecotel.quanlytaisan.dao.NghiemThuTaiSanDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.dao.BienPhapMayMocDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NghiemThuService {

    @Autowired
    private NghiemThuDao nghiemThuDao;

    @Autowired
    private NghiemThuTaiSanDao nghiemThuTaiSanDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    @Autowired
    private BienPhapMayMocDao bienPhapDao;

    @Autowired
    private TaiSanService taiSanService;

    public List<NghiemThuDTO> findAll(String idCongTy) {
        List<NghiemThuDTO> list = nghiemThuDao.findAll(idCongTy);
        for (NghiemThuDTO item : list) {
            enrichData(item);
        }
        return list;
    }

    public NghiemThuDTO findByIdDTO(String id) {
        NghiemThuDTO dto = nghiemThuDao.findByIdDTO(id);
        if (dto != null) enrichData(dto);
        return dto;
    }

    public List<NghiemThuDTO> findByIdBienPhapMayMoc(String idBienPhapMayMoc) {
        List<NghiemThuDTO> list = nghiemThuDao.findByIdBienPhapMayMoc(idBienPhapMayMoc);
        for (NghiemThuDTO item : list) {
            enrichData(item);
        }
        return list;
    }

    public List<NghiemThuDTO> findByIdGiamDinhMayMoc(String idGiamDinhMayMoc) {
        List<NghiemThuDTO> list = nghiemThuDao.findByIdGiamDinhMayMoc(idGiamDinhMayMoc);
        for (NghiemThuDTO item : list) {
            enrichData(item);
        }
        return list;
    }

    private void enrichData(NghiemThuDTO item) {
        item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
        item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
        item.setDanhSachTaiSan(nghiemThuTaiSanDao.findByIdBienBan(item.getId()));
    }

    @Transactional
    public NghiemThu insert(NghiemThu entity) {
        NghiemThu saved = nghiemThuDao.insert(entity);
        if (saved != null) {
            if (entity.getDanhSachTaiSan() != null && !entity.getDanhSachTaiSan().isEmpty()) {
                for (NghiemThuTaiSan ts : entity.getDanhSachTaiSan()) {
                    if (ts.getIdTaiSan() != null && !ts.getIdTaiSan().isEmpty()) {
                        if (taiSanService.getById(ts.getIdTaiSan()) == null) {
                            throw new IllegalArgumentException("Tài sản không tồn tại: " + ts.getIdTaiSan());
                        }
                    }
                    ts.setIdBienBan(saved.getId());
                    ts.setId(nghiemThuTaiSanDao.generateNextIdTaiSan());
                    nghiemThuTaiSanDao.insertTaiSan(ts);
                    if (ts.getDanhSachVatTu() != null && !ts.getDanhSachVatTu().isEmpty()) {
                        for (NghiemThuVatTu vt : ts.getDanhSachVatTu()) {
                            vt.setIdBienBanTaiSan(ts.getId());
                            vt.setId(nghiemThuTaiSanDao.generateNextIdVatTu());
                        }
                        nghiemThuTaiSanDao.batchInsertVatTu(ts.getDanhSachVatTu());
                    }
                }
            }
            if (entity.getNguoiKyList() != null && !entity.getNguoiKyList().isEmpty()) {
                entity.getNguoiKyList().forEach(nk -> nk.setIdTaiLieu(saved.getId()));
                kyTaiLieuDao.updateNguoiKy(saved.getId(), entity.getNguoiKyList());
            }
            bienPhapDao.refreshCache();
        }
        return saved;
    }

    @Transactional
    public NghiemThu update(NghiemThu entity) {
        NghiemThu updated = nghiemThuDao.update(entity);
        if (updated != null) {
            // Delete old details recursively
            nghiemThuTaiSanDao.deleteByIdBienBan(entity.getId());
            
            // Insert new ones recursively
            if (entity.getDanhSachTaiSan() != null && !entity.getDanhSachTaiSan().isEmpty()) {
                for (NghiemThuTaiSan ts : entity.getDanhSachTaiSan()) {
                    if (ts.getIdTaiSan() != null && !ts.getIdTaiSan().isEmpty()) {
                        if (taiSanService.getById(ts.getIdTaiSan()) == null) {
                            throw new IllegalArgumentException("Tài sản không tồn tại: " + ts.getIdTaiSan());
                        }
                    }
                    ts.setIdBienBan(entity.getId());
                    ts.setId(nghiemThuTaiSanDao.generateNextIdTaiSan());
                    nghiemThuTaiSanDao.insertTaiSan(ts);
                    if (ts.getDanhSachVatTu() != null && !ts.getDanhSachVatTu().isEmpty()) {
                        for (NghiemThuVatTu vt : ts.getDanhSachVatTu()) {
                            vt.setIdBienBanTaiSan(ts.getId());
                            vt.setId(nghiemThuTaiSanDao.generateNextIdVatTu());
                        }
                        nghiemThuTaiSanDao.batchInsertVatTu(ts.getDanhSachVatTu());
                    }
                }
            }
            // Update signers
            if (entity.getNguoiKyList() != null) {
                entity.getNguoiKyList().forEach(nk -> nk.setIdTaiLieu(entity.getId()));
                kyTaiLieuDao.updateNguoiKy(entity.getId(), entity.getNguoiKyList());
            }
            bienPhapDao.refreshCache();
        }
        return updated;
    }

    public int updateGhiChu(String id, String ghiChuBienBan) {
        return nghiemThuDao.updateGhiChu(id, ghiChuBienBan);
    }

    @Transactional
    public int updateTrangThai(String id, String userId) {
        NghiemThu nt = nghiemThuDao.findById(id);
        if (nt == null) return 0;

        int trangThai = nt.getTrangThai() != null ? nt.getTrangThai() : 0;

        // 1. Cập nhật trạng thái ký trong bảng NguoiKy
        NguoiKy nk = kyTaiLieuDao.getNguoiKy(userId, id);
        if (nk != null) kyTaiLieuDao.updateTrangThai(nk.getId(), "1");

        // 2. Cập nhật xác nhận của Người lập
        if (Objects.equals(userId, nt.getIdNguoiLap())) {
            nt.setNguoiLapXacNhan(true);
            trangThai = 1;
        }

        // 3. Cập nhật xác nhận của Giám đốc
        if (Objects.equals(userId, nt.getIdGiamDoc())) {
            nt.setGiamDocXacNhan(true);
            trangThai = 1;
        }

        // 4. Kiểm tra tất cả đã ký chưa
        boolean allKy = true;
        if (nt.getIdNguoiLap() != null && !nt.getIdNguoiLap().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(nt.getNguoiLapXacNhan());
        }
        if (nt.getIdGiamDoc() != null && !nt.getIdGiamDoc().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(nt.getGiamDocXacNhan());
        }
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
        NghiemThu result = nghiemThuDao.update(nt);
        return result != null ? result.getTrangThai() : 0;
    }

    @Transactional
    public int huyNghiemThu(String id) {
        return nghiemThuDao.huy(id);
    }

    @Transactional
    public void bulkUpdate(List<NghiemThu> list) {
        for (NghiemThu e : list) nghiemThuDao.update(e);
    }

    @Transactional
    public int delete(String id) {
        nghiemThuTaiSanDao.deleteByIdBienBan(id);
        kyTaiLieuDao.deleteAllNguoiKy(id);
        kyTaiLieuDao.delete(id);
        int r = nghiemThuDao.delete(id);
        if (r > 0) {
            bienPhapDao.refreshCache();
        }
        return r;
    }

    public PageResponse<NghiemThuDTO> findAllPaged(
            String idCongTy, int page, int size,
            String sortBy, String sortDir, String search,
            Integer trangThai, String userid, Boolean isSign,
            String dateFrom, String dateTo, String idTaiSan
    ) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<NghiemThuDTO> sourceList = nghiemThuDao.findAll(idCongTy);

        // Filter by turn
        if (userid != null && !userid.trim().isEmpty()) {
            boolean shouldFilter = !"admin".equalsIgnoreCase(userid) || (isSign != null && isSign);
            if (shouldFilter) {
                List<NghiemThuDTO> filtered = new ArrayList<>();
                for (NghiemThuDTO item : sourceList) {
                    if (isSign != null && isSign) {
                        if (isNeedToSign(item, userid)) filtered.add(item);
                    } else {
                        if (isUserTurnToSign(item, userid)) filtered.add(item);
                    }
                }
                sourceList = filtered;
            }
        }

        // Count by trangThai
        Map<String, Long> trangThaiCounts = new HashMap<>();
        for (NghiemThuDTO item : sourceList) {
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
        
        if (dateFrom != null && !dateFrom.isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(i -> i.getNgayTao() != null && i.getNgayTao().compareTo(dateFrom) >= 0)
                    .collect(Collectors.toList());
        }
        if (dateTo != null && !dateTo.isEmpty()) {
            String dateToEnd = dateTo + " 23:59:59";
            sourceList = sourceList.stream()
                    .filter(i -> i.getNgayTao() != null && i.getNgayTao().compareTo(dateToEnd) <= 0)
                    .collect(Collectors.toList());
        }

        if (idTaiSan != null && !idTaiSan.trim().isEmpty()) {
            List<NghiemThuDTO> filtered = new ArrayList<>();
            for (NghiemThuDTO item : sourceList) {
                List<NghiemThuTaiSan> details = nghiemThuTaiSanDao.findByIdBienBan(item.getId());
                boolean match = details.stream().anyMatch(d -> idTaiSan.equalsIgnoreCase(d.getIdTaiSan()));
                if (match) {
                    filtered.add(item);
                }
            }
            sourceList = filtered;
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(i -> (i.getSoPhieu() != null && i.getSoPhieu().toLowerCase().contains(q))
                            || (i.getViTri() != null && i.getViTri().toLowerCase().contains(q))
                            || (i.getTenThietBi() != null && i.getTenThietBi().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to   = Math.min(from + size, sourceList.size());
        List<NghiemThuDTO> items = new ArrayList<>(sourceList.subList(from, to));

        for (NghiemThuDTO item : items) enrichData(item);

        PageResponse<NghiemThuDTO> response = new PageResponse<>(items, total, page, size);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

   public boolean isNeedToSign(NghiemThuDTO item, String userId) {
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

    public boolean isUserTurnToSign(NghiemThuDTO item, String userId) {
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

    public int getPermissionSigning(NghiemThuDTO item, String tenDangNhap) {
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

    private Comparator<NghiemThuDTO> getComparator(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> pm = new HashMap<>();
            pm.put(0, 1); pm.put(1, 2); pm.put(3, 3); pm.put(2, 4);
            return Comparator.<NghiemThuDTO>comparingInt(i -> pm.getOrDefault(i.getTrangThai(), 5))
                    .thenComparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                            Comparator.nullsLast(Comparator.reverseOrder()));
        }
        boolean asc = "asc".equalsIgnoreCase(sortDir);
        Comparator<NghiemThuDTO> comp;
        switch (sortBy.trim().toLowerCase()) {
            case "sophieu":
                comp = Comparator.comparing(i -> i.getSoPhieu() != null ? i.getSoPhieu() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)); break;
            case "trangthai":
                comp = Comparator.comparing(i -> i.getTrangThai() != null ? i.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo)); break;
            case "ngaynghiemthu":
                comp = Comparator.comparing(i -> i.getNgayNghiemThu() != null ? i.getNgayNghiemThu() : "",
                        Comparator.nullsLast(String::compareTo)); break;
            case "ngaytao": default:
                comp = Comparator.comparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                        Comparator.nullsLast(String::compareTo)); break;
        }
        return asc ? comp : comp.reversed();
    }
}
