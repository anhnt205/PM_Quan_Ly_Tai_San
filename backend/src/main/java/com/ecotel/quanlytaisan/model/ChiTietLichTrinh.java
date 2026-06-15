package com.ecotel.quanlytaisan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "ChiTietLichTrinh")
public class ChiTietLichTrinh {
    @Id
    @Column(name = "Id")
    private String id;

    @Column(name = "IdLichTrinh", insertable = false, updatable = false)
    private String idLichTrinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdLichTrinh", nullable = false)
    @JsonIgnore
    private LichTrinh lichTrinh;

    @Column(name = "Ngay", nullable = false)
    private Integer ngay;

    @Column(name = "Ca1")
    private Integer ca1;

    @Column(name = "Ca2")
    private Integer ca2;

    @Column(name = "Ca3")
    private Integer ca3;
}
