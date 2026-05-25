package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.GiamDinhMayMocChiTietDao;
import com.ecotel.quanlytaisan.model.GiamDinhMayMocChiTiet;
import com.ecotel.quanlytaisan.model.GiamDinhMayMocVatTu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GiamDinhMayMocChiTietService {

    @Autowired
    private GiamDinhMayMocChiTietDao dao;

    public List<GiamDinhMayMocChiTiet> findByIdGiamDinh(String idGiamDinhMayMoc) {
        return dao.findByIdGiamDinh(idGiamDinhMayMoc);
    }

    public int[] batchInsert(List<GiamDinhMayMocChiTiet> list) {
        for (GiamDinhMayMocChiTiet e : list) {
            if (e.getId() == null) e.setId(dao.generateNextId());
        }
        return dao.batchInsert(list);
    }

    public int[] batchUpdate(List<GiamDinhMayMocChiTiet> list) {
        return dao.batchUpdate(list);
    }

    public void batchDelete(List<String> ids) {
        dao.batchDelete(ids);
    }

    // --- CÁC PHƯƠNG THỨC CHO VẬT TƯ CHI TIẾT (giamdinh_maymoc_vattu) ---

    public List<GiamDinhMayMocVatTu> findVatTuByIdChiTietGiamDinh(String idChiTietGiamDinhMayMoc) {
        return dao.findVatTuByIdChiTietGiamDinh(idChiTietGiamDinhMayMoc);
    }

    public int[] batchInsertVatTu(List<GiamDinhMayMocVatTu> list) {
        for (GiamDinhMayMocVatTu e : list) {
            if (e.getId() == null) e.setId(dao.generateNextIdVatTu());
        }
        return dao.batchInsertVatTu(list);
    }

    public int updateVatTu(GiamDinhMayMocVatTu e) {
        return dao.updateVatTu(e);
    }

    public void batchDeleteVatTu(List<String> ids) {
        dao.batchDeleteVatTu(ids);
    }
}
