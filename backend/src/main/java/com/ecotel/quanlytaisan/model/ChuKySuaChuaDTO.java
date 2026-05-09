package com.ecotel.quanlytaisan.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ChuKySuaChuaDTO extends ChuKySuaChua {
    private String tenTaiSan;
    private String tenLoaiSuaChua;
}
