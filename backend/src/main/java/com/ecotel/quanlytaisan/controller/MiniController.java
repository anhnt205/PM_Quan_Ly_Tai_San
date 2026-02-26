package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.MiniDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.MiniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Controller chung để lấy dữ liệu tối giản (id, tên) cho các dropdown/select
 * Endpoint: /api/{entity}/paged-mini
 */
@RestController
@RequestMapping("/api")
public class MiniController {

    @Autowired
    private MiniService miniService;

    // ========== PHÒNG BAN ==========
    @GetMapping("/phongban/paged-mini")
    public PageResponse<MiniDTO> getPhongBanMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getPhongBanMini(idcongty, page, size, search);
    }

    // ========== NHÂN VIÊN ==========
    @GetMapping("/nhanvien/paged-mini")
    public PageResponse<MiniDTO> getNhanVienMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getNhanVienMini(idcongty, page, size, search);
    }

    // ========== ĐƠN VỊ TÍNH ==========
    @GetMapping("/donvitinh/paged-mini")
    public PageResponse<MiniDTO> getDonViTinhMini(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getDonViTinhMini(page, size, search);
    }

    // ========== HIỆN TRẠNG KỸ THUẬT ==========
    @GetMapping("/hientrangkythuat/paged-mini")
    public PageResponse<MiniDTO> getHienTrangMini(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getHienTrangMini(page, size, search);
    }

    // ========== DỰ ÁN ==========
    @GetMapping("/duan/paged-mini")
    public PageResponse<MiniDTO> getDuAnMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getDuAnMini(idcongty, page, size, search);
    }

    // ========== NHÓM TÀI SẢN ==========
    @GetMapping("/nhomtaisan/paged-mini")
    public PageResponse<MiniDTO> getNhomTaiSanMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getNhomTaiSanMini(idcongty, page, size, search);
    }

    // ========== LOẠI TÀI SẢN ==========
    @GetMapping("/loaitaisan/paged-mini")
    public PageResponse<MiniDTO> getLoaiTaiSanMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getLoaiTaiSanMini(idcongty, page, size, search);
    }

    // ========== LÝ DO TĂNG ==========
    @GetMapping("/lydotang/paged-mini")
    public PageResponse<MiniDTO> getLyDoTangMini(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getLyDoTangMini(page, size, search);
    }

    // ========== NHÓM CCDC ==========
    @GetMapping("/nhomccdc/paged-mini")
    public PageResponse<MiniDTO> getNhomCCDCMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getNhomCCDCMini(idcongty, page, size, search);
    }

    // ========== LOẠI CCDC ==========
    @GetMapping("/loaiccdc/paged-mini")
    public PageResponse<MiniDTO> getLoaiCCDCMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getLoaiCCDCMini(idcongty, page, size, search);
    }

    // ========== ĐIỀU ĐỘNG TÀI SẢN ==========
    @GetMapping("/dieudongtaisan/paged-mini")
    public PageResponse<MiniDTO> getDieuDongTaiSanMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getDieuDongTaiSanMini(idcongty, page, size, search);
    }

    // ========== ĐIỀU ĐỘNG CCDC ==========
    @GetMapping("/dieudonccdc/paged-mini")
    public PageResponse<MiniDTO> getDieuDongCCDCMini(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return miniService.getDieuDongCCDCMini(idcongty, page, size, search);
    }
}
