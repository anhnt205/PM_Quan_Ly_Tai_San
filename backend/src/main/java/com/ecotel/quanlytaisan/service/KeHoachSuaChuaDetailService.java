package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KeHoachChiTietSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KeHoachCongViecSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KeHoachSuaChuaDao;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KeHoachSuaChuaDetailService {

    @Autowired
    private KeHoachSuaChuaDao keHoachSuaChuaDao;

    @Autowired
    private KeHoachCongViecSuaChuaDao keHoachCongViecSuaChuaDao;

    @Autowired
    private KeHoachChiTietSuaChuaDao keHoachChiTietSuaChuaDao;

    public KeHoachSuaChuaDetailResponse getDetailById(String id) {
        KeHoachSuaChuaDTO keHoach = keHoachSuaChuaDao.findByIdDTO(id);
        if (keHoach == null) return null;

        List<KeHoachCongViecSuaChuaDTO> congViecs = keHoachCongViecSuaChuaDao.findByIdKeHoach(id);
        List<KeHoachChiTietSuaChuaDTO> chiTiets = keHoachChiTietSuaChuaDao.findByIdKeHoach(id);

        return new KeHoachSuaChuaDetailResponse(keHoach, congViecs, chiTiets);
    }

    public List<KeHoachSuaChuaDetailResponse> getDetailByCongTy(String idCongTy) {
        List<KeHoachSuaChuaDetailResponse> result = new ArrayList<>();
        List<KeHoachSuaChuaDTO> list = keHoachSuaChuaDao.findAll(idCongTy);
        for (KeHoachSuaChuaDTO dto : list) {
            KeHoachSuaChuaDetailResponse detail = getDetailById(dto.getId());
            if (detail != null) result.add(detail);
        }
        return result;
    }
}