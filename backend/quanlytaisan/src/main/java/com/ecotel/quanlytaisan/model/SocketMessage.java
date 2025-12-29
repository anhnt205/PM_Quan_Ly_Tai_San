package com.ecotel.quanlytaisan.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Socket Message Model theo spec
 * Dùng chung cho các nghiệp vụ: biên bản, điều động/bàn giao, ký/trình duyệt
 */
public class SocketMessage {

    /**
     * Nhóm chức năng chính
     * 1 = Điều chuyển tài sản
     * 2 = Bàn giao tài sản
     * 3 = Điều chuyển CCDC & vật tư
     * 4 = Bàn giao CCDC & vật tư
     * 5 = Áp dụng cho tất cả
     */
    @JsonProperty("type_func")
    private int typeFunc;

    /**
     * Chức năng con, phụ thuộc type_func
     * Dùng khi điều động nhiều bước, bàn giao có trung gian
     */
    @JsonProperty("sub_type_func")
    private int subTypeFunc;

    /**
     * Thời điểm phát sinh action (timestamp - milliseconds)
     */
    @JsonProperty("time")
    private long time;

    /**
     * Hành động CRUD / nghiệp vụ
     * 1 = CREATE (Tạo mới)
     * 2 = UPDATE (Cập nhật / Ký / Trình duyệt / Hủy phiếu)
     * 3 = DELETE (Xóa)
     */
    @JsonProperty("type_action")
    private int typeAction;

    /**
     * Danh sách user id liên quan cần xử lý
     * Format: "19,1059,1" - phân tách bằng dấu phẩy
     */
    @JsonProperty("id_need_to_do")
    private String idNeedToDo;

    // Constructors
    public SocketMessage() {
    }

    public SocketMessage(int typeFunc, int subTypeFunc, long time, int typeAction, String idNeedToDo) {
        this.typeFunc = typeFunc;
        this.subTypeFunc = subTypeFunc;
        this.time = time;
        this.typeAction = typeAction;
        this.idNeedToDo = idNeedToDo;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private int typeFunc;
        private int subTypeFunc;
        private long time;
        private int typeAction;
        private String idNeedToDo;

        public Builder typeFunc(int typeFunc) {
            this.typeFunc = typeFunc;
            return this;
        }

        public Builder subTypeFunc(int subTypeFunc) {
            this.subTypeFunc = subTypeFunc;
            return this;
        }

        public Builder time(long time) {
            this.time = time;
            return this;
        }

        public Builder typeAction(int typeAction) {
            this.typeAction = typeAction;
            return this;
        }

        public Builder idNeedToDo(String idNeedToDo) {
            this.idNeedToDo = idNeedToDo;
            return this;
        }

        public SocketMessage build() {
            return new SocketMessage(typeFunc, subTypeFunc, time, typeAction, idNeedToDo);
        }
    }

    // Getters and Setters
    public int getTypeFunc() {
        return typeFunc;
    }

    public void setTypeFunc(int typeFunc) {
        this.typeFunc = typeFunc;
    }

    public int getSubTypeFunc() {
        return subTypeFunc;
    }

    public void setSubTypeFunc(int subTypeFunc) {
        this.subTypeFunc = subTypeFunc;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public int getTypeAction() {
        return typeAction;
    }

    public void setTypeAction(int typeAction) {
        this.typeAction = typeAction;
    }

    public String getIdNeedToDo() {
        return idNeedToDo;
    }

    public void setIdNeedToDo(String idNeedToDo) {
        this.idNeedToDo = idNeedToDo;
    }

    @Override
    public String toString() {
        return "SocketMessage{" +
                "type_func=" + typeFunc +
                ", sub_type_func=" + subTypeFunc +
                ", time=" + time +
                ", type_action=" + typeAction +
                ", id_need_to_do='" + idNeedToDo + '\'' +
                '}';
    }
}
