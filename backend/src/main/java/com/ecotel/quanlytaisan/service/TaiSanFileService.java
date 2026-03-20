package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.TaiSanFileDao;
import com.ecotel.quanlytaisan.model.TaiSanFile;
import com.ecotel.quanlytaisan.model.TaiSanFileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaiSanFileService {

    @Autowired
    private TaiSanFileDao taiSanFileDao;

    // Map Entity -> DTO
    private TaiSanFileDTO mapToDTO(TaiSanFile entity) {
        TaiSanFileDTO dto = new TaiSanFileDTO();
        dto.setId(entity.getId());
        dto.setIdTaiSan(entity.getIdTaiSan());
        dto.setFilePath(entity.getFilePath());
        dto.setLoai(entity.getLoai());
        dto.setNgayTao(entity.getNgayTao());
        dto.setGhiChu(entity.getGhiChu());
        return dto;
    }

    // Map DTO -> Entity (dùng cho create/update)
    private TaiSanFile mapToEntity(TaiSanFileDTO dto) {
        TaiSanFile entity = new TaiSanFile();
        entity.setId(dto.getId());
        entity.setIdTaiSan(dto.getIdTaiSan());
        entity.setFilePath(dto.getFilePath());
        entity.setLoai(dto.getLoai());
        entity.setNgayTao(dto.getNgayTao());
        entity.setGhiChu(dto.getGhiChu());
        return entity;
    }

    // Lấy danh sách file theo tài sản
    public List<TaiSanFileDTO> getByTaiSanId(String idTaiSan) {
        List<TaiSanFile> list = taiSanFileDao.findByTaiSanId(idTaiSan);
        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Lấy chi tiết file
    public TaiSanFileDTO getById(Integer id) {
        TaiSanFile entity = taiSanFileDao.findById(id);
        return mapToDTO(entity);
    }

    // Thêm mới file
    public int create(TaiSanFileDTO dto) {
        TaiSanFile entity = mapToEntity(dto);
        // Tự động gán ngày tạo nếu chưa có
        if (entity.getNgayTao() == null || entity.getNgayTao().isEmpty()) {
            entity.setNgayTao(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        return taiSanFileDao.insert(entity);
    }

    // Cập nhật file
    public int update(Integer id, TaiSanFileDTO dto) {
        // Kiểm tra tồn tại
        if (!taiSanFileDao.existsById(id)) {
            return 0;
        }
        TaiSanFile entity = mapToEntity(dto);
        entity.setId(id);
        // Giữ nguyên ngày tạo cũ (không cập nhật)
        return taiSanFileDao.update(entity);
    }

    // Xóa file
    public int delete(Integer id) {
        return taiSanFileDao.delete(id);
    }

    // Xóa tất cả file của tài sản
    public int deleteByTaiSanId(String idTaiSan) {
        return taiSanFileDao.deleteByTaiSanId(idTaiSan);
    }

    /**
     * Thêm nhiều file (batch)
     * @return số lượng file thêm thành công
     */
    public int createBatch(List<TaiSanFileDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) return 0;

        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        List<TaiSanFile> entities = new ArrayList<>();

        for (TaiSanFileDTO dto : dtos) {
            TaiSanFile entity = mapToEntity(dto);
            // Gán ngày tạo nếu chưa có
            if (entity.getNgayTao() == null || entity.getNgayTao().isEmpty()) {
                entity.setNgayTao(now);
            }
            entities.add(entity);
        }

        int[] results = taiSanFileDao.insertBatch(entities);
        int successCount = 0;
        for (int r : results) {
            if (r > 0) successCount++;
        }
        return successCount;
    }

    /**
     * Xóa nhiều file theo danh sách ID
     * @return số lượng file đã xóa
     */
    public int deleteBatch(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return taiSanFileDao.deleteByIds(ids);
    }
}