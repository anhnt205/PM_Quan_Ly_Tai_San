package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.HuongDanDao;
import com.ecotel.quanlytaisan.model.HuongDan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HuongDanService {

    @Autowired
    private HuongDanDao dao;

    public List<HuongDan> getAll() {
        return dao.findAll();
    }

    public HuongDan getById(String id) {
        return dao.findById(id);
    }

    public int create(HuongDan hd) {
        return dao.insert(hd);
    }

    public int update(HuongDan hd) {
        return dao.update(hd);
    }

    public int delete(String id) {
        return dao.delete(id);
    }
}
