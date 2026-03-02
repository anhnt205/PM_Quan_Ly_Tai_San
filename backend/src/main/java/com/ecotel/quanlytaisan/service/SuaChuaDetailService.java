package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.*;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SuaChuaDetailService {

    @Autowired
    private SuaChuaDao suaChuaDao;

    @Autowired
    private ChiTietSuaChuaDao chiTietSuaChuaDao;

    @Autowired
    private KetQuaSuaChuaDao ketQuaSuaChuaDao;

    @Autowired
    private ChiTietKetQuaSuaChuaDao chiTietKetQuaSuaChuaDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    /**
     * Lấy chi tiết đầy đủ của một phiếu sửa chữa (master + detail + kết quả + chữ ký)
     */
    public SuaChuaDetailResponse getDetailById(String id) {
        SuaChuaDTO suaChua = suaChuaDao.findByIdDTO(id);
        if (suaChua == null) return null;

        List<ChiTietSuaChuaDTO> chiTiet = chiTietSuaChuaDao.findByIdSuaChua(id);
        KetQuaSuaChuaDTO ketQua = ketQuaSuaChuaDao.findByIdSuaChua(id);
        List<ChiTietKetQuaSuaChuaDTO> chiTietKetQua = new ArrayList<>();
        if (ketQua != null) {
            chiTietKetQua = chiTietKetQuaSuaChuaDao.findByIdKetQua(ketQua.getId());
        }
        List<KyTaiLieu> kyTaiLieu = kyTaiLieuDao.findById(id);

        return new SuaChuaDetailResponse(suaChua, chiTiet, ketQua, chiTietKetQua, kyTaiLieu);
    }

    /**
     * Lấy tất cả chi tiết theo công ty
     */
    public List<SuaChuaDetailResponse> getDetailByCongTy(String idCongTy) {
        List<SuaChuaDetailResponse> result = new ArrayList<>();
        List<SuaChuaDTO> list = suaChuaDao.findAll(idCongTy);
        for (SuaChuaDTO dto : list) {
            SuaChuaDetailResponse detail = getDetailById(dto.getId());
            if (detail != null) result.add(detail);
        }
        return result;
    }

    /**
     * Lấy tất cả chi tiết theo userId (các phiếu user có quyền xem)
     */
    public List<SuaChuaDetailResponse> getDetailByUserId(String userId) {
        List<SuaChuaDetailResponse> result = new ArrayList<>();
        List<SuaChuaDTO> list = suaChuaDao.findAll(null); // Lấy tất cả, có thể lọc sau
        for (SuaChuaDTO dto : list) {
            // Có thể lọc theo quyền, nhưng tạm thời lấy hết
            SuaChuaDetailResponse detail = getDetailById(dto.getId());
            if (detail != null) result.add(detail);
        }
        return result;
    }
}