package com.ecotel.quanlytaisan.utils;

import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Helper class để gửi thông báo socket cho các CRUD operations
 */
@Component
public class SocketNotificationHelper {

    @Autowired
    private NotificationService notificationService;

    /**
     * Gửi thông báo tạo mới
     */
    public void notifyCreated(String entityName, String companyId, String entityId, String userId) {
        switch (entityName.toLowerCase()) {
            case "nhanvien":
                notificationService.notifyNhanVienCreated(companyId, entityId, userId);
                break;
            case "taisan":
                notificationService.notifyTaiSanCreated(companyId, entityId, userId);
                break;
            case "ccdcvattu":
                notificationService.notifyCCDCVatTuCreated(companyId, entityId, userId);
                break;
            case "phongban":
                notificationService.notifyPhongBanCreated(companyId, entityId, userId);
                break;
            case "congty":
                notificationService.notifyCongTyCreated(companyId, entityId, userId);
                break;
            case "duan":
                notificationService.notifyDuAnCreated(companyId, entityId, userId);
                break;
            case "loaitaisan":
                notificationService.notifyLoaiTaiSanCreated(companyId, entityId, userId);
                break;
            case "khauhao":
                notificationService.notifyKhauHaoCreated(companyId, entityId, userId);
                break;
            case "taikhoan":
                notificationService.notifyTaiKhoanCreated(companyId, entityId, userId);
                break;
            case "chucvu":
                notificationService.notifyChucVuCreated(companyId, entityId, userId);
                break;
            case "nguonkinhphi":
                notificationService.notifyNguonKinhPhiCreated(companyId, entityId, userId);
                break;
            case "nguonvon":
                notificationService.notifyNguonVonCreated(companyId, entityId, userId);
                break;
            case "donvitinh":
                notificationService.notifyDonViTinhCreated(companyId, entityId, userId);
                break;
            case "mohinhtaisan":
                notificationService.notifyMoHinhTaiSanCreated(companyId, entityId, userId);
                break;
            case "nhomtaisan":
                notificationService.notifyNhomTaiSanCreated(companyId, entityId, userId);
                break;
            case "nhomccdc":
                notificationService.notifyNhomCCDCCreated(companyId, entityId, userId);
                break;
            case "nhomdonvi":
                notificationService.notifyNhomDonViCreated(companyId, entityId, userId);
                break;
            case "lydotang":
                notificationService.notifyLyDoTangCreated(companyId, entityId, userId);
                break;
            case "role":
                notificationService.notifyRoleCreated(companyId, entityId, userId);
                break;
            case "permission":
                notificationService.notifyPermissionCreated(companyId, entityId, userId);
                break;
            default:
                // Sử dụng method tổng quát
                notificationService.sendCrudNotification(companyId, entityName, "CREATE", entityId, userId);
                break;
        }
    }

