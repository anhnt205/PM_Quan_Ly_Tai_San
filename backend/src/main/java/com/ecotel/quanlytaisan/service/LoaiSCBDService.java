package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiSCBDDao;
import com.ecotel.quanlytaisan.model.LoaiSCBD;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiSCBDService {

    @Autowired
    private LoaiSCBDDao dao;

    public List<LoaiSCBD> getAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;
        return dao.findAllPaged(offset, size, sortBy, sortDir, search);
    }

    public long countAll(String search) {
        return dao.countAll(search);
    }

    public PageResponse<LoaiSCBD> getAllPagedResponse(int page, int size, String sortBy, String sortDir, String search) {
        List<LoaiSCBD> items = getAllPaged(page, size, sortBy, sortDir, search);
        long totalItems = countAll(search);

        return new PageResponse<>(items, totalItems, page, size);
    }

    public List<LoaiSCBD> getAll() {
        return dao.findAll();
    }

    public LoaiSCBD getById(String id) {
        return dao.findById(id);
    }

    public int create(LoaiSCBD loaiSCBD) {
        return dao.insert(loaiSCBD);
    }

    public int update(LoaiSCBD loaiSCBD) {
        return dao.update(loaiSCBD);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public int createBatch(List<LoaiSCBD> loaiSCBDs) {
        return dao.insertBatch(loaiSCBDs);
    }

    public int updateBatch(List<LoaiSCBD> loaiSCBDs) {
        return dao.updateBatch(loaiSCBDs);
    }

    public int deleteBatch(List<String> ids) {
        return dao.deleteBatch(ids);
    }




    public void deleteAll() {
        dao.deleteAll();
    }



}
