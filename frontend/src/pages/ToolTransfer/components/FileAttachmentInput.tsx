import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  styled,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CloudUpload, Description } from "@mui/icons-material";

// Thanh hiển thị tên file
const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1, // Để chiếm hết không gian còn lại
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "4px 0 0 4px",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
      borderRight: "none", // Bỏ viền phải để ghép khít với nút
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "14px",
    color: "rgba(0, 0, 0, 0.6)",
    padding: "10px 14px",
  },
}));

interface FileAttachmentInputProps {
  formik: any;
  fileName: string;
  filePath?: string;
  fileField?: string;
  disabled?: boolean;
  setDocument?: (doc: any) => void;
}

const FileAttachmentInput: React.FC<FileAttachmentInputProps> = ({
  formik,
  fileName: fileNameField,
  filePath,
  disabled,
  fileField = "AttachmentFile",
  setDocument,
}) => {
  const currentFileName = formik.values[fileNameField];
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Hàm convert DOCX sang PDF thông qua API
  const convertDocxToPdf = async (file: File): Promise<File | null> => {
    try {
      setIsConverting(true);
      setUploadError(null);

      // Tạo FormData gửi file lên backend
      const formData = new FormData();
      formData.append("file", file);

      // Lấy backend URL từ biến môi trường hoặc mặc định localhost
      const backendUrl =
        process.env.REACT_APP_BASE_API || "http://localhost:8080";
      console.log("Converting DOCX to PDF using backend:", backendUrl);

      // Gọi API backend để convert
      const response = await fetch(
        `${backendUrl}/upload/convert/docx-to-pdf`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        console.error("Response status:", response.status, response.statusText);
        const errorData = await response.text();
        console.error("Response data:", errorData);
        throw new Error(
          `Lỗi convert: ${response.status} ${response.statusText}`,
        );
      }

      // Nhận file PDF từ backend
      const pdfBlob = await response.blob();
      console.log("PDF blob size:", pdfBlob.size, "type:", pdfBlob.type);

      const pdfFileName = file.name.replace(/\.docx$/i, ".pdf");
      const pdfFile = new File([pdfBlob], pdfFileName, {
        type: "application/pdf",
      });

      console.log("Convert successful:", pdfFileName);
      return pdfFile;
    } catch (error) {
      console.error("Lỗi khi convert DOCX sang PDF:", error);
      setUploadError(
        error instanceof Error ? error.message : "Lỗi chuyển đổi file",
      );
      return null;
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      const isDocx =
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx");

      if (!isPdf && !isDocx) {
        setUploadError("Chỉ hỗ trợ file .pdf hoặc .docx");
        formik.setFieldValue(fileNameField, "");
        formik.setFieldValue(fileField, null);
        return;
      }

      if (isPdf) {
        formik.setFieldValue(fileNameField, file.name);
        formik.setFieldValue(fileField, file);
        if (setDocument) setDocument(file);
        setUploadError(null);
        return;
      }

      if (isDocx) {
        const pdfFile = await convertDocxToPdf(file);
        if (pdfFile) {
          formik.setFieldValue(fileNameField, pdfFile.name);
          formik.setFieldValue(fileField, pdfFile);
          if (setDocument) setDocument(pdfFile);
          setUploadError(null);
        } else {
          formik.setFieldValue(fileNameField, "");
          formik.setFieldValue(fileField, null);
        }
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Hiển thị lỗi nếu có */}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {uploadError}
        </Alert>
      )}

      <Box
        display="flex"
        alignItems="stretch"
        sx={{ width: "100%", position: "relative" }}
      >
        <StyledTextField
          fullWidth
          size="small"
          placeholder="Chưa chọn tệp"
          value={currentFileName || ""}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <Description sx={{ color: "#2e7d32", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          component="label"
          variant="contained"
          disabled={disabled || isConverting}
          startIcon={
            isConverting ? <CircularProgress size={20} /> : <CloudUpload />
          }
          sx={{
            bgcolor: "#5cb85c", // Màu xanh lá nhẹ
            color: "#fff",
            textTransform: "none",
            whiteSpace: "nowrap", // KHÔNG cho phép ngắt dòng chữ
            minWidth: "fit-content", // Chiều rộng vừa đủ với nội dung
            px: 3, // Tăng padding ngang để chữ không bị sát mép
            borderRadius: "0 4px 4px 0",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#4cae4c",
              boxShadow: "none",
            },
            "& .MuiButton-startIcon": {
              marginRight: "8px",
            },
          }}
        >
          {isConverting ? "Đang chuyển đổi..." : "Chọn tệp"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </Button>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 0.5,
          fontStyle: "italic",
          color: "rgba(0, 0, 0, 0.54)",
          fontSize: "12px",
        }}
      >
        Định dạng hỗ trợ: .pdf, .docx
      </Typography>
    </Box>
  );
};

export default FileAttachmentInput;
