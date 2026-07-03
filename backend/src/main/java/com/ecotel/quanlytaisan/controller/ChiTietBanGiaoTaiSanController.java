package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSanDTO;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSan;
import com.ecotel.quanlytaisan.service.ChiTietBanGiaoTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/chitietbangiaotaisan")
public class ChiTietBanGiaoTaiSanController {
    @Autowired
    private ChiTietBanGiaoTaiSanService service;

    @GetMapping
    public List<ChiTietBanGiaoTaiSanDTO> getAll(@RequestParam("idbangiaotiasan") String  idbangiaotiasan) {
        return service.findAll(idbangiaotiasan);
    }

    @GetMapping("/{id}")
    public ChiTietBanGiaoTaiSanDTO getById(@PathVariable("id") String id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody ChiTietBanGiaoTaiSan obj) {
        try {
            int result = service.insert(obj);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo chi tiết bàn giao tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo chi tiết bàn giao tài sản thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> update(@RequestBody ChiTietBanGiaoTaiSan obj) {
        try {
            int result = service.update(obj);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật chi tiết bàn giao tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết bàn giao tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<ChiTietBanGiaoTaiSan> list) {
        try {
            int total = 0;
            for (ChiTietBanGiaoTaiSan item : list) {
                total += service.insert(item); // dùng lại insert có sẵn
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm danh sách chi tiết bàn giao tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách chi tiết bàn giao tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<ChiTietBanGiaoTaiSan> list) {
        try {
            int total = 0;
            for (ChiTietBanGiaoTaiSan item : list) {
                total += service.update(item); // dùng lại update có sẵn
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách chi tiết bàn giao tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết bàn giao tài sản để cập nhật", total));
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
                return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết bàn giao tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết bàn giao tài sản để xóa", result));
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
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chi tiết bàn giao tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách chi tiết bàn giao tài sản thất bại", total));
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
            List<ChiTietBanGiaoTaiSan> listChiTietBanGiaoTaiSan;
            if (filename.endsWith(".csv")) {
                listChiTietBanGiaoTaiSan = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listChiTietBanGiaoTaiSan = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (ChiTietBanGiaoTaiSan ts : listChiTietBanGiaoTaiSan) {
                count += service.insert(ts);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listChiTietBanGiaoTaiSan, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
