package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LoaiKeHoachScbdDao;
import com.ecotel.quanlytaisan.model.LoaiKeHoach;
import com.ecotel.quanlytaisan.model.LoaiKeHoachSCBD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoaiKeHoachScbdService {
    @Autowired
    private LoaiKeHoachScbdDao loaiKeHoachDao;

    public List<LoaiKeHoachSCBD> getAll() {
        return loaiKeHoachDao.findAll();
    }

    public LoaiKeHoachSCBD getById(String id) {
        return loaiKeHoachDao.findById(id);
    }

    public int create(LoaiKeHoachSCBD loaiKeHoach) {
        // có thể thêm validation, sinh id nếu cần
        return loaiKeHoachDao.insert(loaiKeHoach);
    }

    public int update(LoaiKeHoachSCBD loaiKeHoach) {
        return loaiKeHoachDao.update(loaiKeHoach);
    }

    public int delete(String id) {
        return loaiKeHoachDao.delete(id); // soft delete
    }

    public void deleteAll() {
        loaiKeHoachDao.deleteAll();
    }
}
