package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.*;
import com.ecotel.quanlytaisan.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service kế hoạch sửa chữa.
 * TrangThai: 0=Nháp | 1=Chờ duyệt | 2=Đã hủy | 3=Đã duyệt/Hoàn thành
 * Luồng ký: Người lập biểu → NguoiKy list → Giám đốc
 */
@Service
public class KeHoachSuaChuaService {

    @Autowired private KeHoachSuaChuaDao keHoachSuaChuaDao;
    @Autowired private KeHoachSuaChuaChiTietTaiSanDao suaChuaChiTietTaiSanDao;
    @Autowired private KyTaiLieuDao kyTaiLieuDao;
    @Autowired private DinhMucSuaChuaDao normDao;
    @Autowired private DinhMucVatTuDao materialNormDao;

    // ==================== Find all ====================

    public List<KeHoachSuaChuaDTO> findAll(String idCongTy) throws SQLException {
        List<KeHoachSuaChuaDTO> list = keHoachSuaChuaDao.findAll(idCongTy);
        for (KeHoachSuaChuaDTO dto : list)
            dto.setDanhSachTaiSan(suaChuaChiTietTaiSanDao.findByIdKeHoach(dto.getId()));
        return list;
    }

    // ==================== Paged ====================

    public PageResponse<KeHoachSuaChuaDTO> findAllPaged(
            String idCongTy, int page, int size,
            String sortBy, String sortDir, String search,
            String loaiKeHoach, String idDonViGiao, String idDonViNhan,
            Integer trangThai, Integer nam, String userid
    ) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<KeHoachSuaChuaDTO> sourceList = keHoachSuaChuaDao.findAll(idCongTy);

        // Turn-based filter (không có quyền ban hành – chỉ filter theo lượt ký)
        if (userid != null && !userid.trim().isEmpty() && !"admin".equalsIgnoreCase(userid)) {
            List<KeHoachSuaChuaDTO> filtered = new ArrayList<>();
            for (KeHoachSuaChuaDTO item : sourceList)
                if (isUserTurnToSign(item, userid)) filtered.add(item);
            sourceList = filtered;
        }

        // Đếm trạng thái (sau turn-filter, trước các filter còn lại)
        Map<String, Long> trangThaiCounts = new HashMap<>();
        for (KeHoachSuaChuaDTO item : sourceList) {
            if (item.getTrangThai() != null) {
                String key = item.getTrangThai().toString();
                trangThaiCounts.put(key, trangThaiCounts.getOrDefault(key, 0L) + 1);
            }
        }

