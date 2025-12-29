package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.BanGiaoTaiSanDao;
import com.ecotel.quanlytaisan.dao.BaoCaoDao;
import com.ecotel.quanlytaisan.dao.PhongBanDao;
import com.ecotel.quanlytaisan.model.BanGiaoTaiSanDTO;
import com.ecotel.quanlytaisan.model.BaoCaoKiemKeCCDC;
import com.ecotel.quanlytaisan.model.BaoCaoKiemKeTaiSan;
import com.ecotel.quanlytaisan.model.BaoCaoTangGiamTrongKy;
import com.ecotel.quanlytaisan.model.BienBanKiemKe;
import com.ecotel.quanlytaisan.model.DieuDongTaiSanDTO;
import com.ecotel.quanlytaisan.model.PhongBanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class BaoCaoService {
    @Autowired
    BaoCaoDao dao;

    @Autowired
    PhongBanDao phongBanDao;

    public List<DieuDongTaiSanDTO> getBaoCaoDieuDong(String idCongTy, int loai) throws SQLException {
        return dao.getDieuDongTaiSan(idCongTy, loai);
    }

    public List<BaoCaoKiemKeTaiSan> getBaoCaoKiemKeTaiSan(String iddonvi, String ngayBanGiao) {
        return dao.getBaoCaoKiemKeTaiSan(iddonvi, ngayBanGiao);
    }

    public List<BaoCaoKiemKeCCDC> getBaoCaoKiemKeCCDC(String iddonvi, String ngayBanGiao) {
        return dao.getBaoCaoKiemKeCCDC(iddonvi, ngayBanGiao);
    }
    public List<Map<String, Object>> getTaiSanCoDinh(String idDonVi) {
        List<Map<String, Object>> data = dao.getTaiSanCoDinh(idDonVi);
        return transformZeroToEmpty(data);
    }

    public Map<String, Object> getS22DnReport(String idDonVi, String nam) {
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("data_increase", transformZeroToEmpty(dao.getS22DnIncrease(idDonVi, nam)));
        result.put("data_reduce", transformZeroToEmpty(dao.getS22DnDecrease(idDonVi, nam)));
        return result;
    }

    public Map<String, Object> getS22DnReportCCDC(String idDonVi, String nam) {
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("data_increase", transformZeroToEmpty(dao.getS22DnIncreaseCCDC(idDonVi, nam)));
        result.put("data_reduce", transformZeroToEmpty(dao.getS22DnDecreaseCCDC(idDonVi, nam)));
        return result;
    }

    /**
     * Transform numeric values: nếu = 0 hoặc null thì trả về chuỗi rỗng
     */
    private List<Map<String, Object>> transformZeroToEmpty(List<Map<String, Object>> data) {
        if (data == null) return null;
        for (Map<String, Object> row : data) {
            for (Map.Entry<String, Object> entry : row.entrySet()) {
                Object value = entry.getValue();
                if (value instanceof Number) {
                    if (((Number) value).doubleValue() == 0) {
                        row.put(entry.getKey(), "");
                    }
                }
            }
        }
        return data;
    }

    /**
     * Báo cáo kiểm kê tài sản theo phòng ban
     * Nếu idPhongBan = null thì get all PhongBan và loop qua từng cái
     * Kết quả được unique theo idTaiSan
     */
    public List<BaoCaoKiemKeTaiSan> getBaoCaoKiemKeTaiSanTheoPhongBan(String idPhongBan, String idCongTy) {
        List<BaoCaoKiemKeTaiSan> result;
        if (idPhongBan == null || idPhongBan.trim().isEmpty()) {
            // Get all PhongBan và loop qua từng cái
            List<PhongBanDTO> allPhongBan = phongBanDao.findAll(idCongTy);
            result = new ArrayList<>();
            for (PhongBanDTO pb : allPhongBan) {
                List<BaoCaoKiemKeTaiSan> pbData = dao.getBaoCaoKiemKeTaiSanTheoPhongBan(pb.getId());
                result.addAll(pbData);
            }
        } else {
            result = dao.getBaoCaoKiemKeTaiSanTheoPhongBan(idPhongBan);
        }
        // Unique theo idTaiSan
        return new ArrayList<>(result.stream()
                .collect(Collectors.toMap(BaoCaoKiemKeTaiSan::getIdTaiSan, Function.identity(), (a, b) -> a, LinkedHashMap::new))
                .values());
    }

    /**
     * Biên bản kiểm kê TaiSan và CCDCVatTu
     * TaiSan: căn cứ IdDonViHienThoi
     * CCDCVatTu: căn cứ IdDonViNhan trong BanGiaoCCDCVatTu
     * Kết quả được unique theo id
     */
    public List<BienBanKiemKe> getBienBanKiemKe(String idPhongBan) {
        List<BienBanKiemKe> result = new ArrayList<>();
        result.addAll(dao.getBienBanKiemKeTaiSan(idPhongBan));
        result.addAll(dao.getBienBanKiemKeCCDCVatTu(idPhongBan));
        // Unique theo id
        return new ArrayList<>(result.stream()
                .collect(Collectors.toMap(BienBanKiemKe::getId, Function.identity(), (a, b) -> a, LinkedHashMap::new))
                .values());
    }

    /**
     * Báo cáo tăng giảm tài sản và CCDC trong kỳ
     * @param idPhongBan ID phòng ban
     * @param thangNam Tháng/Năm (format: MM/yyyy hoặc M/yyyy)
     * Kết quả được unique theo id
     */
    public List<BaoCaoTangGiamTrongKy> getBaoCaoTangGiamTrongKy(String idPhongBan, String thangNam) {
        List<BaoCaoTangGiamTrongKy> result = new ArrayList<>();
        result.addAll(dao.getBaoCaoTangGiamTaiSan(idPhongBan, thangNam));
        result.addAll(dao.getBaoCaoTangGiamCCDCVatTu(idPhongBan, thangNam));
        // Unique theo id
        return new ArrayList<>(result.stream()
                .collect(Collectors.toMap(BaoCaoTangGiamTrongKy::getId, Function.identity(), (a, b) -> a, LinkedHashMap::new))
                .values());
    }
}
