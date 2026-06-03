package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.KyTaiLieuService;
import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chuky")
public class KyTaiLieuController {

    @Autowired
    private KyTaiLieuService kyTaiLieuService;

    @Autowired
    private NotificationService notificationService;

    // ===== API CŨ GIỮ NGUYÊN =====
    @GetMapping("/{idTaiLieu}")
    public List<KyTaiLieu> getById(@PathVariable("idTaiLieu") String idTaiLieu) {
        return kyTaiLieuService.getList(idTaiLieu);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody List<KyTaiLieu> das) {
        try {
            String idTaiLieu = das.get(0).getIdTaiLieu();
            for (KyTaiLieu kyTaiLieu : kyTaiLieuService.getList(idTaiLieu)) {
                kyTaiLieuService.delete(kyTaiLieu.getId());
            }
            for (KyTaiLieu da : das) {
                kyTaiLieuService.addKyTaiLieu(da);
            }
            // Gửi thông báo WebSocket
            notificationService.notifyKyTaiLieuUpdated("COMPANY_ID", idTaiLieu, "System");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Cập nhật chữ ký tài liệu thành công", null, das.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            // Lấy thông tin trước khi xóa để gửi thông báo
            KyTaiLieu existingItem = kyTaiLieuService.getById(id);
            int result = kyTaiLieuService.delete(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyKyTaiLieuUpdated("COMPANY_ID", existingItem.getIdTaiLieu(), "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa chữ ký thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chữ ký để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // ===== API MỚI CHO NGUOIKY =====

    // 1. Thêm người ký
    @PostMapping("/nguoi-ky")
    public ResponseEntity<ApiResponse<Object>> addNguoiKy(@RequestBody NguoiKy nguoiKy) {
        try {
            int result = kyTaiLieuService.addNguoiKy(nguoiKy);
            if (result > 0) {
                // Gửi thông báo WebSocket
                notificationService.notifyNguoiKyAdded("COMPANY_ID", nguoiKy.getIdTaiLieu(), "System");
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm người ký thành công", nguoiKy, result));
            }
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("Không thể thêm người ký", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // 2. Lấy thông tin 1 người ký
    @GetMapping("/nguoi-ky/{idNguoiKy}/{idTaiLieu}")
    public ResponseEntity<ApiResponse<NguoiKy>> getNguoiKy(
            @PathVariable("idNguoiKy") String idNguoiKy,
            @PathVariable("idTaiLieu") String idTaiLieu) {
        try {
            NguoiKy nguoiKy = kyTaiLieuService.getNguoiKy(idNguoiKy, idTaiLieu);
            if (nguoiKy != null) {
                return ResponseEntity.ok(ApiResponse.success("Lấy thông tin người ký thành công", nguoiKy, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy người ký", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // 3. Lấy tất cả người ký theo id tài liệu
    @GetMapping("/nguoi-ky/tailieu/{idTaiLieu}")
    public ResponseEntity<ApiResponse<List<NguoiKy>>> getAllNguoiKyByIdTaiLieu(@PathVariable("idTaiLieu") String idTaiLieu) {
        try {
            List<NguoiKy> list = kyTaiLieuService.getAllNguoiKyByIdTaiLieu(idTaiLieu);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách người ký thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // 4. Cập nhật trạng thái ký
    @PutMapping("/nguoi-ky/{id}/trangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThaiKy(
            @PathVariable("id") String id,
            @RequestParam("trangThai") String trangThai) {
        try {
            int result = kyTaiLieuService.updateTrangThai(id, trangThai);

            if (result > 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.success("Thành công", result, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy người ký để cập nhật", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/nguoi-ky/update/{idTaiLieu}")
    public ResponseEntity<ApiResponse<Object>> updateNguoiKy(@PathVariable("idTaiLieu") String idTaiLieu, @RequestBody List<NguoiKy> nguoiKyList) {
        try {
            int result = kyTaiLieuService.updateNguoiKy(idTaiLieu, nguoiKyList);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.success("Thành công", result, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy người ký để cập nhật", null));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

}
