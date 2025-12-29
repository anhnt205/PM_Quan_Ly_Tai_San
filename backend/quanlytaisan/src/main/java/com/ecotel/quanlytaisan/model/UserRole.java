package com.ecotel.quanlytaisan.model;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class UserRole {
    private String id;
    private String userId;
    private String roleId;
    private Boolean isActive;
    private LocalDateTime createdDate;
    private String roleName;

    public UserRole() {
    }

    public UserRole(String id, String userId, String roleId, Boolean isActive, LocalDateTime createdDate) {
        this.id = id;
        this.userId = userId;
        this.roleId = roleId;
        this.isActive = isActive;
        this.createdDate = createdDate;
    }

}
