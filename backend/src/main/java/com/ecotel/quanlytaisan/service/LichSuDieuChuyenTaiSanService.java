package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.LichSuDieuChuyenTaiSanDao;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSanDTO;
import com.ecotel.quanlytaisan.model.LichSuDieuChuyenTaiSan;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import com.ecotel.quanlytaisan.dao.TaiSanDao;
import com.ecotel.quanlytaisan.model.TaiSanCon;

@Service
public class LichSuDieuChuyenTaiSanService {

    @Autowired
    private LichSuDieuChuyenTaiSanDao lichSuDieuChuyenTaiSanDao;

    @Autowired
    private TaiSanDao taiSanDao;

    public int createBatch(List<LichSuDieuChuyenTaiSanDTO> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<LichSuDieuChuyenTaiSanDTO> fullList = new ArrayList<>(list);
        for (LichSuDieuChuyenTaiSanDTO dto : list) {
            List<TaiSanCon> childAssets = taiSanDao.getTaiSanConByTaiSan(dto.getIdTaiSan());
            if (childAssets != null && !childAssets.isEmpty()) {
                for (TaiSanCon child : childAssets) {
                    LichSuDieuChuyenTaiSanDTO childDto = new LichSuDieuChuyenTaiSanDTO();
                    childDto.setIdTaiSan(child.getIdTaiSanCon());
                    childDto.setIdBanGiaoTaiSan(dto.getIdBanGiaoTaiSan());
                    childDto.setIdDonViNhan(dto.getIdDonViNhan());
                    childDto.setIdDonViGiao(dto.getIdDonViGiao());
                    childDto.setThoiGianBanGiao(dto.getThoiGianBanGiao());
                    fullList.add(childDto);
                }
            }
        }

        return lichSuDieuChuyenTaiSanDao.createBatch(fullList);
    }

    public PageResponse<LichSuDieuChuyenTaiSan> getAllPaged(int page, int size, String idTaiSan, String fromDate, String toDate) {
        int offset = page * size;
        List<LichSuDieuChuyenTaiSan> list = lichSuDieuChuyenTaiSanDao.findAllPaged(offset, size, idTaiSan, fromDate, toDate);
        long total = lichSuDieuChuyenTaiSanDao.countAll(idTaiSan, fromDate, toDate);
        return new PageResponse<>(list, total, page, size);
    }

    public int update(String id, LichSuDieuChuyenTaiSanDTO item) {
        return lichSuDieuChuyenTaiSanDao.update(id, item);
    }

    public int delete(String id) {
        return lichSuDieuChuyenTaiSanDao.delete(id);
    }

    // ================== BATCH UPDATE & DELETE ==================
    public int updateBatch(List<LichSuDieuChuyenTaiSanDTO> list) {
        if (list == null || list.isEmpty()) return 0;
        int[] results = lichSuDieuChuyenTaiSanDao.updateBatch(list);
        int successCount = 0;
        for (int r : results) {
            if (r > 0) successCount++;
        }
        return successCount;
    }

    public int deleteBatch(List<String> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return lichSuDieuChuyenTaiSanDao.deleteBatch(ids);
    }
}