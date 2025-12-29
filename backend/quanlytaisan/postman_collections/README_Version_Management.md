# Hướng dẫn sử dụng Version Management APIs

## Tổng quan
Hệ thống quản lý version cho phép theo dõi và quản lý các phiên bản của ứng dụng quản lý tài sản.

## Cài đặt

### 1. Tạo bảng Version
Chạy script SQL trong file `create_version_table.sql` để tạo bảng và dữ liệu mẫu.

### 2. Import Postman Collection
- Mở Postman
- Click "Import" 
- Chọn file `Version_Management_APIs.postman_collection.json`

## Cấu trúc dữ liệu

### Bảng Version
```sql
CREATE TABLE Version (
    Id VARCHAR(50) PRIMARY KEY,
    VersionName TEXT NOT NULL,
    VersionCode TEXT NOT NULL,
    Description TEXT,
    ReleaseDate DATETIME,
    IsActive BOOLEAN DEFAULT TRUE,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao VARCHAR(50),
    NguoiCapNhat VARCHAR(50)
);
```

### Model Version
```json
{
    "id": "v1_3_0",
    "versionName": "Version 1.3.0",
    "versionCode": "1.3.0",
    "description": "Cập nhật tính năng mới và sửa lỗi",
    "releaseDate": "2024-04-01T00:00:00",
    "isActive": true,
    "ngayTao": "2024-04-01 10:00:00",
    "ngayCapNhat": "2024-04-01 10:00:00",
    "nguoiTao": "admin",
    "nguoiCapNhat": "admin"
}
```

## Danh sách APIs

### 1. Lấy danh sách tất cả version
- **Endpoint**: `GET /api/version`
- **Mô tả**: Lấy danh sách tất cả version (bao gồm cả active và inactive)
- **Response**: Danh sách version được sắp xếp theo ngày cập nhật mới nhất

### 2. Lấy danh sách version đang hoạt động
- **Endpoint**: `GET /api/version/active`
- **Mô tả**: Lấy danh sách các version đang được kích hoạt
- **Response**: Danh sách version active

### 3. Lấy version mới nhất
- **Endpoint**: `GET /api/version/latest`
- **Mô tả**: Lấy version mới nhất đang hoạt động
- **Response**: Thông tin version mới nhất

### 4. Lấy version theo ID
- **Endpoint**: `GET /api/version/{id}`
- **Mô tả**: Lấy thông tin chi tiết của một version theo ID
- **Parameters**: 
  - `id`: ID của version (ví dụ: v1_3_0)

### 5. Lấy version theo mã version
- **Endpoint**: `GET /api/version/code/{versionCode}`
- **Mô tả**: Lấy thông tin version theo mã version
- **Parameters**: 
  - `versionCode`: Mã version (ví dụ: 1.3.0)

### 6. Tạo version mới
- **Endpoint**: `POST /api/version`
- **Mô tả**: Tạo một version mới
- **Body**:
```json
{
    "versionName": "Version 1.3.0",
    "versionCode": "1.3.0",
    "description": "Cập nhật tính năng mới và sửa lỗi",
    "releaseDate": "2024-04-01T00:00:00",
    "isActive": true,
    "nguoiTao": "admin",
    "nguoiCapNhat": "admin"
}
```

### 7. Cập nhật version
- **Endpoint**: `PUT /api/version/{id}`
- **Mô tả**: Cập nhật thông tin của một version
- **Parameters**: 
  - `id`: ID của version cần cập nhật
- **Body**: Tương tự như tạo mới

### 8. Xóa version
- **Endpoint**: `DELETE /api/version/{id}`
- **Mô tả**: Xóa hoàn toàn một version khỏi hệ thống
- **Parameters**: 
  - `id`: ID của version cần xóa

### 9. Vô hiệu hóa version
- **Endpoint**: `PUT /api/version/{id}/deactivate`
- **Mô tả**: Vô hiệu hóa một version (không xóa khỏi DB)
- **Parameters**: 
  - `id`: ID của version cần vô hiệu hóa

### 10. Kích hoạt version
- **Endpoint**: `PUT /api/version/{id}/activate`
- **Mô tả**: Kích hoạt lại một version đã bị vô hiệu hóa
- **Parameters**: 
  - `id`: ID của version cần kích hoạt

### 11. Thống kê version
- **Endpoint**: `GET /api/version/stats`
- **Mô tả**: Lấy thống kê về số lượng version
- **Response**:
```json
{
    "totalVersions": 10,
    "activeVersions": 8,
    "inactiveVersions": 2
}
```

## Quy tắc Version Code

### Định dạng Semantic Versioning
Version code phải tuân theo định dạng: `major.minor.patch`

- **major**: Thay đổi lớn, có thể không tương thích ngược
- **minor**: Thêm tính năng mới, tương thích ngược
- **patch**: Sửa lỗi, tương thích ngược

### Ví dụ:
- `1.0.0` - Phiên bản đầu tiên
- `1.1.0` - Thêm tính năng mới
- `1.1.1` - Sửa lỗi
- `2.0.0` - Thay đổi lớn

## ID Generation

ID của version được tự động tạo từ version code:
- Version code: `1.3.0` → ID: `v1_3_0`
- Version code: `2.0.1` → ID: `v2_0_1`

## Response Format

Tất cả API đều trả về response theo format chuẩn:

### Success Response
```json
{
    "success": true,
    "message": "Thông báo thành công",
    "data": {...},
    "count": 1
}
```

### Error Response
```json
{
    "success": false,
    "message": "Thông báo lỗi",
    "data": null,
    "count": 0
}
```

## Ví dụ sử dụng

### 1. Tạo version mới
```bash
curl -X POST http://localhost:8080/api/version \
  -H "Content-Type: application/json" \
  -d '{
    "versionName": "Version 1.4.0",
    "versionCode": "1.4.0",
    "description": "Thêm tính năng báo cáo nâng cao",
    "releaseDate": "2024-05-01T00:00:00",
    "isActive": true,
    "nguoiTao": "admin"
  }'
```

### 2. Lấy version mới nhất
```bash
curl -X GET http://localhost:8080/api/version/latest
```

### 3. Cập nhật version
```bash
curl -X PUT http://localhost:8080/api/version/v1_4_0 \
  -H "Content-Type: application/json" \
  -d '{
    "versionName": "Version 1.4.0 - Updated",
    "description": "Thêm tính năng báo cáo nâng cao và tối ưu hiệu suất",
    "nguoiCapNhat": "admin"
  }'
```

## Lưu ý
- Version code phải tuân theo định dạng semantic versioning
- ID sẽ được tự động tạo nếu không được cung cấp
- Tất cả thời gian được lưu theo định dạng ISO 8601
- Có thể vô hiệu hóa version thay vì xóa để giữ lại lịch sử
