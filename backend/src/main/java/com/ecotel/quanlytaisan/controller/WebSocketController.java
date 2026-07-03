package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.enums.TypeAction;
import com.ecotel.quanlytaisan.enums.TypeFunc;
import com.ecotel.quanlytaisan.model.SocketMessage;
import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/websocket")
public class WebSocketController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Test gửi thông báo toàn cục
     */
    @PostMapping("/test/global")
    public ResponseEntity<Map<String, Object>> testGlobalNotification(
            @RequestParam("title") String title,
            @RequestParam("message") String message,
            @RequestParam(value = "type", defaultValue = "TEST") String type) {
        
        try {
            notificationService.sendGlobalNotification(title, message, type);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo toàn cục");
            response.put("title", title);
            response.put("content", message);
            response.put("type", type);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test gửi thông báo cho công ty
     */
    @PostMapping("/test/company")
    public ResponseEntity<Map<String, Object>> testCompanyNotification(
            @RequestParam("companyId") String companyId,
            @RequestParam("title") String title,
            @RequestParam("message") String message,
            @RequestParam(value = "type", defaultValue = "TEST") String type) {
        
        try {
            notificationService.sendCompanyNotification(companyId, title, message, type);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo cho công ty");
            response.put("companyId", companyId);
            response.put("title", title);
            response.put("message", message);
            response.put("type", type);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test gửi thông báo CRUD
     */
    @PostMapping("/test/crud")
    public ResponseEntity<Map<String, Object>> testCrudNotification(
            @RequestParam("companyId") String companyId,
            @RequestParam("entityName") String entityName,
            @RequestParam("operation") String operation,
            @RequestParam("entityId") String entityId,
            @RequestParam(value = "userId", defaultValue = "System") String userId) {
        
        try {
            notificationService.sendCrudNotification(companyId, entityName, operation, entityId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo CRUD");
            response.put("companyId", companyId);
            response.put("entityName", entityName);
            response.put("operation", operation);
            response.put("entityId", entityId);
            response.put("userId", userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test thông báo nhân viên
     */
    @PostMapping("/test/nhanvien")
    public ResponseEntity<Map<String, Object>> testNhanVienNotification(
            @RequestParam("companyId") String companyId,
            @RequestParam("nhanVienId") String nhanVienId,
            @RequestParam("operation") String operation,
            @RequestParam(value = "userId", defaultValue = "System") String userId) {
        
        try {
            switch (operation.toUpperCase()) {
                case "CREATE":
                    notificationService.notifyNhanVienCreated(companyId, nhanVienId, userId);
                    break;
                case "UPDATE":
                    notificationService.notifyNhanVienUpdated(companyId, nhanVienId, userId);
                    break;
                case "DELETE":
                    notificationService.notifyNhanVienDeleted(companyId, nhanVienId, userId);
                    break;
                default:
                    throw new IllegalArgumentException("Operation phải là CREATE, UPDATE hoặc DELETE");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo nhân viên");
            response.put("companyId", companyId);
            response.put("nhanVienId", nhanVienId);
            response.put("operation", operation);
            response.put("userId", userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test thông báo tài sản
     */
    @PostMapping("/test/taisan")
    public ResponseEntity<Map<String, Object>> testTaiSanNotification(
            @RequestParam("companyId") String companyId,
            @RequestParam("taiSanId") String taiSanId,
            @RequestParam("operation") String operation,
            @RequestParam(value = "userId", defaultValue = "System") String userId) {
        
        try {
            switch (operation.toUpperCase()) {
                case "CREATE":
                    notificationService.notifyTaiSanCreated(companyId, taiSanId, userId);
                    break;
                case "UPDATE":
                    notificationService.notifyTaiSanUpdated(companyId, taiSanId, userId);
                    break;
                case "DELETE":
                    notificationService.notifyTaiSanDeleted(companyId, taiSanId, userId);
                    break;
                default:
                    throw new IllegalArgumentException("Operation phải là CREATE, UPDATE hoặc DELETE");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo tài sản");
            response.put("companyId", companyId);
            response.put("taiSanId", taiSanId);
            response.put("operation", operation);
            response.put("userId", userId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== SOCKET MESSAGE THEO SPEC ====================

    /**
     * Test gửi SocketMessage theo spec với tham số đầy đủ
     *
     * @param typeFunc     Nhóm chức năng (1-5)
     * @param subTypeFunc  Chức năng con
     * @param typeAction   Hành động (1=CREATE, 2=UPDATE, 3=DELETE)
     * @param idNeedToDo   Danh sách user ID cần xử lý (phân tách bằng dấu phẩy)
     */
    @PostMapping("/socket-message")
    public ResponseEntity<Map<String, Object>> testSocketMessage(
            @RequestParam("typeFunc") int typeFunc,
            @RequestParam(value = "subTypeFunc", defaultValue = "0") int subTypeFunc,
            @RequestParam("typeAction") int typeAction,
            @RequestParam("idNeedToDo") String idNeedToDo) {

        try {
            // Validate
            if (!TypeFunc.isValid(typeFunc)) {
                throw new IllegalArgumentException("type_func phải từ 1-5");
            }
            if (!TypeAction.isValid(typeAction)) {
                throw new IllegalArgumentException("type_action phải từ 1-3");
            }

            notificationService.sendCustomSocketMessage(typeFunc, subTypeFunc, typeAction, idNeedToDo);

            SocketMessage sentMessage = notificationService.createSocketMessage(typeFunc, subTypeFunc, typeAction, idNeedToDo);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi SocketMessage theo spec");
            response.put("socketMessage", sentMessage);
            response.put("typeFuncName", TypeFunc.getName(typeFunc));
            response.put("typeActionName", TypeAction.getName(typeAction));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test gửi thông báo biên bản bàn giao tài sản (theo spec)
     */
    @PostMapping("/test/spec/ban-giao-tai-san")
    public ResponseEntity<Map<String, Object>> testBanGiaoTaiSanSpec(
            @RequestParam(value = "subTypeFunc", defaultValue = "0") int subTypeFunc,
            @RequestParam("typeAction") int typeAction,
            @RequestParam("creatorId") String creatorId,
            @RequestParam(value = "signerIds", defaultValue = "") String signerIds) {

        try {
            if (!TypeAction.isValid(typeAction)) {
                throw new IllegalArgumentException("type_action phải từ 1-3");
            }

            switch (typeAction) {
                case TypeAction.CREATE:
                    notificationService.notifyBienBanBanGiaoTaiSanCreated(subTypeFunc, creatorId, signerIds);
                    break;
                case TypeAction.UPDATE:
                    notificationService.notifyBienBanBanGiaoTaiSanSigned(subTypeFunc, signerIds);
                    break;
                case TypeAction.DELETE:
                    notificationService.notifyBienBanBanGiaoTaiSanDeleted(subTypeFunc, signerIds);
                    break;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo bàn giao tài sản");
            response.put("type_func", TypeFunc.ASSET_HANDOVER);
            response.put("type_func_name", TypeFunc.getName(TypeFunc.ASSET_HANDOVER));
            response.put("sub_type_func", subTypeFunc);
            response.put("type_action", typeAction);
            response.put("type_action_name", TypeAction.getName(typeAction));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test gửi thông báo biên bản điều chuyển tài sản (theo spec)
     */
    @PostMapping("/test/spec/dieu-chuyen-tai-san")
    public ResponseEntity<Map<String, Object>> testDieuChuyenTaiSanSpec(
            @RequestParam(value = "subTypeFunc", defaultValue = "0") int subTypeFunc,
            @RequestParam("typeAction") int typeAction,
            @RequestParam("creatorId") String creatorId,
            @RequestParam(value = "signerIds", defaultValue = "") String signerIds) {

        try {
            if (!TypeAction.isValid(typeAction)) {
                throw new IllegalArgumentException("type_action phải từ 1-3");
            }

            switch (typeAction) {
                case TypeAction.CREATE:
                    notificationService.notifyBienBanDieuChuyenTaiSanCreated(subTypeFunc, creatorId, signerIds);
                    break;
                case TypeAction.UPDATE:
                    notificationService.notifyBienBanDieuChuyenTaiSanSigned(subTypeFunc, signerIds);
                    break;
                case TypeAction.DELETE:
                    notificationService.notifyBienBanDieuChuyenTaiSanDeleted(subTypeFunc, signerIds);
                    break;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo điều chuyển tài sản");
            response.put("type_func", TypeFunc.ASSET_TRANSFER);
            response.put("type_func_name", TypeFunc.getName(TypeFunc.ASSET_TRANSFER));
            response.put("sub_type_func", subTypeFunc);
            response.put("type_action", typeAction);
            response.put("type_action_name", TypeAction.getName(typeAction));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test gửi thông báo biên bản bàn giao CCDC/Vật tư (theo spec)
     */
    @PostMapping("/test/spec/ban-giao-ccdc")
    public ResponseEntity<Map<String, Object>> testBanGiaoCCDCSpec(
            @RequestParam(value = "subTypeFunc", defaultValue = "0") int subTypeFunc,
            @RequestParam("typeAction") int typeAction,
            @RequestParam("creatorId") String creatorId,
            @RequestParam(value = "signerIds", defaultValue = "") String signerIds) {

        try {
            if (!TypeAction.isValid(typeAction)) {
                throw new IllegalArgumentException("type_action phải từ 1-3");
            }

            switch (typeAction) {
                case TypeAction.CREATE:
                    notificationService.notifyBienBanBanGiaoCCDCCreated(subTypeFunc, creatorId, signerIds);
                    break;
                case TypeAction.UPDATE:
                    notificationService.notifyBienBanBanGiaoCCDCSigned(subTypeFunc, signerIds);
                    break;
                case TypeAction.DELETE:
                    notificationService.notifyBienBanBanGiaoCCDCDeleted(subTypeFunc, signerIds);
                    break;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo bàn giao CCDC/Vật tư");
            response.put("type_func", TypeFunc.TOOL_AND_SUPPLIES_HANDOVER);
            response.put("type_func_name", TypeFunc.getName(TypeFunc.TOOL_AND_SUPPLIES_HANDOVER));
            response.put("sub_type_func", subTypeFunc);
            response.put("type_action", typeAction);
            response.put("type_action_name", TypeAction.getName(typeAction));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Test gửi thông báo biên bản điều chuyển CCDC/Vật tư (theo spec)
     */
    @PostMapping("/test/spec/dieu-chuyen-ccdc")
    public ResponseEntity<Map<String, Object>> testDieuChuyenCCDCSpec(
            @RequestParam(value = "subTypeFunc", defaultValue = "0") int subTypeFunc,
            @RequestParam("typeAction") int typeAction,
            @RequestParam("creatorId") String creatorId,
            @RequestParam(value = "signerIds", defaultValue = "") String signerIds) {

        try {
            if (!TypeAction.isValid(typeAction)) {
                throw new IllegalArgumentException("type_action phải từ 1-3");
            }

            switch (typeAction) {
                case TypeAction.CREATE:
                    notificationService.notifyBienBanDieuChuyenCCDCCreated(subTypeFunc, creatorId, signerIds);
                    break;
                case TypeAction.UPDATE:
                    notificationService.notifyBienBanDieuChuyenCCDCSigned(subTypeFunc, signerIds);
                    break;
                case TypeAction.DELETE:
                    notificationService.notifyBienBanDieuChuyenCCDCDeleted(subTypeFunc, signerIds);
                    break;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã gửi thông báo điều chuyển CCDC/Vật tư");
            response.put("type_func", TypeFunc.TOOL_AND_MATERIAL_TRANSFER);
            response.put("type_func_name", TypeFunc.getName(TypeFunc.TOOL_AND_MATERIAL_TRANSFER));
            response.put("sub_type_func", subTypeFunc);
            response.put("type_action", typeAction);
            response.put("type_action_name", TypeAction.getName(typeAction));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Lấy thông tin về các giá trị type_func và type_action
     */
    @GetMapping("/spec/info")
    public ResponseEntity<Map<String, Object>> getSpecInfo() {
        Map<String, Object> response = new HashMap<>();

        // Type Func info
        Map<String, Object> typeFuncInfo = new HashMap<>();
        typeFuncInfo.put("1", TypeFunc.getName(TypeFunc.ASSET_TRANSFER));
        typeFuncInfo.put("2", TypeFunc.getName(TypeFunc.ASSET_HANDOVER));
        typeFuncInfo.put("3", TypeFunc.getName(TypeFunc.TOOL_AND_MATERIAL_TRANSFER));
        typeFuncInfo.put("4", TypeFunc.getName(TypeFunc.TOOL_AND_SUPPLIES_HANDOVER));
        typeFuncInfo.put("5", TypeFunc.getName(TypeFunc.ALL_FUNCTION));

        // Type Action info
        Map<String, Object> typeActionInfo = new HashMap<>();
        typeActionInfo.put("1", TypeAction.getName(TypeAction.CREATE));
        typeActionInfo.put("2", TypeAction.getName(TypeAction.UPDATE));
        typeActionInfo.put("3", TypeAction.getName(TypeAction.DELETE));

        response.put("type_func", typeFuncInfo);
        response.put("type_action", typeActionInfo);
        response.put("message_format", Map.of(
            "type_func", "int - Nhóm chức năng chính (1-5)",
            "sub_type_func", "int - Chức năng con",
            "time", "long - Timestamp (milliseconds)",
            "type_action", "int - Hành động (1-3)",
            "id_need_to_do", "string - Danh sách user ID (phân tách bằng dấu phẩy)"
        ));

        return ResponseEntity.ok(response);
    }
    @PostMapping("/send-message")
    public ResponseEntity<Void> sendMessage(@RequestBody Map<String, Object> payload) {
        try {
            // Gửi message tới topic "/topic/notifications"
            messagingTemplate.convertAndSend("/topic/notifications", payload);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
