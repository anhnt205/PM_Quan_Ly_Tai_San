package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ChiTietDieuDongCCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.service.ChiTietDieuDongCCDCVatTuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/chitietdieudongccdcvattu")
public class ChiTietDieuDongCCDCVatTuController {
    @Autowired
    private ChiTietDieuDongCCDCVatTuService service;

    @GetMapping
    public List<ChiTietDieuDongCCDCVatTuDTO> getAll(@RequestParam String  iddieudongccdcvattu
    ) {
        return service.findAll(iddieudongccdcvattu);
    }

    @GetMapping("/{id}")
    public ChiTietDieuDongCCDCVatTuDTO getById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody ChiTietDieuDongCCDCVatTu obj) {
        try {
            int result = service.insert(obj);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo chi tiết điều động CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo chi tiết điều động CCDC/Vật tư thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> update(@RequestBody ChiTietDieuDongCCDCVatTu obj) {
        try {
            int result = service.update(obj);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật chi tiết điều động CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết điều động CCDC/Vật tư để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<ChiTietDieuDongCCDCVatTu> list) {
        try {
            int total = 0;
            for (ChiTietDieuDongCCDCVatTu item : list) {
                total += service.insert(item); // dùng lại insert có sẵn
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm danh sách chi tiết điều động CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách chi tiết điều động CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<ChiTietDieuDongCCDCVatTu> list) {
        try {
            int total = 0;
            for (ChiTietDieuDongCCDCVatTu item : list) {
                total += service.update(item); // dùng lại update có sẵn
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách chi tiết điều động CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết điều động CCDC/Vật tư để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = service.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết điều động CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết điều động CCDC/Vật tư để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = 0;
            for (String id : ids) {
                total += service.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chi tiết điều động CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách chi tiết điều động CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("File không được rỗng", null));
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Tên file không hợp lệ", null));
        }

        try {
            List<ChiTietDieuDongCCDCVatTu> listChiTietDieuDongCCDC;
            if (filename.endsWith(".csv")) {
                listChiTietDieuDongCCDC = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listChiTietDieuDongCCDC = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (ChiTietDieuDongCCDCVatTu ts : listChiTietDieuDongCCDC) {
                count += service.insert(ts);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listChiTietDieuDongCCDC, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
