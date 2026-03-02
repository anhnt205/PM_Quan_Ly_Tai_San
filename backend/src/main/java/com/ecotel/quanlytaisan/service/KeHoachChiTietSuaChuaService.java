package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KeHoachChiTietSuaChuaDao;
import com.ecotel.quanlytaisan.model.KeHoachChiTietSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachChiTietSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KeHoachChiTietSuaChuaService {

    @Autowired
    private KeHoachChiTietSuaChuaDao keHoachChiTietSuaChuaDao;

    public List<KeHoachChiTietSuaChuaDTO> findByIdKeHoach(String idKeHoach) {
        return keHoachChiTietSuaChuaDao.findByIdKeHoach(idKeHoach);
    }

    public KeHoachChiTietSuaChuaDTO findById(String id) {
        return keHoachChiTietSuaChuaDao.findById(id);
    }

    public int insert(KeHoachChiTietSuaChua entity) {
        return keHoachChiTietSuaChuaDao.insert(entity);
    }

    public int update(KeHoachChiTietSuaChua entity) {
        return keHoachChiTietSuaChuaDao.update(entity);
    }

    public int delete(String id) {
        return keHoachChiTietSuaChuaDao.delete(id);
    }

    public int deleteByIdKeHoach(String idKeHoach) {
        return keHoachChiTietSuaChuaDao.deleteByIdKeHoach(idKeHoach);
    }
}