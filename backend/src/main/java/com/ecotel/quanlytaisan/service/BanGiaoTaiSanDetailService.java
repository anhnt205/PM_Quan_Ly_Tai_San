package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.BanGiaoTaiSanDao;
import com.ecotel.quanlytaisan.dao.ChiTietBanGiaoTaiSanDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BanGiaoTaiSanDetailService {

    @Autowired
    private BanGiaoTaiSanDao banGiaoTaiSanDao;

    @Autowired
    private ChiTietBanGiaoTaiSanDao chiTietBanGiaoTaiSanDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    public List<BanGiaoTaiSanDetailResponse> getBanGiaoTaiSanDetailByIdCongTy(String idCongTy) {
        try {
            List<BanGiaoTaiSanDetailResponse> banGiaoTaiSanDetailResponseList = new ArrayList<>();
            List<BanGiaoTaiSanDTO> banGiaoTaiSanDTOList = banGiaoTaiSanDao.findAll(idCongTy);
            for (BanGiaoTaiSanDTO banGiaoTaiSanDTO : banGiaoTaiSanDTOList) {
                List<ChiTietBanGiaoTaiSanDTO> chiTietBanGiaoTaiSan = chiTietBanGiaoTaiSanDao.findAll(banGiaoTaiSanDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(banGiaoTaiSanDTO.getId());
                banGiaoTaiSanDetailResponseList.add(new BanGiaoTaiSanDetailResponse(banGiaoTaiSanDTO, chiTietBanGiaoTaiSan, kyTaiLieus));
            }
            return banGiaoTaiSanDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết bàn giao tài sản: " + e.getMessage(), e);
        }
    }


    public List<BanGiaoTaiSanDetailResponse> getBanGiaoTaiSanDetailByUserId(String userId) {
        try {
            List<BanGiaoTaiSanDetailResponse> banGiaoTaiSanDetailResponseList = new ArrayList<>();
            List<BanGiaoTaiSanDTO> banGiaoTaiSanDTOList = banGiaoTaiSanDao.getByUserId(userId);
            for (BanGiaoTaiSanDTO banGiaoTaiSanDTO : banGiaoTaiSanDTOList) {
                List<ChiTietBanGiaoTaiSanDTO> chiTietBanGiaoTaiSan = chiTietBanGiaoTaiSanDao.findAll(banGiaoTaiSanDTO.getId());
                List<KyTaiLieu> kyTaiLieus = kyTaiLieuDao.findById(banGiaoTaiSanDTO.getId());
                banGiaoTaiSanDetailResponseList.add(new BanGiaoTaiSanDetailResponse(banGiaoTaiSanDTO, chiTietBanGiaoTaiSan, kyTaiLieus));
            }
            return banGiaoTaiSanDetailResponseList;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy chi tiết bàn giao tài sản: " + e.getMessage(), e);
        }
    }
}
