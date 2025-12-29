package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiTaiSanConDao;
import com.ecotel.quanlytaisan.model.LoaiTaiSanCon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiTaiSanConService {
    @Autowired
    private LoaiTaiSanConDao loaiTaiSanConDao;

    public List<LoaiTaiSanCon> getAll() {
        return loaiTaiSanConDao.findAll();
    }

    public LoaiTaiSanCon getById(String id) {
        return loaiTaiSanConDao.findById(id);
    }

    public List<LoaiTaiSanCon> getByIdLoaiTs(String idLoaiTs) {
        return loaiTaiSanConDao.findByIdLoaiTs(idLoaiTs);
    }

    public int create(LoaiTaiSanCon ltsc) {
        return loaiTaiSanConDao.insert(ltsc);
    }

    public int update(LoaiTaiSanCon ltsc) {
        return loaiTaiSanConDao.update(ltsc);
    }

    public int delete(String id) {
        return loaiTaiSanConDao.delete(id);
    }
}
