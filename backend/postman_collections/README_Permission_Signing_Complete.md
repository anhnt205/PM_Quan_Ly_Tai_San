# Hướng dẫn sử dụng Permission Signing APIs - Hoàn chỉnh

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

## Lệnh cURL - Hoàn chỉnh

### 1. Kiểm tra quyền ký bàn giao tài sản

#### 1.1. Kiểm tra quyền ký cho admin
```bash
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json"
```

#### 1.2. Kiểm tra quyền ký cho user thường
```bash
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts002?tenDangNhap=user001" \
  -H "Accept: application/json"
```

#### 1.3. Kiểm tra quyền ký với ID khác
```bash
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts003?tenDangNhap=manager" \
  -H "Accept: application/json"
```

### 2. Kiểm tra quyền ký điều động tài sản

#### 2.1. Kiểm tra quyền ký cho admin
```bash
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json"
```

#### 2.2. Kiểm tra quyền ký cho user thường
```bash
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts002?tenDangNhap=user001" \
  -H "Accept: application/json"
```

#### 2.3. Kiểm tra quyền ký với ID khác
```bash
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts003?tenDangNhap=manager" \
  -H "Accept: application/json"
```

### 3. Với authentication (nếu cần)

#### 3.1. Với Bearer token
```bash
# Bàn giao tài sản
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Điều động tài sản
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3.2. Với Basic auth
```bash
# Bàn giao tài sản
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -u "username:password"

# Điều động tài sản
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -u "username:password"
```

### 4. Test với các trường hợp khác nhau

#### 4.1. Test với ID không tồn tại
```bash
# Bàn giao tài sản
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/invalid_id?tenDangNhap=admin" \
  -H "Accept: application/json"

# Điều động tài sản
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/invalid_id?tenDangNhap=admin" \
  -H "Accept: application/json"
```

#### 4.2. Test với user không có quyền
```bash
# Bàn giao tài sản
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=guest" \
  -H "Accept: application/json"

# Điều động tài sản
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=guest" \
  -H "Accept: application/json"
```

#### 4.3. Test với user đã ký
```bash
# Bàn giao tài sản
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=signed_user" \
  -H "Accept: application/json"

# Điều động tài sản
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=signed_user" \
  -H "Accept: application/json"
```

## Ví dụ Response

### 1. Có thể ký (Permission = 0)
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

### 2. Chờ người trước ký (Permission = 1)
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

### 3. Không nằm trong flow ký (Permission = 2)
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": {
        "permission": 2,
        "permissionDescription": "Không nằm trong flow ký",
        "itemId": "bgts001",
        "tenDangNhap": "guest"
    },
    "count": 1
}
```

### 4. Đã ký (Permission = 3)
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": {
        "permission": 3,
        "permissionDescription": "Đã ký",
        "itemId": "ddts001",
        "tenDangNhap": "signed_user"
    },
    "count": 1
}
```

### 5. Có thể ban hành quyết định (Permission = 5)
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": {
        "permission": 5,
        "permissionDescription": "Có thể ban hành quyết định",
        "itemId": "bgts001",
        "tenDangNhap": "admin"
    },
    "count": 1
}
```

### 6. Lỗi không tìm thấy tài liệu
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

## Script Test tự động

### Windows Batch Script
```batch
@echo off
echo Testing Permission Signing APIs...

echo.
echo 1. Testing BanGiaoTaiSan - Admin
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" -H "Accept: application/json"

echo.
echo 2. Testing BanGiaoTaiSan - User
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts002?tenDangNhap=user001" -H "Accept: application/json"

echo.
echo 3. Testing DieuDongTaiSan - Admin
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" -H "Accept: application/json"

echo.
echo 4. Testing DieuDongTaiSan - User
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts002?tenDangNhap=user001" -H "Accept: application/json"

echo.
echo Testing completed!
pause
```

### Linux/Mac Shell Script
```bash
#!/bin/bash
echo "Testing Permission Signing APIs..."

echo ""
echo "1. Testing BanGiaoTaiSan - Admin"
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json"

echo ""
echo "2. Testing BanGiaoTaiSan - User"
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts002?tenDangNhap=user001" \
  -H "Accept: application/json"

echo ""
echo "3. Testing DieuDongTaiSan - Admin"
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json"

echo ""
echo "4. Testing DieuDongTaiSan - User"
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts002?tenDangNhap=user001" \
  -H "Accept: application/json"

echo ""
echo "Testing completed!"
```

## Lưu ý
- API trả về thông tin chi tiết về quyền ký của người dùng
- Permission code giúp frontend hiển thị UI phù hợp
- Cần kiểm tra quyền trước khi cho phép người dùng thực hiện ký duyệt
- Tên đăng nhập phải chính xác và tồn tại trong hệ thống
- Có thể sử dụng script test để kiểm tra nhanh tất cả các trường hợp
