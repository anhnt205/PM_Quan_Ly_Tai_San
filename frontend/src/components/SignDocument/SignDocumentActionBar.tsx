import React from "react";
import {
  Box,
  Button,
  alpha,
  Paper,
  Divider,
} from "@mui/material";
import { Pencil, Check, X } from "lucide-react";

interface SignDocumentActionBarProps {
  signatureType: number;
  setSignatureType: (type: number) => void;
  employee: any;
  handleSign: () => void;
  handleConfirmSign: () => void;
  onCancel: () => void;
}

const SignDocumentActionBar = ({
  signatureType,
  setSignatureType,
  employee,
  handleSign,
  handleConfirmSign,
  onCancel,
}: SignDocumentActionBarProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(4px)",
        borderBottom: "1px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSign}
          startIcon={<Pencil size={18} />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            },
          }}
        >
          Thêm chữ ký
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Button
          variant="contained"
          size="small"
          onClick={handleConfirmSign}
          startIcon={<Check size={18} />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #6941a0 100%)",
            },
          }}
        >
          Ký xác nhận
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={onCancel}
          startIcon={<X size={18} />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            color: "#ef4444",
            borderColor: "#fecaca",
            "&:hover": {
              borderColor: "#fca5a5",
              bgcolor: alpha("#ef4444", 0.04),
            },
          }}
        >
          Hủy
        </Button>
      </Box>
    </Paper>
  );
};

export default SignDocumentActionBar;
