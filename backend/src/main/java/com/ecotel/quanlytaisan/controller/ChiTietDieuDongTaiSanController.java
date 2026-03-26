package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSanDTO;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongTaiSan;
import com.ecotel.quanlytaisan.service.ChiTietDieuDongTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/chitietdieudongtaisan")
public class ChiTietDieuDongTaiSanController {
    @Autowired
    private ChiTietDieuDongTaiSanService service;

    @GetMapping
    public List<ChiTietDieuDongTaiSanDTO> getAll(@RequestParam("iddieudongtaisan") String  iddieudongtaisan) {
        return service.findAll(iddieudongtaisan);
    }

    @GetMapping("/{id}")
    public ChiTietDieuDongTaiSanDTO getById(@PathVariable("id") String id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody ChiTietDieuDongTaiSan obj) {
        try {
            int result = service.insert(obj);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo chi tiết điều động tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo chi tiết điều động tài sản thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> update(@RequestBody ChiTietDieuDongTaiSan obj) {
        try {
            int result = service.update(obj);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật chi tiết điều động tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết điều động tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<ChiTietDieuDongTaiSan> list) {
        try {
            int total = 0;
            for (ChiTietDieuDongTaiSan item : list) {
                total += service.insert(item);
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách chi tiết điều động tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách chi tiết điều động tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<ChiTietDieuDongTaiSan> list) {
        try {
            int total = 0;
            for (ChiTietDieuDongTaiSan item : list) {
                total += service.update(item);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách chi tiết điều động tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết điều động tài sản để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = service.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết điều động tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết điều động tài sản để xóa", result));
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
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chi tiết điều động tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách chi tiết điều động tài sản thất bại", total));
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
            List<ChiTietDieuDongTaiSan> listChiTietDieuDongTaiSan;
            if (filename.endsWith(".csv")) {
                listChiTietDieuDongTaiSan = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listChiTietDieuDongTaiSan = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (ChiTietDieuDongTaiSan ts : listChiTietDieuDongTaiSan) {
                count += service.insert(ts);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listChiTietDieuDongTaiSan, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
