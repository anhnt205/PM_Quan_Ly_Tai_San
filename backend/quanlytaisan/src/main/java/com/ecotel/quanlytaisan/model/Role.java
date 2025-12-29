package com.ecotel.quanlytaisan.model;

import lombok.Data;

@Data
public class Role {
    private String id;
    private String roleName;
    private String roleCode;
    private String description;
    private Boolean isActive;

}
