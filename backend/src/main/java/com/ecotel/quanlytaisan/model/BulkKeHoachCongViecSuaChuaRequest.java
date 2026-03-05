package com.ecotel.quanlytaisan.model;

import lombok.Data;

import java.util.List;

@Data
public class BulkKeHoachCongViecSuaChuaRequest {
    private List<KeHoachCongViecSuaChua> create;
    private List<KeHoachCongViecSuaChua> update;
    private List<String> delete;
}
