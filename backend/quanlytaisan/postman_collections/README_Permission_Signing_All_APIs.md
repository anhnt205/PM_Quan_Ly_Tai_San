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

#### 1.1. Lấy quyền ký theo ID
- **Endpoint**: `GET /api/bangiaotaisan/permission-signing/{id}`
- **Mô tả**: Kiểm tra quyền ký duyệt của người dùng đối với một bàn giao tài sản cụ thể
- **Parameters**: 
  - `id`: ID của bàn giao tài sản (path parameter)
  - `tenDangNhap`: Tên đăng nhập của người dùng (query parameter)

#### 1.2. Lấy tất cả quyền ký của người dùng
- **Endpoint**: `GET /api/bangiaotaisan/permission-signing/?tenDangNhap={username}`
- **Mô tả**: Lấy danh sách tất cả bàn giao tài sản và quyền ký của người dùng
- **Parameters**: 
  - `tenDangNhap`: Tên đăng nhập của người dùng (query parameter)

### 2. DieuDongTaiSan - Get Permission Signing

#### 2.1. Lấy quyền ký theo ID
- **Endpoint**: `GET /api/dieudongtaisan/permission-signing/{id}`
- **Mô tả**: Kiểm tra quyền ký duyệt của người dùng đối với một điều động tài sản cụ thể
- **Parameters**: 
  - `id`: ID của điều động tài sản (path parameter)
  - `tenDangNhap`: Tên đăng nhập của người dùng (query parameter)

#### 2.2. Lấy tất cả quyền ký của người dùng
- **Endpoint**: `GET /api/dieudongtaisan/permission-signing/?tenDangNhap={username}`
- **Mô tả**: Lấy danh sách tất cả điều động tài sản và quyền ký của người dùng
- **Parameters**: 
  - `tenDangNhap`: Tên đăng nhập của người dùng (query parameter)

## Response Format

### Success Response - Single Item
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

### Success Response - Multiple Items
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": [
        {
            "id": "bgts001",
            "permission": 0,
            "permissionDescription": "Có thể ký",
            "tenDangNhap": "admin",
            "itemName": "Bàn giao tài sản 001",
            "quyetDinhDieuDongSo": "QD001",
            "trangThai": 1,
            "ngayTao": "2024-01-01 10:00:00",
            "ngayCapNhat": "2024-01-01 10:00:00",
            "tenDonViGiao": "Phòng IT",
            "tenDonViNhan": "Phòng Kế toán",
            "ngayBanGiao": "2024-01-15"
        },
        {
            "id": "bgts002",
            "permission": 1,
            "permissionDescription": "Chờ người trước ký",
            "tenDangNhap": "admin",
            "itemName": "Bàn giao tài sản 002",
            "quyetDinhDieuDongSo": "QD002",
            "trangThai": 1,
            "ngayTao": "2024-01-02 10:00:00",
            "ngayCapNhat": "2024-01-02 10:00:00",
            "tenDonViGiao": "Phòng IT",
            "tenDonViNhan": "Phòng Nhân sự",
            "ngayBanGiao": "2024-01-16"
        }
    ],
    "count": 2
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

### 1. BanGiaoTaiSan APIs

#### 1.1. Lấy quyền ký theo ID
```bash
# Kiểm tra quyền ký cho bàn giao tài sản cụ thể
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json"

# Ví dụ với user khác
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts002?tenDangNhap=user001" \
  -H "Accept: application/json"
```

#### 1.2. Lấy tất cả quyền ký của người dùng
```bash
# Lấy tất cả bàn giao tài sản và quyền ký của admin
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json"

# Lấy tất cả bàn giao tài sản và quyền ký của user001
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=user001" \
  -H "Accept: application/json"
```

### 2. DieuDongTaiSan APIs

#### 2.1. Lấy quyền ký theo ID
```bash
# Kiểm tra quyền ký cho điều động tài sản cụ thể
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json"

# Ví dụ với user khác
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts002?tenDangNhap=user001" \
  -H "Accept: application/json"
```

