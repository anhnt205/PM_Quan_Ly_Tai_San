package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KetQuaSuaChuaChiTietDao;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietDTO;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTiet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class KetQuaSuaChuaChiTietService {

    @Autowired
    private KetQuaSuaChuaChiTietDao chiTietDao;

    public KetQuaSuaChuaChiTiet findById(String id) {
        return chiTietDao.findById(id);
    }

    public List<KetQuaSuaChuaChiTietDTO> findByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        return chiTietDao.findByIdKetQuaSuaChua(idKetQuaSuaChua);
    }

    public KetQuaSuaChuaChiTiet insert(KetQuaSuaChuaChiTiet entity, String userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String now = sdf.format(new Date());
        entity.setNgayTao(now);
        entity.setNgayCapNhat(now);
        entity.setNguoiTao(userId);
        entity.setNguoiCapNhat(userId);
        if (entity.getIsActive() == null) entity.setIsActive(true);
        return chiTietDao.insert(entity);
    }

    public KetQuaSuaChuaChiTiet update(KetQuaSuaChuaChiTiet entity, String userId) {
        KetQuaSuaChuaChiTiet existing = chiTietDao.findById(entity.getId());
        if (existing == null) return null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        entity.setNgayCapNhat(sdf.format(new Date()));
        entity.setNguoiCapNhat(userId);
        // Giữ nguyên ngày tạo và người tạo cũ
        entity.setNgayTao(existing.getNgayTao());
        entity.setNguoiTao(existing.getNguoiTao());
        return chiTietDao.update(entity);
    }

    public int delete(String id) {
        return chiTietDao.delete(id);
    }

    public int softDelete(String id) {
        return chiTietDao.softDelete(id);
    }

    public int deleteByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        return chiTietDao.deleteByIdKetQuaSuaChua(idKetQuaSuaChua);
    }

    public List<KetQuaSuaChuaChiTiet> insertBulk(List<KetQuaSuaChuaChiTiet> entities, String userId) {
        List<KetQuaSuaChuaChiTiet> result = new ArrayList<>();
        for (KetQuaSuaChuaChiTiet entity : entities) {
            result.add(insert(entity, userId));
        }
        return result;
    }

    public List<KetQuaSuaChuaChiTiet> updateBulk(List<KetQuaSuaChuaChiTiet> entities, String userId) {
        List<KetQuaSuaChuaChiTiet> result = new ArrayList<>();
        for (KetQuaSuaChuaChiTiet entity : entities) {
            KetQuaSuaChuaChiTiet updated = update(entity, userId);
            if (updated != null) result.add(updated);
        }
        return result;
    }

    public int deleteBulk(List<String> ids) {
        int count = 0;
        for (String id : ids) {
            count += delete(id);
        }
        return count;
    }

    public int deleteByIdKetQuaSuaChuaBulk(List<String> idKetQuaSuaChuaList) {
        int count = 0;
        for (String id : idKetQuaSuaChuaList) {
            count += deleteByIdKetQuaSuaChua(id);
        }
        return count;
    }

    /**
     * Thay thế toàn bộ danh sách chi tiết tài sản cho một phiếu kết quả sửa chữa
     * - Xóa hết các chi tiết cũ (theo idKetQuaSuaChua)
     * - Thêm mới danh sách được cung cấp
     */
    public List<KetQuaSuaChuaChiTiet> replaceByKetQuaSuaChua(String idKetQuaSuaChua,
                                                             List<KetQuaSuaChuaChiTiet> newEntities,
                                                             String userId) {
        // Xóa tất cả chi tiết cũ
        deleteByIdKetQuaSuaChua(idKetQuaSuaChua);
        // Thêm mới, đảm bảo gán đúng idKetQuaSuaChua
        for (KetQuaSuaChuaChiTiet entity : newEntities) {
            entity.setIdKetQuaSuaChua(idKetQuaSuaChua);
        }
        return insertBulk(newEntities, userId);
    }
}