import React, { Dispatch, SetStateAction, useState } from "react";
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
import { useAssetTranferMutation } from "../../pages/AssetTransfer/Mutation";
import { getIn } from "formik";
import imageCompression from "browser-image-compression";
import api from "../../config/api.config";
import { useStaffMutation } from "../../pages/Staff/Mutation";
import S3Service from "../../services/S3Service";

// Style cho Input hiển thị tên file
const StyledTextField = styled(TextField)({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "4px 0 0 4px",
    "& fieldset": {
      borderRight: "none",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "14px",
    padding: "10px 14px",
  },
});

interface FileAttachmentInputProps {
  formik: any;
  fileName: string; // Lưu tên file để hiển thị (string)
  filePath?: string; // Lưu dữ liệu file thực tế (File object)
  disabled?: boolean;
  setDocument: Dispatch<SetStateAction<File | string | any>>;
}

export default function FileAttachmentInput({
  formik,
  fileName,
  filePath,
  disabled,
  setDocument,
}: FileAttachmentInputProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const currentValue = formik && fileName ? getIn(formik.values, fileName) : "";

  const fieldError = formik && fileName ? getIn(formik.errors, fileName) : "";

  const fieldTouched =
    formik && fileName ? getIn(formik.touched, fileName) : false;
  // setDocument(currentValue)
  // Giả sử hàm này lấy từ custom hook của bạn
  const { convertDocxToPdf } = useAssetTranferMutation();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedFileName = file.name.toLowerCase();
    const isPdf = uploadedFileName.endsWith(".pdf");
    const isDocx = uploadedFileName.endsWith(".docx");

    // 1. Kiểm tra định dạng
    if (!isPdf && !isDocx) {
      setUploadError("Chỉ hỗ trợ file .pdf hoặc .docx");
      return;
    }

    setUploadError(null);

    // 2. Nếu là PDF: Lưu trực tiếp
    if (isPdf) {
      // const key = await S3Service.put({
      //   name: file.name,
      //   file: file,
      //   type: "tailieu", // Hoặc logic để xác định loại file
      // });
      // Store the File object directly, S3 upload will happen on form submission
      // const key = await S3Service.put({ name: file.name, file: file, type: "tailieu" });

      formik.setFieldError(fileName, undefined);
      formik.setFieldTouched(fileName, true, false);
      formik.setFieldValue(fileName, file.name);
      // if (key) formik.setFieldValue(filePath, key);
      setDocument(file);
      return;
    }

    // 3. Nếu là DOCX: Tiến hành convert
    if (isDocx) {
      try {
        setIsConverting(true);

        // Gọi API và nhận về Blob
        const blobData = await convertDocxToPdf(file);

        if (blobData) {
          // Tạo tên file mới: .docx -> .pdf
          const newFileName = file.name.replace(/\.docx$/i, ".pdf");

          // Chuyển đổi Blob thành đối tượng File
          const convertedFile = new File([blobData], newFileName, {
            type: "application/pdf",
          });

          // Gọi hàm upload với file đã convert
          // const key = await S3Service.put({
          //   name: file.name,
          //   file: convertedFile,
          //   type: "tailieu", // Hoặc logic để xác định loại file
          // });
          // Cập nhật Formik
          // Store the converted File object directly, S3 upload will happen on form submission
          formik.setFieldError(fileName, undefined);
          formik.setFieldTouched(fileName, true, false);
          formik.setFieldValue(fileName, newFileName);
          // if (filePath) formik.setFieldValue(filePath, key);
          setDocument(convertedFile);
        }
      } catch (error) {
        setUploadError(
          "Không thể chuyển đổi file DOCX sang PDF. Vui lòng thử lại.",
        );
        formik.setFieldValue(fileName, "");
        formik.setFieldValue(filePath, "");
      } finally {
        setIsConverting(false);
        // Reset input file để có thể chọn lại cùng 1 file nếu cần
        event.target.value = "";
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {uploadError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {uploadError}
        </Alert>
      )}

      <Box display="flex" alignItems="flex-start">
        <StyledTextField
          fullWidth
          size="small"
          placeholder={isConverting ? "Đang xử lý..." : "Chưa chọn tệp"}
          value={currentValue}
          error={Boolean(fieldTouched && fieldError)}
          helperText={fieldTouched && fieldError ? fieldError : ""}
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
          size="small"
          component="label"
          variant="contained"
          disabled={disabled || isConverting}
          startIcon={
            isConverting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CloudUpload />
            )
          }
          sx={{
            bgcolor: "#5cb85c",
            whiteSpace: "nowrap",
            px: 3,
            borderRadius: "0 4px 4px 0",
            boxShadow: "none",
            "&:hover": { bgcolor: "#4cae4c", boxShadow: "none" },
          }}
        >
          {isConverting ? "Đang convert..." : "Chọn tệp"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".pdf,.docx"
          />
        </Button>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 0.5,
          fontStyle: "italic",
          color: "text.secondary",
        }}
      >
        Hệ thống sẽ tự động chuyển đổi .docx sang .pdf
      </Typography>
    </Box>
  );
}