#### 2.2. Lấy tất cả quyền ký của người dùng
```bash
# Lấy tất cả điều động tài sản và quyền ký của admin
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json"

# Lấy tất cả điều động tài sản và quyền ký của user001
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/?tenDangNhap=user001" \
  -H "Accept: application/json"
```

### 3. Với authentication (nếu cần)

#### 3.1. Với Bearer token
```bash
# Bàn giao tài sản - Single
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Bàn giao tài sản - All
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Điều động tài sản - Single
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Điều động tài sản - All
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3.2. Với Basic auth
```bash
# Bàn giao tài sản - Single
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -u "username:password"

# Bàn giao tài sản - All
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -u "username:password"

# Điều động tài sản - Single
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -u "username:password"

# Điều động tài sản - All
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json" \
  -u "username:password"
```

## Ví dụ sử dụng

### 1. Lấy quyền ký cho một bàn giao tài sản cụ thể
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

### 2. Lấy tất cả quyền ký của người dùng
```bash
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=admin"
```

**Response:**
```json
{
    "success": true,
    "message": "Lấy thông tin quyền ký thành công",
    "data": [
        {
            "id": "bgts001",
            "permission": 0,
            "permissionDescription": "Có thể ký",
            "tenDangNhap": "admin",
            "itemName": "Bàn giao tài sản 001",
            "quyetDinhDieuDongSo": "QD001",
            "trangThai": 1,
            "ngayTao": "2024-01-01 10:00:00",
            "ngayCapNhat": "2024-01-01 10:00:00",
            "tenDonViGiao": "Phòng IT",
            "tenDonViNhan": "Phòng Kế toán",
            "ngayBanGiao": "2024-01-15"
        },
        {
            "id": "bgts002",
            "permission": 1,
            "permissionDescription": "Chờ người trước ký",
            "tenDangNhap": "admin",
            "itemName": "Bàn giao tài sản 002",
            "quyetDinhDieuDongSo": "QD002",
            "trangThai": 1,
            "ngayTao": "2024-01-02 10:00:00",
            "ngayCapNhat": "2024-01-02 10:00:00",
            "tenDonViGiao": "Phòng IT",
            "tenDonViNhan": "Phòng Nhân sự",
            "ngayBanGiao": "2024-01-16"
        }
    ],
    "count": 2
}
```

### 3. Trường hợp không có dữ liệu
```bash
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=guest"
```

**Response:**
```json
{
    "success": true,
    "message": "Không có bàn giao tài sản nào cho người dùng này",
    "data": [],
    "count": 0
}
```

### 4. Trường hợp không tìm thấy tài liệu cụ thể
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

## Script Test tự động

### Windows Batch Script
```batch
@echo off
echo Testing Permission Signing APIs...

echo.
echo 1. Testing BanGiaoTaiSan - Single Item
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" -H "Accept: application/json"

echo.
echo 2. Testing BanGiaoTaiSan - All Items
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=admin" -H "Accept: application/json"

echo.
echo 3. Testing DieuDongTaiSan - Single Item
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" -H "Accept: application/json"

echo.
echo 4. Testing DieuDongTaiSan - All Items
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/?tenDangNhap=admin" -H "Accept: application/json"

echo.
echo Testing completed!
pause
```

### Linux/Mac Shell Script
```bash
#!/bin/bash
echo "Testing Permission Signing APIs..."

echo ""
echo "1. Testing BanGiaoTaiSan - Single Item"
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/bgts001?tenDangNhap=admin" \
  -H "Accept: application/json"

echo ""
echo "2. Testing BanGiaoTaiSan - All Items"
curl -X GET "http://localhost:8080/api/bangiaotaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json"

echo ""
echo "3. Testing DieuDongTaiSan - Single Item"
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/ddts001?tenDangNhap=admin" \
  -H "Accept: application/json"

echo ""
echo "4. Testing DieuDongTaiSan - All Items"
curl -X GET "http://localhost:8080/api/dieudongtaisan/permission-signing/?tenDangNhap=admin" \
  -H "Accept: application/json"

echo ""
echo "Testing completed!"
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
- API "Get All" trả về danh sách tất cả tài liệu liên quan đến người dùng
- Có thể sử dụng script test để kiểm tra nhanh tất cả các trường hợp
