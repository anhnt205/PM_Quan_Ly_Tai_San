package com.ecotel.quanlytaisan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mau_bien_ban_sua_chua")
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class MauBienBanSuaChua {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "Ma", unique = true)
    String ma;

    @Column(name = "Ten")
    String ten;

    @Column(name = "MacDinh")
    @Builder.Default
    Boolean macDinh = false;
}
