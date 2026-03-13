import React from "react";
import { Box, Typography } from "@mui/material";
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
            sx={{ color: "#9e9e9e", fontSize: "11px" }}
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
              borderTop: "1px solid #e0e0e0",
            }}
          />
        ))}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / actualMax) * chartHeight;
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
                sx={{ mb: 0.5, fontWeight: 500, fontSize: "11px" }}
              >
                {formattedPrice(item.value)}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 50,
                  height: Math.max(barHeight, 2),
                  bgcolor: item.color || barColor,
                  transition: "height 0.3s ease",
                }}
              />
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
                color: "#9e9e9e",
                fontSize: "11px",
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
