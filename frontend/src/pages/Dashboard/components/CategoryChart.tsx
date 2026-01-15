import React from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import BarChart from "./BarChart";

interface LoaiData {
  tenLoai: string;
  soLuong: number;
}

interface NhomOption {
  id: number;
  ten: string;
}

interface Props {
  title: string;
  data: LoaiData[];
  nhomOptions: NhomOption[];
  selectedNhom: number | undefined;
  onNhomChange: (nhomId: number | undefined) => void;
  barColor?: string;
}

export default function CategoryChart({
  title,
  data,
  nhomOptions,
  selectedNhom,
  onNhomChange,
  barColor = "#FF9800",
}: Props) {
  const chartData = data.map((item) => ({
    label: item.tenLoai,
    value: item.soLuong,
  }));

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#04b46e", fontWeight: 600 }}
        >
          {title}
        </Typography>
      </Box>

      {/* Filter */}
      <FormControl size="small" sx={{ mb: 2, maxWidth: 200 }}>
        <Select
          value={selectedNhom ?? ""}
          onChange={(e) => {
            const val = String(e.target.value);
            onNhomChange(val === "" ? undefined : Number(val));
          }}
          displayEmpty
          sx={{
            "& .MuiSelect-select": {
              py: 0.5,
              px: 1,
            },
          }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {nhomOptions.map((nhom) => (
            <MenuItem key={nhom.id} value={nhom.id}>
              {nhom.ten}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Chart */}
      <Box sx={{ flex: 1, minHeight: 200 }}>
        <BarChart data={chartData} height={200} barColor={barColor} />
      </Box>
    </Box>
  );
}
