# Hướng dẫn sử dụng DOCX to PDF Conversion APIs

## Tổng quan
APIs này cho phép upload file DOCX và convert sang PDF, cũng như các chức năng upload/download file khác.

## Cài đặt

### 1. Dependencies cần thiết
Thêm vào `pom.xml`:

```xml
<!-- Apache POI for DOCX processing -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.3</version>
</dependency>

<!-- iText for PDF generation -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itextpdf</artifactId>
    <version>5.5.13.3</version>
</dependency>
```

### 2. Import Postman Collection
- Mở Postman
- Click "Import" 
- Chọn file `DOCX_to_PDF_APIs.postman_collection.json`

## Danh sách APIs

### 1. Upload File
- **Endpoint**: `POST /api/upload`
- **Mô tả**: Upload file bất kỳ lên server
- **Parameters**: 
  - `file`: File cần upload (multipart/form-data)

### 2. Download File
- **Endpoint**: `GET /api/upload/download/{fileName}`
- **Mô tả**: Download file đã upload
- **Parameters**: 
  - `fileName`: Tên file cần download (path parameter)

### 3. Preview File
- **Endpoint**: `GET /api/upload/preview/{fileName}`
- **Mô tả**: Preview file trong browser
- **Parameters**: 
  - `fileName`: Tên file cần preview (path parameter)

### 4. Convert DOCX to PDF (Download)
- **Endpoint**: `POST /api/upload/docx-to-pdf`
- **Mô tả**: Upload file DOCX và download file PDF đã convert
- **Parameters**: 
  - `file`: File DOCX cần convert (multipart/form-data)

### 5. Convert DOCX to PDF (Return Bytes)
- **Endpoint**: `POST /api/upload/docx-to-pdf-bytes`
- **Mô tả**: Upload file DOCX và trả về PDF bytes trong JSON response
- **Parameters**: 
  - `file`: File DOCX cần convert (multipart/form-data)

### 6. Export JSON to Excel
- **Endpoint**: `POST /api/upload/export`
- **Mô tả**: Convert JSON data thành Excel file
- **Parameters**: 
  - `jsonList`: Danh sách JSON data (request body)
  - `sheetName`: Tên sheet (query parameter, optional)

## Response Format

### Upload File Success Response
```json
{
    "fileName": "document.docx",
    "filePath": "/path/to/uploads/document.docx"
}
```

### Convert DOCX to PDF Bytes Success Response
```json
{
    "success": true,
    "originalFileName": "document.docx",
    "pdfFileName": "document.pdf",
    "pdfBytes": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoK...",
    "fileSize": 12345,
    "message": "Convert thành công"
}
```

### Error Response
```json
{
    "success": false,
    "error": "Chỉ hỗ trợ file DOCX"
}
```

## Lệnh cURL

### 1. Upload File
```bash
curl -X POST "http://localhost:8080/api/upload" \
  -F "file=@/path/to/your/document.docx"
```

### 2. Download File
```bash
curl -X GET "http://localhost:8080/api/upload/download/document.docx" \
  -o "downloaded_document.docx"
```

### 3. Preview File
```bash
curl -X GET "http://localhost:8080/api/upload/preview/document.docx" \
  -H "Accept: */*"
```

### 4. Convert DOCX to PDF (Download)
```bash
curl -X POST "http://localhost:8080/api/upload/docx-to-pdf" \
  -F "file=@/path/to/your/document.docx" \
  -o "converted_document.pdf"
```

### 5. Convert DOCX to PDF (Return Bytes)
```bash
curl -X POST "http://localhost:8080/api/upload/docx-to-pdf-bytes" \
  -F "file=@/path/to/your/document.docx" \
  -H "Accept: application/json"
```

### 6. Export JSON to Excel
```bash
curl -X POST "http://localhost:8080/api/upload/export?sheetName=Data" \
  -H "Content-Type: application/json" \
  -d '[
    {
        "id": "1",
        "name": "Nguyễn Văn A",
        "age": 25,
        "department": "IT"
    },
    {
        "id": "2", 
        "name": "Trần Thị B",
        "age": 30,
        "department": "HR"
    }
  ]' \
  -o "exported_data.xlsx"
```

## Ví dụ sử dụng

### 1. Upload và Convert DOCX sang PDF
```bash
# Upload file DOCX
curl -X POST "http://localhost:8080/api/upload" \
  -F "file=@document.docx"

# Convert sang PDF và download
curl -X POST "http://localhost:8080/api/upload/docx-to-pdf" \
  -F "file=@document.docx" \
  -o "document.pdf"
```

### 2. Convert DOCX sang PDF và lấy bytes
```bash
curl -X POST "http://localhost:8080/api/upload/docx-to-pdf-bytes" \
  -F "file=@document.docx"
```

**Response:**
```json
{
    "success": true,
    "originalFileName": "document.docx",
    "pdfFileName": "document.pdf",
    "pdfBytes": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoK...",
    "fileSize": 12345,
    "message": "Convert thành công"
}
```

### 3. Sử dụng PDF bytes trong code
```javascript
// Lấy response từ API
const response = await fetch('/api/upload/docx-to-pdf-bytes', {
    method: 'POST',
    body: formData
});

const data = await response.json();

if (data.success) {
    // Decode base64 bytes
    const pdfBytes = atob(data.pdfBytes);
    
    // Tạo blob và download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.pdfFileName;
    a.click();
}
```

## Tính năng đặc biệt

### 1. Hỗ trợ tiếng Việt
- Sử dụng font Arial với encoding UTF-8
- Hỗ trợ đầy đủ ký tự tiếng Việt có dấu

### 2. Error Handling
- Kiểm tra file type (chỉ hỗ trợ .docx)
- Xử lý lỗi convert và trả về thông báo rõ ràng

### 3. Flexible Response
- API trả về PDF bytes để có thể xử lý linh hoạt
- Hỗ trợ cả download trực tiếp và lấy bytes

### 4. File Management
- Upload file vào thư mục uploads/
- Tự động tạo thư mục nếu chưa tồn tại
- Hỗ trợ preview và download file

## Lưu ý

### 1. Font Requirements
- Cần có font Arial trong hệ thống (Windows: `c:/windows/fonts/arial.ttf`)
- Có thể thay đổi đường dẫn font trong code nếu cần

### 2. File Size Limits
- Mặc định Spring Boot giới hạn file upload 1MB
- Có thể tăng giới hạn trong `application.properties`:
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 3. Memory Usage
- File được xử lý trong memory
- Với file lớn có thể cần tối ưu để tránh OutOfMemoryError

### 4. Supported DOCX Features
- Text content và paragraphs
- Basic formatting (bold, italic)
- Chưa hỗ trợ: tables, images, complex formatting

## Troubleshooting

### 1. Font không tìm thấy
```
Error: Font not found
```
**Giải pháp**: Kiểm tra đường dẫn font trong code hoặc thay đổi font khác

### 2. File quá lớn
```
Error: File too large
```
**Giải pháp**: Tăng giới hạn file size trong application.properties

### 3. DOCX file bị lỗi
```
Error: Invalid DOCX file
```
**Giải pháp**: Kiểm tra file DOCX có hợp lệ không, thử với file khác
