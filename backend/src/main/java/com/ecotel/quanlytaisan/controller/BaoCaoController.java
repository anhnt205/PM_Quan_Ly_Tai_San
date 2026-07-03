package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.BaoCaoKiemKeCCDC;
import com.ecotel.quanlytaisan.model.BaoCaoKiemKeTaiSan;
import com.ecotel.quanlytaisan.model.BaoCaoTangGiamTrongKy;
import com.ecotel.quanlytaisan.model.BienBanKiemKe;
import com.ecotel.quanlytaisan.model.DieuDongTaiSanDTO;
import com.ecotel.quanlytaisan.service.BaoCaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/baocao")
public class BaoCaoController {
    @Autowired
    private BaoCaoService service;

    @GetMapping("/dieudongtaisan")
    public List<DieuDongTaiSanDTO> getBaoCaoDieuDong(@RequestParam("idcongty") String idcongty, @RequestParam("loai") int loai) throws SQLException {
        return service.getBaoCaoDieuDong(idcongty, loai);
    }

    @GetMapping("/baocaokiemketaisan")
    public List<BaoCaoKiemKeTaiSan> getBaoCaoKiemKeTaiSan(@RequestParam("iddonvi") String iddonvi, @RequestParam("ngayBanGiao") String ngayBanGiao) throws SQLException {
        return service.getBaoCaoKiemKeTaiSan(iddonvi, ngayBanGiao);
    }

    @GetMapping("/baocaokiemkeccdc")
    public List<BaoCaoKiemKeCCDC> getBaoCaoKiemKeCCDC(@RequestParam("iddonvi") String iddonvi, @RequestParam("ngayBanGiao") String ngayBanGiao) throws SQLException {
        return service.getBaoCaoKiemKeCCDC(iddonvi, ngayBanGiao);
    }

    @GetMapping("/taisancodinh")

    public List<Map<String, Object>> getTaiSanCoDinh(@RequestParam("iddonvi") String iddonvi) throws SQLException {
        return service.getTaiSanCoDinh(iddonvi);
    }

    @GetMapping("/s22dn")
    public Map<String, Object> getS22DnReport(@RequestParam("iddonvi") String iddonvi, @RequestParam("nam") String nam) {
        return service.getS22DnReport(iddonvi, nam);
    }

    @GetMapping("/s22dn-ccdc")
    public Map<String, Object> getS22DnReportCCDC(@RequestParam("iddonvi") String iddonvi, @RequestParam("nam") String nam) {
        return service.getS22DnReportCCDC(iddonvi, nam);
    }

    /**
     * Báo cáo kiểm kê tài sản theo phòng ban
     * Dựa trên BanGiaoTaiSan với TrangThai = 3 (hoàn thành)
     * Nếu không truyền idPhongBan thì get all PhongBan và lấy toàn bộ
     */
    @GetMapping("/kiemke-taisan-theo-phongban")
    public List<BaoCaoKiemKeTaiSan> getBaoCaoKiemKeTaiSanTheoPhongBan(
            @RequestParam(value = "idPhongBan",required = false) String idPhongBan) {
        return service.getBaoCaoKiemKeTaiSanTheoPhongBan(idPhongBan, "CT001");
    }

    /**
     * Biên bản kiểm kê TaiSan và CCDCVatTu
     * TaiSan: căn cứ IdDonViHienThoi
     * CCDCVatTu: căn cứ IdDonViNhan trong BanGiaoCCDCVatTu
     */
    @GetMapping("/bienban-kiemke")
    public List<BienBanKiemKe> getBienBanKiemKe(@RequestParam("idPhongBan") String idPhongBan) {
        return service.getBienBanKiemKe(idPhongBan);
    }

    /**
     * Báo cáo tăng giảm tài sản và CCDC trong kỳ
     * @param idPhongBan ID phòng ban
     * @param thangNam Tháng/Năm (format: MM/yyyy hoặc M/yyyy, ví dụ: 12/2025 hoặc 1/2025)
     */
    @GetMapping("/tang-giam-trong-ky")
    public List<BaoCaoTangGiamTrongKy> getBaoCaoTangGiamTrongKy(
            @RequestParam("idPhongBan") String idPhongBan,
            @RequestParam("thangNam") String thangNam) {
        return service.getBaoCaoTangGiamTrongKy(idPhongBan, thangNam);
    }
}
