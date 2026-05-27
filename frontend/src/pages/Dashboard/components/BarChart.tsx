import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { formattedPrice } from "../../../utils/helpers";

interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: BarChartItem[];
  maxValue?: number;
  height?: number;
  barColor?: string;
}

// Helper: create a gradient from a solid color
const getBarBackground = (color: string): string => {
  if (color.startsWith("linear-gradient")) return color;
  return `linear-gradient(180deg, ${color} 0%, ${color}dd 60%, ${color}99 100%)`;
};

export default function BarChart({
  data,
  maxValue,
  height = 200,
  barColor = "#FF9800",
}: Props) {
  const max = maxValue || Math.max(...data.map((item) => item.value), 1);
  const chartHeight = height - 40; // Leave space for labels

  // Generate nice Y-axis values
  const generateYAxisValues = (maxVal: number) => {
    if (maxVal <= 2) {
      return [2, 1.5, 1, 0.5, 0];
    } else if (maxVal <= 5) {
      return [5, 4, 3, 2, 1, 0];
    } else {
      const step = Math.ceil(maxVal / 4);
      return [step * 4, step * 3, step * 2, step, 0];
    }
  };

  // Nếu không có dữ liệu, hiển thị thông báo
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

  const yAxisValues = generateYAxisValues(max);
  const actualMax = yAxisValues[0];

  return (
    <Box sx={{ height, position: "relative", px: 1 }}>
      {/* Y-axis labels */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 40,
          width: 25,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          pr: 0.5,
        }}
      >
        {yAxisValues.map((val, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{ color: "#94a3b8", fontSize: "11px", fontWeight: 500 }}
          >
            {val}
          </Typography>
        ))}
      </Box>

      {/* Chart area */}
      <Box
        sx={{
          ml: 3.5,
          height: chartHeight,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          gap: 2,
          position: "relative",
        }}
      >
        {/* Grid lines */}
        {yAxisValues.map((val, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              bottom: (val / actualMax) * chartHeight,
              left: 0,
              right: 0,
              borderTop: "1px dashed #e5e7eb",
            }}
          />
        ))}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / actualMax) * chartHeight;
          const bgColor = item.color || barColor;
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                maxWidth: 80,
                zIndex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ mb: 0.5, fontWeight: 700, fontSize: "14px" }}
              >
                {formattedPrice(item.value)}
              </Typography>
              <Tooltip
                arrow
                placement="top"
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "#fff",
                      }}
                    >
                      {formattedPrice(item.value)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                }
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "rgba(15, 23, 42, 0.9)",
                      backdropFilter: "blur(12px)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      px: 1.5,
                      py: 1,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    },
                  },
                  arrow: {
                    sx: {
                      color: "rgba(15, 23, 42, 0.9)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 70,
                    minWidth: 12,
                    height: Math.max(barHeight, 4),
                    background: getBarBackground(bgColor),
                    borderRadius: "8px 8px 0 0",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    transformOrigin: "bottom",
                    "&:hover": {
                      filter: "brightness(1.08)",
                      transform: "scaleX(1.05) scaleY(1.02)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                />
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {/* X-axis labels */}
      <Box
        sx={{
          ml: 3.5,
          display: "flex",
          justifyContent: "space-around",
          gap: 2,
          mt: 1,
        }}
      >
        {data.map((item, index) => (
          <Box key={index} sx={{ flex: 1, maxWidth: 80, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#94a3b8",
                fontSize: "11px",
                fontWeight: 500,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
