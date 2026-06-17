package com.ecotel.quanlytaisan.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "LichTrinh")
public class LichTrinh {
    @Id
    @Column(name = "Id")
    private String id;

    @Column(name = "IdTaiSan", nullable = false)
    private String idTaiSan;

    @Column(name = "Nam", nullable = false)
    private Integer nam;

    @Column(name = "Thang", nullable = false)
    private Integer thang;

    @Column(name = "GhiChu")
    private String ghiChu;

    @Column(name = "NgayTao")
    private String ngayTao;

    @Column(name = "NgayCapNhat")
    private String ngayCapNhat;

    @Column(name = "NguoiTao")
    private String nguoiTao;

    @Column(name = "NguoiCapNhat")
    private String nguoiCapNhat;

    @OneToMany(mappedBy = "lichTrinh", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ChiTietLichTrinh> chiTietLichTrinhs;
}
