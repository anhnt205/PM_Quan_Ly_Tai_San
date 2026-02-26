package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietBanGiaoPhuLucDao;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoPhuLuc;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoPhuLucDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietBanGiaoPhuLucService {
    @Autowired
    private ChiTietBanGiaoPhuLucDao dao;

    public ChiTietBanGiaoPhuLucService() {
        dao =  new ChiTietBanGiaoPhuLucDao();
    }

    public List<ChiTietBanGiaoPhuLucDTO> findAll(String idBanGiaoPhuLuc) {
        return dao.findAll(idBanGiaoPhuLuc);
    }

    public ChiTietBanGiaoPhuLucDTO findById(String id) {
        return dao.findById(id);
    }

    public int insert(ChiTietBanGiaoPhuLuc obj) {
        return dao.insert(obj);
    }

    public int update(ChiTietBanGiaoPhuLuc obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }
}
