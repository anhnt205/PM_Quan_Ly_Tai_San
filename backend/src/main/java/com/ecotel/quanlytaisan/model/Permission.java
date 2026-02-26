package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class Permission {
    private String id;
    private String permissionName;
    private String permissionCode;
    private String description;
    private Boolean isActive;

}
