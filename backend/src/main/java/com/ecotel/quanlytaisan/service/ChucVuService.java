package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChucVuDao;
import com.ecotel.quanlytaisan.dao.TaiKhoanDao;
import com.ecotel.quanlytaisan.model.ChucVu;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.TaiKhoan;
import com.ecotel.quanlytaisan.model.UserPermission;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChucVuService {
    @Autowired
    private ChucVuDao chucVuDAO;

    @Autowired
    private TaiKhoanDao taiKhoanDao;

    @Autowired
    private UserPermissionService userPermissionService;

    public int insert(ChucVu cv) {
        return chucVuDAO.insert(cv);
    }

    public int batchCreate(List<ChucVu> list) {
        return chucVuDAO.batchCreate(list);
    }

    public int update(ChucVu cv) {
        int result = chucVuDAO.update(cv);
        if (result > 0) {
            syncPermissionsForAccounts(cv);
        }
        return result;
    }

    private void syncPermissionsForAccounts(ChucVu cv) {
        List<TaiKhoan> accounts = taiKhoanDao.findByChucVuId(cv.getId());
        if (accounts.isEmpty()) return;

        Map<String, Boolean> pMap = new HashMap<>();
        pMap.put("NHANVIEN", cv.getQuanLyNhanVien() != null && cv.getQuanLyNhanVien());
        pMap.put("PHONGBAN", cv.getQuanLyPhongBan() != null && cv.getQuanLyPhongBan());
        pMap.put("DUAN", cv.getQuanLyDuAn() != null && cv.getQuanLyDuAn());
        pMap.put("NGUONVON", cv.getQuanLyNguonVon() != null && cv.getQuanLyNguonVon());
        pMap.put("MOHINHTAISAN", cv.getQuanLyMoHinhTaiSan() != null && cv.getQuanLyMoHinhTaiSan());
        pMap.put("NHOMTAISAN", cv.getQuanLyNhomTaiSan() != null && cv.getQuanLyNhomTaiSan());
        pMap.put("TAISAN", cv.getQuanLyTaiSan() != null && cv.getQuanLyTaiSan());
        pMap.put("CCDCVT", cv.getQuanLyCCDCVatTu() != null && cv.getQuanLyCCDCVatTu());
        pMap.put("DIEUDONG_TAISAN", cv.getDieuDongTaiSan() != null && cv.getDieuDongTaiSan());
        pMap.put("DIEUDONG_CCDC", cv.getDieuDongCCDCVatTu() != null && cv.getDieuDongCCDCVatTu());
        pMap.put("BANGIAO_TAISAN", cv.getBanGiaoTaiSan() != null && cv.getBanGiaoTaiSan());
        pMap.put("BANGIAO_CCDC", cv.getBanGiaoCCDCVatTu() != null && cv.getBanGiaoCCDCVatTu());
        pMap.put("BAOCAO", cv.getBaoCao() != null && cv.getBaoCao());

        for (TaiKhoan tk : accounts) {
            List<UserPermission> userPerms = new ArrayList<>();
            for (Map.Entry<String, Boolean> entry : pMap.entrySet()) {
                UserPermission up = new UserPermission();
                up.setUserId(tk.getId());
                up.setPermissionCode(entry.getKey());
                boolean val = entry.getValue();
                up.setCanCreate(val);
                up.setCanRead(val);
                up.setCanUpdate(val);
                up.setCanDelete(val);
                userPerms.add(up);
            }
            userPermissionService.setUserPermissionsBatch(userPerms);
        }
    }

    public int batchUpdate(List<ChucVu> list) {
        int result = chucVuDAO.batchUpdate(list);
        if (result > 0) {
            for (ChucVu cv : list) {
                syncPermissionsForAccounts(cv);
            }
        }
        return result;
    }

    public int delete(String id) {
        return chucVuDAO.delete(id);
    }

    public int batchDelete(List<String> ids) {
        return chucVuDAO.batchDelete(ids);
    }

    public List<ChucVu> findAll(String idCongTy) {
        return chucVuDAO.findAll(idCongTy);
    }

    public PageResponse<ChucVu> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String searchKeyword) {
        List<ChucVu> items = chucVuDAO.findAllPaged(idCongTy, page, size, sortBy, sortDir, searchKeyword);
        long totalItems = chucVuDAO.countAll(idCongTy, searchKeyword);
        return new PageResponse<>(items, totalItems, page, size);
    }

    public ChucVu findById(String id) {
        return chucVuDAO.findById(id);
    }

    public List<ChucVu> findByTen(String ten) {
        return chucVuDAO.findByTen(ten);
    }

    public List<ChucVu> readCsv(MultipartFile file) throws IOException {
        List<ChucVu> list = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1);
                ChucVu ts = ChucVu.mapToChucVu(fields);
                list.add(ts);
            }
        }
        return list;
    }

    public List<ChucVu> readExcel(MultipartFile file) throws IOException {
        List<ChucVu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            ChucVu ts = ChucVu.mapToChucVu(row);
            list.add(ts);
        }
        workbook.close();
        return list;
    }


    public int deleteAll() {
        return chucVuDAO.deleteAll();
    }





}