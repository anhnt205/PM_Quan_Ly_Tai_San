package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.GiamDinhChiTietDao;
import com.ecotel.quanlytaisan.model.GiamDinhChiTiet;
import com.ecotel.quanlytaisan.model.GiamDinhVatTu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GiamDinhChiTietService {

    @Autowired
    private GiamDinhChiTietDao dao;

    public List<GiamDinhChiTiet> findByIdGiamDinh(String idGiamDinh) {
        return dao.findByIdGiamDinh(idGiamDinh);
    }

    public int[] batchInsert(List<GiamDinhChiTiet> list) {
        for (GiamDinhChiTiet e : list) {
            if (e.getId() == null) e.setId(dao.generateNextId());
        }
        return dao.batchInsert(list);
    }

    public int[] batchUpdate(List<GiamDinhChiTiet> list) {
        return dao.batchUpdate(list);
    }

    public void batchDelete(List<String> ids) {
        dao.batchDelete(ids);
    }

    // --- CÁC PHƯƠNG THỨC CHO VẬT TƯ CHI TIẾT (giamdinh_vattu) ---

    public List<GiamDinhVatTu> findVatTuByIdChiTietGiamDinh(String idChiTietGiamDinh) {
        return dao.findVatTuByIdChiTietGiamDinh(idChiTietGiamDinh);
    }

    public int[] batchInsertVatTu(List<GiamDinhVatTu> list) {
        for (GiamDinhVatTu e : list) {
            if (e.getId() == null) e.setId(dao.generateNextIdVatTu());
        }
        return dao.batchInsertVatTu(list);
    }

    public int updateVatTu(GiamDinhVatTu e) {
        return dao.updateVatTu(e);
    }

    public void batchDeleteVatTu(List<String> ids) {
        dao.batchDeleteVatTu(ids);
    }
}
