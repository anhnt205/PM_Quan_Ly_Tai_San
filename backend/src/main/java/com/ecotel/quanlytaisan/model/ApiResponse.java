package com.ecotel.quanlytaisan.model;

public class ApiResponse<T> {
    private Boolean success;
    private String message;
    private T data;
    private Integer affectedRows;

    public ApiResponse() {
    }

    public ApiResponse(boolean success, String message, T data, Integer affectedRows) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.affectedRows = affectedRows;
    }

    public static <T> ApiResponse<T> success(String message, T data, Integer affectedRows) {
        return new ApiResponse<>(true, message, data, affectedRows);
    }

    public static <T> ApiResponse<T> failure(String message, Integer affectedRows) {
        return new ApiResponse<>(false, message, null, affectedRows);
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Integer getAffectedRows() {
        return affectedRows;
    }

    public void setAffectedRows(Integer affectedRows) {
        this.affectedRows = affectedRows;
    }
}


