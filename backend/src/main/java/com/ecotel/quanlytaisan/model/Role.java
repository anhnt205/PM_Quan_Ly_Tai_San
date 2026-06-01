package com.ecotel.quanlytaisan.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "role")
@Access(AccessType.FIELD)
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "RoleName")
    private String roleName;
    @Column(name = "RoleCode")
    private String roleCode;
    @Column(name = "description")
    private String description;
    @Column(name = "IsActive")
    private Boolean isActive;

}
