package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KeHoachCongViecSuaChuaDao;
import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChua;
import com.ecotel.quanlytaisan.model.KeHoachCongViecSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KeHoachCongViecSuaChuaService {

    @Autowired
    private KeHoachCongViecSuaChuaDao keHoachCongViecSuaChuaDao;

    public List<KeHoachCongViecSuaChuaDTO> findByIdKeHoach(String idKeHoach) {
        return keHoachCongViecSuaChuaDao.findByIdKeHoach(idKeHoach);
    }

    public KeHoachCongViecSuaChuaDTO findById(String id) {
        return keHoachCongViecSuaChuaDao.findById(id);
    }

    public int insert(KeHoachCongViecSuaChua entity) {
        if (entity.getNguoiThucHien() == null || entity.getNguoiThucHien().trim().isEmpty()){
            throw new IllegalArgumentException("Nguoi thuc hien dang khong duoc de trong");
        }
        return keHoachCongViecSuaChuaDao.insert(entity);
    }

    public int update(KeHoachCongViecSuaChua entity) {
        return keHoachCongViecSuaChuaDao.update(entity);
    }

    public int delete(String id) {
        return keHoachCongViecSuaChuaDao.delete(id);
    }

    public int deleteByIdKeHoach(String idKeHoach) {
        return keHoachCongViecSuaChuaDao.deleteByIdKeHoach(idKeHoach);
    }

    public void bulkCreate(List<KeHoachCongViecSuaChua> list) {

        if (list == null || list.isEmpty()) return;

        for (KeHoachCongViecSuaChua e : list) {
            if (e.getNguoiThucHien() == null || e.getNguoiThucHien().trim().isEmpty()) {
                throw new IllegalArgumentException("Nguoi thuc hien khong duoc de trong");
            }
        }

        keHoachCongViecSuaChuaDao.batchInsert(list);
    }

    public void bulkUpdate(List<KeHoachCongViecSuaChua> list) {

        if (list == null || list.isEmpty()) return;

        keHoachCongViecSuaChuaDao.batchUpdate(list);
    }

    public void bulkDelete(List<String> ids) {

        if (ids == null || ids.isEmpty()) return;

        keHoachCongViecSuaChuaDao.batchDelete(ids);
    }

}