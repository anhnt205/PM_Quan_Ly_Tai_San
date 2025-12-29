package com.ecotel.quanlytaisan.enums;

/**
 * Hành động CRUD / nghiệp vụ cho Socket Message
 *
 * Mapping nghiệp vụ:
 * - Tạo biên bản -> CREATE
 * - Ký biên bản -> UPDATE
 * - Trình duyệt -> UPDATE
 * - Hủy phiếu -> UPDATE
 * - Hủy / xóa -> DELETE
 */
public class TypeAction {

    /**
     * Tạo mới
     */
    public static final int CREATE = 1;

    /**
     * Cập nhật (bao gồm: Ký, Trình duyệt, Hủy phiếu)
     */
    public static final int UPDATE = 2;

    /**
     * Xóa
     */
    public static final int DELETE = 3;

    /**
     * Lấy tên mô tả cho type_action
     */
    public static String getName(int typeAction) {
        switch (typeAction) {
            case CREATE:
                return "Tạo mới";
            case UPDATE:
                return "Cập nhật";
            case DELETE:
                return "Xóa";
            default:
                return "Không xác định";
        }
    }

    /**
     * Kiểm tra type_action có hợp lệ không
     */
    public static boolean isValid(int typeAction) {
        return typeAction >= CREATE && typeAction <= DELETE;
    }
}
