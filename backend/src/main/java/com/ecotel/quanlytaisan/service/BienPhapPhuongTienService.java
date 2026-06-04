package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.BienPhapPhuongTienDao;
import com.ecotel.quanlytaisan.dao.BienPhapPhuongTienChiTietDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BienPhapPhuongTienService {

    @Autowired private BienPhapPhuongTienDao        bienPhapDao;
    @Autowired private BienPhapPhuongTienChiTietDao  chiTietDao;
    @Autowired private KyTaiLieuDao                 kyTaiLieuDao;

    // ─── Queries ───────────────────────────────────────────────────────────────

    public List<BienPhapPhuongTienDTO> findAll(String idCongTy) {
        List<BienPhapPhuongTienDTO> list = bienPhapDao.findAll(idCongTy);
        list.forEach(this::enrich);
        return list;
    }

    public BienPhapPhuongTienDTO findByIdDTO(String id) {
        BienPhapPhuongTienDTO dto = bienPhapDao.findByIdDTO(id);
        if (dto != null) enrich(dto);
        return dto;
    }

    public List<BienPhapPhuongTienDTO> findByIdTaiSan(String idTaiSan) {
        List<BienPhapPhuongTienDTO> list = bienPhapDao.findByIdTaiSan(idTaiSan);
        list.forEach(this::enrich);
        return list;
    }

    public List<BienPhapPhuongTienDTO> findByIdGiamDinhPhuongTien(String idGiamDinhPhuongTien) {
        List<BienPhapPhuongTienDTO> list = bienPhapDao.findByIdGiamDinhPhuongTien(idGiamDinhPhuongTien);
        list.forEach(this::enrich);
        return list;
    }

    private void enrich(BienPhapPhuongTienDTO dto) {
        dto.setChuKyList(kyTaiLieuDao.findById(dto.getId()));
        dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(dto.getId()));
        dto.setDanhSachChiTiet(chiTietDao.findByIdBienPhap(dto.getId()));
    }

    // ─── Mutations ─────────────────────────────────────────────────────────────

    @Transactional
    public BienPhapPhuongTien insert(BienPhapPhuongTien entity) {
        BienPhapPhuongTien saved = bienPhapDao.insert(entity);
        if (saved != null && entity.getDanhSachChiTiet() != null && !entity.getDanhSachChiTiet().isEmpty()) {
            entity.getDanhSachChiTiet().forEach(ct -> ct.setIdBienPhap(saved.getId()));
            chiTietDao.batchInsert(entity.getDanhSachChiTiet());
        }
        return saved;
    }

    @Transactional
    public BienPhapPhuongTien update(BienPhapPhuongTien entity) {
        BienPhapPhuongTien saved = bienPhapDao.update(entity);
        if (saved != null) {
            chiTietDao.deleteByIdBienPhap(saved.getId());
            if (entity.getDanhSachChiTiet() != null && !entity.getDanhSachChiTiet().isEmpty()) {
                entity.getDanhSachChiTiet().forEach(ct -> ct.setIdBienPhap(saved.getId()));
                chiTietDao.batchInsert(entity.getDanhSachChiTiet());
            }
        }
        return saved;
    }

    @Transactional
    public int updateTrangThai(String id, String userId) {
        BienPhapPhuongTien bp = bienPhapDao.findById(id);
        if (bp == null) return 0;

        int trangThai = bp.getTrangThai() != null ? bp.getTrangThai() : 0;

        // Cập nhật ký trong NguoiKy
        NguoiKy nk = kyTaiLieuDao.getNguoiKy(userId, id);
        if (nk != null) kyTaiLieuDao.updateTrangThai(nk.getId(), "1");

        if (Objects.equals(userId, bp.getIdNguoiLap())) { bp.setNguoiLapXacNhan(true); trangThai = 1; }
        if (Objects.equals(userId, bp.getIdGiamDoc()))  { bp.setGiamDocXacNhan(true);  trangThai = 1; }

        // Kiểm tra tất cả đã ký chưa
        boolean allKy = true;
        if (bp.getIdNguoiLap() != null && !bp.getIdNguoiLap().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(bp.getNguoiLapXacNhan());
        if (bp.getIdGiamDoc() != null && !bp.getIdGiamDoc().isEmpty())
            allKy = allKy && Boolean.TRUE.equals(bp.getGiamDocXacNhan());
        if (allKy) {
            List<NguoiKy> nkList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id);
            if (nkList != null) allKy = nkList.stream().allMatch(n -> n.getTrangThai() == 1);
        }
        if (allKy) trangThai = 3;

        bp.setTrangThai(trangThai);
        BienPhapPhuongTien result = bienPhapDao.update(bp);
        return result != null ? result.getTrangThai() : 0;
    }

    @Transactional
    public int huy(String id) { return bienPhapDao.updateTrangThai(id, 2); }

    @Transactional
    public void bulkUpdate(List<BienPhapPhuongTien> list) {
        list.forEach(bienPhapDao::update);
    }

    @Transactional
    public int delete(String id) {
        chiTietDao.deleteByIdBienPhap(id);
        return bienPhapDao.delete(id);
    }

    // ─── Phân trang ────────────────────────────────────────────────────────────

    public PageResponse<BienPhapPhuongTienDTO> findAllPaged(
            String idCongTy, int page, int size,
            String sortBy, String sortDir, String search,
            Integer trangThai, String userid, Boolean isSign,
            String dateFrom, String dateTo) {

        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<BienPhapPhuongTienDTO> source = bienPhapDao.findAll(idCongTy);

        if (userid != null && !userid.isBlank()) {
            boolean shouldFilter = !"admin".equalsIgnoreCase(userid) || (isSign != null && isSign);
            if (shouldFilter) {
                List<BienPhapPhuongTienDTO> filtered = new ArrayList<>();
                for (BienPhapPhuongTienDTO item : source) {
                    if (isSign != null && isSign) {
                        if (isNeedToSign(item, userid)) filtered.add(item);
                    } else {
                        if (isUserTurnToSign(item, userid)) filtered.add(item);
                    }
                }
                source = filtered;
            }
        }

        Map<String, Long> trangThaiCounts = source.stream()
                .filter(i -> i.getTrangThai() != null)
                .collect(Collectors.groupingBy(i -> i.getTrangThai().toString(), Collectors.counting()));

        if (trangThai != null)
            source = source.stream().filter(i -> trangThai.equals(i.getTrangThai())).collect(Collectors.toList());
        if (dateFrom != null && !dateFrom.isEmpty())
            source = source.stream().filter(i -> i.getNgayTao() != null && i.getNgayTao().compareTo(dateFrom) >= 0).collect(Collectors.toList());
        if (dateTo != null && !dateTo.isEmpty()) {
            String end = dateTo + " 23:59:59";
            source = source.stream().filter(i -> i.getNgayTao() != null && i.getNgayTao().compareTo(end) <= 0).collect(Collectors.toList());
        }
        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            source = source.stream()
                    .filter(i -> (i.getSoBienBan() != null && i.getSoBienBan().toLowerCase().contains(q))
                            || (i.getTenTaiSan() != null && i.getTenTaiSan().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        source.sort(getComparator(sortBy, sortDir));

        long total = source.size();
        int from = Math.min(page * size, source.size());
        int to   = Math.min(from + size, source.size());
        List<BienPhapPhuongTienDTO> items = new ArrayList<>(source.subList(from, to));
        items.forEach(this::enrich);

        PageResponse<BienPhapPhuongTienDTO> resp = new PageResponse<>(items, total, page, size);
        resp.setTrangThaiCounts(trangThaiCounts);
        return resp;
    }

    public boolean isNeedToSign(BienPhapPhuongTienDTO item, String userId) {
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

    public boolean isUserTurnToSign(BienPhapPhuongTienDTO item, String userId) {
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

    private Comparator<BienPhapPhuongTienDTO> getComparator(String sortBy, String sortDir) {
        boolean asc = "asc".equalsIgnoreCase(sortDir);
        Comparator<BienPhapPhuongTienDTO> comp;
        switch (sortBy != null ? sortBy.toLowerCase() : "") {
            case "sobienban": comp = Comparator.comparing(i -> i.getSoBienBan() != null ? i.getSoBienBan() : "", Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)); break;
            case "trangthai": comp = Comparator.comparing(i -> i.getTrangThai() != null ? i.getTrangThai() : 0, Comparator.nullsLast(Integer::compareTo)); break;
            default:
                Map<Integer, Integer> pm = new HashMap<>(); pm.put(0,1); pm.put(1,2); pm.put(3,3); pm.put(2,4);
                return Comparator.<BienPhapPhuongTienDTO>comparingInt(i -> pm.getOrDefault(i.getTrangThai(), 5))
                        .thenComparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "", Comparator.nullsLast(Comparator.reverseOrder()));
        }
        return asc ? comp : comp.reversed();
    }
}
