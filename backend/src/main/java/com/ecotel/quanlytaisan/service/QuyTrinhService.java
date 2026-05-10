package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.QuyTrinhDao;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.QuyTrinhSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuyTrinhService {

    @Autowired
    private QuyTrinhDao quyTrinhDao;

    public PageResponse<QuyTrinhSuaChuaDTO> getPagedQuyTrinh(int page, int pageSize, String idTaiSan, Integer nam) {
        int total = quyTrinhDao.countQuyTrinh(idTaiSan, nam);
        List<QuyTrinhSuaChuaDTO> list = quyTrinhDao.getPagedQuyTrinh(page, pageSize, idTaiSan, nam);

        return new PageResponse<>(list, total, page, pageSize);
    }
}
