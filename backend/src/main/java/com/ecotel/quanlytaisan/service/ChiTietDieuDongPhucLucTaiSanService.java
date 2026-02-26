package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietDieuDongPhucLucTaiSanDao;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongPhucLucTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongPhucLucTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
@Service
public class ChiTietDieuDongPhucLucTaiSanService {
    @Autowired
    private final ChiTietDieuDongPhucLucTaiSanDao dao;

    public ChiTietDieuDongPhucLucTaiSanService() {
        this.dao = new ChiTietDieuDongPhucLucTaiSanDao();
    }

    public List<ChiTietDieuDongPhucLucTaiSanDTO> findAll(String idDieuDongPhuLucTaiSan) throws SQLException {
        return dao.findAll(idDieuDongPhuLucTaiSan);
    }

    public ChiTietDieuDongPhucLucTaiSanDTO findById(String id) throws SQLException {
        return dao.findById(id);
    }

    public int insert(ChiTietDieuDongPhucLucTaiSan obj) throws SQLException {
        return dao.insert(obj);
    }

    public int update(ChiTietDieuDongPhucLucTaiSan obj) throws SQLException {
        return dao.update(obj);
    }

    public int delete(String id) throws SQLException {
        return dao.delete(id);
    }
}
