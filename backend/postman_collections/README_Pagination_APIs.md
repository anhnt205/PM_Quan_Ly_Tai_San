# Hướng dẫn sử dụng Postman Collection cho Pagination APIs

## Tổng quan
Collection này chứa tất cả các API pagination cho hệ thống quản lý tài sản.

## Cài đặt

### 1. Import Collection
- Mở Postman
- Click "Import" 
- Chọn file `Pagination_APIs.postman_collection.json`

### 2. Import Environment
- Click "Import" 
- Chọn file `Pagination_Environment.postman_environment.json`
- Chọn environment "Pagination APIs Environment" trong dropdown

## Cấu hình Environment Variables

Cập nhật các biến trong environment:

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `base_url` | URL base của API server | `http://localhost:8080` |
| `idcongty` | ID công ty để lọc dữ liệu | `company-123` |

## Danh sách APIs

### 1. BanGiaoCCDCVatTu - Pagination
- **Endpoint**: `GET /api/bangiaoccdcvattu/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`
- **SortBy options**: `banggiaoccdcvattu`, `quyetdinhdieudongso`, `ngaybangiao`, `ngaytao`, `ngaycapnhat`

### 2. BanGiaoTaiSan - Pagination
- **Endpoint**: `GET /api/bangiaotaisan/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`

### 3. CCDCVatTu - Pagination
- **Endpoint**: `GET /api/ccdcvattu/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`
- **SortBy options**: `ten`, `ngaynhap`, `ngaycapnhat`

### 4. DieuDongCCDCVatTu - Pagination
- **Endpoint**: `GET /api/dieudongccdcvattu/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`
- **SortBy options**: `tenphieu`, `soquyetdinh`, `ngaytao`, `ngaycapnhat`

### 5. DieuDongTaiSan - Pagination
- **Endpoint**: `GET /api/dieudongtaisan/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`
- **SortBy options**: `tenphieu`, `soquyetdinh`, `ngaytao`, `ngaycapnhat`

### 6. NhanVien - Pagination
- **Endpoint**: `GET /api/nhanvien/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`
- **SortBy options**: `hoten`, `ngaytao`, `ngaycapnhat`

### 7. TaiSan - Pagination
- **Endpoint**: `GET /api/taisan/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`
- **SortBy options**: `ten`, `ngaytao`, `ngaycapnhat`

### 8. CongTy - Pagination
- **Endpoint**: `GET /api/congty/paged`
- **Tham số bắt buộc**: Không có
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`
- **SortBy options**: `tencongty`, `tenviettat`, `email`, `masothue`, `ngaytao`, `ngaycapnhat`

### 9. DuAn - Pagination
- **Endpoint**: `GET /api/duan/paged`
- **Tham số bắt buộc**: `idcongty`
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`

### 10. KhauHao - Pagination
- **Endpoint**: `GET /api/khauhao/paged`
- **Tham số bắt buộc**: Không có
- **Tham số tùy chọn**: `page`, `size`, `sortBy`, `sortDir`

## Tham số chung

### Pagination Parameters
| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| `page` | int | 0 | Số trang (bắt đầu từ 0) |
| `size` | int | 20 | Số lượng bản ghi mỗi trang |
| `sortBy` | string | `ngaycapnhat` | Trường sắp xếp |
| `sortDir` | string | `desc` | Hướng sắp xếp (`asc` hoặc `desc`) |

### Response Format
```json
{
  "items": [...],
  "totalItems": 100,
  "page": 0,
  "size": 20,
  "totalPages": 5
}
```

## Ví dụ sử dụng

### 1. Lấy trang đầu tiên với 20 bản ghi
```
GET /api/taisan/paged?idcongty=company-123&page=0&size=20
```

### 2. Lấy trang thứ 2 với 10 bản ghi, sắp xếp theo tên
```
GET /api/taisan/paged?idcongty=company-123&page=1&size=10&sortBy=ten&sortDir=asc
```

### 3. Lấy tất cả công ty, sắp xếp theo tên công ty
```
GET /api/congty/paged?page=0&size=50&sortBy=tencongty&sortDir=asc
```

## Lưu ý
- Tất cả các API đều trả về response theo format `PageResponse<T>`
- Tham số `idcongty` là bắt buộc cho hầu hết các API (trừ CongTy và KhauHao)
- Giá trị mặc định cho `page` là 0, `size` là 20
- Giá trị mặc định cho `sortBy` thường là `ngaycapnhat`, `sortDir` là `desc`
