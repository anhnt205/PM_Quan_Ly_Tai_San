package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.*;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BanGiaoCCDCVatTuDetailService {

    @Autowired
    private BanGiaoCCDCVatTuDao banGiaoCCDCVatTuDao;

    @Autowired
    private ChiTietBanGiaoCCDCVatTuDao chiTietBanGiaoCCDCVatTuDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    public List<BanGiaoCCDCVatTuDetailResponse> getBanGiaoCCDCVatTuDetailByIdCongTy(String idCongTy) {
        try {
            List<BanGiaoCCDCVatTuDetailResponse> banGiaoCCDCVatTuDetailResponseList = new ArrayList<>();
            List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = banGiaoCCDCVatTuDao.findAll(idCongTy);
            for (BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO : banGiaoCCDCVatTuDTOList) {
                List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTu = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(banGiaoCCDCVatTuDTO.getId());
                banGiaoCCDCVatTuDetailResponseList.add(new BanGiaoCCDCVatTuDetailResponse(banGiaoCCDCVatTuDTO, chiTietBanGiaoCCDCVatTu, kyTaiLieus));
            }
            return banGiaoCCDCVatTuDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết bàn giao tài sản: " + e.getMessage(), e);
        }
    }


    public List<BanGiaoCCDCVatTuDetailResponse> getBanGiaoCCDCVatTuDetailByUserId(String userId) {
        try {
            List<BanGiaoCCDCVatTuDetailResponse> banGiaoCCDCVatTuDetailResponseList = new ArrayList<>();
            List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = banGiaoCCDCVatTuDao.getByUserId(userId);
            for (BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO : banGiaoCCDCVatTuDTOList) {
                List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTu = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(banGiaoCCDCVatTuDTO.getId());
                banGiaoCCDCVatTuDetailResponseList.add(new BanGiaoCCDCVatTuDetailResponse(banGiaoCCDCVatTuDTO, chiTietBanGiaoCCDCVatTu, kyTaiLieus));
            }
            return banGiaoCCDCVatTuDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết bàn giao tài sản: " + e.getMessage(), e);
        }
    }
}
