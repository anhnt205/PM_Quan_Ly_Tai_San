import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart as RechartsChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { formattedPrice } from "../../../utils/helpers";

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartItem[];
  maxValue?: number;
  height?: number;
  barColor?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: BarChartItem;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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
          {formattedPrice(data.value)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.75rem",
            display: "block",
            mt: 0.5,
          }}
        >
          {data.label}
        </Typography>
      </Box>
    );
  }
  return null;
}

export default function BarChart({
  data,
  maxValue,
  height = 200,
  barColor = "#FF9800",
}: BarChartProps) {
  const computedMax = useMemo(() => {
    if (maxValue !== undefined) return maxValue;
    const maxVal = Math.max(...data.map((item) => item.value), 1);
    return Math.ceil(maxVal * 1.15);
  }, [data, maxValue]);

  const getGradientId = (color: string) => {
    const lower = color.toLowerCase();
    if (
      lower.includes("f59e0b") ||
      lower.includes("d97706") ||
      lower.includes("orange") ||
      lower.includes("amber")
    ) {
      return "barOrangeGradient";
    }
    if (
      lower.includes("3b82f6") ||
      lower.includes("1d4ed8") ||
      lower.includes("1a73e8") ||
      lower.includes("blue")
    ) {
      return "barBlueGradient";
    }
    if (
      lower.includes("10b981") ||
      lower.includes("04b46e") ||
      lower.includes("0d9e6d") ||
      lower.includes("green")
    ) {
      return "barGreenGradient";
    }
    return "";
  };

  if (data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Chọn nhóm để xem biểu đồ
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height, pr: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsChart
          data={data}
          margin={{ top: 25, right: 10, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="barOrangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="barBlueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="barGreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(226, 232, 240, 0.6)"
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            dy={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            domain={[0, computedMax]}
            allowDecimals={false}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(226, 232, 240, 0.4)", radius: 6 }}
          />

          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
            animationDuration={800}
          >
            {data.map((item, index) => {
              const gradId = getGradientId(item.color || barColor);
              const fill = gradId ? `url(#${gradId})` : item.color || barColor;
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(val: number) => formattedPrice(val)}
              style={{ fill: "#64748b", fontSize: "11px", fontWeight: 700 }}
            />
          </Bar>
        </RechartsChart>
      </ResponsiveContainer>
    </Box>
  );
}
