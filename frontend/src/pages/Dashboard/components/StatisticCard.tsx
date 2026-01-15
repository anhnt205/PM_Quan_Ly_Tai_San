import React from "react";
import { Box, Typography } from "@mui/material";
import PieChart, { COLORS } from "./PieChart";

interface LegendItem {
  ten: string;
  soLuong: number;
  phanTram: number;
  color?: string;
}

interface Props {
  title: string;
  data: LegendItem[];
  total: number;
  totalLabel: string;
  totalValue: number | string;
  totalValueLabel: string;
  totalValueIcon?: React.ReactNode;
  totalIcon?: React.ReactNode;
}

export default function StatisticCard({
  title,
  data,
  total,
  totalLabel,
  totalValue,
  totalValueLabel,
  totalValueIcon,
  totalIcon,
}: Props) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length],
  }));

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        p: 2,
        height: "100%",
      }}
    >
      {/* Title */}
      <Typography
        variant="subtitle1"
        sx={{ color: "#04b46e", fontWeight: 600, mb: 2 }}
      >
        {title}
      </Typography>

      {/* Content */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Pie Chart */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PieChart data={chartData} size={100} />
        </Box>

        {/* Legend */}
        <Box sx={{ flex: 1 }}>
          {chartData.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: item.color,
                  borderRadius: 0.5,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ color: item.color }}>
                {item.ten}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.soLuong} ({item.phanTram.toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer statistics */}
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {totalIcon}
          <Typography variant="body2">
            {totalLabel}: <strong>{total.toLocaleString()}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {totalValueIcon}
          <Typography variant="body2">
            {totalValueLabel}:{" "}
            <strong>
              {typeof totalValue === "number"
                ? totalValue.toLocaleString()
                : totalValue}{" "}
              đ
            </strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
