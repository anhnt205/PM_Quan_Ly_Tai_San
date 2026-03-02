package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietKetQuaSuaChuaDao;
import com.ecotel.quanlytaisan.model.ChiTietKetQuaSuaChua;
import com.ecotel.quanlytaisan.model.ChiTietKetQuaSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietKetQuaSuaChuaService {

    @Autowired
    private ChiTietKetQuaSuaChuaDao chiTietKetQuaSuaChuaDao;

    public List<ChiTietKetQuaSuaChuaDTO> findByIdKetQua(String idKetQua) {
        return chiTietKetQuaSuaChuaDao.findByIdKetQua(idKetQua);
    }

    public ChiTietKetQuaSuaChuaDTO findById(String id) {
        return chiTietKetQuaSuaChuaDao.findById(id);
    }

    public int insert(ChiTietKetQuaSuaChua entity) {
        return chiTietKetQuaSuaChuaDao.insert(entity);
    }

    public int update(ChiTietKetQuaSuaChua entity) {
        return chiTietKetQuaSuaChuaDao.update(entity);
    }

    public int delete(String id) {
        return chiTietKetQuaSuaChuaDao.delete(id);
    }

    public int deleteByIdKetQua(String idKetQua) {
        return chiTietKetQuaSuaChuaDao.deleteByIdKetQua(idKetQua);
    }
}