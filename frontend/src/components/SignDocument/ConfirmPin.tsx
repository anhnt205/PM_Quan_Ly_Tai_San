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
import { Close, Visibility, VisibilityOff, EnhancedEncryption } from "@mui/icons-material";

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
      <DialogTitle sx={{ m: 0, p: 2, pb: 1, textAlign: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 1, gap: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "rgba(4, 180, 110, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EnhancedEncryption sx={{ color: "#04b46e", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
            Xác nhận mã PIN
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#9ca3af" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 3 }}>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Vui lòng nhập mã PIN ký số để xác nhận giao dịch
        </Typography>
        <TextField
          fullWidth
          type={showPin ? "text" : "password"}
          placeholder="Nhập mã PIN"
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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&.Mui-focused fieldset": {
                borderColor: "#04b46e",
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1, justifyContent: "center" }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirm}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "0.938rem",
            fontWeight: 600,
            bgcolor: "#04b46e",
            py: 1.3,
            boxShadow: "0 2px 8px rgba(4, 180, 110, 0.25)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: "#038d56",
              boxShadow: "0 4px 12px rgba(4, 180, 110, 0.35)",
            },
          }}
        >
          XÁC NHẬN
        </Button>
      </DialogActions>
    </Dialog>
  );
};
