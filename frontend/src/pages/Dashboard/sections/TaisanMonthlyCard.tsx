import React from "react";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { formattedPrice } from "../../../utils/helpers";

export default function TaisanMonthlyCard({
  taiSanMonthlyData,
  maxTaiSan,
  yearTaiSan,
  setYearTaiSan,
  years,
}: any) {
  const getMonthName = (month: number) => `Tháng ${month}`;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        minHeight: 350,
        bgcolor: "#f0faf5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUp sx={{ color: "#04b46e" }} />
          <Typography
            variant="subtitle1"
            sx={{ color: "#04b46e", fontWeight: 600 }}
          >
            Tài sản tăng mới theo tháng
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={yearTaiSan}
            onChange={(e) => setYearTaiSan(Number(e.target.value))}
          >
            {years.map((y: number) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 250, position: "relative" }}>
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
            maxTaiSan,
            Math.round(maxTaiSan * 0.75),
            Math.round(maxTaiSan * 0.5),
            Math.round(maxTaiSan * 0.25),
            0,
          ].map((val: any, index: number) => (
            <Typography key={index} variant="caption" color="text.secondary">
              {val}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            ml: 5,
            height: 210,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {(taiSanMonthlyData || []).map((item: any, index: number) => {
            const barHeight = (item.soLuong / maxTaiSan) * 180;
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
                  {formattedPrice(item.soLuong)}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: Math.max(barHeight, 2),
                    bgcolor: "#2196F3",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "space-around", ml: 5, mt: 1 }}
        >
          {(taiSanMonthlyData || []).map((item: any, index: number) => (
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
    </Paper>
  );
}
