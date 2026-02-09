import React from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
  Paper,
  alpha,
} from "@mui/material";
import { Check, Pencil, FileSignature } from "lucide-react";
import { CancelOutlined } from "@mui/icons-material";
import { useGetFileQuery } from "../../pages/Staff/Mutation";

interface SidebarContentProps {
  signatureType: number;
  setSignatureType: (type: number) => void;
  employee: any;
  handleSign: () => void;
  handleConfirmSign: () => void;
  onCancel: () => void;
}

const SidebarContent = ({
  signatureType,
  setSignatureType,
  employee,
  handleSign,
  handleConfirmSign,
  onCancel,
}: SidebarContentProps) => {
  const { data: fileUrlNhay } = useGetFileQuery(employee.chuKyNhay);
  const { data: fileUrlThuong } = useGetFileQuery(employee.chuKyThuong);

  const SignatureOption = ({
    value,
    label,
    imageUrl,
    showImage = true,
  }: {
    value: number;
    label: string;
    imageUrl?: string;
    showImage?: boolean;
  }) => (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 1.5,
        border: "2px solid",
        borderColor: signatureType === value ? "#667eea" : "#e5e7eb",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s",
        bgcolor: signatureType === value ? alpha("#667eea", 0.05) : "white",
        "&:hover": {
          borderColor: signatureType === value ? "#667eea" : "#d1d5db",
          bgcolor: signatureType === value ? alpha("#667eea", 0.08) : "#f9fafb",
        },
      }}
      onClick={() => setSignatureType(value)}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          value={value}
          control={
            <Radio
              sx={{
                color: "#9ca3af",
                "&.Mui-checked": {
                  color: "#667eea",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: signatureType === value ? 600 : 500,
                color: signatureType === value ? "#111827" : "#6b7280",
              }}
            >
              {label}
            </Typography>
          }
          sx={{ m: 0 }}
        />
        {showImage && imageUrl && (
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              p: 0.5,
              bgcolor: "white",
            }}
          >
            <img
              src={imageUrl}
              alt={label}
              width={70}
              height={35}
              style={{ objectFit: "contain", display: "block" }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              bgcolor: alpha("#667eea", 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileSignature size={18} color="#667eea" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "#111827",
                lineHeight: 1.2,
              }}
            >
              Công cụ ký
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontSize: "0.813rem",
                mt: 0.5,
              }}
            >
              Chọn loại chữ ký phù hợp
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Signature Options */}
      <RadioGroup
        value={signatureType}
        onChange={(e) => setSignatureType(Number(e.target.value))}
        sx={{ flex: 1, mb: 2 }}
      >
        {employee?.kyNhay && (
          <SignatureOption
            value={1}
            label="Ký nháy"
            imageUrl={fileUrlNhay}
          />
        )}

        {employee?.kyThuong && (
          <SignatureOption
            value={2}
            label="Ký thường"
            imageUrl={fileUrlThuong}
          />
        )}

        {employee?.kySo && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              bgcolor: "#fafbfc",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#10b981",
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#111827",
                }}
              >
                Chữ ký số
              </Typography>
            </Box>

            <SignatureOption
              value={3}
              label="Hiển thị mặc định"
              showImage={false}
            />

            {employee.chuKyThuong && (
              <SignatureOption
                value={4}
                label="Kèm chữ ký thường"
                imageUrl={fileUrlThuong}
              />
            )}

            {employee.chuKyNhay && (
              <SignatureOption
                value={5}
                label="Kèm chữ ký nháy"
                imageUrl={fileUrlNhay}
              />
            )}
          </Paper>
        )}
      </RadioGroup>

      <Divider sx={{ my: 1 }} />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSign}
          startIcon={<Pencil size={18} />}
          sx={{
            py: 1.25,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.938rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
            },
          }}
        >
          Thêm chữ ký
        </Button>

        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirmSign}
          startIcon={<Check size={18} />}
          sx={{
            py: 1.25,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.938rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #6941a0 100%)",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            },
          }}
        >
          Xác nhận & Lưu
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={onCancel}
          startIcon={<CancelOutlined sx={{ fontSize: 18 }} />}
          sx={{
            py: 1.25,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.938rem",
            fontWeight: 600,
            color: "#ef4444",
            borderColor: "#fecaca",
            borderWidth: "2px !important", // 👈 FIX: Force border width
            "&:hover": {
              borderColor: "#fca5a5",
              bgcolor: alpha("#ef4444", 0.04),
              borderWidth: "2px !important", // 👈 FIX: Maintain border on hover
            },
          }}
        >
          Hủy bỏ
        </Button>
      </Box>
    </Box>
  );
};

export default SidebarContent;