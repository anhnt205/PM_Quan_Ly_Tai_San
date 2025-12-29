package com.ecotel.quanlytaisan.enums;

/**
 * Nhóm chức năng chính cho Socket Message
 * type_func quyết định người tạo chính của biên bản và phạm vi nghiệp vụ
 */
public class TypeFunc {

    /**
     * Điều chuyển tài sản
     */
    public static final int ASSET_TRANSFER = 1;

    /**
     * Bàn giao tài sản
     */
    public static final int ASSET_HANDOVER = 2;

    /**
     * Điều chuyển CCDC & vật tư
     */
    public static final int TOOL_AND_MATERIAL_TRANSFER = 3;

    /**
     * Bàn giao CCDC & vật tư
     */
    public static final int TOOL_AND_SUPPLIES_HANDOVER = 4;

    /**
     * Áp dụng cho tất cả
     */
    public static final int ALL_FUNCTION = 5;

    /**
     * Lấy tên mô tả cho type_func
     */
    public static String getName(int typeFunc) {
        switch (typeFunc) {
            case ASSET_TRANSFER:
                return "Điều chuyển tài sản";
            case ASSET_HANDOVER:
                return "Bàn giao tài sản";
            case TOOL_AND_MATERIAL_TRANSFER:
                return "Điều chuyển CCDC & vật tư";
            case TOOL_AND_SUPPLIES_HANDOVER:
                return "Bàn giao CCDC & vật tư";
            case ALL_FUNCTION:
                return "Tất cả chức năng";
            default:
                return "Không xác định";
        }
    }

    /**
     * Kiểm tra type_func có hợp lệ không
     */
    public static boolean isValid(int typeFunc) {
        return typeFunc >= ASSET_TRANSFER && typeFunc <= ALL_FUNCTION;
    }
}
