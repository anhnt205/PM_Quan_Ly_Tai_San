import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import {
  BarChart as RechartsChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { formattedPrice } from "../../../utils/helpers";

export interface TaiSanMonthlyItem {
  thang: number;
  soLuong: number;
  nam?: number;
}

export interface TaisanMonthlyCardProps {
  taiSanMonthlyData: TaiSanMonthlyItem[];
  maxTaiSan: number;
  yearTaiSan: number;
  setYearTaiSan: (year: number) => void;
  years: number[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TaiSanMonthlyItem;
  }>;
}

function CustomTooltip({
  active,
  payload,
  data,
}: CustomTooltipProps & { data: TaiSanMonthlyItem[] }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const index = data.findIndex((d) => d.thang === item.thang);
    const prevItem = index > 0 ? data[index - 1] : null;
    const pctChange =
      prevItem && prevItem.soLuong > 0
        ? ((item.soLuong - prevItem.soLuong) / prevItem.soLuong) * 100
        : null;

    const isIncrease = pctChange !== null && pctChange >= 0;
    const pctColor = isIncrease ? "#10b981" : "#ef4444";
    const changeSign = isIncrease ? "+" : "";
    const pctChangeText =
      pctChange !== null
        ? `${changeSign}${pctChange.toFixed(1)}% so với tháng trước`
        : "Tháng đầu tiên";

    return (
      <Box
        sx={{
          bgcolor: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          px: 1.5,
          py: 1,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          Tháng {item.thang}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 800,
            color: "#60a5fa",
            fontSize: "1.1rem",
            mt: 0.5,
          }}
        >
          {formattedPrice(item.soLuong)} tài sản
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: pctColor,
            fontWeight: 600,
            display: "block",
            mt: 0.5,
          }}
        >
          {pctChangeText}
        </Typography>
      </Box>
    );
  }
  return null;
}

export default function TaisanMonthlyCard({
  taiSanMonthlyData,
  maxTaiSan,
  yearTaiSan,
  setYearTaiSan,
  years,
}: TaisanMonthlyCardProps) {
  const computedMax = useMemo(() => {
    const maxVal = maxTaiSan || 1;
    return Math.ceil(maxVal * 1.15);
  }, [maxTaiSan]);

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
          background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
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
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              borderLeft: "4px solid #3b82f6",
              pl: 1.5,
            }}
          >
            <TrendingUp sx={{ color: "#3b82f6", fontSize: 20 }} />
            <Box>
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
                Tài sản tăng mới theo tháng
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.72rem" }}
              >
                Theo dõi biến động hàng tháng
              </Typography>
            </Box>
          </Box>

          <FormControl size="small" sx={{ minWidth: 84 }}>
            <Select
              value={yearTaiSan}
              onChange={(e) => setYearTaiSan(Number(e.target.value))}
              sx={{
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                bgcolor: "rgba(59, 130, 246, 0.04)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(59, 130, 246, 0.15)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(59, 130, 246, 0.3)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Biểu đồ */}
        <Box sx={{ height: 320, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsChart
              data={taiSanMonthlyData}
              margin={{ top: 25, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="monthlyBlueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(226, 232, 240, 0.6)"
              />

              <XAxis
                dataKey="thang"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                tickFormatter={(val: number) => `Tháng ${val}`}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                domain={[0, computedMax]}
                allowDecimals={false}
              />

              <RechartsTooltip
                content={<CustomTooltip data={taiSanMonthlyData} />}
                cursor={{ fill: "rgba(226, 232, 240, 0.4)", radius: 6 }}
              />

              <Bar
                dataKey="soLuong"
                fill="url(#monthlyBlueGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
                animationDuration={800}
              >
                <LabelList
                  dataKey="soLuong"
                  position="top"
                  formatter={(val: number) => formattedPrice(val)}
                  style={{ fill: "#64748b", fontSize: "11px", fontWeight: 700 }}
                />
              </Bar>
            </RechartsChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
}
