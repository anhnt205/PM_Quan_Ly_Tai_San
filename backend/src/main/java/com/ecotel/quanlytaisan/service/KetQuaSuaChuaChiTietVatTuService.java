package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KetQuaSuaChuaChiTietVatTuDao;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietVatTuDTO;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaChiTietVatTu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class KetQuaSuaChuaChiTietVatTuService {

    @Autowired
    private KetQuaSuaChuaChiTietVatTuDao vatTuDao;

    public KetQuaSuaChuaChiTietVatTu findById(String id) {
        return vatTuDao.findById(id);
    }

    public List<KetQuaSuaChuaChiTietVatTuDTO> findByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        return vatTuDao.findByIdKetQuaSuaChua(idKetQuaSuaChua);
    }

    public KetQuaSuaChuaChiTietVatTu insert(KetQuaSuaChuaChiTietVatTu entity, String userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String now = sdf.format(new Date());
        entity.setNgayTao(now);
        entity.setNgayCapNhat(now);
        entity.setNguoiTao(userId);
        entity.setNguoiCapNhat(userId);
        if (entity.getIsActive() == null) entity.setIsActive(true);
        // Tính thành tiền nếu chưa có
        if (entity.getThanhTien() == null && entity.getDonGia() != null && entity.getSoLuong() != null) {
            entity.setThanhTien(entity.getDonGia().multiply(new java.math.BigDecimal(entity.getSoLuong())));
        }
        return vatTuDao.insert(entity);
    }

    public KetQuaSuaChuaChiTietVatTu update(KetQuaSuaChuaChiTietVatTu entity, String userId) {
        KetQuaSuaChuaChiTietVatTu existing = vatTuDao.findById(entity.getId());
        if (existing == null) return null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        entity.setNgayCapNhat(sdf.format(new Date()));
        entity.setNguoiCapNhat(userId);
        entity.setNgayTao(existing.getNgayTao());
        entity.setNguoiTao(existing.getNguoiTao());
        if (entity.getThanhTien() == null && entity.getDonGia() != null && entity.getSoLuong() != null) {
            entity.setThanhTien(entity.getDonGia().multiply(new java.math.BigDecimal(entity.getSoLuong())));
        }
        return vatTuDao.update(entity);
    }

    public int delete(String id) {
        return vatTuDao.delete(id);
    }

    public int softDelete(String id) {
        return vatTuDao.softDelete(id);
    }

    public int deleteByIdKetQuaSuaChua(String idKetQuaSuaChua) {
        return vatTuDao.deleteByIdKetQuaSuaChua(idKetQuaSuaChua);
    }

    public List<KetQuaSuaChuaChiTietVatTu> insertBulk(List<KetQuaSuaChuaChiTietVatTu> entities, String userId) {
        List<KetQuaSuaChuaChiTietVatTu> result = new ArrayList<>();
        for (KetQuaSuaChuaChiTietVatTu entity : entities) {
            result.add(insert(entity, userId));
        }
        return result;
    }

    public List<KetQuaSuaChuaChiTietVatTuDTO> findBySuaChuaChiTietTaiSan(String idSuaChuaChiTietTaiSan) {
        return vatTuDao.findByIdSuaChuaChiTietTaiSan(idSuaChuaChiTietTaiSan);
    }

    public List<KetQuaSuaChuaChiTietVatTu> updateBulk(List<KetQuaSuaChuaChiTietVatTu> entities, String userId) {
        List<KetQuaSuaChuaChiTietVatTu> result = new ArrayList<>();
        for (KetQuaSuaChuaChiTietVatTu entity : entities) {
            KetQuaSuaChuaChiTietVatTu updated = update(entity, userId);
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

    public List<KetQuaSuaChuaChiTietVatTu> replaceByKetQuaSuaChua(String idKetQuaSuaChua,
                                                                  List<KetQuaSuaChuaChiTietVatTu> newEntities,
                                                                  String userId) {
        deleteByIdKetQuaSuaChua(idKetQuaSuaChua);
        for (KetQuaSuaChuaChiTietVatTu entity : newEntities) {
            entity.setIdKetQuaSuaChua(idKetQuaSuaChua);
        }
        return insertBulk(newEntities, userId);
    }
}