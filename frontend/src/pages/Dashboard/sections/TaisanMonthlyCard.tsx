import React from "react";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderLeft: "4px solid #0d9e6d",
              pl: 1.5,
            }}
          >
            <TrendingUp sx={{ color: "#0d9e6d" }} />
            <Typography
              variant="subtitle1"
              sx={{ color: "#0d9e6d", fontWeight: 600 }}
            >
              Tài sản tăng mới theo tháng
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 84 }}>
            <Select
              value={yearTaiSan}
              onChange={(e) => setYearTaiSan(Number(e.target.value))}
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
              {years.map((y: number) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 320, position: "relative" }}>
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
              height: 280,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            {(taiSanMonthlyData || []).map((item: any, index: number) => {
              const barHeight = (item.soLuong / maxTaiSan) * 240;
              const prevItem = index > 0 ? taiSanMonthlyData[index - 1] : null;
              const pctChange =
                prevItem && prevItem.soLuong > 0
                  ? ((item.soLuong - prevItem.soLuong) / prevItem.soLuong) * 100
                  : null;
              const pctChangeText =
                pctChange !== null
                  ? `${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}% so với tháng trước`
                  : "Tháng đầu tiên";

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    mx: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, mb: 0.5, color: "#475569" }}
                  >
                    {formattedPrice(item.soLuong)}
                  </Typography>
                  <Tooltip
                    arrow
                    placement="top"
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, fontSize: "0.8rem" }}
                        >
                          {formattedPrice(item.soLuong)} Tài sản
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.85)" }}
                        >
                          {pctChangeText}
                        </Typography>
                      </Box>
                    }
                  >
                    <Box
                      sx={{
                        width: "80%",
                        maxWidth: 36,
                        minWidth: 16,
                        height: Math.max(barHeight, 4),
                        background:
                          "linear-gradient(180deg, #1a73e8 0%, #60a5fa 100%)",
                        borderRadius: "6px 6px 0 0",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        transformOrigin: "bottom",
                        "&:hover": {
                          filter: "brightness(1.05)",
                          transform: "scaleX(1.08)",
                          boxShadow: "0 4px 12px rgba(26, 115, 232, 0.2)",
                        },
                      }}
                    />
                  </Tooltip>
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              ml: 5,
              mt: 1,
            }}
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
      </Box>
    </Paper>
  );
}
