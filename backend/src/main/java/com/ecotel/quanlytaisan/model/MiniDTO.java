package com.ecotel.quanlytaisan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO tối giản cho các dropdown/select box
 * Chỉ chứa id và tên để giảm dung lượng response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MiniDTO {
    private String id;
    private String ten;
}
