package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.GiamDinhMayMocDao;
import com.ecotel.quanlytaisan.dao.GiamDinhMayMocChiTietDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.GiamDinhMayMoc;
import com.ecotel.quanlytaisan.model.GiamDinhMayMocDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.NguoiKy;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GiamDinhMayMocService {

    @Autowired
    private GiamDinhMayMocDao giamDinhMayMocDao;

    @Autowired
    private GiamDinhMayMocChiTietDao giamDinhMayMocChiTietDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    public List<GiamDinhMayMocDTO> findAll(String idCongTy) {
        List<GiamDinhMayMocDTO> list = giamDinhMayMocDao.findAll(idCongTy);
        for (GiamDinhMayMocDTO item : list) {
            enrichData(item);
        }
        return list;
    }

    public GiamDinhMayMocDTO findByIdDTO(String id) {
        GiamDinhMayMocDTO dto = giamDinhMayMocDao.findByIdDTO(id);
        if (dto != null) {
            enrichData(dto);
        }
        return dto;
    }

    public List<GiamDinhMayMocDTO> findByIdBienBan(String idBienBan) {
        List<GiamDinhMayMocDTO> list = giamDinhMayMocDao.findAll(null).stream()
                .filter(d -> idBienBan != null && idBienBan.equalsIgnoreCase(d.getIdBienBan()))
                .collect(Collectors.toList());
        for (GiamDinhMayMocDTO item : list) {
            enrichData(item);
        }
        return list;
    }

    private void enrichData(GiamDinhMayMocDTO item) {
        item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
        item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
        item.setDanhSachChiTiet(giamDinhMayMocChiTietDao.findByIdGiamDinh(item.getId()));
    }

    @Transactional
    public GiamDinhMayMoc insert(GiamDinhMayMoc entity) {
        return giamDinhMayMocDao.insert(entity);
    }

    @Transactional
    public GiamDinhMayMoc update(GiamDinhMayMoc entity) {
        return giamDinhMayMocDao.update(entity);
    }

    @Transactional
    public int updateTrangThai(String id, String userId) {
        GiamDinhMayMoc gd = giamDinhMayMocDao.findById(id);
        if (gd == null) return 0;

        int trangThai = gd.getTrangThai() != null ? gd.getTrangThai() : 0;

        // 1. Cập nhật trạng thái ký trong bảng NguoiKy
        updateTrangThaiKy(id, userId);

        // 2. Cập nhật xác nhận của Người lập
        if (java.util.Objects.equals(userId, gd.getIdNguoiLap())) {
            gd.setNguoiLapXacNhan(true);
            trangThai = 1;
        }

        // 3. Cập nhật xác nhận của Giám đốc
        if (java.util.Objects.equals(userId, gd.getIdGiamDoc())) {
            gd.setGiamDocXacNhan(true);
            trangThai = 1;
        }

        // 4. Kiểm tra xem tất cả đã ký chưa
        boolean allKy = true;
        if (gd.getIdNguoiLap() != null && !gd.getIdNguoiLap().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(gd.getNguoiLapXacNhan());
        }
        if (gd.getIdGiamDoc() != null && !gd.getIdGiamDoc().isEmpty()) {
            allKy = allKy && Boolean.TRUE.equals(gd.getGiamDocXacNhan());
        }

        if (allKy) {
            allKy = checkAllOtherNguoiKy(id);
        }

        // Nếu tất cả đã ký thì chuyển trạng thái sang 3 (Đã hoàn thành)
        if (allKy) {
            trangThai = 3;
        }

        gd.setTrangThai(trangThai);
        GiamDinhMayMoc result = giamDinhMayMocDao.update(gd);

        return result != null ? result.getTrangThai() : 0;
    }

    private void updateTrangThaiKy(String id, String userId) {
        com.ecotel.quanlytaisan.model.NguoiKy nk = kyTaiLieuDao.getNguoiKy(userId, id);
        if (nk != null) {
            kyTaiLieuDao.updateTrangThai(nk.getId(), "1");
        }
    }

    private boolean checkAllOtherNguoiKy(String id) {
        List<com.ecotel.quanlytaisan.model.NguoiKy> nkList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id);
        if (nkList != null && !nkList.isEmpty()) {
            for (com.ecotel.quanlytaisan.model.NguoiKy nk : nkList) {
                if (nk.getTrangThai() != 1) {
                    return false;
                }
            }
        }
        return true;
    }

    @Transactional
    public int huyGiamDinh(String id) {
        return giamDinhMayMocDao.updateTrangThai(id, 2); // 2 = Hủy
    }

    @Transactional
    public void bulkUpdate(List<GiamDinhMayMoc> list) {
        for (GiamDinhMayMoc e : list) {
            giamDinhMayMocDao.update(e);
        }
    }

    @Transactional
    public int delete(String id) {
        giamDinhMayMocChiTietDao.deleteByIdGiamDinh(id);
        return giamDinhMayMocDao.delete(id);
    }

    public PageResponse<GiamDinhMayMocDTO> findAllPaged(
            String idCongTy, int page, int size,
            String sortBy, String sortDir, String search,
            Integer trangThai, String userid, Boolean isSign,
            String dateFrom, String dateTo
    ) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<GiamDinhMayMocDTO> sourceList = giamDinhMayMocDao.findAll(idCongTy);

        // Turn-based filter
        if (userid != null && !userid.trim().isEmpty() && !"admin".equalsIgnoreCase(userid)) {
            List<GiamDinhMayMocDTO> filtered = new ArrayList<>();
            for (GiamDinhMayMocDTO item : sourceList) {
                if (isSign != null && isSign) {
                    if (isNeedToSign(item, userid)) filtered.add(item);
                } else {
                    if (isUserTurnToSign(item, userid)) filtered.add(item);
                }
            }
            sourceList = filtered;
        }

        // Count statuses
        Map<String, Long> trangThaiCounts = new HashMap<>();
        for (GiamDinhMayMocDTO item : sourceList) {
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

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(i -> (i.getSoPhieu() != null && i.getSoPhieu().toLowerCase().contains(q))
                            || (i.getViTri() != null && i.getViTri().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to   = Math.min(from + size, sourceList.size());
        List<GiamDinhMayMocDTO> items = new ArrayList<>(sourceList.subList(from, to));

        // Enrich
        for (GiamDinhMayMocDTO item : items) {
            enrichData(item);
        }

        PageResponse<GiamDinhMayMocDTO> response = new PageResponse<>(items, total, page, size);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    public boolean isNeedToSign(GiamDinhMayMocDTO item, String userId) {
        if (userId == null || userId.isEmpty()) return false;
        if (!Boolean.TRUE.equals(item.getShare())) return false;
        if (item.getTrangThai() == 2 || item.getTrangThai() == 3) return false;

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

    public boolean isUserTurnToSign(GiamDinhMayMocDTO item, String userId) {
        if ("admin".equalsIgnoreCase(userId)) return true;
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

    public int getPermissionSigning(GiamDinhMayMocDTO item, String tenDangNhap) {
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

    private Comparator<GiamDinhMayMocDTO> getComparator(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> pm = new HashMap<>();
            pm.put(0, 1); pm.put(1, 2); pm.put(3, 3); pm.put(2, 4);
            return Comparator.<GiamDinhMayMocDTO>comparingInt(i -> pm.getOrDefault(i.getTrangThai(), 5))
                    .thenComparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                            Comparator.nullsLast(Comparator.reverseOrder()));
        }
        boolean asc = "asc".equalsIgnoreCase(sortDir);
        Comparator<GiamDinhMayMocDTO> comp;
        switch (sortBy.trim().toLowerCase()) {
            case "sophieu":
                comp = Comparator.comparing(i -> i.getSoPhieu() != null ? i.getSoPhieu() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)); break;
            case "trangthai":
                comp = Comparator.comparing(i -> i.getTrangThai() != null ? i.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo)); break;
            case "ngaygiamdinh":
                comp = Comparator.comparing(i -> i.getNgayGiamDinh() != null ? i.getNgayGiamDinh() : "",
                        Comparator.nullsLast(String::compareTo)); break;
            case "ngaytao": default:
                comp = Comparator.comparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "",
                        Comparator.nullsLast(String::compareTo)); break;
        }
        return asc ? comp : comp.reversed();
    }
}
