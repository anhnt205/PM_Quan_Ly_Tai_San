import React from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
} from "@mui/material";
import { Check, Pencil } from "lucide-react";
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
  return (
    <>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Công cụ ký
      </Typography>

      <RadioGroup
        value={signatureType}
        onChange={(e) => setSignatureType(Number(e.target.value))}
      >
        {employee?.kyNhay && (
          <Box
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value={1} control={<Radio />} label="Ký nháy" />
            <img
              src={fileUrlNhay}
              alt={fileUrlNhay ? "Chữ ký nháy" : "Lỗi chữ ký"}
              width={60}
              height={30}
              style={{ border: "1px solid #eee", objectFit: "contain" }}
            />
          </Box>
        )}

        {employee?.kyThuong && (
          <Box
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value={2} control={<Radio />} label="Ký thường" />
            <img
              src={fileUrlThuong}
              alt={fileUrlThuong ? "Chữ ký thường" : "Lỗi chữ ký"}
              width={60}
              height={30}
              style={{ border: "1px solid #eee", objectFit: "contain" }}
            />
          </Box>
        )}

        {employee?.kySo && (
          <Box sx={{ p: 1, border: "1px solid #ddd", borderRadius: 5 }}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Chữ ký số
            </Typography>
            <Box sx={{ mb: 1 }}>
              <FormControlLabel
                value={3}
                control={<Radio />}
                label="Hiển thị mặc định"
              />
            </Box>

            {employee.chuKyThuong && (
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent={"space-between"}
                sx={{ mb: 1 }}
              >
                <FormControlLabel
                  value={4}
                  control={<Radio />}
                  label="Hiển thị chữ kí thường"
                />
                <img
                  src={fileUrlThuong}
                  alt={fileUrlThuong ? "Chữ ký thường" : "Lỗi chữ ký"}
                  width={60}
                  height={30}
                  style={{ border: "1px solid #eee", objectFit: "contain" }}
                />
              </Box>
            )}

            {employee.chuKyNhay && (
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <FormControlLabel
                  value={5}
                  control={<Radio />}
                  label="Hiển thị chữ kí nháy"
                />
                <img
                  src={fileUrlNhay}
                  alt={fileUrlNhay ? "Chữ ký nháy" : "Lỗi chữ ký"}
                  width={60}
                  height={30}
                  style={{ border: "1px solid #eee", objectFit: "contain" }}
                />
              </Box>
            )}
          </Box>
        )}
      </RadioGroup>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          color="success"
          onClick={handleSign}
          sx={{ color: "white" }}
          startIcon={<Pencil size={16} />}
        >
          Ký
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="info"
          onClick={handleConfirmSign}
          sx={{ color: "white" }}
          startIcon={<Check size={16} />}
        >
          Xác nhận
        </Button>
        <Button
          variant="outlined"
          fullWidth
          color="error"
          onClick={onCancel}
          sx={{ color: "red" }}
          startIcon={<CancelOutlined sx={{ fontSize: 16 }} />}
        >
          Hủy
        </Button>
      </Box>
    </>
  );
};

export default SidebarContent;
