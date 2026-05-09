package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KiemTraSuCoDao;
import com.ecotel.quanlytaisan.dao.KiemTraSuCoChiTietDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class KiemTraSuCoService {

    @Autowired
    private KiemTraSuCoDao mainDao;

    @Autowired
    private KiemTraSuCoChiTietDao detailDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    public PageResponse<KiemTraSuCoDTO> findAllPaged(int page, int pageSize, String searchValue, String idCongTy, Integer trangThai, String userid) {
        List<KiemTraSuCoDTO> all = mainDao.findAll(idCongTy);
        
        // Turn-based filter
        if (userid != null && !userid.trim().isEmpty() && !"admin".equalsIgnoreCase(userid)) {
            all = all.stream()
                    .filter(item -> isUserTurnToSign(item, userid))
                    .collect(Collectors.toList());
        }

        // Count by status
        Map<String, Long> trangThaiCounts = new HashMap<>();
        for (KiemTraSuCoDTO item : all) {
            if (item.getTrangThai() != null) {
                String key = item.getTrangThai().toString();
                trangThaiCounts.put(key, trangThaiCounts.getOrDefault(key, 0L) + 1);
            }
        }

        // Filters
        if (trangThai != null) {
            all = all.stream()
                    .filter(i -> trangThai.equals(i.getTrangThai()))
                    .collect(Collectors.toList());
        }
        if (searchValue != null && !searchValue.isEmpty()) {
            all = all.stream()
                    .filter(d -> (d.getSoPhieu() != null && d.getSoPhieu().toLowerCase().contains(searchValue.toLowerCase()))
                            || (d.getSoPhieuSuCo() != null && d.getSoPhieuSuCo().toLowerCase().contains(searchValue.toLowerCase())))
                    .collect(Collectors.toList());
        }
        
        int total = all.size();
        int start = page * pageSize;
        int end = Math.min(start + pageSize, total);
        List<KiemTraSuCoDTO> items = (start < total) ? all.subList(start, end) : List.of();
        
        // Enrich
        for (KiemTraSuCoDTO item : items) {
            item.setDanhSachChiTiet(detailDao.findByIdKiemTraSuCo(item.getId()));
            item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
        }

        PageResponse<KiemTraSuCoDTO> response = new PageResponse<>(items, total, page, pageSize);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    public KiemTraSuCoDTO findByIdDTO(String id) {
        KiemTraSuCoDTO dto = mainDao.findByIdDTO(id);
        if (dto != null) {
            dto.setDanhSachChiTiet(detailDao.findByIdKiemTraSuCo(id));
            dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id));
        }
        return dto;
    }

    public List<KiemTraSuCoDTO> findByIdSuCo(String idSuCo) {
        List<KiemTraSuCoDTO> list = mainDao.findByIdSuCo(idSuCo);
        for (KiemTraSuCoDTO dto : list) {
            dto.setDanhSachChiTiet(detailDao.findByIdKiemTraSuCo(dto.getId()));
            dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(dto.getId()));
        }
        return list;
    }

    @Transactional
    public KiemTraSuCo insert(KiemTraSuCo entity) {
        KiemTraSuCo saved = mainDao.insert(entity);
        if (saved != null) {
            if (entity.getDanhSachChiTiet() != null && !entity.getDanhSachChiTiet().isEmpty()) {
                entity.getDanhSachChiTiet().forEach(d -> d.setIdKiemTraSuCo(saved.getId()));
                detailDao.insertBatch(entity.getDanhSachChiTiet());
            }
            if (entity.getNguoiKyList() != null && !entity.getNguoiKyList().isEmpty()) {
                entity.getNguoiKyList().forEach(nk -> nk.setIdTaiLieu(saved.getId()));
                kyTaiLieuDao.updateNguoiKy(saved.getId(), entity.getNguoiKyList());
            }
        }
        return saved;
    }

    @Transactional
    public KiemTraSuCo update(KiemTraSuCo entity) {
        KiemTraSuCo updated = mainDao.update(entity);
        if (updated != null) {
            detailDao.deleteByIdKiemTraSuCo(entity.getId());
            if (entity.getDanhSachChiTiet() != null && !entity.getDanhSachChiTiet().isEmpty()) {
                entity.getDanhSachChiTiet().forEach(d -> d.setIdKiemTraSuCo(entity.getId()));
                detailDao.insertBatch(entity.getDanhSachChiTiet());
            }
            // NguoiKy update is usually handled separately or by batch update
        }
        return updated;
    }

    @Transactional
    public int updateTrangThai(String id, String userId) {
        return mainDao.updateTrangThai(id, userId);
    }

    @Transactional
    public int huy(String id) {
        return mainDao.huy(id);
    }

    @Transactional
    public int delete(String id) {
        detailDao.deleteByIdKiemTraSuCo(id);
        kyTaiLieuDao.delete(id);
        return mainDao.delete(id);
    }

    public boolean isUserTurnToSign(KiemTraSuCoDTO item, String userId) {
        if ("admin".equalsIgnoreCase(userId)) return true;
        if (userId != null && userId.equals(item.getNguoiTao())) return true;
        if (!Boolean.TRUE.equals(item.getShare())) return false;

        // Step 1: Creator/Reporter
        if (item.getIdNguoiLap() != null && !item.getIdNguoiLap().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getNguoiLapXacNhan()))
                return userId != null && userId.equals(item.getIdNguoiLap());
            if (userId != null && userId.equals(item.getIdNguoiLap())) return true;
        }

        // Step 2: NguoiKy list & Director
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
}
