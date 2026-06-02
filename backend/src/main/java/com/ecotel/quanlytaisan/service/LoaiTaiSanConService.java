package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiTaiSanConDao;
import com.ecotel.quanlytaisan.model.LoaiTaiSanCon;
import com.ecotel.quanlytaisan.model.PageResponse;
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

    public PageResponse<LoaiTaiSanCon> getAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        List<LoaiTaiSanCon> items = loaiTaiSanConDao.findAllPaged(page, size, sortBy, sortDir, search);
        long totalItems = loaiTaiSanConDao.countAll(search);
        return new PageResponse<>(items, totalItems, page, size);
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

    public int batchCreate(List<LoaiTaiSanCon> list) {
        return loaiTaiSanConDao.batchCreate(list);
    }

    public int update(LoaiTaiSanCon ltsc) {
        return loaiTaiSanConDao.update(ltsc);
    }

    public int batchUpdate(List<LoaiTaiSanCon> list) {
        return loaiTaiSanConDao.batchUpdate(list);
    }

    public int delete(String id) {
        return loaiTaiSanConDao.delete(id);
    }

    public int batchDelete(List<String> ids) {
        return loaiTaiSanConDao.batchDelete(ids);
    }
}
