import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send"; // Icon gửi
import GavelIcon from "@mui/icons-material/Gavel"; // Icon búa (quyết định)

export default function DecisionButton({
  data,
  handleDecision,
  onClose,
}: {
  data: any;
  handleDecision?: (data: any) => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [decisionCode, setDecisionCode] = useState("");

  // Mở modal
  const handleClickOpen = () => setOpen(true);

  // Đóng modal
  const handleClose = () => {
    setOpen(false);
    setDecisionCode(""); // Reset mã khi đóng
    onClose();
  };

  // Xử lý gửi mã
  const handleSend = async () => {
    const updatedData = {
      ...data,
      soQuyetDinh: decisionCode,
    };
    await handleDecision?.(updatedData);
    handleClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Button chính */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<GavelIcon />}
        onClick={handleClickOpen}
        sx={{
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
          px: 3,
          py: 1,
        }}
      >
        Ban hành quyết định
      </Button>

      {/* Popup / Modal nhập mã */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Xác nhận ban hành
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Vui lòng nhập **Số quyết định** để hoàn tất quy trình ban hành tài
            sản.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Số quyết định"
            type="text"
            fullWidth
            variant="outlined"
            value={decisionCode}
            onChange={(e) => setDecisionCode(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={handleClose} color="inherit">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSend}
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!decisionCode.trim()} // Chỉ cho gửi khi đã nhập mã
          >
            Gửi quyết định
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
