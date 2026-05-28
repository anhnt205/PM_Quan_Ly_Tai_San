package com.ecotel.quanlytaisan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lylich")
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class LyLich {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(name = "MaLyLich")
    String maLyLich;
    @Column(name = "TenLyLich")
    String tenLyLich;
    @Column(name = "MoTa")
    String moTa;
    @Column(name = "HieuLuc")
    @Builder.Default
    Boolean hieuLuc = true;
    @Column(name = "IdCongTy")
    String idCongTy;
    @Column(name = "NgayTao")
    String ngayTao;
    @Column(name = "NgayCapNhat")
    String ngayCapNhat;
    @Column(name = "NguoiTao")
    String nguoiTao;
    @Column(name = "NguoiCapNhat")
    String nguoiCapNhat;

    @OneToMany(
            mappedBy = "lyLich",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    List<LyLichNhomTaiSan> nhomTaiSans = new ArrayList<>();
}
