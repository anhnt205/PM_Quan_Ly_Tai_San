import React from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

interface MonthlyData {
  thang: number;
  soLuong: number;
}

interface Props {
  data: MonthlyData[];
  title: string;
  year: number;
  onYearChange: (year: number) => void;
  icon?: React.ReactNode;
  color?: string;
}

export default function MonthlyChart({
  data,
  title,
  year,
  onYearChange,
  icon,
  color = "#C0EBA6",
}: Props) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Get last 2 months of data for display
  const sortedData = [...data].sort((a, b) => b.thang - a.thang);
  const displayData = sortedData.slice(0, 2);
  const maxValue = Math.max(...data.map((d) => d.soLuong), 1);

  const getMonthName = (month: number) => {
    return `Tháng ${month}`;
  };

  const chartHeight = 180;

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
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icon || <TrendingUp sx={{ color: color }} />}
          <Typography
            variant="subtitle1"
            sx={{ color: "#04b46e", fontWeight: 600 }}
          >
            {title}
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            sx={{
              "& .MuiSelect-select": {
                py: 0.5,
                px: 1,
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

      {/* Chart area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          position: "relative",
          minHeight: chartHeight,
        }}
      >
        {/* Y-axis scale */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 30,
            width: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            pr: 1,
          }}
        >
          {[
            maxValue,
            Math.round(maxValue * 0.75),
            Math.round(maxValue * 0.5),
            Math.round(maxValue * 0.25),
            0,
          ].map((val, index) => (
            <Typography key={index} variant="caption" color="text.secondary">
              {val}
            </Typography>
          ))}
        </Box>

        {/* Bars */}
        <Box
          sx={{
            flex: 1,
            ml: 5,
            height: chartHeight - 30,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            borderBottom: "1px solid #E0E0E0",
            position: "relative",
          }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                bottom: `${ratio * 100}%`,
                left: 0,
                right: 0,
                borderTop: "1px dashed #E0E0E0",
              }}
            />
          ))}

          {displayData.reverse().map((item, index) => {
            const barHeight = (item.soLuong / maxValue) * (chartHeight - 30);
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {item.soLuong}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: Math.max(barHeight, 2),
                    bgcolor: color,
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.3s ease",
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* X-axis labels */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          ml: 5,
          mt: 1,
        }}
      >
        {displayData.map((item, index) => (
          <Typography
            key={index}
            variant="caption"
            color="text.secondary"
            sx={{ flex: 1, textAlign: "center" }}
          >
            {getMonthName(item.thang)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
