# Hướng dẫn sử dụng Permission Signing APIs

## Tổng quan
APIs này cho phép kiểm tra quyền ký duyệt của người dùng đối với các tài liệu bàn giao tài sản và điều động tài sản.

## Cài đặt

### Import Postman Collection
- Mở Postman
- Click "Import" 
- Chọn file `Permission_Signing_APIs.postman_collection.json`

## Danh sách APIs

### 1. BanGiaoTaiSan - Get Permission Signing
- **Endpoint**: `GET /api/bangiaotaisan/permission-signing/{id}`
- **Mô tả**: Kiểm tra quyền ký duyệt của người dùng đối với bàn giao tài sản
- **Parameters**: 
  - `id`: ID của bàn giao tài sản (path parameter)
  - `tenDangNhap`: Tên đăng nhập của người dùng (query parameter)

### 2. DieuDongTaiSan - Get Permission Signing
- **Endpoint**: `GET /api/dieudongtaisan/permission-signing/{id}`
- **Mô tả**: Kiểm tra quyền ký duyệt của người dùng đối với điều động tài sản
- **Parameters**: 
  - `id`: ID của điều động tài sản (path parameter)
  - `tenDangNhap`: Tên đăng nhập của người dùng (query parameter)

## Response Format

### Success Response
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": {
        "permission": 0,
        "permissionDescription": "Có thể ký",
        "itemId": "bgts001",
        "tenDangNhap": "admin"
    },
    "count": 1
}
```

### Error Response
```json
{
    "success": false,
    "message": "Không tìm thấy bàn giao tài sản với ID: bgts001",
    "data": null,
    "count": 0
}
```

## Permission Codes

| Code | Mô tả | Ý nghĩa |
|------|-------|---------|
| 0 | Có thể ký | Người dùng có thể thực hiện ký duyệt |
| 1 | Chờ người trước ký | Phải chờ người trước trong flow ký duyệt |
| 2 | Không nằm trong flow ký | Người dùng không có quyền ký tài liệu này |
| 3 | Đã ký | Người dùng đã thực hiện ký duyệt |
| 4 | Đã ban hành quyết định / Đã tạo phiếu | Đã hoàn thành vai trò của mình |
| 5 | Có thể ban hành quyết định / Có thể tạo phiếu | Có thể thực hiện vai trò đặc biệt |

## Lệnh cURL

### 1. Kiểm tra quyền ký bàn giao tài sản
```bash
# Kiểm tra quyền ký cho bàn giao tài sản
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json"

# Ví dụ với ID khác
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts002?tenDangNhap=user001" \
  -H "Accept: application/json"
```

### 2. Kiểm tra quyền ký điều động tài sản
```bash
# Kiểm tra quyền ký cho điều động tài sản
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json"

# Ví dụ với ID khác
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts002?tenDangNhap=user001" \
  -H "Accept: application/json"
```

### 3. Với authentication (nếu cần)
```bash
# Với Bearer token
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Với Basic auth
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -u "username:password"
```

## Ví dụ sử dụng

### 1. Kiểm tra quyền ký cho admin
```bash
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin"
```

**Response:**
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": {
        "permission": 0,
        "permissionDescription": "Có thể ký",
        "itemId": "bgts001",
        "tenDangNhap": "admin"
    },
    "count": 1
}
```

### 2. Kiểm tra quyền ký cho user thường
```bash
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=user001"
```

**Response:**
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": {
        "permission": 1,
        "permissionDescription": "Chờ người trước ký",
        "itemId": "ddts001",
        "tenDangNhap": "user001"
    },
    "count": 1
}
```

### 3. Trường hợp không tìm thấy tài liệu
```bash
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/invalid_id?tenDangNhap=admin"
```

**Response:**
```json
{
    "success": false,
    "message": "Không tìm thấy bàn giao tài sản với ID: invalid_id",
    "data": null,
    "count": 0
}
```

## Flow ký duyệt

### BanGiaoTaiSan
1. **Đại diện đơn vị ban hành QĐ** - Xác nhận ban hành quyết định
2. **Đại diện bên giao** - Ký xác nhận bên giao
3. **Đại diện bên nhận** - Ký xác nhận bên nhận
4. **Người ký bổ sung** - Các người ký khác (nếu có)

### DieuDongTaiSan
1. **Người lập phiếu** - Tạo và ký phiếu điều động
2. **Người duyệt cấp phòng** - Duyệt cấp phòng ban
3. **Người ký bổ sung** - Các người ký khác (nếu có)
4. **Người phê duyệt (Giám đốc)** - Phê duyệt cuối cùng

## Lưu ý
- API trả về thông tin chi tiết về quyền ký của người dùng
- Permission code giúp frontend hiển thị UI phù hợp
- Cần kiểm tra quyền trước khi cho phép người dùng thực hiện ký duyệt
- Tên đăng nhập phải chính xác và tồn tại trong hệ thống
