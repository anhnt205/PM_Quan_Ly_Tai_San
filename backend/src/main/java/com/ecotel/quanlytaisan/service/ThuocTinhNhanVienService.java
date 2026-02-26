package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ThuocTinhNhanVienDao;
import com.ecotel.quanlytaisan.model.ThuocTinhNhanVien;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
@Service
public class ThuocTinhNhanVienService {
    @Autowired
    private final ThuocTinhNhanVienDao dao;

    public ThuocTinhNhanVienService() {
        this.dao = new ThuocTinhNhanVienDao();
    }

    public List<ThuocTinhNhanVien> findAll(String idNhanVien) throws SQLException {
        return dao.findAll(idNhanVien);
    }

    public ThuocTinhNhanVien findById(String id) throws SQLException {
        return dao.findById(id);
    }

    public int insert(ThuocTinhNhanVien obj) throws SQLException {
        return dao.insert(obj);
    }

    public int update(ThuocTinhNhanVien obj) throws SQLException {
        return dao.update(obj);
    }

    public int delete(String id) throws SQLException {
        return dao.delete(id);
    }
} 