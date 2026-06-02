package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.NghiemThuTaiSanDao;
import com.ecotel.quanlytaisan.model.NghiemThuTaiSan;
import com.ecotel.quanlytaisan.model.NghiemThuVatTu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NghiemThuTaiSanService {

    @Autowired
    private NghiemThuTaiSanDao dao;

    public List<NghiemThuTaiSan> findByIdBienBan(String idBienBan) {
        return dao.findByIdBienBan(idBienBan);
    }

    public List<NghiemThuVatTu> findVatTuByIdBienBanTaiSan(String idBienBanTaiSan) {
        return dao.findVatTuByIdBienBanTaiSan(idBienBanTaiSan);
    }

    public int[] batchInsertTaiSan(List<NghiemThuTaiSan> list) {
        for (NghiemThuTaiSan e : list) {
            if (e.getId() == null) e.setId(dao.generateNextIdTaiSan());
        }
        return dao.batchInsertTaiSan(list);
    }

    public int[] batchInsertVatTu(List<NghiemThuVatTu> list) {
        for (NghiemThuVatTu e : list) {
            if (e.getId() == null) e.setId(dao.generateNextIdVatTu());
        }
        return dao.batchInsertVatTu(list);
    }

    public int updateVatTu(NghiemThuVatTu e) {
        return dao.updateVatTu(e);
    }

    public int[] batchUpdateVatTu(List<NghiemThuVatTu> list) {
        return dao.batchUpdateVatTu(list);
    }

    public int deleteById(String id) {
        return dao.deleteById(id);
    }

    public void batchDeleteVatTu(List<String> ids) {
        dao.batchDeleteVatTu(ids);
    }
}
