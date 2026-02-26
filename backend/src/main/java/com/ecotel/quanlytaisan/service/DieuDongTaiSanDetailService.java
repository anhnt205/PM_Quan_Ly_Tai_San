package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DieuDongTaiSanDao;
import com.ecotel.quanlytaisan.dao.ChiTietDieuDongTaiSanDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DieuDongTaiSanDetailService {

    @Autowired
    private DieuDongTaiSanDao dieuDongTaiSanDao;

    @Autowired
    private ChiTietDieuDongTaiSanDao chiTietDieuDongTaiSanDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    public List<DieuDongTaiSanDetailResponse> getDieuDongTaiSanDetailByIdCongTy(String idCongTy) {
        try {
            List<DieuDongTaiSanDetailResponse> dieuDongTaiSanDetailResponseList = new ArrayList<>();
            List<DieuDongTaiSanDTO> dieuDongTaiSanDTOList = dieuDongTaiSanDao.findAll(idCongTy);
            for (DieuDongTaiSanDTO dieuDongTaiSanDTO : dieuDongTaiSanDTOList) {
                List<ChiTietDieuDongTaiSanDTO> chiTietDieuDongTaiSan = chiTietDieuDongTaiSanDao.findAll(dieuDongTaiSanDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(dieuDongTaiSanDTO.getId());
                dieuDongTaiSanDetailResponseList.add(new DieuDongTaiSanDetailResponse(dieuDongTaiSanDTO, chiTietDieuDongTaiSan, kyTaiLieus));
            }
            return dieuDongTaiSanDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết điều động tài sản: " + e.getMessage(), e);
        }
    }

    public List<DieuDongTaiSanDetailResponse> getDieuDongTaiSanDetailByUserId(String userId) {
        try {
            List<DieuDongTaiSanDetailResponse> dieuDongTaiSanDetailResponseList = new ArrayList<>();
            List<DieuDongTaiSanDTO> dieuDongTaiSanDTOList = dieuDongTaiSanDao.findByUserId(userId);
            for (DieuDongTaiSanDTO dieuDongTaiSanDTO : dieuDongTaiSanDTOList) {
                List<ChiTietDieuDongTaiSanDTO> chiTietDieuDongTaiSan = chiTietDieuDongTaiSanDao.findAll(dieuDongTaiSanDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(dieuDongTaiSanDTO.getId());
                dieuDongTaiSanDetailResponseList.add(new DieuDongTaiSanDetailResponse(dieuDongTaiSanDTO, chiTietDieuDongTaiSan, kyTaiLieus));
            }
            return dieuDongTaiSanDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết điều động tài sản: " + e.getMessage(), e);
        }
    }
}

