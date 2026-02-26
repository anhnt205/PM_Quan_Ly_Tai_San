# Postman Collections cho Nguồn Kinh Phí API

## Tổng quan
Bộ sưu tập Postman này cung cấp các test cases đầy đủ cho API Nguồn Kinh Phí, bao gồm cả NguonKinhPhi và SetNguonKinhPhi.

## Danh sách Collections

### 1. NguonKinhPhiController.postman_collection.json
- **Mô tả**: Collection cơ bản cho API NguonKinhPhi
- **Chức năng**: 
  - GET, POST, PUT, DELETE operations
  - Batch operations
  - File upload (CSV/Excel)
- **Sử dụng**: Test các chức năng cơ bản của NguonKinhPhi API

### 2. SetNguonKinhPhiController.postman_collection.json
- **Mô tả**: Collection cơ bản cho API SetNguonKinhPhi
- **Chức năng**:
  - GET, POST, PUT, DELETE operations
  - Query by TaiSan ID, NguonKinhPhi ID
  - Get NguonKinhPhi detail by TaiSan ID
  - Batch operations
  - File upload (CSV/Excel)
- **Sử dụng**: Test các chức năng cơ bản của SetNguonKinhPhi API

### 3. NguonKinhPhi_Complete.postman_collection.json
- **Mô tả**: Collection đầy đủ với tất cả endpoints và test scenarios
- **Chức năng**:
  - Tất cả endpoints của cả 2 API
  - Test scenarios hoàn chỉnh
  - Workflow testing
  - Organized structure với folders
- **Sử dụng**: Test toàn diện và demo API

### 4. NguonKinhPhi_Quick_Test.postman_collection.json
- **Mô tả**: Collection đơn giản cho test nhanh
- **Chức năng**:
  - Essential endpoints only
  - Quick CRUD operations
  - File upload test
- **Sử dụng**: Test nhanh và development

### 5. NguonKinhPhi_Error_Test.postman_collection.json
- **Mô tả**: Collection cho test error handling và edge cases
- **Chức năng**:
  - Error scenarios testing
  - Edge cases testing
  - Security testing (SQL injection)
  - Invalid data testing
- **Sử dụng**: Test độ bền và bảo mật của API

### 6. KyTaiLieuController.postman_collection.json
- **Mô tả**: Collection đầy đủ cho API KyTaiLieu (Chữ ký tài liệu)
- **Chức năng**:
  - KyTaiLieu CRUD operations
  - NguoiKy management
  - TrangThai update
  - Complete workflow testing
  - Error testing
- **Sử dụng**: Test toàn diện chức năng chữ ký tài liệu

### 7. KyTaiLieu_Quick_Test.postman_collection.json
- **Mô tả**: Collection đơn giản cho test nhanh KyTaiLieu API
- **Chức năng**:
  - Essential KyTaiLieu operations
  - Essential NguoiKy operations
  - Quick workflow testing
- **Sử dụng**: Test nhanh và development cho chữ ký tài liệu

## Cách sử dụng

### 1. Import Collections
1. Mở Postman
2. Click "Import" button
3. Chọn file .json collection muốn import
4. Click "Import"

### 2. Cấu hình Environment Variables
Tạo environment với các variables sau:
```
baseUrl: http://localhost:8080
nguonKinhPhiId: nkp001
setNguonKinhPhiId: snkp001
taiSanId: ts001
```

### 3. Chạy Tests
1. Chọn collection muốn chạy
2. Click "Run" button
3. Chọn environment đã tạo
4. Click "Run" để bắt đầu test

## Test Scenarios

### Basic CRUD Test
1. Create → Read → Update → Delete
2. Test với valid data
3. Verify response format

### Batch Operations Test
1. Create multiple records
2. Delete multiple records
3. Verify batch response

### File Upload Test
1. Upload CSV file
2. Upload Excel file
3. Verify upload response với success/failure counts

### Error Handling Test
1. Test với invalid data
2. Test với non-existent IDs
3. Test với empty data
4. Test SQL injection protection

### Edge Cases Test
1. Very long strings
2. Special characters
3. Null values
4. Invalid file types

## Sample Data

### NguonKinhPhi Sample
```json
{
  "id": "nkp001",
  "ten": "Nguồn kinh phí 1",
  "note": "Ghi chú nguồn kinh phí 1"
}
```

### SetNguonKinhPhi Sample
```json
{
  "id": "snkp001",
  "idTaiSan": "ts001",
  "idNguonKinhPhi": "nkp001",
  "tenNguonKinhPhi": "Nguồn kinh phí 1"
}
```

### KyTaiLieu Sample
```json
{
  "id": "ktl001",
  "idTaiLieu": "tailieu001",
  "loaiKy": 1,
  "x": 100.5,
  "y": 200.3,
  "idNguoiKy": "nk001",
  "chuKySo": "base64_encoded_signature",
  "ngayKy": "2024-01-15 10:30:00",
  "stt": 1
}
```

### NguoiKy Sample
```json
{
  "id": "nk001",
  "idTaiLieu": "tailieu001",
  "idNguoiKy": "user001",
  "tenNguoiKy": "Nguyễn Văn A",
  "idPhongBan": "pb001",
  "trangThai": 0
}
```

## File Upload Format

### CSV Format cho NguonKinhPhi
```csv
Id,Ten,Note
nkp001,Nguồn kinh phí 1,Ghi chú nguồn kinh phí 1
nkp002,Nguồn kinh phí 2,Ghi chú nguồn kinh phí 2
```

### CSV Format cho SetNguonKinhPhi
```csv
Id,IdTaiSan,IdNguonKinhPhi,TenNguonKinhPhi
snkp001,ts001,nkp001,Nguồn kinh phí 1
snkp002,ts001,nkp002,Nguồn kinh phí 2
```

### CSV Format cho KyTaiLieu
```csv
Id,IdTaiLieu,LoaiKy,X,Y,IdNguoiKy,ChuKySo,NgayKy,Stt
ktl001,tailieu001,1,100.5,200.3,nk001,base64_signature_1,2024-01-15 10:30:00,1
ktl002,tailieu001,2,300.5,400.3,nk002,base64_signature_2,2024-01-15 11:30:00,2
```

### CSV Format cho NguoiKy
```csv
Id,IdTaiLieu,IdNguoiKy,TenNguoiKy,IdPhongBan,TrangThai
nk001,tailieu001,user001,Nguyễn Văn A,pb001,0
nk002,tailieu001,user002,Trần Thị B,pb002,1
```

## Lưu ý

1. **Base URL**: Đảm bảo server đang chạy trên port 8080
2. **File Path**: Các file CSV mẫu nằm trong thư mục `file_example/`
3. **Database**: Đảm bảo database đã được tạo với các bảng cần thiết
4. **Dependencies**: Đảm bảo tất cả dependencies đã được cài đặt

## Troubleshooting

### Lỗi Connection Refused
- Kiểm tra server có đang chạy không
- Kiểm tra port 8080 có bị chiếm không

### Lỗi 404 Not Found
- Kiểm tra endpoint URL
- Kiểm tra server có đang chạy đúng port không

### Lỗi 500 Internal Server Error
- Kiểm tra database connection
- Kiểm tra logs của server
- Kiểm tra data format

### File Upload Lỗi
- Kiểm tra file có tồn tại không
- Kiểm tra file format (CSV/Excel)
- Kiểm tra file size