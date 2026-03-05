package com.ecotel.quanlytaisan.model;

import lombok.Data;

import java.util.List;

@Data
public class BulkKeHoachChiTietSuaChuaRequest {
    private List<KeHoachChiTietSuaChua> create;
    private List<KeHoachChiTietSuaChua> update;
    private List<String> delete;
}
