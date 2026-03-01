package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.DashboardDao;
import com.ecotel.quanlytaisan.dao.NhomCCDCDAO;
import com.ecotel.quanlytaisan.dao.NhomTaiSanDao;
import com.ecotel.quanlytaisan.model.NhomCCDC;
import com.ecotel.quanlytaisan.model.NhomTaiSan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    @Autowired
    private DashboardDao repo;
    @Autowired
    private NhomTaiSanDao nhomTaiSanDao;
    @Autowired
    private NhomCCDCDAO nhomCCDCDAO;

    // ===== API chính - Lấy tất cả thống kê =====
    public Map<String, Object> getAllStatistics() {
        return repo.getTongHopDashboard();
    }

    // ===== API mới cho thống kê trạng thái =====

    // Tài sản theo trạng thái (HienTrang) với phần trăm
    public List<Map<String, Object>> getTaiSanTheoHienTrangPhanTram() {
        return repo.getTaiSanTheoHienTrangPhanTram();
    }

    // CCDC theo trạng thái (HienTrang) với phần trăm
    public List<Map<String, Object>> getCCDCTheoHienTrangPhanTram() {
        return repo.getCCDCTheoHienTrangPhanTram();
    }

    // Tài sản sắp hết hạn khấu hao
    public List<Map<String, Object>> getTaiSanSapHetHanKhauHao() {
        return repo.getTaiSanSapHetHanKhauHao();
    }

    // Tài sản theo nhóm và loại con với phần trăm (có tham số)
    public List<Map<String, Object>> getTaiSanTheoNhomLoaiConPhanTram(
        String idCongTy, String idNhomTaiSan
        ) {
        return repo.getThongKeTaiSanTheoLoaiCon(idCongTy, idNhomTaiSan);
    }

    // CCDC theo nhóm và loại con với phần trăm (có tham số)
    public Map<String, List<Map<String, Object>>> getCCDCTheoNhomLoaiConPhanTram() {
        List<NhomCCDC> nhomCCDCList = nhomCCDCDAO.findAll("");
        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        for (NhomCCDC nhomCCDC : nhomCCDCList) {
            result.put(nhomCCDC.getTen(), repo.getCCDCTheoNhomLoaiConPhanTram(nhomCCDC.getId()));
        }

        return result;
    }

    // ===== API mới cho thống kê nhóm với phần trăm chi tiết =====

    // Tài sản theo nhóm với phần trăm chi tiết
    public List<Map<String, Object>> getTaiSanTheoNhomPhanTramChiTiet() {
        return repo.getTaiSanTheoNhomPhanTramChiTiet();
    }

    // CCDC theo nhóm với phần trăm chi tiết
    public List<Map<String, Object>> getCCDCTheoNhomPhanTramChiTiet() {
        return repo.getCCDCTheoNhomPhanTramChiTiet();
    }
}
