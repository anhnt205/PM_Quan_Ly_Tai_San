import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";

interface PinInputPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
}

export const ConfirmPin: React.FC<PinInputPopupProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleConfirm = () => {
    onConfirm(pin);
    setPin("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 10001 }}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Xác nhận mã Pin
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 4 }}>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Vui lòng nhập mã Pin để xác nhận
        </Typography>
        <TextField
          fullWidth
          type={showPin ? "text" : "password"}
          placeholder="Nhập mã Pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPin(!showPin)} edge="end">
                  {showPin ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirm}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1rem",
            bgcolor: "#1976d2",
            py: 1.5,
          }}
        >
          XÁC NHẬN
        </Button>
      </DialogActions>
    </Dialog>
  );
};
