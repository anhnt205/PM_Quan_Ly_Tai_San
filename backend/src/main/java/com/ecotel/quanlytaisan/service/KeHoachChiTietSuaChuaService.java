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

    public void bulkCreate(List<KeHoachChiTietSuaChua> list) {

        if (list == null || list.isEmpty()) return;

        keHoachChiTietSuaChuaDao.batchInsert(list);
    }

    public int update(KeHoachChiTietSuaChua entity) {
        return keHoachChiTietSuaChuaDao.update(entity);
    }

    public void bulkUpdate(List<KeHoachChiTietSuaChua> list) {

        if (list == null || list.isEmpty()) return;

        keHoachChiTietSuaChuaDao.batchUpdate(list);
    }

    public int delete(String id) {
        return keHoachChiTietSuaChuaDao.delete(id);
    }

    public void bulkDelete(List<String> ids) {

        if (ids == null || ids.isEmpty()) return;

        keHoachChiTietSuaChuaDao.batchDelete(ids);
    }

    public int deleteByIdKeHoach(String idKeHoach) {
        return keHoachChiTietSuaChuaDao.deleteByIdKeHoach(idKeHoach);
    }
}