        // Filters
        if (loaiKeHoach != null && !loaiKeHoach.trim().isEmpty())
            sourceList = sourceList.stream().filter(i -> loaiKeHoach.equals(i.getIdLoaiKeHoach())).collect(Collectors.toList());
        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty())
            sourceList = sourceList.stream().filter(i -> idDonViGiao.equalsIgnoreCase(i.getIdDonViGiao())).collect(Collectors.toList());
        if (idDonViNhan != null && !idDonViNhan.trim().isEmpty())
            sourceList = sourceList.stream().filter(i -> idDonViNhan.equalsIgnoreCase(i.getIdDonViNhan())).collect(Collectors.toList());
        if (trangThai != null)
            sourceList = sourceList.stream().filter(i -> trangThai.equals(i.getTrangThai())).collect(Collectors.toList());
        if (nam != null)
            sourceList = sourceList.stream().filter(i -> nam.equals(i.getNam())).collect(Collectors.toList());
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
        int to   = Math.min(from + size, sourceList.size());
        List<KeHoachSuaChuaDTO> items = new ArrayList<>(sourceList.subList(from, to));

        // Enrich
        for (KeHoachSuaChuaDTO item : items) {
            item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
            item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
            item.setDanhSachTaiSan(suaChuaChiTietTaiSanDao.findByIdKeHoach(item.getId()));
        }

        PageResponse<KeHoachSuaChuaDTO> response = new PageResponse<>(items, total, page, size);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    public Map<Integer, List<KeHoachSuaChuaDTO>> findAllGroupedByYear(
            String idCongTy, String search, Integer trangThai, Integer nam, String userid) throws SQLException {
        List<KeHoachSuaChuaDTO> sourceList = findAll(idCongTy);

        if (userid != null && !userid.trim().isEmpty() && !"admin".equalsIgnoreCase(userid)) {
            List<KeHoachSuaChuaDTO> filtered = new ArrayList<>();
            for (KeHoachSuaChuaDTO item : sourceList)
                if (isUserTurnToSign(item, userid)) filtered.add(item);
            sourceList = filtered;
        }

        if (trangThai != null)
            sourceList = sourceList.stream().filter(i -> trangThai.equals(i.getTrangThai())).collect(Collectors.toList());
        if (nam != null)
            sourceList = sourceList.stream().filter(i -> nam.equals(i.getNam())).collect(Collectors.toList());
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(i -> (i.getTenKeHoach() != null && i.getTenKeHoach().toLowerCase().contains(q))
                            || (i.getSoKeHoach() != null && i.getSoKeHoach().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return sourceList.stream()
                .filter(i -> i.getNam() != null)
                .collect(Collectors.groupingBy(KeHoachSuaChuaDTO::getNam));
    }


    private Comparator<KeHoachSuaChuaDTO> getComparator(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> pm = new HashMap<>();
            pm.put(0, 1); pm.put(1, 2); pm.put(3, 3); pm.put(2, 4);
            Comparator<KeHoachSuaChuaDTO> comp = Comparator.comparing(i -> pm.getOrDefault(i.getTrangThai(), 5));
            return comp.thenComparing(i -> i.getNgayTao() != null ? i.getNgayTao() : "", Comparator.reverseOrder());
        }
        boolean asc = "asc".equalsIgnoreCase(sortDir);
        Comparator<KeHoachSuaChuaDTO> comp;
        switch (sortBy.trim().toLowerCase()) {
            case "tenkehoach":
                comp = Comparator.comparing(i -> i.getTenKeHoach() != null ? i.getTenKeHoach() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)); break;
            case "nam":
                comp = Comparator.comparing(i -> i.getNam() != null ? i.getNam() : 0,
                        Comparator.nullsLast(Integer::compareTo)); break;
            case "trangthai":
                comp = Comparator.comparing(i -> i.getTrangThai() != null ? i.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo)); break;
            case "ngaytao": default:
                comp = Comparator.comparing((KeHoachSuaChuaDTO i) -> i.getNgayTao() != null ? i.getNgayTao() : ""); break;
        }
        return asc ? comp : comp.reversed();
    }

    // ==================== CRUD ====================

    public KeHoachSuaChua findById(String id) { return keHoachSuaChuaDao.findById(id); }

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

    public int updateTrangThai(String id, String userId) {
        return keHoachSuaChuaDao.updateTrangThai(id, userId);
    }

    public int huyKeHoach(String id) { return keHoachSuaChuaDao.huyKeHoach(id); }

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

    // ==================== Workflow: turn-filter ====================
    // Luồng: Người lập biểu xác nhận → NguoiKy list → Giám đốc duyệt

    public boolean isUserTurnToSign(KeHoachSuaChuaDTO item, String userId) {
        if ("admin".equalsIgnoreCase(userId)) return true;
        if (userId != null && userId.equals(item.getNguoiTao())) return true;
        if (!Boolean.TRUE.equals(item.getShare())) return false;

        // Bước 1: Người lập biểu
        if (item.getIdNguoiLapBieu() != null && !item.getIdNguoiLapBieu().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getNguoiLapBieuXacNhan()))
                return userId != null && userId.equals(item.getIdNguoiLapBieu());
            if (userId != null && userId.equals(item.getIdNguoiLapBieu())) return true;
        }

        // Bước 2: NguoiKy list & Giám đốc
        boolean lapBieuDone = item.getIdNguoiLapBieu() == null || item.getIdNguoiLapBieu().isEmpty()
                || Boolean.TRUE.equals(item.getNguoiLapBieuXacNhan());
        if (lapBieuDone) {
            List<NguoiKy> kyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
            if (kyList != null && !kyList.isEmpty()) {
                NguoiKy firstUnsigned = null;
                boolean allSigned = true;
                boolean userSigned = false, userInList = false;
                for (NguoiKy nk : kyList) {
                    if (nk.getTrangThai() != 1) { allSigned = false; if (firstUnsigned == null) firstUnsigned = nk; }
                    if (userId != null && userId.equals(nk.getIdNguoiKy())) {
                        userInList = true;
                        if (nk.getTrangThai() == 1) userSigned = true;
                    }
                }
                if (userSigned) return true;
                if (firstUnsigned != null && userInList && userId != null && userId.equals(firstUnsigned.getIdNguoiKy())) return true;
                // Tất cả đã ký → đến giám đốc
                if (allSigned && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()))
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
            } else {
                // Không có NguoiKy → thẳng đến giám đốc
                if (!Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()))
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
            }
        }
        if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
                && userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc()))
            return true;

        return false;
    }

    // ==================== Permission signing ====================

    public int getPermissionSigning(KeHoachSuaChuaDTO item, String tenDangNhap) {
        List<Map<String, Object>> flow = new ArrayList<>();

        if (item.getIdNguoiLapBieu() != null && !item.getIdNguoiLapBieu().isEmpty()) {
            Map<String, Object> s = new HashMap<>();
            s.put("id", item.getIdNguoiLapBieu());
            s.put("signed", Boolean.TRUE.equals(item.getNguoiLapBieuXacNhan()));
            s.put("label", "Người lập biểu: " + item.getTenNguoiLapBieu());
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

        if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()) {
            Map<String, Object> s = new HashMap<>();
            s.put("id", item.getIdTrinhDuyetGiamDoc());
            s.put("signed", Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()));
            s.put("label", "Giám đốc duyệt: " + item.getTenTrinhDuyetGiamDoc());
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

    // ==================== Material Aggregation ====================

    public List<DinhMucVatTuDTO> getTongVatTu(String idKeHoach) {
        List<KeHoachSuaChuaChiTietTaiSan> details = suaChuaChiTietTaiSanDao.findByIdKeHoach(idKeHoach);
        Map<String, DinhMucVatTuDTO> aggregateMap = new HashMap<>();
        Map<String, List<DinhMucVatTuDTO>> normCache = new HashMap<>();

        for (KeHoachSuaChuaChiTietTaiSan detail : details) {
            int assetQty = detail.getSoLuong() != null ? detail.getSoLuong() : 1;
            String[] months = {
                detail.getCapSuaChuaThang1(), detail.getCapSuaChuaThang2(), detail.getCapSuaChuaThang3(),
                detail.getCapSuaChuaThang4(), detail.getCapSuaChuaThang5(), detail.getCapSuaChuaThang6(),
                detail.getCapSuaChuaThang7(), detail.getCapSuaChuaThang8(), detail.getCapSuaChuaThang9(),
                detail.getCapSuaChuaThang10(), detail.getCapSuaChuaThang11(), detail.getCapSuaChuaThang12()
            };

            for (String loaiSuaChuaId : months) {
                if (loaiSuaChuaId != null && !loaiSuaChuaId.isEmpty()) {
                    List<DinhMucVatTuDTO> materials = normCache.get(loaiSuaChuaId);
                    if (materials == null) {
                        DinhMucSuaChua norm = normDao.findByLoaiSuaChuaId(loaiSuaChuaId);
                        if (norm != null) {
                            materials = materialNormDao.findByDinhMucId(norm.getId());
                            normCache.put(loaiSuaChuaId, materials);
                        } else {
                            normCache.put(loaiSuaChuaId, new ArrayList<>());
                            continue;
                        }
                    }

                    for (DinhMucVatTuDTO mat : materials) {
                        String key = mat.getIdCCDCVT();
                        int totalNeeded = (mat.getSoLuong() != null ? mat.getSoLuong() : 0) * assetQty;

                        if (aggregateMap.containsKey(key)) {
                            DinhMucVatTuDTO existing = aggregateMap.get(key);
                            existing.setSoLuong(existing.getSoLuong() + totalNeeded);
                        } else {
                            DinhMucVatTuDTO newItem = new DinhMucVatTuDTO();
                            newItem.setIdCCDCVT(mat.getIdCCDCVT());
                            newItem.setTenCCDCVT(mat.getTenCCDCVT());
                            newItem.setDonViTinh(mat.getDonViTinh());
                            newItem.setKyHieu(mat.getKyHieu());
                            newItem.setSoLuong(totalNeeded);
                            aggregateMap.put(key, newItem);
                        }
                    }
                }
            }
        }
        return new ArrayList<>(aggregateMap.values());
    }
}