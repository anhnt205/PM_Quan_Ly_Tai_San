package com.ecotel.quanlytaisan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "lylich_nhomtaisan",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_nhomtaisan",
                        columnNames = "nhomtaisan_id"
                )
        }
)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LyLichNhomTaiSan {

    @EmbeddedId
    LyLichNhomTaiSanId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("lyLichId")
    @JoinColumn(name = "lylich_id")
    LyLich lyLich;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("nhomTaiSanId")
    @JoinColumn(name = "nhomtaisan_id")
    NhomTaiSan nhomTaiSan;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LyLichNhomTaiSanId
            implements Serializable {

        @Column(name = "lylich_id")
        String lyLichId;

        @Column(name = "nhomtaisan_id")
        String nhomTaiSanId;
    }
}
