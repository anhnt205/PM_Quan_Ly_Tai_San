package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietLichSuSuaChuaDao;
import com.ecotel.quanlytaisan.dao.LichSuSuaChuaDao;
import com.ecotel.quanlytaisan.model.LichSuSuaChuaDTO;
import com.ecotel.quanlytaisan.model.LichSuSuaChua;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class LichSuSuaChuaService {

    @Autowired
    private LichSuSuaChuaDao lichSuDao;

    @Autowired
    private ChiTietLichSuSuaChuaDao chiTietDao;

    public LichSuSuaChua findById(String id) {
        return lichSuDao.findById(id);
    }

    public LichSuSuaChuaDTO findByIdDTO(String id) {
        LichSuSuaChuaDTO dto = lichSuDao.findByIdDTO(id);
        if (dto != null) {
            dto.setChiTietList(chiTietDao.findByIdLichSu(id));
        }
        return dto;
    }

    public List<LichSuSuaChuaDTO> findByTaiSan(String idTaiSan) {
        return lichSuDao.findByTaiSan(idTaiSan);
    }

    public List<LichSuSuaChuaDTO> findByKetQuaSuaChua(String idKetQuaSuaChua) {
        return lichSuDao.findByKetQuaSuaChua(idKetQuaSuaChua);
    }

    public List<LichSuSuaChuaDTO> findAll() {
        return lichSuDao.findAll();
    }

    public LichSuSuaChua insert(LichSuSuaChua entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String now = sdf.format(new Date());
        entity.setNgayTao(now);
        entity.setNgayCapNhat(now);
        return lichSuDao.insert(entity);
    }

    public LichSuSuaChua update(LichSuSuaChua entity) {
        LichSuSuaChua existing = lichSuDao.findById(entity.getId());
        if (existing == null) return null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        entity.setNgayCapNhat(sdf.format(new Date()));
        entity.setNgayTao(existing.getNgayTao()); // giữ nguyên ngày tạo
        return lichSuDao.update(entity);
    }

    public int delete(String id) {
        // Xóa chi tiết trước (cascade trong DB nhưng xóa tay cho chắc)
        chiTietDao.deleteByIdLichSu(id);
        return lichSuDao.delete(id);
    }

    public int deleteByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        // Lấy danh sách lịch sử theo idKetQuaSuaChua và xóa chi tiết trước
        List<LichSuSuaChuaDTO> list = lichSuDao.findByKetQuaSuaChua(idKetQuaSuaChua);
        for (LichSuSuaChuaDTO dto : list) {
            chiTietDao.deleteByIdLichSu(dto.getId());
        }
        return lichSuDao.deleteByIdKetQuaSuaChua(idKetQuaSuaChua);
    }

    // Bulk operations
    public void bulkInsert(List<LichSuSuaChua> list) {
        for (LichSuSuaChua entity : list) {
            insert(entity);
        }
    }

    public void bulkUpdate(List<LichSuSuaChua> list) {
        for (LichSuSuaChua entity : list) {
            update(entity);
        }
    }

    public void bulkDelete(List<String> ids) {
        for (String id : ids) {
            delete(id);
        }
    }
}