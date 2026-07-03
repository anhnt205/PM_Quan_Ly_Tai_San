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
import java.util.*;
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

        // Lấy danh sách tăng từ bàn giao tài sản
        List<Map<String, Object>> increase = dao.getS22DnIncrease(idDonVi, nam);

        // Lấy danh sách tài sản hiện tại của đơn vị
        List<Map<String, Object>> currentAssets = dao.getTaiSanCoDinh(idDonVi);

        // Tạo set chứa các idTaiSan đã có trong danh sách tăng
        Set<String> existingAssetIds = increase.stream()
                .map(row -> String.valueOf(row.get("idTaiSan")))
                .filter(id -> id != null && !"null".equals(id))
                .collect(Collectors.toSet());

        // Thêm các tài sản chưa có trong danh sách tăng
        for (Map<String, Object> asset : currentAssets) {
            String assetId = String.valueOf(asset.get("Id"));
            if (!existingAssetIds.contains(assetId)) {
                // Tạo bản ghi mới cho tài sản chưa có trong danh sách tăng
                Map<String, Object> newRecord = new java.util.LinkedHashMap<>();
                newRecord.put("soQuyetDinh", ""); // Không có quyết định
                newRecord.put("ngayThang", ""); // Không có ngày tháng
                newRecord.put("idTaiSan", asset.get("Id"));
                newRecord.put("tenTaiSan", asset.get("TenTaiSan"));
                newRecord.put("donViTinh", asset.get("DonViTinh") != null ? asset.get("DonViTinh") : "");
                newRecord.put("soLuong", asset.get("SoLuong") != null ? asset.get("SoLuong") : 0);
                newRecord.put("donGia", asset.get("NguyenGia") != null ? asset.get("NguyenGia") : 0);

                // Tính tổng tiền = số lượng * đơn giá
                Number soLuong = (Number) asset.get("SoLuong");
                Number donGia = (Number) asset.get("NguyenGia");
                double tongTien = (soLuong != null ? soLuong.doubleValue() : 0) *
                        (donGia != null ? donGia.doubleValue() : 0);
                newRecord.put("tongTien", tongTien);
                newRecord.put("ghiChu", asset.get("GhiChu") != null ? asset.get("GhiChu") : "");

                increase.add(newRecord);
            }
        }

        // Lấy danh sách giảm
        List<Map<String, Object>> reduce = dao.getS22DnDecrease(idDonVi, nam);

        increase = mergeS22List(increase, "idTaiSan", "soQuyetDinh");
        reduce = mergeS22List(reduce, "idTaiSan", "soQuyetDinh");

        result.put("data_increase", transformZeroToEmpty(increase));
        result.put("data_reduce", transformZeroToEmpty(reduce));
        return result;
    }

    public Map<String, Object> getS22DnReportCCDC(String idDonVi, String nam) {
        Map<String, Object> result = new java.util.HashMap<>();

        // Lấy danh sách tăng từ bàn giao CCDC
        List<Map<String, Object>> increase = dao.getS22DnIncreaseCCDC(idDonVi, nam);

        // Lấy danh sách CCDC từ bảng chitietdonvisohuu, group theo IdCCDCVT và tính tổng số lượng
        List<Map<String, Object>> ccdcFromDonViSoHuu = dao.getCCDCGroupByDonViSoHuu(idDonVi);

        // Tạo map chứa idCCDC và tổng số lượng từ bảng chitietdonvisohuu
        Map<String, Double> ccdcSoHuuMap = ccdcFromDonViSoHuu.stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row.get("idCCDCVT")),
                        row -> ((Number) row.get("tongSoLuong")).doubleValue(),
                        (a, b) -> a
                ));

        // Tạo map chứa idCCDC và số lượng từ danh sách tăng hiện tại
        Map<String, Double> increaseMap = increase.stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row.get("idCCDC")),
                        row -> ((Number) row.get("soLuong")).doubleValue(),
                        (a, b) -> a + b // Nếu có nhiều dòng cùng id thì cộng dồn
                ));

        // Xử lý từng CCDC trong danh sách sở hữu
        for (Map.Entry<String, Double> entry : ccdcSoHuuMap.entrySet()) {
            String idCCDC = entry.getKey();
            double soLuongSoHuu = entry.getValue();
            double soLuongDaTang = increaseMap.getOrDefault(idCCDC, 0.0);

            double soLuongConLai = soLuongSoHuu - soLuongDaTang;

            // Nếu số lượng còn lại > 0 thì thêm vào danh sách tăng
            if (soLuongConLai > 0) {
                // Lấy thông tin chi tiết của CCDC
                Map<String, Object> ccdcInfo = dao.getCCDCInfoById(idCCDC);

                if (ccdcInfo != null) {
                    Map<String, Object> newRecord = new java.util.LinkedHashMap<>();
                    newRecord.put("soQuyetDinh", ""); // Không có quyết định
                    newRecord.put("ngayThang", ""); // Không có ngày tháng
                    newRecord.put("idCCDC", idCCDC);
                    newRecord.put("tenTaiSan", ccdcInfo.get("Ten") != null ? ccdcInfo.get("Ten") : "");
                    newRecord.put("donViTinh", ccdcInfo.get("DonViTinh") != null ? ccdcInfo.get("DonViTinh") : "");
                    newRecord.put("soLuong", soLuongConLai);
                    newRecord.put("donGia", ccdcInfo.get("GiaTri") != null ? ccdcInfo.get("GiaTri") : 0);

                    // Tính tổng tiền = số lượng * đơn giá
                    Number donGia = (Number) ccdcInfo.get("GiaTri");
                    double tongTien = soLuongConLai * (donGia != null ? donGia.doubleValue() : 0);
                    newRecord.put("tongTien", tongTien);
                    newRecord.put("ghiChu", "Tồn từ kỳ trước"); // Ghi chú để phân biệt

                    increase.add(newRecord);
                }
            }
        }

        // Lấy danh sách giảm
        List<Map<String, Object>> reduce = dao.getS22DnDecreaseCCDC(idDonVi, nam);

        increase = mergeS22List(increase, "idCCDC", "soQuyetDinh");
        reduce = mergeS22List(reduce, "idCCDC", "soQuyetDinh");

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
    private List<Map<String, Object>> mergeS22List(List<Map<String, Object>> list, String idField, String soQuyetDinhField) {
        if (list == null || list.isEmpty()) {
            return list;
        }

        Map<String, Map<String, Object>> merged = new LinkedHashMap<>();

        for (Map<String, Object> row : list) {
            Object idObj = row.get(idField);
            Object soQDObj = row.get(soQuyetDinhField);

            if (idObj == null) continue; // bỏ qua dòng không có id

            String id = idObj.toString();
            String soQD = soQDObj != null ? soQDObj.toString() : "";

            // Tạo key kết hợp từ idTaiSan và soQuyetDinh
            String compositeKey = id + "|" + soQD;

            if (!merged.containsKey(compositeKey)) {
                // Tạo bản sao của row
                Map<String, Object> newRow = new LinkedHashMap<>(row);
                merged.put(compositeKey, newRow);
            } else {
                Map<String, Object> existing = merged.get(compositeKey);

                // Cộng dồn số lượng
                Number soLuongExisting = (Number) existing.get("soLuong");
                Number soLuongCurrent = (Number) row.get("soLuong");
                if (soLuongExisting != null && soLuongCurrent != null) {
                    existing.put("soLuong", soLuongExisting.doubleValue() + soLuongCurrent.doubleValue());
                }

                // Cộng dồn tổng tiền
                Number tongTienExisting = (Number) existing.get("tongTien");
                Number tongTienCurrent = (Number) row.get("tongTien");
                if (tongTienExisting != null && tongTienCurrent != null) {
                    existing.put("tongTien", tongTienExisting.doubleValue() + tongTienCurrent.doubleValue());
                }

                // Ghép ngày tháng (nếu cần)
                String ngayExisting = (String) existing.get("ngayThang");
                String ngayCurrent = (String) row.get("ngayThang");
                if (ngayExisting != null && ngayCurrent != null && !ngayExisting.equals(ngayCurrent)) {
                    existing.put("ngayThang", ngayExisting + ", " + ngayCurrent);
                } else if (ngayCurrent != null && ngayExisting == null) {
                    existing.put("ngayThang", ngayCurrent);
                }

                // Ghép ghi chú
                String ghiChuExisting = (String) existing.get("ghiChu");
                String ghiChuCurrent = (String) row.get("ghiChu");
                if (ghiChuExisting != null && ghiChuCurrent != null && !ghiChuExisting.equals(ghiChuCurrent)) {
                    existing.put("ghiChu", ghiChuExisting + "; " + ghiChuCurrent);
                } else if (ghiChuCurrent != null && ghiChuExisting == null) {
                    existing.put("ghiChu", ghiChuCurrent);
                }

                // Các trường tenTaiSan, donViTinh, donGia giữ nguyên (không gộp)
            }
        }

        return new ArrayList<>(merged.values());
    }
}
