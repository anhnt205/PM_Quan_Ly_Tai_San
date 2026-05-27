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

interface TaisanTypeCardProps {
  taiSanBarData: { label: string; value: number }[];
  selectedNhomTaiSan?: string;
  setSelectedNhomTaiSan: (value?: string) => void;
  uniqueNhomTaiSan?: any[]; // Danh sách nhóm tài sản từ API
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
        borderRadius: 3,
        height: "100%",
        minHeight: 420,
        bgcolor: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(13,158,109,0.12)",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow:
            "0 10px 32px rgba(4,180,110,0.13), 0 2px 16px rgba(0,0,0,0.06)",
          // transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          height: 3,
          background: "#04b46e",
        }}
      />

      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            borderLeft: "4px solid #0d9e6d",
            pl: 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: "#0d9e6d", fontWeight: 600 }}
          >
            Phân bố tài sản theo loại
          </Typography>

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
                bgcolor: "rgba(4,180,110,0.04)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(4,180,110,0.15)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(4,180,110,0.3)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#04b46e",
                },
              }}
            >
              {(uniqueNhomTaiSan || []).map((nhom: any) => (
                <MenuItem key={nhom.id} value={String(nhom.id)}>
                  {" "}
                  {/* ← String(nhom.id) */}
                  {nhom.tenNhom || nhom.ten} {/* ← fallback sang nhom.ten */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Biểu đồ */}
        <Box sx={{ height: 400 }}>
          {taiSanBarData.length > 0 ? (
            <BarChart
              data={taiSanBarData}
              height={400}
              barColor="linear-gradient(180deg, #f59e0b 0%, #d97706 100%)"
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
