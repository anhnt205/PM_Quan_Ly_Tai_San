import { UploadFile, Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import imageCompression from "browser-image-compression";
import React, { ChangeEvent, useState } from "react";
import api from "../../config/api.config";
import { useGetFileQuery, useStaffMutation } from "../../pages/Staff/Mutation";
import S3Service from "../../services/S3Service";

interface Props {
  label?: string; // Text hiển thị (VD: Nhấn để chọn file...)
  onChange?: (file: string) => void; // Hàm callback trả file về cha
  accept?: string; // Định dạng file cho phép (VD: .png, .jpg)
  name?: string; // Tên field (dùng cho formik)
  disabled?: boolean; // Vô hiệu hóa nút upload
  nameFile?: string;
}

// ponytail: using native canvas API to resize images to avoid complex dependencies
const resizeImageCanvas = (
  file: File,
  targetW = 300,
  targetH = 150,
): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // giữ nền trong suốt
        ctx.clearRect(0, 0, targetW, targetH);

        // scale fit trong khung targetW x targetH, giữ tỉ lệ, canh giữa
        const scale = Math.min(targetW / img.width, targetH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = (targetH - drawH) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(
            new File([blob], file.name, {
              type: "image/png",
              lastModified: Date.now(),
            }),
          );
        }, "image/png");
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export default function UploadButton({
  label = "Nhấn để chọn file chữ ký (.png, .jpg...)",
  onChange,
  accept = ".png, .jpg, .jpeg",
  name,
  disabled = false,
  nameFile,
}: Props) {

  const [fileName, setFileName] = useState<string | null | undefined>(nameFile);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      if (file) {
        try {
          if (
            file.type.startsWith("image/") ||
            /\.(png|jpe?g)$/i.test(file.name)
          ) {
            file = await resizeImageCanvas(file);
          }
          const key = await S3Service.put({
            name: file.name,
            file: file,
            type: "chuky", // Hoặc logic để xác định loại file
          });

          if (key) {
            setFileName(key);
            if (onChange) onChange(key);
          }
        } catch (error) {
          console.error("Upload thất bại:", error);
        }
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn kích hoạt lại input file
    setFileName(null);
    if (onChange) onChange("");
  };

  const { data: fileUrl } = useGetFileQuery(nameFile);
  return (
    <Box>
      {disabled ? (
        <img src={fileUrl} alt="" height={30} />
      ) : (
        <Button
          component="label" // Biến button thành label để kích hoạt input hidden
          fullWidth
          variant="outlined"
          startIcon={!fileName && <UploadFile color="success" />} // Ẩn icon upload khi đã có file
          sx={{
            justifyContent: fileName ? "space-between" : "flex-start", // Căn chỉnh lại khi có file
            textTransform: "none",
            color: fileName ? "#333" : "#888", // Đổi màu chữ khi có file
            backgroundColor: "#f5f5f5", // Màu nền xám nhạt giống design
            borderColor: "#e0e0e0", // Viền nhạt
            height: "40px",
            padding: "4px 12px",
            "&:hover": {
              backgroundColor: "#eeeeee",
              borderColor: "#bdbdbd",
            },
          }}
        >
          {/* Hiển thị tên file hoặc label */}
          <Typography variant="body2" noWrap sx={{ maxWidth: "80%" }}>
            {fileName || label}
          </Typography>

          {/* Input file bị ẩn */}
          <input
            name={name}
            type="file"
            hidden
            accept={accept}
            onChange={handleFileChange}
            onClick={(e) => ((e.target as HTMLInputElement).value = "")} // Reset để chọn lại file cũ được
          />

          {/* Nút xóa file (chỉ hiện khi đã chọn file) */}
          {fileName && (
            <IconButton size="small" onClick={handleRemove} color="error">
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Button>
      )}
    </Box>
  );
}
