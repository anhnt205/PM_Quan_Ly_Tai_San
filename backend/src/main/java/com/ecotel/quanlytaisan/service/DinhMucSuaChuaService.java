package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DinhMucSuaChuaDao;
import com.ecotel.quanlytaisan.dao.DinhMucVatTuDao;
import com.ecotel.quanlytaisan.model.DinhMucSuaChua;
import com.ecotel.quanlytaisan.model.DinhMucSuaChuaDTO;
import com.ecotel.quanlytaisan.model.DinhMucVatTu;
import com.ecotel.quanlytaisan.model.DinhMucVatTuDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DinhMucSuaChuaService {

    @Autowired
    private DinhMucSuaChuaDao normDao;

    @Autowired
    private DinhMucVatTuDao materialNormDao;

    private String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public PageResponse<DinhMucSuaChuaDTO> getPaged(int page, int size, String search) {
        List<DinhMucSuaChuaDTO> items = normDao.findAllPaged(page, size, search);
        int total = normDao.countAll(search);

        for (DinhMucSuaChuaDTO item : items) {
            item.setDinhMucVatTuList(materialNormDao.findByDinhMucId(item.getId()));
        }

        return new PageResponse<>(items, total, page, size);
    }

    public DinhMucSuaChuaDTO getById(String id) {
        DinhMucSuaChuaDTO dto = normDao.findById(id);
        if (dto != null) {
            dto.setDinhMucVatTuList(materialNormDao.findByDinhMucId(id));
        }
        return dto;
    }

    @Transactional
    public DinhMucSuaChuaDTO save(DinhMucSuaChuaDTO dto, String username) {
        String now = getCurrentTime();
        DinhMucSuaChua norm = new DinhMucSuaChua();
        norm.setId(dto.getId());
        norm.setIdLoaiSuaChua(dto.getIdLoaiSuaChua());
        norm.setGhiChu(dto.getGhiChu());
        norm.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        norm.setNgayCapNhat(now);
        norm.setNguoiCapNhat(username);

        if (norm.getId() == null || norm.getId().isEmpty()) {
            norm.setNgayTao(now);
            norm.setNguoiTao(username);
            normDao.insert(norm);
            dto.setId(norm.getId());
        } else {
            normDao.update(norm);
        }

        syncMaterials(norm.getId(), dto.getDinhMucVatTuList(), username, now);

        return getById(norm.getId());
    }

    private void syncMaterials(String normId, List<DinhMucVatTuDTO> newList, String username, String now) {
        if (newList == null) return;

        List<DinhMucVatTuDTO> existingList = materialNormDao.findByDinhMucId(normId);
        Map<String, DinhMucVatTuDTO> existingMap = existingList.stream()
                .collect(Collectors.toMap(DinhMucVatTuDTO::getId, m -> m));

        // Delete removed items
        List<String> newIds = newList.stream()
                .map(DinhMucVatTuDTO::getId)
                .filter(id -> id != null && !id.isEmpty())
                .collect(Collectors.toList());
        
        for (String oldId : existingMap.keySet()) {
            if (!newIds.contains(oldId)) {
                materialNormDao.delete(oldId);
            }
        }

        // Insert or Update
        for (DinhMucVatTuDTO itemDto : newList) {
            DinhMucVatTu material = new DinhMucVatTu();
            material.setId(itemDto.getId());
            material.setIdDinhMuc(normId);
            material.setIdCCDCVT(itemDto.getIdCCDCVT());
            material.setSoLuong(itemDto.getSoLuong());
            material.setGhiChu(itemDto.getGhiChu());
            material.setIsActive(true);
            material.setNgayCapNhat(now);
            material.setNguoiCapNhat(username);

            if (material.getId() == null || material.getId().isEmpty() || !existingMap.containsKey(material.getId())) {
                material.setNgayTao(now);
                material.setNguoiTao(username);
                materialNormDao.insert(material);
            } else {
                materialNormDao.update(material);
            }
        }
    }

    @Transactional
    public boolean delete(String id) {
        // Materials are deleted by ON DELETE CASCADE, but we can be explicit
        materialNormDao.deleteByDinhMucId(id);
        return normDao.delete(id) > 0;
    }
}
