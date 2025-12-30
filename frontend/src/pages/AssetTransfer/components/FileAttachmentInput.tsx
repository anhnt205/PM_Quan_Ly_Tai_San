import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  styled,
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
  field: string;
  disabled?: boolean;
}

const FileAttachmentInput: React.FC<FileAttachmentInputProps> = ({
  formik,
  field,
  disabled,
}) => {
  const fileName = formik.values[field];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue(field, file.name);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        alignItems="stretch" // Đảm bảo nút và input cao bằng nhau
        sx={{ width: "100%" }}
      >
        <StyledTextField
          fullWidth
          size="small"
          placeholder="Chưa chọn tệp"
          value={fileName || ""}
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
          disabled={disabled}
          startIcon={<CloudUpload />}
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
          Chọn tệp
          <input type="file" hidden onChange={handleFileChange} />
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