    /**
     * Gửi thông báo cập nhật
     */
    public void notifyUpdated(String entityName, String companyId, String entityId, String userId) {
        switch (entityName.toLowerCase()) {
            case "nhanvien":
                notificationService.notifyNhanVienUpdated(companyId, entityId, userId);
                break;
            case "taisan":
                notificationService.notifyTaiSanUpdated(companyId, entityId, userId);
                break;
            case "ccdcvattu":
                notificationService.notifyCCDCVatTuUpdated(companyId, entityId, userId);
                break;
            case "phongban":
                notificationService.notifyPhongBanUpdated(companyId, entityId, userId);
                break;
            case "congty":
                notificationService.notifyCongTyUpdated(companyId, entityId, userId);
                break;
            case "duan":
                notificationService.notifyDuAnUpdated(companyId, entityId, userId);
                break;
            case "loaitaisan":
                notificationService.notifyLoaiTaiSanUpdated(companyId, entityId, userId);
                break;
            case "khauhao":
                notificationService.notifyKhauHaoUpdated(companyId, entityId, userId);
                break;
            case "taikhoan":
                notificationService.notifyTaiKhoanUpdated(companyId, entityId, userId);
                break;
            case "chucvu":
                notificationService.notifyChucVuUpdated(companyId, entityId, userId);
                break;
            case "nguonkinhphi":
                notificationService.notifyNguonKinhPhiUpdated(companyId, entityId, userId);
                break;
            case "nguonvon":
                notificationService.notifyNguonVonUpdated(companyId, entityId, userId);
                break;
            case "donvitinh":
                notificationService.notifyDonViTinhUpdated(companyId, entityId, userId);
                break;
            case "mohinhtaisan":
                notificationService.notifyMoHinhTaiSanUpdated(companyId, entityId, userId);
                break;
            case "nhomtaisan":
                notificationService.notifyNhomTaiSanUpdated(companyId, entityId, userId);
                break;
            case "nhomccdc":
                notificationService.notifyNhomCCDCUpdated(companyId, entityId, userId);
                break;
            case "nhomdonvi":
                notificationService.notifyNhomDonViUpdated(companyId, entityId, userId);
                break;
            case "lydotang":
                notificationService.notifyLyDoTangUpdated(companyId, entityId, userId);
                break;
            case "role":
                notificationService.notifyRoleUpdated(companyId, entityId, userId);
                break;
            case "permission":
                notificationService.notifyPermissionUpdated(companyId, entityId, userId);
                break;
            default:
                // Sử dụng method tổng quát
                notificationService.sendCrudNotification(companyId, entityName, "UPDATE", entityId, userId);
                break;
        }
    }

    /**
     * Gửi thông báo xóa
     */
    public void notifyDeleted(String entityName, String companyId, String entityId, String userId) {
        switch (entityName.toLowerCase()) {
            case "nhanvien":
                notificationService.notifyNhanVienDeleted(companyId, entityId, userId);
                break;
            case "taisan":
                notificationService.notifyTaiSanDeleted(companyId, entityId, userId);
                break;
            case "ccdcvattu":
                notificationService.notifyCCDCVatTuDeleted(companyId, entityId, userId);
                break;
            case "phongban":
                notificationService.notifyPhongBanDeleted(companyId, entityId, userId);
                break;
            case "congty":
                notificationService.notifyCongTyDeleted(companyId, entityId, userId);
                break;
            case "duan":
                notificationService.notifyDuAnDeleted(companyId, entityId, userId);
                break;
            case "loaitaisan":
                notificationService.notifyLoaiTaiSanDeleted(companyId, entityId, userId);
                break;
            case "khauhao":
                notificationService.notifyKhauHaoDeleted(companyId, entityId, userId);
                break;
            case "taikhoan":
                notificationService.notifyTaiKhoanDeleted(companyId, entityId, userId);
                break;
            case "chucvu":
                notificationService.notifyChucVuDeleted(companyId, entityId, userId);
                break;
            case "nguonkinhphi":
                notificationService.notifyNguonKinhPhiDeleted(companyId, entityId, userId);
                break;
            case "nguonvon":
                notificationService.notifyNguonVonDeleted(companyId, entityId, userId);
                break;
            case "donvitinh":
                notificationService.notifyDonViTinhDeleted(companyId, entityId, userId);
                break;
            case "mohinhtaisan":
                notificationService.notifyMoHinhTaiSanDeleted(companyId, entityId, userId);
                break;
            case "nhomtaisan":
                notificationService.notifyNhomTaiSanDeleted(companyId, entityId, userId);
                break;
            case "nhomccdc":
                notificationService.notifyNhomCCDCDeleted(companyId, entityId, userId);
                break;
            case "nhomdonvi":
                notificationService.notifyNhomDonViDeleted(companyId, entityId, userId);
                break;
            case "lydotang":
                notificationService.notifyLyDoTangDeleted(companyId, entityId, userId);
                break;
            case "role":
                notificationService.notifyRoleDeleted(companyId, entityId, userId);
                break;
            case "permission":
                notificationService.notifyPermissionDeleted(companyId, entityId, userId);
                break;
            default:
                // Sử dụng method tổng quát
                notificationService.sendCrudNotification(companyId, entityName, "DELETE", entityId, userId);
                break;
        }
    }
}
