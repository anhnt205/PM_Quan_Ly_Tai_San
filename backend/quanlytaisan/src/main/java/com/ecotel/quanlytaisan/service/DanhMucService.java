package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.*;
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DanhMucService {

    @Autowired
    private NhomTaiSanDao nhomTaiSanDao;

    @Autowired
    private NhomCCDCDAO nhomCCDCDAO;

    @Autowired
    private LoaiTaiSanDao loaiTaiSanDao;

    @Autowired
    private LoaiTaiSanConDao loaiTaiSanConDao;

    @Autowired
    private LoaiCCDCConDao loaiCCDCConDao;

    @Autowired
    private NhanVienDao nhanVienDao;

    @Autowired
    private MoHinhTaiSanDao moHinhTaiSanDao;

    @Autowired
    private NhomDonViDao nhomDonViDao;

    @Autowired
    private DonViTinhDAO donViTinhDAO;

    public DanhMucResponse getAllDanhMuc(String idCongTy) {
        try {
            // Lấy dữ liệu từ tất cả các DAO
            List<NhomTaiSan> nhomTaiSan = nhomTaiSanDao.findAll(idCongTy);
            List<NhomCCDC> nhomCCDC = nhomCCDCDAO.findAll(idCongTy);
            List<LoaiTaiSan> loaiTaiSan = loaiTaiSanDao.findAll(idCongTy);
            List<LoaiTaiSanCon> loaiTaiSanCon = loaiTaiSanConDao.findAll();
            List<LoaiCCDCCon> loaiCCDCCon = loaiCCDCConDao.findAll();
            List<NhanVienDTO> nhanVien = nhanVienDao.findAll(idCongTy);
            List<MoHinhTaiSan> moHinhTaiSan = moHinhTaiSanDao.findAll(idCongTy);
            List<NhomDonVi> donVi = nhomDonViDao.findAll(idCongTy);
            List<DonViTinh> donViTinh = donViTinhDAO.findAll();

            return new DanhMucResponse(
                nhomTaiSan,
                nhomCCDC,
                loaiTaiSan,
                loaiTaiSanCon,
                loaiCCDCCon,
                nhanVien,
                moHinhTaiSan,
                donVi,
                donViTinh
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy dữ liệu danh mục: " + e.getMessage(), e);
        }
    }
}
