package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DieuDongPhuLucTaiSanDao;
import com.ecotel.quanlytaisan.model.DieuDongPhuLucTaiSan;
import com.ecotel.quanlytaisan.model.DieuDongPhuLucTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
@Service
public class DieuDongPhuLucTaiSanService {
    @Autowired
    private final DieuDongPhuLucTaiSanDao dao;

    public DieuDongPhuLucTaiSanService() {
        this.dao = new DieuDongPhuLucTaiSanDao();
    }

    public List<DieuDongPhuLucTaiSanDTO> findAll(String idCongTy) throws SQLException {
        return dao.findAll(idCongTy);
    }

    public DieuDongPhuLucTaiSanDTO findById(String id) throws SQLException {
        return dao.findById(id);
    }

    public int insert(DieuDongPhuLucTaiSan obj) throws SQLException {
        return dao.insert(obj);
    }

    public int update(DieuDongPhuLucTaiSan obj) throws SQLException {
        return dao.update(obj);
    }

    public int delete(String id) throws SQLException {
        return dao.delete(id);
    }
} 