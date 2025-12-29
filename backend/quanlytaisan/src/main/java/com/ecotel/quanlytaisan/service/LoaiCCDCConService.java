package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiCCDCConDao;
import com.ecotel.quanlytaisan.model.LoaiCCDCCon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiCCDCConService {
    @Autowired
    private LoaiCCDCConDao loaiCCDCConDao;

    public List<LoaiCCDCCon> getAll() {
        return loaiCCDCConDao.findAll();
    }

    public LoaiCCDCCon getById(String id) {
        return loaiCCDCConDao.findById(id);
    }

    public List<LoaiCCDCCon> getByIdLoaiCCDC(String idLoaiCCDC) {
        return loaiCCDCConDao.findByIdLoaiCCDC(idLoaiCCDC);
    }

    public int create(LoaiCCDCCon lccdc) {
        return loaiCCDCConDao.insert(lccdc);
    }

    public int update(LoaiCCDCCon lccdc) {
        return loaiCCDCConDao.update(lccdc);
    }

    public int delete(String id) {
        return loaiCCDCConDao.delete(id);
    }
}
