package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DieuDongCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietDieuDongCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DieuDongCCDCVatTuDetailService {

    @Autowired
    private DieuDongCCDCVatTuDao dieuDongCCDCVatTuDao;

    @Autowired
    private ChiTietDieuDongCCDCVatTuDao chiTietDieuDongCCDCVatTuDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    public List<DieuDongCCDCVatTuDetailResponse> getDieuDongCCDCVatTuDetailByIdCongTy(String idCongTy) {
        try {
            List<DieuDongCCDCVatTuDetailResponse> dieuDongCCDCVatTuDetailResponseList = new ArrayList<>();
            List<DieuDongCCDCVatTuDTO> dieuDongCCDCVatTuDTOList = dieuDongCCDCVatTuDao.findAll(idCongTy);
            for (DieuDongCCDCVatTuDTO dieuDongCCDCVatTuDTO : dieuDongCCDCVatTuDTOList) {
                List<ChiTietDieuDongCCDCVatTuDTO> chiTietDieuDongCCDCVatTu = chiTietDieuDongCCDCVatTuDao.findAll(dieuDongCCDCVatTuDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(dieuDongCCDCVatTuDTO.getId());
                dieuDongCCDCVatTuDetailResponseList.add(new DieuDongCCDCVatTuDetailResponse(dieuDongCCDCVatTuDTO, chiTietDieuDongCCDCVatTu, kyTaiLieus));
            }
            return dieuDongCCDCVatTuDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết điều động CCDC/Vật tư: " + e.getMessage(), e);
        }
    }

    public List<DieuDongCCDCVatTuDetailResponse> getDieuDongCCDCVatTuDetailByUserId(String userId) {
        try {
            List<DieuDongCCDCVatTuDetailResponse> dieuDongCCDCVatTuDetailResponseList = new ArrayList<>();
            List<DieuDongCCDCVatTuDTO> dieuDongCCDCVatTuDTOList = dieuDongCCDCVatTuDao.findByUserId(userId);
            for (DieuDongCCDCVatTuDTO dieuDongCCDCVatTuDTO : dieuDongCCDCVatTuDTOList) {
                List<ChiTietDieuDongCCDCVatTuDTO> chiTietDieuDongCCDCVatTu = chiTietDieuDongCCDCVatTuDao.findAll(dieuDongCCDCVatTuDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(dieuDongCCDCVatTuDTO.getId());
                dieuDongCCDCVatTuDetailResponseList.add(new DieuDongCCDCVatTuDetailResponse(dieuDongCCDCVatTuDTO, chiTietDieuDongCCDCVatTu, kyTaiLieus));
            }
            return dieuDongCCDCVatTuDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết điều động CCDC/Vật tư: " + e.getMessage(), e);
        }
    }
}
