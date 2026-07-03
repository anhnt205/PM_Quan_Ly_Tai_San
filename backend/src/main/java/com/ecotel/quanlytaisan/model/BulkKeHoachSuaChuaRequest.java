package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;

@Data
public class BulkKeHoachSuaChuaRequest {
    private List<KeHoachSuaChua> create;
    private List<KeHoachSuaChua> update;
    private List<String> delete;
}