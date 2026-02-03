import { Close, Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface ExpirationSettingDialogProps {
  open: boolean;
  onClose: () => void;
  initialConfig?: { thoiHanTaiLieu: number; ngayBaoHetHan: number };
  onConfirm?: (
    expirationDays: number,
    warningDays: number,
  ) => void | Promise<void>;
  loading?: boolean;
}

export default function ExpirationSettingDialog({
  open,
  onClose,
  initialConfig,
  onConfirm,
  loading = false,
}: ExpirationSettingDialogProps) {
  const [expirationDays, setExpirationDays] = useState<string>("0");
  const [warningDays, setWarningDays] = useState<string>("0");
  const [expirationFocused, setExpirationFocused] = useState(false);
  const [warningFocused, setWarningFocused] = useState(false);

  useEffect(() => {
    if (open && initialConfig) {
      setExpirationDays(String(initialConfig.thoiHanTaiLieu));
      setWarningDays(String(initialConfig.ngayBaoHetHan));
    }
  }, [open, initialConfig]);

  const MIN_VALUE = 1;
  const MAX_VALUE = 999;

  // Hàm chuẩn hóa giá trị trong khoảng cho phép
  const normalizeValue = (value: string): string => {
    if (value === "") return value;
    const num = parseInt(value);
    if (num < MIN_VALUE) return String(MIN_VALUE);
    if (num > MAX_VALUE) return String(MAX_VALUE);
    return String(num);
  };

  const handleIncreaseExpiration = () => {
    setExpirationDays((prev) => {
      const num = (parseInt(prev) || 0) + 1;
      return num > MAX_VALUE ? String(MAX_VALUE) : String(num);
    });
  };

  const handleDecreaseExpiration = () => {
    setExpirationDays((prev) => {
      const num = parseInt(prev) || 0;
      if (num <= MIN_VALUE) return "";
      return String(num - 1);
    });
  };

  const handleIncreaseWarning = () => {
    setWarningDays((prev) => {
      const num = (parseInt(prev) || 0) + 1;
      return num > MAX_VALUE ? String(MAX_VALUE) : String(num);
    });
  };

  const handleDecreaseWarning = () => {
    setWarningDays((prev) => {
      const num = parseInt(prev) || 0;
      if (num <= MIN_VALUE) return "";
      return String(num - 1);
    });
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số nguyên không âm hoặc để trống
    if (value === "" || /^\d+$/.test(value)) {
      setExpirationDays(normalizeValue(value));
    }
  };

  const handleWarningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số nguyên không âm hoặc để trống
    if (value === "" || /^\d+$/.test(value)) {
      setWarningDays(normalizeValue(value));
    }
  };

  const handleConfirm = async () => {
    const exp = parseInt(expirationDays) || 0;
    const warn = parseInt(warningDays) || 0;

    if (warn > exp) {
      // Bạn có thể dùng Alert của dự án tại đây
      alert("Số ngày báo trước không được lớn hơn thời hạn tài liệu!");
      return;
    }

    if (onConfirm) {
      await onConfirm(exp, warn);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "16px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 4 }}>
        {/* Tiêu đề */}
        <Typography
          variant="h5"
          sx={{
            color: "#1b8a4a",
            fontWeight: "bold",
            textAlign: "center",
            mb: 3,
          }}
        >
          Thiết lập thời gian hết hạn
        </Typography>

        {/* Mô tả 1 */}
        <Typography
          sx={{
            textAlign: "center",
            mb: 2,
            color: "#333",
          }}
        >
          Nhập số ngày để thiết lập thời gian hết hạn cho các biên bản
        </Typography>

        {/* Input số ngày hết hạn */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
          <IconButton
            onClick={handleDecreaseExpiration}
            sx={{
              backgroundColor: "#1b8a4a",
              color: "white",
              borderRadius: "8px",
              width: 48,
              height: 48,
              "&:hover": {
                backgroundColor: "#15703c",
              },
            }}
          >
            <Remove />
          </IconButton>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              py: 1.5,
              mx: 1,
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={expirationDays}
              onChange={handleExpirationChange}
              onFocus={() => setExpirationFocused(true)}
              onBlur={() => setExpirationFocused(false)}
              placeholder={expirationFocused ? "Nhập số" : ""}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                textAlign: "center",
                fontSize: "1.25rem",
                fontWeight: 500,
                fontFamily: "inherit",
                backgroundColor: "transparent",
              }}
            />
          </Box>
          <IconButton
            onClick={handleIncreaseExpiration}
            sx={{
              backgroundColor: "#1b8a4a",
              color: "white",
              borderRadius: "8px",
              width: 48,
              height: 48,
              "&:hover": {
                backgroundColor: "#15703c",
              },
            }}
          >
            <Add />
          </IconButton>
        </Box>

        {/* Mô tả 2 */}
        <Typography
          sx={{
            textAlign: "center",
            mb: 2,
            color: "#333",
          }}
        >
          Nhập số ngày báo hết hạn (tính theo ngày)
        </Typography>

        {/* Input số ngày báo hết hạn */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
          }}
        >
          <IconButton
            onClick={handleDecreaseWarning}
            sx={{
              backgroundColor: "#1b8a4a",
              color: "white",
              borderRadius: "8px",
              width: 48,
              height: 48,
              "&:hover": {
                backgroundColor: "#15703c",
              },
            }}
          >
            <Remove />
          </IconButton>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              py: 1.5,
              mx: 1,
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={warningDays}
              onChange={handleWarningChange}
              onFocus={() => setWarningFocused(true)}
              onBlur={() => setWarningFocused(false)}
              placeholder={warningFocused ? "Nhập số" : ""}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                textAlign: "center",
                fontSize: "1.25rem",
                fontWeight: 500,
                fontFamily: "inherit",
                backgroundColor: "transparent",
              }}
            />
          </Box>
          <IconButton
            onClick={handleIncreaseWarning}
            sx={{
              backgroundColor: "#1b8a4a",
              color: "white",
              borderRadius: "8px",
              width: 48,
              height: 48,
              "&:hover": {
                backgroundColor: "#15703c",
              },
            }}
          >
            <Add />
          </IconButton>
        </Box>

        {/* --- SỬA 3: Nút bấm có trạng thái Loading --- */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirm}
          disabled={loading} // Tránh click tặc khi đang gọi API
          sx={{
            backgroundColor: "#1b8a4a",
            color: "white",
            py: 1.5,
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#15703c",
            },
          }}
        >
          {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
