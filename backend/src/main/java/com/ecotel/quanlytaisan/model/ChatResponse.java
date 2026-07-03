package com.ecotel.quanlytaisan.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ChatResponse {
    private String sqlQuery;
    private List<Map<String, Object>> data;
    private String explanation;

    public ChatResponse() {}

    public ChatResponse(String sqlQuery, List<Map<String, Object>> data, String explanation) {
        this.sqlQuery = sqlQuery;
        this.data = data;
        this.explanation = explanation;
    }
}
