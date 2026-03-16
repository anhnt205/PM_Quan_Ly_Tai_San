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

        List<Map<String, Object>> increase = dao.getS22DnIncrease(idDonVi, nam);
        List<Map<String, Object>> reduce = dao.getS22DnDecrease(idDonVi, nam);

        increase = mergeS22List(increase, "idTaiSan");
        reduce = mergeS22List(reduce, "idTaiSan");

        result.put("data_increase", transformZeroToEmpty(increase));
        result.put("data_reduce", transformZeroToEmpty(reduce));
        return result;
    }

    public Map<String, Object> getS22DnReportCCDC(String idDonVi, String nam) {
        Map<String, Object> result = new java.util.HashMap<>();

        List<Map<String, Object>> increase = dao.getS22DnIncreaseCCDC(idDonVi, nam);
        List<Map<String, Object>> reduce = dao.getS22DnDecreaseCCDC(idDonVi, nam);

        increase = mergeS22List(increase, "idCCDC");
        reduce = mergeS22List(reduce, "idCCDC");

        result.put("data_increase", transformZeroToEmpty(increase));
        result.put("data_reduce", transformZeroToEmpty(reduce));
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


    /**
     * Gộp các dòng trong báo cáo S22 theo id tài sản (hoặc id CCDC)
     * @param list     danh sách các Map từ DAO
     * @param idField  tên trường id (ví dụ "idTaiSan" hoặc "idCCDC")
     * @return danh sách đã gộp
     */
    private List<Map<String, Object>> mergeS22List(List<Map<String, Object>> list, String idField) {
        if (list == null || list.isEmpty()) {
            return list;
        }

        Map<String, Map<String, Object>> merged = new LinkedHashMap<>();

        for (Map<String, Object> row : list) {
            Object idObj = row.get(idField);
            if (idObj == null) continue; // bỏ qua dòng không có id
            String id = idObj.toString();

            if (!merged.containsKey(id)) {
                // Tạo bản sao của row (có thể dùng LinkedHashMap để giữ thứ tự)
                Map<String, Object> newRow = new LinkedHashMap<>(row);
                merged.put(id, newRow);
            } else {
                Map<String, Object> existing = merged.get(id);

                // Cộng dồn số lượng
                Number soLuongExisting = (Number) existing.get("soLuong");
                Number soLuongCurrent = (Number) row.get("soLuong");
                existing.put("soLuong", soLuongExisting.doubleValue() + soLuongCurrent.doubleValue());

                // Cộng dồn tổng tiền
                Number tongTienExisting = (Number) existing.get("tongTien");
                Number tongTienCurrent = (Number) row.get("tongTien");
                existing.put("tongTien", tongTienExisting.doubleValue() + tongTienCurrent.doubleValue());

                // Ghép số quyết định
                String soQDExisting = (String) existing.get("soQuyetDinh");
                String soQDCurrent = (String) row.get("soQuyetDinh");
                existing.put("soQuyetDinh", soQDExisting + ", " + soQDCurrent);

                // Ghép ngày tháng (nếu cần)
                String ngayExisting = (String) existing.get("ngayThang");
                String ngayCurrent = (String) row.get("ngayThang");
                if (ngayExisting != null && ngayCurrent != null) {
                    existing.put("ngayThang", ngayExisting + ", " + ngayCurrent);
                } else if (ngayCurrent != null) {
                    existing.put("ngayThang", ngayCurrent);
                }

                // Ghép ghi chú
                String ghiChuExisting = (String) existing.get("ghiChu");
                String ghiChuCurrent = (String) row.get("ghiChu");
                if (ghiChuExisting != null && ghiChuCurrent != null) {
                    existing.put("ghiChu", ghiChuExisting + "; " + ghiChuCurrent);
                } else if (ghiChuCurrent != null) {
                    existing.put("ghiChu", ghiChuCurrent);
                }

                // Các trường tenTaiSan, donViTinh, donGia giữ nguyên (không gộp)
            }
        }

        return new ArrayList<>(merged.values());
    }
}
