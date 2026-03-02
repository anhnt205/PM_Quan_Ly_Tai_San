package com.ecotel.quanlytaisan.controller;
import com.ecotel.quanlytaisan.model.KhauHaoTaiSan;
import com.ecotel.quanlytaisan.model.TaiSan;
import com.ecotel.quanlytaisan.model.TaiSanCon;
import com.ecotel.quanlytaisan.model.TaiSanDTO;
import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.service.TaiSanService;
import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/taisan")
public class TaiSanController {
    @Autowired
    private TaiSanService taiSanService;
    @Autowired
    private NotificationService notificationService;
    @PutMapping("/updatedonvi")
    public ResponseEntity<ApiResponse<Object>> updateDonVi(@RequestBody List<Map<String, String>> res) {
        try {
            int result = taiSanService.updateDonViTaiSan(res);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PutMapping("/update-tai-san-con")
    public ResponseEntity<ApiResponse<Object>> updateTaiSanCon(@RequestBody List<Map<String, Object>> res) {
        try {
            int count = 0;
            for (Map<String, Object> map : res) {
                String idTaiSan = (String) map.get("idTaiSan");
                Boolean isTaiSanCon = (Boolean) map.get("isTaiSanCon");
                count += taiSanService.updateTaiSanCon(idTaiSan, isTaiSanCon);
            }
            if (count > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật tài sản thành công", null, count));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy tài sản để cập nhật", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll(@RequestParam String idcongty) {
        try {
            List<TaiSanDTO> result = taiSanService.getAll(idcongty);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Object>> getAllPaged(@RequestParam String idcongty, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) String sortBy, @RequestParam(required = false) String sortDir, @RequestParam(required = false) String search, @RequestParam(required = false) String idNhomTaiSan, @RequestParam(required = false) String idLoaiTaiSan,@RequestParam(required = false) String idDonViHienThoi) {
        try {
            PageResponse<TaiSanDTO> result = taiSanService.getAllPaged(idcongty, page, size, sortBy, sortDir, search, idNhomTaiSan, idLoaiTaiSan,idDonViHienThoi);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản phân trang thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/paged-ban-giao")
    public ResponseEntity<ApiResponse<Object>> getAllPagedWithBanGiaoStatus(@RequestParam String idcongty, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) String sortBy, @RequestParam(required = false) String sortDir, @RequestParam(required = false) String search, @RequestParam(required = false) String idNhomTaiSan,@RequestParam(required = false) String idDonViHienThoi) {
        try {
            Map<String, Object> result = taiSanService.getAllPagedWithBanGiaoStatus(idcongty, page, size, sortBy, sortDir, search, idNhomTaiSan,idDonViHienThoi);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản theo trạng thái bàn giao thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/paged-da-ban-giao")
    public ResponseEntity<ApiResponse<Object>> getPagedDaBanGiao(@RequestParam String idcongty, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) String sortBy, @RequestParam(required = false) String sortDir, @RequestParam(required = false) String search, @RequestParam(required = false) String idNhomTaiSan,@RequestParam(required = false) String idDonViHienThoi) {
        try {
            PageResponse<TaiSanDTO> result = taiSanService.getPagedByBanGiaoStatus(idcongty, page, size, sortBy, sortDir, search, idNhomTaiSan,idDonViHienThoi, true);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản đã bàn giao thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/paged-chua-ban-giao")
    public ResponseEntity<ApiResponse<Object>> getPagedChuaBanGiao(@RequestParam String idcongty, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(required = false) String sortBy, @RequestParam(required = false) String sortDir, @RequestParam(required = false) String search, @RequestParam(required = false) String idNhomTaiSan,@RequestParam(required = false) String idDonViHienThoi) {
        try {
            PageResponse<TaiSanDTO> result = taiSanService.getPagedByBanGiaoStatus(idcongty, page, size, sortBy, sortDir, search, idNhomTaiSan,idDonViHienThoi, false);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản chưa bàn giao thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/by-donvi-bandau/paged")
    public ResponseEntity<ApiResponse<Object>> getByDonViBanDauPaged(
            @RequestParam String idcongty,
            @RequestParam String iddonvibandau,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir) {
        try {
            PageResponse<TaiSanDTO> result = taiSanService.getByDonViBanDauPaged(idcongty, iddonvibandau, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản theo đơn vị ban đầu thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/by-donvi-hienthoi/paged")
    public ResponseEntity<ApiResponse<Object>> getByDonViHienThoiPaged(
            @RequestParam String idcongty,
            @RequestParam String iddonvihienthoi,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String idNhomTaiSan,
            @RequestParam(required = false) String search) {
        try {
            PageResponse<TaiSanDTO> result = taiSanService.getByDonViHienThoiPaged(idcongty, iddonvihienthoi, page, size, sortBy, sortDir, idNhomTaiSan, search);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản theo đơn vị hiện thời thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/loaitaisan/")
    public ResponseEntity<ApiResponse<Object>> getByLoai(@RequestParam String idloataisan) {
        try {
            List<TaiSanDTO> result = taiSanService.getByLoai(idloataisan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản theo loại thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) {
        try {
            TaiSanDTO result = taiSanService.getById(id);
            if (result != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tài sản thành công", result, null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy tài sản", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody TaiSan ts) {
        try {
            int result = taiSanService.create(ts);
            if (result > 0) {
                // Gửi thông báo socket
                notificationService.notifyTaiSanCreated(ts.getIdCongTy(), ts.getId(), "System");
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Tạo tài sản thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<TaiSan> list) {
        try {
            int total = 0;
            for (TaiSan item : list) {
                int result = taiSanService.create(item);
                if (result > 0) {
                    total += result;
                    // Gửi thông báo socket cho từng tài sản được tạo
                    notificationService.notifyTaiSanCreated(item.getIdCongTy(), item.getId(), "System");
                }
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo danh sách tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Tạo danh sách tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody TaiSan ts) {
        try {
            ts.setId(id);
            int result = taiSanService.update(ts);
            if (result > 0) {
                // Gửi thông báo socket
                notificationService.notifyTaiSanUpdated(ts.getIdCongTy(), ts.getId(), "System");
                return ResponseEntity.ok(ApiResponse.success("Cập nhật tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PutMapping("/update-tai-san/tai-san-con")
    public ResponseEntity<ApiResponse<Object>> updateTaiSanConTaiSan(@RequestBody List<Map<String, Object>> maps) {
        try {
            int result = 0;
            for (Map<String, Object> map : maps) {
                result += taiSanService.updateTaiSanConTaiSan(map);
            }
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            // Lấy thông tin tài sản trước khi xóa để có thông tin công ty
            TaiSanDTO taiSan = taiSanService.getById(id);
            int result = taiSanService.delete(id);
            if (result > 0) {
                // Gửi thông báo socket
                if (taiSan != null) {
                    notificationService.notifyTaiSanDeleted(taiSan.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy tài sản để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = 0;
            for (String id : ids) {
                // Lấy thông tin tài sản trước khi xóa để có thông tin công ty
                TaiSanDTO taiSan = taiSanService.getById(id);
                int result = taiSanService.delete(id);
                if (result > 0) {
                    total += result;
                    // Gửi thông báo socket cho từng tài sản bị xóa
                    if (taiSan != null) {
                        notificationService.notifyTaiSanDeleted(taiSan.getIdCongTy(), id, "System");
                    }
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Xóa danh sách tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/taisancon/")
    public ResponseEntity<ApiResponse<Object>> insertTaiSanCon(@RequestBody TaiSanCon ts) {
        try {
            int result = taiSanService.insertTaiSanCon(ts);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Thêm tài sản con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Thêm tài sản con thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/taisancon/bulk")
    public ResponseEntity<ApiResponse<Object>> insertListTaiSanCon(@RequestBody List<TaiSanCon> listTs) {
        try {
            int successCount = 0;
            for (TaiSanCon ts : listTs) {
                int result = taiSanService.insertTaiSanCon(ts);
                if (result > 0) {
                    successCount++;
                }
            }
            if (successCount == listTs.size()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Thêm danh sách tài sản con thành công", null, successCount));
            } else if (successCount > 0) {
                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(ApiResponse.failure("Một số tài sản con thêm thất bại", successCount));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Thêm danh sách tài sản con thất bại", successCount));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PutMapping("/taisancon/")
    public ResponseEntity<ApiResponse<Object>> updateTaiSanCon(@RequestBody TaiSanCon ts) {
        try {
            int result = taiSanService.updateTaiSanCon(ts);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật tài sản con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Cập nhật tài sản con thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/taisancon/{idTaiSan}")
    public ResponseEntity<ApiResponse<Object>> getTaiSanConByTaiSan(@PathVariable String idTaiSan) {
        try {
            List<TaiSanCon> result = taiSanService.getTaiSanCon(idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài sản con thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/taisancon/getall")
    public ResponseEntity<ApiResponse<Object>> getTaiSanConByTaiSan() {
        try {
            List<TaiSanCon> result = taiSanService.getAllTSC();
            return ResponseEntity.ok(ApiResponse.success("Lấy toàn bộ danh sách tài sản con thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @DeleteMapping("/taisancon/")
    public ResponseEntity<ApiResponse<Object>> deleteTaiSanCon(@RequestParam String idTaiSanCon) {
        try {
            int result = taiSanService.deleteTaiSanCon(idTaiSanCon);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa tài sản con thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy tài sản con để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/khauhaotaisan")
    public ResponseEntity<ApiResponse<Object>> getKhauHaoTaiSan(
            @RequestParam String idcongty,
            @RequestParam int ngay,
            @RequestParam int thang,
            @RequestParam int nam,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search) {
        try {
            PageResponse<KhauHaoTaiSan> result = taiSanService.getKhauHaoTaiSanPaged(
                    idcongty, ngay, thang, nam, page, size, sortBy, sortDir, search
            );
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khấu hao tài sản thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/khauhaotaisanbynhom")
    public ResponseEntity<ApiResponse<Object>> getKhauHaoTaiSanByNhom(
            @RequestParam String idcongty,
            @RequestParam int ngay,
            @RequestParam int thang,
            @RequestParam int nam,
            @RequestParam String idNhomTaiSan,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search) {
        try {
            PageResponse<KhauHaoTaiSan> result = taiSanService.getKhauHaoTaiSanByNhomPaged(
                    idcongty, ngay, thang, nam, idNhomTaiSan, page, size, sortBy, sortDir, search
            );
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khấu hao tài sản theo nhóm thành công", result, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("File không được rỗng", null));
        }
        String filename = file.getOriginalFilename();
        if (filename == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Tên file không hợp lệ", null));
        }
        try {
            // Đọc danh sách tài sản
            List<TaiSan> listTaiSan;
            if (filename.endsWith(".csv")) {
                listTaiSan = taiSanService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listTaiSan = taiSanService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Chỉ hỗ trợ file CSV hoặc Excel", null));
            }
            // Tạo 2 danh sách kết quả
            List<TaiSan> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();
            for (TaiSan ts : listTaiSan) {
                if (ts.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", ts);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }
                try {
                    int inserted = taiSanService.create(ts);
                    if (inserted > 0) {
                        successList.add(ts);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", ts);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", ts);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }
            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listTaiSan.size());
            result.put("successCount", successList.size());
            result.put("failureCount", failureList.size());
            result.put("successItems", successList);
            result.put("failureItems", failureList);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload hoàn tất", result, successList.size()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/export/excel")
    public void exportToExcel(
            @RequestParam String idcongty,
            HttpServletResponse response) throws IOException {
        try {
            // Tạo tên file với timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "TaiSan_" + timestamp + ".xlsx";
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20");
            // Set response headers
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename);
            // Xuất Excel
            taiSanService.exportToExcel(idcongty, response.getOutputStream());
            response.getOutputStream().flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Lỗi khi xuất file Excel: " + e.getMessage());
        }
    }
}