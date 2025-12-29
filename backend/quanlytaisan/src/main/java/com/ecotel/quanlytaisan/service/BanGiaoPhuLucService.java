package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.BanGiaoPhuLucDao;
import com.ecotel.quanlytaisan.model.BanGiaoPhuLuc;
import com.ecotel.quanlytaisan.model.BanGiaoPhuLucDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BanGiaoPhuLucService {
    @Autowired
    private BanGiaoPhuLucDao dao;

    public BanGiaoPhuLucService() {
        this.dao = new BanGiaoPhuLucDao();
    }

    public List<BanGiaoPhuLucDTO> findAll(String idCongTy) {
        return dao.findAll(idCongTy);
    }

    public BanGiaoPhuLucDTO findById(String id) {
        return dao.findById(id);
    }

    public int insert(BanGiaoPhuLuc obj) {
        return dao.insert(obj);
    }

    public int update(BanGiaoPhuLuc obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }
}
