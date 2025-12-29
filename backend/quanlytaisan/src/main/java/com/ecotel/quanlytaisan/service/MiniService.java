package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.MiniDAO;
import com.ecotel.quanlytaisan.model.MiniDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service chung để lấy dữ liệu tối giản (id, tên) cho các dropdown/select
 */
@Service
public class MiniService {

    @Autowired
    private MiniDAO miniDAO;

    // ========== PHÒNG BAN ==========
    public PageResponse<MiniDTO> getPhongBanMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countPhongBanMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findPhongBanMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== NHÂN VIÊN ==========
    public PageResponse<MiniDTO> getNhanVienMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countNhanVienMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findNhanVienMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== ĐƠN VỊ TÍNH ==========
    public PageResponse<MiniDTO> getDonViTinhMini(int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countDonViTinhMini(search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findDonViTinhMini(offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== HIỆN TRẠNG KỸ THUẬT ==========
    public PageResponse<MiniDTO> getHienTrangMini(int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countHienTrangMini(search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findHienTrangMini(offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== DỰ ÁN ==========
    public PageResponse<MiniDTO> getDuAnMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countDuAnMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findDuAnMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== NHÓM TÀI SẢN ==========
    public PageResponse<MiniDTO> getNhomTaiSanMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countNhomTaiSanMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findNhomTaiSanMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== LOẠI TÀI SẢN ==========
    public PageResponse<MiniDTO> getLoaiTaiSanMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countLoaiTaiSanMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findLoaiTaiSanMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== LÝ DO TĂNG ==========
    public PageResponse<MiniDTO> getLyDoTangMini(int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countLyDoTangMini(search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findLyDoTangMini(offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== NHÓM CCDC ==========
    public PageResponse<MiniDTO> getNhomCCDCMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countNhomCCDCMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findNhomCCDCMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== LOẠI CCDC ==========
    public PageResponse<MiniDTO> getLoaiCCDCMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countLoaiCCDCMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findLoaiCCDCMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== ĐIỀU ĐỘNG TÀI SẢN ==========
    public PageResponse<MiniDTO> getDieuDongTaiSanMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countDieuDongTaiSanMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findDieuDongTaiSanMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }

    // ========== ĐIỀU ĐỘNG CCDC ==========
    public PageResponse<MiniDTO> getDieuDongCCDCMini(String idCongTy, int page, int size, String search) {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        long total = miniDAO.countDieuDongCCDCMini(idCongTy, search);
        if (total == 0) {
            return new PageResponse<>(List.of(), 0, page, size);
        }
        int offset = page * size;
        List<MiniDTO> items = miniDAO.findDieuDongCCDCMini(idCongTy, offset, size, search);
        return new PageResponse<>(items, total, page, size);
    }
}
