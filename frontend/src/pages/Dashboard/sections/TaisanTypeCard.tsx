import React from "react";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import BarChart from "../components/BarChart";
import CustomLoading from "../../../components/loading/CustomLoading/CustomLoading";

export interface NhomTaiSanItem {
  id: string | number;
  tenNhom?: string;
  ten?: string;
}

export interface TaisanTypeCardProps {
  taiSanBarData: { label: string; value: number }[];
  selectedNhomTaiSan?: string;
  setSelectedNhomTaiSan: (value?: string) => void;
  uniqueNhomTaiSan?: NhomTaiSanItem[];
}

export default function TaisanTypeCard({
  taiSanBarData,
  selectedNhomTaiSan,
  setSelectedNhomTaiSan,
  uniqueNhomTaiSan,
}: TaisanTypeCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: "16px",
        height: "100%",
        minHeight: 420,
        bgcolor: "rgba(255, 255, 255, 0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(4, 180, 110, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow:
            "0 12px 36px rgba(4, 180, 110, 0.12), 0 4px 20px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
        }}
      />

      <Box sx={{ p: 2.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              borderLeft: "4px solid #f59e0b",
              pl: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#1e293b",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              Phân bố tài sản theo loại
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.72rem" }}
            >
              Phân chia số lượng tài sản
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedNhomTaiSan ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedNhomTaiSan(value === "" ? undefined : String(value));
              }}
              displayEmpty
              sx={{
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                bgcolor: "rgba(245, 158, 11, 0.04)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(245, 158, 11, 0.15)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(245, 158, 11, 0.3)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f59e0b",
                },
              }}
            >
              {(uniqueNhomTaiSan || []).map((nhom) => (
                <MenuItem key={nhom.id} value={String(nhom.id)}>
                  {nhom.tenNhom || nhom.ten}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Biểu đồ */}
        <Box sx={{ height: 320 }}>
          {taiSanBarData.length > 0 ? (
            <BarChart
              data={taiSanBarData}
              height={320}
              barColor="#f59e0b"
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <CustomLoading />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Không có dữ liệu loại tài sản
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
