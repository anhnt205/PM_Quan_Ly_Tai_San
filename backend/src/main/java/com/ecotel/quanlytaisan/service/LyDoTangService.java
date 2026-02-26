package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LyDoTangDao;
import com.ecotel.quanlytaisan.model.LyDoTang;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LyDoTangService {

    @Autowired
    private LyDoTangDao dao;

    public List<LyDoTang> getAllPaged(int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;
        return dao.findAllPaged(offset, size, sortBy, sortDir, search);
    }

    public long countAll(String search) {
        return dao.countAll(search);
    }

    public PageResponse<LyDoTang> getAllPagedResponse(int page, int size, String sortBy, String sortDir, String search) {
        List<LyDoTang> items = getAllPaged(page, size, sortBy, sortDir, search);
        long totalItems = countAll(search);

        return new PageResponse<>(items, totalItems, page, size);
    }

    public List<LyDoTang> getAll() {
        return dao.findAll();
    }

    public LyDoTang getById(String id) {
        return dao.findById(id);
    }

    public int create(LyDoTang lyDoTang) {
        return dao.insert(lyDoTang);
    }

    public int update(LyDoTang lyDoTang) {
        return dao.update(lyDoTang);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public int createBatch(List<LyDoTang> lyDoTangs) {
        return dao.insertBatch(lyDoTangs);
    }

    public int updateBatch(List<LyDoTang> lyDoTangs) {
        return dao.updateBatch(lyDoTangs);
    }

    public int deleteBatch(List<String> ids) {
        return dao.deleteBatch(ids);
    }



    public void deleteAll() {
        dao.deleteAll();
    }




}
