package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.SuaChuaChiTietDao;
import com.ecotel.quanlytaisan.dao.SuaChuaDao;
import com.ecotel.quanlytaisan.model.SuaChua;
import com.ecotel.quanlytaisan.model.SuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SuaChuaService {

    @Autowired
    private SuaChuaDao suaChuaDao;

    @Autowired
    private SuaChuaChiTietDao suaChuaChiTietDao;

    public List<SuaChuaDTO> findAll(String idCongTy) {
        return suaChuaDao.findAll(idCongTy);
    }

    public SuaChuaDTO findByIdDTO(String id) {
        SuaChuaDTO dto = suaChuaDao.findByIdDTO(id);
        if (dto != null) {
            dto.setDanhSachChiTiet(suaChuaChiTietDao.findByIdSuaChua(id));
        }
        return dto;
    }

    public SuaChua findById(String id) {
        return suaChuaDao.findById(id);
    }

    @Transactional
    public SuaChua insert(SuaChua entity) {
        return suaChuaDao.insert(entity);
    }

    @Transactional
    public SuaChua update(SuaChua entity) {
        return suaChuaDao.update(entity);
    }

    @Transactional
    public int updateTrangThai(String id, Integer trangThai) {
        if (trangThai < 0 || trangThai > 3) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ");
        }
        return suaChuaDao.updateTrangThai(id, trangThai);
    }

    @Transactional
    public int huySuaChua(String id) {
        return suaChuaDao.updateTrangThai(id, 2); // 2 = Hủy
    }

    @Transactional
    public int delete(String id) {
        // Cascade delete details
        suaChuaChiTietDao.deleteByIdSuaChua(id);
        return suaChuaDao.delete(id);
    }

    @Transactional
    public void bulkDelete(List<String> ids) {
        for (String id : ids) {
            suaChuaChiTietDao.deleteByIdSuaChua(id);
        }
        suaChuaDao.batchDelete(ids);
    }
}
