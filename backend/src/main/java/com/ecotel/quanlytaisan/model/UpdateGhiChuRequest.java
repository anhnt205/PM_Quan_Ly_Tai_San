package com.ecotel.quanlytaisan.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class UpdateGhiChuRequest {
    @NotBlank(message = "Ghi chú không được để trống")
    @Size(max = 5000, message = "Ghi chú không được vượt quá 5000 ký tự")
    private String ghiChuBienBan;
}
