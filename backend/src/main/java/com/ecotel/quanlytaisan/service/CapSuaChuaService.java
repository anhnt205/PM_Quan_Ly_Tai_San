package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.CapSuaChuaDao;
import com.ecotel.quanlytaisan.model.CapSuaChua;
import com.ecotel.quanlytaisan.model.CapSuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CapSuaChuaService {
    @Autowired
    private CapSuaChuaDao capSuaChuaDao;

    public List<CapSuaChuaDTO> getAll() {
        return capSuaChuaDao.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PageResponse<CapSuaChuaDTO> getPaged(int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;
        List<CapSuaChuaDTO> list = capSuaChuaDao.findAllPaged(offset, size, sortBy, sortDir, search).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        long total = capSuaChuaDao.countAll(search);
        return new PageResponse<>(list, total, page, size);
    }

    public CapSuaChuaDTO getById(String id) {
        CapSuaChua item = capSuaChuaDao.findById(id);
        return item != null ? mapToDTO(item) : null;
    }

    public int create(CapSuaChua item) {
        if (item.getId() == null || item.getId().trim().isEmpty()) {
            item.setId(UUID.randomUUID().toString());
        }
        item.setNgayTao(java.time.LocalDateTime.now().toString());
        item.setNgayCapNhat(java.time.LocalDateTime.now().toString());
        return capSuaChuaDao.insert(item);
    }

    public int update(String id, CapSuaChua item) {
        item.setId(id);
        item.setNgayCapNhat(java.time.LocalDateTime.now().toString());
        return capSuaChuaDao.update(item);
    }

    public int delete(String id) {
        return capSuaChuaDao.delete(id);
    }

    public int deleteAll() {
        return capSuaChuaDao.deleteAll();
    }

    private CapSuaChuaDTO mapToDTO(CapSuaChua item) {
        CapSuaChuaDTO dto = new CapSuaChuaDTO();
        dto.setId(item.getId());
        dto.setKyHieu(item.getKyHieu());
        dto.setTen(item.getTen());
        dto.setChuKyThucHien(item.getChuKyThucHien());
        dto.setSoLanTrongChuKy(item.getSoLanTrongChuKy());
        dto.setThoiGianSuaChua(item.getThoiGianSuaChua());
        dto.setIdLoaiTaiSan(item.getIdLoaiTaiSan());
        dto.setTenLoaiTaiSan(item.getTenLoaiTaiSan());
        dto.setMocGioDau(item.getMocGioDau());
        dto.setMocGioCuoi(item.getMocGioCuoi());
        dto.setGhiChu(item.getGhiChu());
        return dto;
    }
}
