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
        p: 2,
        borderRadius: 2,
        height: "100%",
        minHeight: 320,
        bgcolor: "#f0faf5",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#04b46e", fontWeight: 600 }}
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
          >
            {(uniqueNhomTaiSan || []).map((nhom: any) => (
              <MenuItem key={nhom.id} value={String(nhom.id)}>  {/* ← String(nhom.id) */}
                {nhom.tenNhom || nhom.ten}  {/* ← fallback sang nhom.ten */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Biểu đồ */}
      <Box sx={{ height: 200 }}>
        {taiSanBarData.length > 0 ? (
          <BarChart
            data={taiSanBarData}
            height={200}
            barColor="#FF9800"
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
    </Paper>
  );
}