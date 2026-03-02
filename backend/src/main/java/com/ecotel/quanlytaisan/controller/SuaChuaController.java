package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.SuaChua;
import com.ecotel.quanlytaisan.model.SuaChuaDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.SuaChuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/suachua")
public class SuaChuaController {

    @Autowired
    private SuaChuaService suaChuaService;

    /**
     * Lấy danh sách phiếu sửa chữa có phân trang, lọc, sắp xếp
     *
     * @param idCongTy    ID công ty (bắt buộc)
     * @param page        Trang số (mặc định 0)
     * @param size        Số lượng mỗi trang (mặc định 20)
     * @param sortBy      Trường sắp xếp (mặc định ngaytao)
     * @param sortDir     Hướng sắp xếp (asc/desc)
     * @param search      Từ khóa tìm kiếm
     * @param userId      ID người dùng để lọc theo quyền (tùy chọn)
     * @param loai        Loại phiếu (tùy chọn)
     * @param idDonViGiao ID đơn vị giao (tùy chọn)
     * @param idDonViNhan ID đơn vị nhận (tùy chọn)
     */
    @GetMapping
    public ResponseEntity<PageResponse<SuaChuaDTO>> findAll(
            @RequestParam String idCongTy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Integer loai,
            @RequestParam(required = false) String idDonViGiao,
            @RequestParam(required = false) String idDonViNhan
    ) throws SQLException {
        PageResponse<SuaChuaDTO> response = suaChuaService.findAllPaged(
                idCongTy, page, size, sortBy, sortDir, search,
                userId, loai, idDonViGiao, idDonViNhan
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách phiếu sửa chữa theo userId (các phiếu user có quyền xem)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SuaChuaDTO>> getByUserId(@PathVariable String userId) throws SQLException {
        List<SuaChuaDTO> list = suaChuaService.getByUserId(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy danh sách phiếu sửa chữa theo loại
     */
    @GetMapping("/loai/{loai}")
    public ResponseEntity<List<SuaChuaDTO>> getByLoai(@PathVariable int loai) throws SQLException {
        List<SuaChuaDTO> list = suaChuaService.getByLoai(loai);
        return ResponseEntity.ok(list);
    }

    /**
     * Lấy thông tin phiếu sửa chữa theo ID (trả về DTO)
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuaChuaDTO> findById(@PathVariable String id) throws SQLException {
        SuaChuaDTO dto = suaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Tạo mới phiếu sửa chữa
     */
    @PostMapping
    public ResponseEntity<SuaChua> insert(@RequestBody SuaChua entity) throws SQLException {
        SuaChua created = suaChuaService.insert(entity);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Cập nhật phiếu sửa chữa
     */
    @PutMapping("/{id}")
    public ResponseEntity<SuaChua> update(@PathVariable String id, @RequestBody SuaChua entity) throws SQLException {
        entity.setId(id);
        SuaChua updated = suaChuaService.update(entity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa phiếu sửa chữa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) throws SQLException {
        int result = suaChuaService.delete(id);
        if (result == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // ==================== CÁC ENDPOINT XỬ LÝ KÝ DUYỆT ====================

    /**
     * Ký nháy (dành cho người được chỉ định trong IdNguoiKyNhay)
     */
    @PostMapping("/{id}/ky-nhay")
    public ResponseEntity<Integer> updateKyNhay(@PathVariable String id, @RequestParam String userId) {
        int result = suaChuaService.updateKyNhay(id, userId);
        return ResponseEntity.ok(result);
    }

    /**
     * Người lập phiếu ký nháy (NguoiLapPhieuKyNhay)
     */
    @PostMapping("/{id}/ky-lap-phieu")
    public ResponseEntity<Integer> updateNguoiLapPhieuKyNhay(@PathVariable String id) {
        int result = suaChuaService.updateNguoiLapPhieuKyNhay(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Duyệt cấp phòng
     */
    @PostMapping("/{id}/duyet-cap-phong")
    public ResponseEntity<Integer> updateDuyetCapPhong(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestParam boolean xacNhan) {
        int result = suaChuaService.updateDuyetCapPhong(id, userId, xacNhan);
        return ResponseEntity.ok(result);
    }

    /**
     * Duyệt giám đốc
     */
    @PostMapping("/{id}/duyet-giam-doc")
    public ResponseEntity<Integer> updateDuyetGiamDoc(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestParam boolean xacNhan) {
        int result = suaChuaService.updateDuyetGiamDoc(id, userId, xacNhan);
        return ResponseEntity.ok(result);
    }

    /**
     * Ký từ bảng NguoiKy (người ký phụ)
     */
    @PostMapping("/{id}/ky")
    public ResponseEntity<Integer> updateTrangThaiKy(@PathVariable String id, @RequestParam String userId) {
        int result = suaChuaService.updateTrangThaiKy(id, userId);
        return ResponseEntity.ok(result);
    }

    /**
     * Hủy phiếu sửa chữa
     */
    @PostMapping("/{id}/huy")
    public ResponseEntity<Integer> huyTrangThai(@PathVariable String id) {
        int result = suaChuaService.huyTrangThai(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Kiểm tra quyền ký của user trên phiếu
     * Trả về: 0 - có thể ký, 1 - chưa đến lượt, 2 - không trong luồng, 3 - đã ký
     */
    @GetMapping("/{id}/permission")
    public ResponseEntity<Integer> getPermissionSigning(
            @PathVariable String id,
            @RequestParam String userId
    ) throws SQLException {
        SuaChuaDTO dto = suaChuaService.findByIdDTO(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        int permission = suaChuaService.getPermissionSigning(dto, userId);
        return ResponseEntity.ok(permission);
    }

    // ==================== IMPORT ====================

    /**
     * Import từ file CSV
     */
    @PostMapping("/import/csv")
    public ResponseEntity<List<SuaChua>> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
        List<SuaChua> list = suaChuaService.readCsv(file);
        return ResponseEntity.ok(list);
    }

    /**
     * Import từ file Excel
     */
    @PostMapping("/import/excel")
    public ResponseEntity<List<SuaChua>> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        List<SuaChua> list = suaChuaService.readExcel(file);
        return ResponseEntity.ok(list);
    }
}