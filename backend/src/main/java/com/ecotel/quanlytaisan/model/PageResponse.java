package com.ecotel.quanlytaisan.model;

import java.util.List;
import java.util.Map;

public class PageResponse<T> {

    private List<T> items;
    private long totalItems;
    private int totalPages;
    private int page;
    private int size;

    // Các field thống kê bổ sung
    private Map<String, Long> groupCounts;
    private Map<String, Long> loaiCounts;
    private Map<String, Long> trangThaiCounts;

    // Constructor chính - dùng rộng rãi trong dự án
    public PageResponse(List<T> items, long totalItems, int page, int size) {
        this.items = items;
        this.totalItems = totalItems;
        this.page = page;
        this.size = size;
        this.totalPages = size > 0 ? (int) Math.ceil((double) totalItems / size) : 0;
    }

    // Constructor đầy đủ khi có thống kê
    public PageResponse(List<T> items, long totalItems, int page, int size,
                        Map<String, Long> groupCounts,
                        Map<String, Long> loaiCounts,
                        Map<String, Long> trangThaiCounts) {
        this(items, totalItems, page, size);
        this.groupCounts = groupCounts;
        this.loaiCounts = loaiCounts;
        this.trangThaiCounts = trangThaiCounts;
    }

    // Getter & Setter giữ nguyên tên cũ
    public List<T> getItems() { return items; }
    public void setItems(List<T> items) { this.items = items; }

    public long getTotalItems() { return totalItems; }
    public void setTotalItems(long totalItems) { this.totalItems = totalItems; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public Map<String, Long> getGroupCounts() { return groupCounts; }
    public void setGroupCounts(Map<String, Long> groupCounts) { this.groupCounts = groupCounts; }

    public Map<String, Long> getLoaiCounts() { return loaiCounts; }
    public void setLoaiCounts(Map<String, Long> loaiCounts) { this.loaiCounts = loaiCounts; }

    public Map<String, Long> getTrangThaiCounts() { return trangThaiCounts; }
    public void setTrangThaiCounts(Map<String, Long> trangThaiCounts) { this.trangThaiCounts = trangThaiCounts; }
}