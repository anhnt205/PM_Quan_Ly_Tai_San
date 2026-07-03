package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.enums.TypeAction;
import com.ecotel.quanlytaisan.enums.TypeFunc;
import com.ecotel.quanlytaisan.model.SocketMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Gửi thông báo cho tất cả người dùng
     */
    public void sendGlobalNotification(String title, String message, String type) {
        Map<String, Object> notification = createNotification(title, message, type, null);
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }

    /**
     * Gửi thông báo cho một người dùng cụ thể
     */
    public void sendUserNotification(String userId, String title, String message, String type) {
        Map<String, Object> notification = createNotification(title, message, type, userId);
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }

    /**
     * Gửi thông báo cho một công ty cụ thể
     */
    public void sendCompanyNotification(String companyId, String title, String message, String type) {
        Map<String, Object> notification = createNotification(title, message, type, companyId);
        messagingTemplate.convertAndSend("/topic/company/" + companyId, notification);
    }

    /**
     * Thông báo tạo mới bàn giao tài sản
     */
    public void notifyBanGiaoTaiSanCreated(String companyId, String documentId, String createdBy) {
        String title = "Bàn giao tài sản mới";
        String message = String.format("Có bàn giao tài sản mới được tạo bởi %s (ID: %s)", createdBy, documentId);
        sendCompanyNotification(companyId, title, message, "BAN_GIAO_TAI_SAN_CREATED");
    }

    /**
     * Thông báo cập nhật bàn giao tài sản
     */
    public void notifyBanGiaoTaiSanUpdated(String companyId, String documentId, String updatedBy) {
        String title = "Bàn giao tài sản được cập nhật";
        String message = String.format("Bàn giao tài sản (ID: %s) đã được cập nhật bởi %s", documentId, updatedBy);
        sendCompanyNotification(companyId, title, message, "BAN_GIAO_TAI_SAN_UPDATED");
    }

    /**
     * Thông báo xóa bàn giao tài sản
     */
    public void notifyBanGiaoTaiSanDeleted(String companyId, String documentId, String deletedBy) {
        String title = "Bàn giao tài sản bị xóa";
        String message = String.format("Bàn giao tài sản (ID: %s) đã bị xóa bởi %s", documentId, deletedBy);
        sendCompanyNotification(companyId, title, message, "BAN_GIAO_TAI_SAN_DELETED");
    }

    /**
     * Thông báo tạo mới bàn giao CCDC/Vật tư
     */
    public void notifyBanGiaoCCDCVatTuCreated(String companyId, String documentId, String createdBy) {
        String title = "Bàn giao CCDC/Vật tư mới";
        String message = String.format("Có bàn giao CCDC/Vật tư mới được tạo bởi %s (ID: %s)", createdBy, documentId);
        sendCompanyNotification(companyId, title, message, "BAN_GIAO_CCDC_VAT_TU_CREATED");
    }

    /**
     * Thông báo cập nhật bàn giao CCDC/Vật tư
     */
    public void notifyBanGiaoCCDCVatTuUpdated(String companyId, String documentId, String updatedBy) {
        String title = "Bàn giao CCDC/Vật tư được cập nhật";
        String message = String.format("Bàn giao CCDC/Vật tư (ID: %s) đã được cập nhật bởi %s", documentId, updatedBy);
        sendCompanyNotification(companyId, title, message, "BAN_GIAO_CCDC_VAT_TU_UPDATED");
    }

    /**
     * Thông báo xóa bàn giao CCDC/Vật tư
     */
    public void notifyBanGiaoCCDCVatTuDeleted(String companyId, String documentId, String deletedBy) {
        String title = "Bàn giao CCDC/Vật tư bị xóa";
        String message = String.format("Bàn giao CCDC/Vật tư (ID: %s) đã bị xóa bởi %s", documentId, deletedBy);
        sendCompanyNotification(companyId, title, message, "BAN_GIAO_CCDC_VAT_TU_DELETED");
    }

    /**
     * Thông báo tạo mới điều động tài sản
     */
    public void notifyDieuDongTaiSanCreated(String companyId, String documentId, String createdBy) {
        String title = "Điều động tài sản mới";
        String message = String.format("Có điều động tài sản mới được tạo bởi %s (ID: %s)", createdBy, documentId);
        sendCompanyNotification(companyId, title, message, "DIEU_DONG_TAI_SAN_CREATED");
    }

    /**
     * Thông báo cập nhật điều động tài sản
     */
    public void notifyDieuDongTaiSanUpdated(String companyId, String documentId, String updatedBy) {
        String title = "Điều động tài sản được cập nhật";
        String message = String.format("Điều động tài sản (ID: %s) đã được cập nhật bởi %s", documentId, updatedBy);
        sendCompanyNotification(companyId, title, message, "DIEU_DONG_TAI_SAN_UPDATED");
    }

    /**
     * Thông báo xóa điều động tài sản
     */
    public void notifyDieuDongTaiSanDeleted(String companyId, String documentId, String deletedBy) {
        String title = "Điều động tài sản bị xóa";
        String message = String.format("Điều động tài sản (ID: %s) đã bị xóa bởi %s", documentId, deletedBy);
        sendCompanyNotification(companyId, title, message, "DIEU_DONG_TAI_SAN_DELETED");
    }

    /**
     * Thông báo tạo mới điều động CCDC/Vật tư
     */
    public void notifyDieuDongCCDCVatTuCreated(String companyId, String documentId, String createdBy) {
        String title = "Điều động CCDC/Vật tư mới";
        String message = String.format("Có điều động CCDC/Vật tư mới được tạo bởi %s (ID: %s)", createdBy, documentId);
        sendCompanyNotification(companyId, title, message, "DIEU_DONG_CCDC_VAT_TU_CREATED");
    }

    /**
     * Thông báo cập nhật điều động CCDC/Vật tư
     */
    public void notifyDieuDongCCDCVatTuUpdated(String companyId, String documentId, String updatedBy) {
        String title = "Điều động CCDC/Vật tư được cập nhật";
        String message = String.format("Điều động CCDC/Vật tư (ID: %s) đã được cập nhật bởi %s", documentId, updatedBy);
        sendCompanyNotification(companyId, title, message, "DIEU_DONG_CCDC_VAT_TU_UPDATED");
    }

    /**
     * Thông báo xóa điều động CCDC/Vật tư
     */
    public void notifyDieuDongCCDCVatTuDeleted(String companyId, String documentId, String deletedBy) {
        String title = "Điều động CCDC/Vật tư bị xóa";
        String message = String.format("Điều động CCDC/Vật tư (ID: %s) đã bị xóa bởi %s", documentId, deletedBy);
        sendCompanyNotification(companyId, title, message, "DIEU_DONG_CCDC_VAT_TU_DELETED");
    }

    /**
     * Thông báo cập nhật chữ ký tài liệu
     */
    public void notifyKyTaiLieuUpdated(String companyId, String documentId, String updatedBy) {
        String title = "Chữ ký tài liệu được cập nhật";
        String message = String.format("Chữ ký tài liệu (ID: %s) đã được cập nhật bởi %s", documentId, updatedBy);
        sendCompanyNotification(companyId, title, message, "KY_TAI_LIEU_UPDATED");
    }

    /**
     * Thông báo thêm người ký
     */
    public void notifyNguoiKyAdded(String companyId, String documentId, String addedBy) {
        String title = "Thêm người ký mới";
        String message = String.format("Có người ký mới được thêm vào tài liệu (ID: %s) bởi %s", documentId, addedBy);
        sendCompanyNotification(companyId, title, message, "NGUOI_KY_ADDED");
    }

    /**
     * Thông báo cập nhật trạng thái ký
     */
    public void notifyTrangThaiKyUpdated(String companyId, String documentId, String signerName, String status) {
        String title = "Trạng thái ký được cập nhật";
        String message = String.format("Trạng thái ký của %s cho tài liệu (ID: %s) đã được cập nhật thành: %s", 
                signerName, documentId, status);
        sendCompanyNotification(companyId, title, message, "TRANG_THAI_KY_UPDATED");
    }

    /**
     * Gửi thông báo tổng quát cho CRUD operations
     */
    public void sendCrudNotification(String companyId, String entityName, String operation, String entityId, String userId) {
        String title = getCrudTitle(entityName, operation);
        String message = getCrudMessage(entityName, operation, entityId, userId);
        String type = getCrudType(entityName, operation);
        sendCompanyNotification(companyId, title, message, type);
    }

    /**
     * Gửi thông báo cho tất cả người dùng về CRUD operations
     */
    public void sendGlobalCrudNotification(String entityName, String operation, String entityId, String userId) {
        String title = getCrudTitle(entityName, operation);
        String message = getCrudMessage(entityName, operation, entityId, userId);
        String type = getCrudType(entityName, operation);
        sendGlobalNotification(title, message, type);
    }

    /**
     * Thông báo cho các entity cơ bản - Nhân viên
     */
    public void notifyNhanVienCreated(String companyId, String nhanVienId, String createdBy) {
        sendCrudNotification(companyId, "Nhân viên", "CREATE", nhanVienId, createdBy);
    }

    public void notifyNhanVienUpdated(String companyId, String nhanVienId, String updatedBy) {
        sendCrudNotification(companyId, "Nhân viên", "UPDATE", nhanVienId, updatedBy);
    }

    public void notifyNhanVienDeleted(String companyId, String nhanVienId, String deletedBy) {
        sendCrudNotification(companyId, "Nhân viên", "DELETE", nhanVienId, deletedBy);
    }

    /**
     * Thông báo cho Tài sản
     */
    public void notifyTaiSanCreated(String companyId, String taiSanId, String createdBy) {
        sendCrudNotification(companyId, "Tài sản", "CREATE", taiSanId, createdBy);
    }

    public void notifyTaiSanUpdated(String companyId, String taiSanId, String updatedBy) {
        sendCrudNotification(companyId, "Tài sản", "UPDATE", taiSanId, updatedBy);
    }

    public void notifyTaiSanDeleted(String companyId, String taiSanId, String deletedBy) {
        sendCrudNotification(companyId, "Tài sản", "DELETE", taiSanId, deletedBy);
    }

    /**
     * Thông báo cho CCDC/Vật tư
     */
    public void notifyCCDCVatTuCreated(String companyId, String ccdcId, String createdBy) {
        sendCrudNotification(companyId, "CCDC/Vật tư", "CREATE", ccdcId, createdBy);
    }

    public void notifyCCDCVatTuUpdated(String companyId, String ccdcId, String updatedBy) {
        sendCrudNotification(companyId, "CCDC/Vật tư", "UPDATE", ccdcId, updatedBy);
    }

    public void notifyCCDCVatTuDeleted(String companyId, String ccdcId, String deletedBy) {
        sendCrudNotification(companyId, "CCDC/Vật tư", "DELETE", ccdcId, deletedBy);
    }

    /**
     * Thông báo cho Phòng ban
     */
    public void notifyPhongBanCreated(String companyId, String phongBanId, String createdBy) {
        sendCrudNotification(companyId, "Phòng ban", "CREATE", phongBanId, createdBy);
    }

    public void notifyPhongBanUpdated(String companyId, String phongBanId, String updatedBy) {
        sendCrudNotification(companyId, "Phòng ban", "UPDATE", phongBanId, updatedBy);
    }

    public void notifyPhongBanDeleted(String companyId, String phongBanId, String deletedBy) {
        sendCrudNotification(companyId, "Phòng ban", "DELETE", phongBanId, deletedBy);
    }

    /**
     * Thông báo cho Công ty
     */
    public void notifyCongTyCreated(String companyId, String congTyId, String createdBy) {
        sendCrudNotification(companyId, "Công ty", "CREATE", congTyId, createdBy);
    }

    public void notifyCongTyUpdated(String companyId, String congTyId, String updatedBy) {
        sendCrudNotification(companyId, "Công ty", "UPDATE", congTyId, updatedBy);
    }

    public void notifyCongTyDeleted(String companyId, String congTyId, String deletedBy) {
        sendCrudNotification(companyId, "Công ty", "DELETE", congTyId, deletedBy);
    }

    /**
     * Thông báo cho Dự án
     */
    public void notifyDuAnCreated(String companyId, String duAnId, String createdBy) {
        sendCrudNotification(companyId, "Dự án", "CREATE", duAnId, createdBy);
    }

    public void notifyDuAnUpdated(String companyId, String duAnId, String updatedBy) {
        sendCrudNotification(companyId, "Dự án", "UPDATE", duAnId, updatedBy);
    }

    public void notifyDuAnDeleted(String companyId, String duAnId, String deletedBy) {
        sendCrudNotification(companyId, "Dự án", "DELETE", duAnId, deletedBy);
    }

    /**
     * Thông báo cho Loại tài sản
     */
    public void notifyLoaiTaiSanCreated(String companyId, String loaiTaiSanId, String createdBy) {
        sendCrudNotification(companyId, "Loại tài sản", "CREATE", loaiTaiSanId, createdBy);
    }

    public void notifyLoaiTaiSanUpdated(String companyId, String loaiTaiSanId, String updatedBy) {
        sendCrudNotification(companyId, "Loại tài sản", "UPDATE", loaiTaiSanId, updatedBy);
    }

    public void notifyLoaiTaiSanDeleted(String companyId, String loaiTaiSanId, String deletedBy) {
        sendCrudNotification(companyId, "Loại tài sản", "DELETE", loaiTaiSanId, deletedBy);
    }

    /**
     * Thông báo cho Khấu hao
     */
    public void notifyKhauHaoCreated(String companyId, String khauHaoId, String createdBy) {
        sendCrudNotification(companyId, "Khấu hao", "CREATE", khauHaoId, createdBy);
    }

    public void notifyKhauHaoUpdated(String companyId, String khauHaoId, String updatedBy) {
        sendCrudNotification(companyId, "Khấu hao", "UPDATE", khauHaoId, updatedBy);
    }

    public void notifyKhauHaoDeleted(String companyId, String khauHaoId, String deletedBy) {
        sendCrudNotification(companyId, "Khấu hao", "DELETE", khauHaoId, deletedBy);
    }

    /**
     * Thông báo cho Tài khoản
     */
    public void notifyTaiKhoanCreated(String companyId, String taiKhoanId, String createdBy) {
        sendCrudNotification(companyId, "Tài khoản", "CREATE", taiKhoanId, createdBy);
    }

    public void notifyTaiKhoanUpdated(String companyId, String taiKhoanId, String updatedBy) {
        sendCrudNotification(companyId, "Tài khoản", "UPDATE", taiKhoanId, updatedBy);
    }

    public void notifyTaiKhoanDeleted(String companyId, String taiKhoanId, String deletedBy) {
        sendCrudNotification(companyId, "Tài khoản", "DELETE", taiKhoanId, deletedBy);
    }

    /**
     * Thông báo cho Chức vụ
     */
    public void notifyChucVuCreated(String companyId, String chucVuId, String createdBy) {
        sendCrudNotification(companyId, "Chức vụ", "CREATE", chucVuId, createdBy);
    }

    public void notifyChucVuUpdated(String companyId, String chucVuId, String updatedBy) {
        sendCrudNotification(companyId, "Chức vụ", "UPDATE", chucVuId, updatedBy);
    }

    public void notifyChucVuDeleted(String companyId, String chucVuId, String deletedBy) {
        sendCrudNotification(companyId, "Chức vụ", "DELETE", chucVuId, deletedBy);
    }

    /**
     * Thông báo cho Nguồn kinh phí
     */
    public void notifyNguonKinhPhiCreated(String companyId, String nguonKinhPhiId, String createdBy) {
        sendCrudNotification(companyId, "Nguồn kinh phí", "CREATE", nguonKinhPhiId, createdBy);
    }

    public void notifyNguonKinhPhiUpdated(String companyId, String nguonKinhPhiId, String updatedBy) {
        sendCrudNotification(companyId, "Nguồn kinh phí", "UPDATE", nguonKinhPhiId, updatedBy);
    }

    public void notifyNguonKinhPhiDeleted(String companyId, String nguonKinhPhiId, String deletedBy) {
        sendCrudNotification(companyId, "Nguồn kinh phí", "DELETE", nguonKinhPhiId, deletedBy);
    }

    /**
     * Thông báo cho Nguồn vốn
     */
    public void notifyNguonVonCreated(String companyId, String nguonVonId, String createdBy) {
        sendCrudNotification(companyId, "Nguồn vốn", "CREATE", nguonVonId, createdBy);
    }

    public void notifyNguonVonUpdated(String companyId, String nguonVonId, String updatedBy) {
        sendCrudNotification(companyId, "Nguồn vốn", "UPDATE", nguonVonId, updatedBy);
    }

    public void notifyNguonVonDeleted(String companyId, String nguonVonId, String deletedBy) {
        sendCrudNotification(companyId, "Nguồn vốn", "DELETE", nguonVonId, deletedBy);
    }

    /**
     * Thông báo cho Đơn vị tính
     */
    public void notifyDonViTinhCreated(String companyId, String donViTinhId, String createdBy) {
        sendCrudNotification(companyId, "Đơn vị tính", "CREATE", donViTinhId, createdBy);
    }

    public void notifyDonViTinhUpdated(String companyId, String donViTinhId, String updatedBy) {
        sendCrudNotification(companyId, "Đơn vị tính", "UPDATE", donViTinhId, updatedBy);
    }

    public void notifyDonViTinhDeleted(String companyId, String donViTinhId, String deletedBy) {
        sendCrudNotification(companyId, "Đơn vị tính", "DELETE", donViTinhId, deletedBy);
    }

    /**
     * Thông báo cho Mô hình tài sản
     */
    public void notifyMoHinhTaiSanCreated(String companyId, String moHinhTaiSanId, String createdBy) {
        sendCrudNotification(companyId, "Mô hình tài sản", "CREATE", moHinhTaiSanId, createdBy);
    }

    public void notifyMoHinhTaiSanUpdated(String companyId, String moHinhTaiSanId, String updatedBy) {
        sendCrudNotification(companyId, "Mô hình tài sản", "UPDATE", moHinhTaiSanId, updatedBy);
    }

    public void notifyMoHinhTaiSanDeleted(String companyId, String moHinhTaiSanId, String deletedBy) {
        sendCrudNotification(companyId, "Mô hình tài sản", "DELETE", moHinhTaiSanId, deletedBy);
    }

    /**
     * Thông báo cho Nhóm tài sản
     */
    public void notifyNhomTaiSanCreated(String companyId, String nhomTaiSanId, String createdBy) {
        sendCrudNotification(companyId, "Nhóm tài sản", "CREATE", nhomTaiSanId, createdBy);
    }

    public void notifyNhomTaiSanUpdated(String companyId, String nhomTaiSanId, String updatedBy) {
        sendCrudNotification(companyId, "Nhóm tài sản", "UPDATE", nhomTaiSanId, updatedBy);
    }

    public void notifyNhomTaiSanDeleted(String companyId, String nhomTaiSanId, String deletedBy) {
        sendCrudNotification(companyId, "Nhóm tài sản", "DELETE", nhomTaiSanId, deletedBy);
    }

    /**
     * Thông báo cho Nhóm CCDC
     */
    public void notifyNhomCCDCCreated(String companyId, String nhomCCDCId, String createdBy) {
        sendCrudNotification(companyId, "Nhóm CCDC", "CREATE", nhomCCDCId, createdBy);
    }

    public void notifyNhomCCDCUpdated(String companyId, String nhomCCDCId, String updatedBy) {
        sendCrudNotification(companyId, "Nhóm CCDC", "UPDATE", nhomCCDCId, updatedBy);
    }

    public void notifyNhomCCDCDeleted(String companyId, String nhomCCDCId, String deletedBy) {
        sendCrudNotification(companyId, "Nhóm CCDC", "DELETE", nhomCCDCId, deletedBy);
    }

    /**
     * Thông báo cho Nhóm đơn vị
     */
    public void notifyNhomDonViCreated(String companyId, String nhomDonViId, String createdBy) {
        sendCrudNotification(companyId, "Nhóm đơn vị", "CREATE", nhomDonViId, createdBy);
    }

    public void notifyNhomDonViUpdated(String companyId, String nhomDonViId, String updatedBy) {
        sendCrudNotification(companyId, "Nhóm đơn vị", "UPDATE", nhomDonViId, updatedBy);
    }

    public void notifyNhomDonViDeleted(String companyId, String nhomDonViId, String deletedBy) {
        sendCrudNotification(companyId, "Nhóm đơn vị", "DELETE", nhomDonViId, deletedBy);
    }

    /**
     * Thông báo cho Lý do tăng
     */
    public void notifyLyDoTangCreated(String companyId, String lyDoTangId, String createdBy) {
        sendCrudNotification(companyId, "Lý do tăng", "CREATE", lyDoTangId, createdBy);
    }

    public void notifyLyDoTangUpdated(String companyId, String lyDoTangId, String updatedBy) {
        sendCrudNotification(companyId, "Lý do tăng", "UPDATE", lyDoTangId, updatedBy);
    }

    public void notifyLyDoTangDeleted(String companyId, String lyDoTangId, String deletedBy) {
        sendCrudNotification(companyId, "Lý do tăng", "DELETE", lyDoTangId, deletedBy);
    }

    /**
     * Thông báo cho Role
     */
    public void notifyRoleCreated(String companyId, String roleId, String createdBy) {
        sendCrudNotification(companyId, "Vai trò", "CREATE", roleId, createdBy);
    }

    public void notifyRoleUpdated(String companyId, String roleId, String updatedBy) {
        sendCrudNotification(companyId, "Vai trò", "UPDATE", roleId, updatedBy);
    }

    public void notifyRoleDeleted(String companyId, String roleId, String deletedBy) {
        sendCrudNotification(companyId, "Vai trò", "DELETE", roleId, deletedBy);
    }

    /**
     * Thông báo cho Permission
     */
    public void notifyPermissionCreated(String companyId, String permissionId, String createdBy) {
        sendCrudNotification(companyId, "Quyền", "CREATE", permissionId, createdBy);
    }

    public void notifyPermissionUpdated(String companyId, String permissionId, String updatedBy) {
        sendCrudNotification(companyId, "Quyền", "UPDATE", permissionId, updatedBy);
    }

    public void notifyPermissionDeleted(String companyId, String permissionId, String deletedBy) {
        sendCrudNotification(companyId, "Quyền", "DELETE", permissionId, deletedBy);
    }

    /**
     * Helper methods để tạo title, message và type cho CRUD operations
     */
    private String getCrudTitle(String entityName, String operation) {
        switch (operation.toUpperCase()) {
            case "CREATE":
                return entityName + " mới được tạo";
            case "UPDATE":
                return entityName + " được cập nhật";
            case "DELETE":
                return entityName + " bị xóa";
            default:
                return entityName + " có thay đổi";
        }
    }

    private String getCrudMessage(String entityName, String operation, String entityId, String userId) {
        switch (operation.toUpperCase()) {
            case "CREATE":
                return String.format("Có %s mới được tạo bởi %s (ID: %s)", entityName.toLowerCase(), userId, entityId);
            case "UPDATE":
                return String.format("%s (ID: %s) đã được cập nhật bởi %s", entityName, entityId, userId);
            case "DELETE":
                return String.format("%s (ID: %s) đã bị xóa bởi %s", entityName, entityId, userId);
            default:
                return String.format("%s (ID: %s) có thay đổi bởi %s", entityName, entityId, userId);
        }
    }

    private String getCrudType(String entityName, String operation) {
        String entityType = entityName.toUpperCase().replace(" ", "_").replace("/", "_");
        return entityType + "_" + operation.toUpperCase();
    }

    /**
     * Tạo object thông báo
     */
    private Map<String, Object> createNotification(String title, String message, String type, String targetId) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("message", message);
        notification.put("type", type);
        notification.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        notification.put("targetId", targetId);
        return notification;
    }

    // ==================== SOCKET MESSAGE THEO SPEC ====================

    /**
     * Gửi SocketMessage theo spec đến tất cả users
     */
    public void sendSocketMessage(SocketMessage message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }

    /**
     * Gửi SocketMessage đến công ty cụ thể
     */
    public void sendSocketMessageToCompany(String companyId, SocketMessage message) {
        messagingTemplate.convertAndSend("/topic/company/" + companyId, message);
    }

    /**
     * Gửi SocketMessage đến các users cụ thể
     * Gửi đến từng user trong danh sách id_need_to_do
     */
    public void sendSocketMessageToUsers(SocketMessage message) {
        if (message.getIdNeedToDo() == null || message.getIdNeedToDo().isEmpty()) {
            return;
        }
        List<String> userIds = Arrays.stream(message.getIdNeedToDo().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        for (String userId : userIds) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", message);
        }
    }

    /**
     * Gửi SocketMessage broadcast và đến từng user cần xử lý
     */
    public void broadcastSocketMessage(SocketMessage message) {
        // Broadcast toàn cục
        sendSocketMessage(message);
        // Gửi đến từng user cần xử lý
        sendSocketMessageToUsers(message);
    }

    /**
     * Tạo và gửi SocketMessage - Điều chuyển tài sản
     */
    public void notifyDieuChuyenTaiSan(int subTypeFunc, int typeAction, String idNeedToDo) {
        SocketMessage message = SocketMessage.builder()
                .typeFunc(TypeFunc.ASSET_TRANSFER)
                .subTypeFunc(subTypeFunc)
                .time(Instant.now().toEpochMilli())
                .typeAction(typeAction)
                .idNeedToDo(idNeedToDo)
                .build();
        broadcastSocketMessage(message);
    }

    /**
     * Tạo và gửi SocketMessage - Bàn giao tài sản
     */
    public void notifyBanGiaoTaiSanSocket(int subTypeFunc, int typeAction, String idNeedToDo) {
        SocketMessage message = SocketMessage.builder()
                .typeFunc(TypeFunc.ASSET_HANDOVER)
                .subTypeFunc(subTypeFunc)
                .time(Instant.now().toEpochMilli())
                .typeAction(typeAction)
                .idNeedToDo(idNeedToDo)
                .build();
        broadcastSocketMessage(message);
    }

    /**
     * Tạo và gửi SocketMessage - Điều chuyển CCDC & vật tư
     */
    public void notifyDieuChuyenCCDCVatTu(int subTypeFunc, int typeAction, String idNeedToDo) {
        SocketMessage message = SocketMessage.builder()
                .typeFunc(TypeFunc.TOOL_AND_MATERIAL_TRANSFER)
                .subTypeFunc(subTypeFunc)
                .time(Instant.now().toEpochMilli())
                .typeAction(typeAction)
                .idNeedToDo(idNeedToDo)
                .build();
        broadcastSocketMessage(message);
    }

    /**
     * Tạo và gửi SocketMessage - Bàn giao CCDC & vật tư
     */
    public void notifyBanGiaoCCDCVatTuSocket(int subTypeFunc, int typeAction, String idNeedToDo) {
        SocketMessage message = SocketMessage.builder()
                .typeFunc(TypeFunc.TOOL_AND_SUPPLIES_HANDOVER)
                .subTypeFunc(subTypeFunc)
                .time(Instant.now().toEpochMilli())
                .typeAction(typeAction)
                .idNeedToDo(idNeedToDo)
                .build();
        broadcastSocketMessage(message);
    }

    /**
     * Tạo và gửi SocketMessage - Áp dụng cho tất cả chức năng
     */
    public void notifyAllFunction(int subTypeFunc, int typeAction, String idNeedToDo) {
        SocketMessage message = SocketMessage.builder()
                .typeFunc(TypeFunc.ALL_FUNCTION)
                .subTypeFunc(subTypeFunc)
                .time(Instant.now().toEpochMilli())
                .typeAction(typeAction)
                .idNeedToDo(idNeedToDo)
                .build();
        broadcastSocketMessage(message);
    }

    /**
     * Helper: Tạo SocketMessage với tham số đầy đủ
     */
    public SocketMessage createSocketMessage(int typeFunc, int subTypeFunc, int typeAction, String idNeedToDo) {
        return SocketMessage.builder()
                .typeFunc(typeFunc)
                .subTypeFunc(subTypeFunc)
                .time(Instant.now().toEpochMilli())
                .typeAction(typeAction)
                .idNeedToDo(idNeedToDo)
                .build();
    }

    /**
     * Gửi SocketMessage tùy chỉnh với tham số đầy đủ
     */
    public void sendCustomSocketMessage(int typeFunc, int subTypeFunc, int typeAction, String idNeedToDo) {
        SocketMessage message = createSocketMessage(typeFunc, subTypeFunc, typeAction, idNeedToDo);
        broadcastSocketMessage(message);
    }

    // ==================== NGHIỆP VỤ CỤ THỂ ====================

    /**
     * Thông báo tạo biên bản bàn giao tài sản (theo spec)
     * @param subTypeFunc chức năng con (ví dụ: 1 = từ điều động)
     * @param creatorId ID người tạo
     * @param signerIds danh sách ID người ký (phân tách bằng dấu phẩy)
     */
    public void notifyBienBanBanGiaoTaiSanCreated(int subTypeFunc, String creatorId, String signerIds) {
        String idNeedToDo = buildIdNeedToDo(creatorId, signerIds);
        notifyBanGiaoTaiSanSocket(subTypeFunc, TypeAction.CREATE, idNeedToDo);
    }

    /**
     * Thông báo ký/trình duyệt biên bản bàn giao tài sản
     */
    public void notifyBienBanBanGiaoTaiSanSigned(int subTypeFunc, String remainingSignerIds) {
        notifyBanGiaoTaiSanSocket(subTypeFunc, TypeAction.UPDATE, remainingSignerIds);
    }

    /**
     * Thông báo xóa biên bản bàn giao tài sản
     */
    public void notifyBienBanBanGiaoTaiSanDeleted(int subTypeFunc, String relatedUserIds) {
        notifyBanGiaoTaiSanSocket(subTypeFunc, TypeAction.DELETE, relatedUserIds);
    }

    /**
     * Thông báo tạo biên bản điều chuyển tài sản (theo spec)
     */
    public void notifyBienBanDieuChuyenTaiSanCreated(int subTypeFunc, String creatorId, String signerIds) {
        String idNeedToDo = buildIdNeedToDo(creatorId, signerIds);
        notifyDieuChuyenTaiSan(subTypeFunc, TypeAction.CREATE, idNeedToDo);
    }

    /**
     * Thông báo ký/trình duyệt biên bản điều chuyển tài sản
     */
    public void notifyBienBanDieuChuyenTaiSanSigned(int subTypeFunc, String remainingSignerIds) {
        notifyDieuChuyenTaiSan(subTypeFunc, TypeAction.UPDATE, remainingSignerIds);
    }

    /**
     * Thông báo xóa biên bản điều chuyển tài sản
     */
    public void notifyBienBanDieuChuyenTaiSanDeleted(int subTypeFunc, String relatedUserIds) {
        notifyDieuChuyenTaiSan(subTypeFunc, TypeAction.DELETE, relatedUserIds);
    }

    /**
     * Thông báo tạo biên bản bàn giao CCDC/Vật tư (theo spec)
     */
    public void notifyBienBanBanGiaoCCDCCreated(int subTypeFunc, String creatorId, String signerIds) {
        String idNeedToDo = buildIdNeedToDo(creatorId, signerIds);
        notifyBanGiaoCCDCVatTuSocket(subTypeFunc, TypeAction.CREATE, idNeedToDo);
    }

    /**
     * Thông báo ký/trình duyệt biên bản bàn giao CCDC/Vật tư
     */
    public void notifyBienBanBanGiaoCCDCSigned(int subTypeFunc, String remainingSignerIds) {
        notifyBanGiaoCCDCVatTuSocket(subTypeFunc, TypeAction.UPDATE, remainingSignerIds);
    }

    /**
     * Thông báo xóa biên bản bàn giao CCDC/Vật tư
     */
    public void notifyBienBanBanGiaoCCDCDeleted(int subTypeFunc, String relatedUserIds) {
        notifyBanGiaoCCDCVatTuSocket(subTypeFunc, TypeAction.DELETE, relatedUserIds);
    }

    /**
     * Thông báo tạo biên bản điều chuyển CCDC/Vật tư (theo spec)
     */
    public void notifyBienBanDieuChuyenCCDCCreated(int subTypeFunc, String creatorId, String signerIds) {
        String idNeedToDo = buildIdNeedToDo(creatorId, signerIds);
        notifyDieuChuyenCCDCVatTu(subTypeFunc, TypeAction.CREATE, idNeedToDo);
    }

    /**
     * Thông báo ký/trình duyệt biên bản điều chuyển CCDC/Vật tư
     */
    public void notifyBienBanDieuChuyenCCDCSigned(int subTypeFunc, String remainingSignerIds) {
        notifyDieuChuyenCCDCVatTu(subTypeFunc, TypeAction.UPDATE, remainingSignerIds);
    }

    /**
     * Thông báo xóa biên bản điều chuyển CCDC/Vật tư
     */
    public void notifyBienBanDieuChuyenCCDCDeleted(int subTypeFunc, String relatedUserIds) {
        notifyDieuChuyenCCDCVatTu(subTypeFunc, TypeAction.DELETE, relatedUserIds);
    }

    /**
     * Helper: Ghép danh sách user ID thành chuỗi id_need_to_do
     */
    private String buildIdNeedToDo(String... userIds) {
        return Arrays.stream(userIds)
                .filter(id -> id != null && !id.isEmpty())
                .flatMap(id -> Arrays.stream(id.split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .collect(Collectors.joining(","));
    }
}
