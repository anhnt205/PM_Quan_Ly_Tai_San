package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.PhuLucTaiSanDao;
import com.ecotel.quanlytaisan.model.PhuLucTaiSan;
import com.ecotel.quanlytaisan.model.PhuLucTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhuLucTaiSanService {
    @Autowired
    private PhuLucTaiSanDao dao;

    public PhuLucTaiSanService() {
        this.dao = new PhuLucTaiSanDao();
    }

    public List<PhuLucTaiSanDTO> findAll(String idCongTy) {
        return dao.findAll(idCongTy);
    }

    public PhuLucTaiSanDTO findById(String id) {
        return dao.findById(id);
    }

    public int insert(PhuLucTaiSan obj) {
        return dao.insert(obj);
    }

    public int update(PhuLucTaiSan obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }
}
