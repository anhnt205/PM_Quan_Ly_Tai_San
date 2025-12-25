import { UploadFile, Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';

interface Props {
    label?: string; // Text hiển thị (VD: Nhấn để chọn file...)
    onChange?: (file: File | null) => void; // Hàm callback trả file về cha
    accept?: string; // Định dạng file cho phép (VD: .png, .jpg)
    name?: string; // Tên field (dùng cho formik)
    disabled?: boolean; // Vô hiệu hóa nút upload
}

export default function UploadButton({
    label = "Nhấn để chọn file chữ ký (.png, .jpg...)",
    onChange,
    accept = ".png, .jpg, .jpeg",
    name,
    disabled = false
}: Props) {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);
            if (onChange) onChange(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Ngăn kích hoạt lại input file
        setFileName(null);
        if (onChange) onChange(null);
    };
    
    return (
        <Box>{disabled ? (
            <img src="" alt="" />
            
        ) : (
        <Button
            component="label" // Biến button thành label để kích hoạt input hidden
            fullWidth
            variant="outlined"
            startIcon={!fileName && <UploadFile color="success" />} // Ẩn icon upload khi đã có file
            sx={{
                justifyContent: fileName ? 'space-between' : 'flex-start', // Căn chỉnh lại khi có file
                textTransform: 'none',
                color: fileName ? '#333' : '#888', // Đổi màu chữ khi có file
                backgroundColor: '#f5f5f5', // Màu nền xám nhạt giống design
                borderColor: '#e0e0e0', // Viền nhạt
                height: '40px',
                padding: '4px 12px',
                '&:hover': {
                    backgroundColor: '#eeeeee',
                    borderColor: '#bdbdbd'
                }
            }}
        >
            {/* Hiển thị tên file hoặc label */}
            <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
                {fileName || label}
            </Typography>

            {/* Input file bị ẩn */}
            <input
                name={name}
                type="file"
                hidden
                accept={accept}
                onChange={handleFileChange}
                onClick={(e) => (e.target as HTMLInputElement).value = ''} // Reset để chọn lại file cũ được
            />

            {/* Nút xóa file (chỉ hiện khi đã chọn file) */}
            {fileName && (
                <IconButton size="small" onClick={handleRemove} color="error">
                    <Delete fontSize="small" />
                </IconButton>
            )}
        </Button>)}
        </Box>
    );
}