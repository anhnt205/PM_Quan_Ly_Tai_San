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

    @Column(name = "LoaiBienBan")
    String loaiBienBan;

    @Column(name = "CongTy")
    String congTy;

    @Column(name = "Trai1")
    String trai1;

    @Column(name = "Trai2")
    String trai2;

    @Column(name = "Trai3")
    String trai3;

    @Column(name = "Phai1")
    String phai1;

    @Column(name = "Phai2")
    String phai2;

    @Column(name = "Phai3")
    String phai3;

    @Column(name = "ThoiGian")
    String thoiGian;

    @Column(name = "Giua1")
    String giua1;

    @Column(name = "Giua2")
    String giua2;

    @Column(name = "Giua3")
    String giua3;
}
