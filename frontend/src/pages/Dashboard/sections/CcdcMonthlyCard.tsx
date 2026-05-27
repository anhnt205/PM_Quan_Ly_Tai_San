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
import { BarChartOutlined } from "@mui/icons-material";
import { formattedPrice } from "../../../utils/helpers";

export default function CcdcMonthlyCard({
  ccdcMonthlyData,
  maxCCDC,
  yearCCDC,
  setYearCCDC,
  years,
}: any) {
  const getMonthName = (month: number) => `T${month}`;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        height: "100%",
        minHeight: 420,
        bgcolor: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(4,180,110,0.10)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition:
          "box-shadow 0.35s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1)",
        "&:hover": {
          boxShadow:
            "0 8px 32px rgba(4,180,110,0.13), 0 2px 16px rgba(0,0,0,0.06)",
          // transform: "translateY(-2px)",
        },
      }}
    >
      {/* ─── Premium gradient accent line ─────────────────────────── */}
      <Box
        sx={{
          height: 3,
          background:
            "linear-gradient(90deg, #04b46e 0%, #36d399 40%, #f59e0b 70%, #3b82f6 100%)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      <Box sx={{ p: 2.5 }}>
        {/* ─── Header ──────────────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, rgba(4,180,110,0.12) 0%, rgba(4,180,110,0.22) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BarChartOutlined sx={{ fontSize: 20, color: "#04b46e" }} />
            </Box>
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
                CCDC tăng mới theo tháng
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.72rem" }}
              >
                Biến động hàng tháng
              </Typography>
            </Box>
          </Box>
          <FormControl size="small" sx={{ minWidth: 84 }}>
            <Select
              value={yearCCDC}
              onChange={(e) => setYearCCDC(Number(e.target.value))}
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

        {/* ─── Chart area ──────────────────────────────────────────── */}
        <Box sx={{ height: 320, position: "relative" }}>
          {/* Y-axis labels */}
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
              maxCCDC,
              Math.round(maxCCDC * 0.75),
              Math.round(maxCCDC * 0.5),
              Math.round(maxCCDC * 0.25),
              0,
            ].map((val: any, index: number) => (
              <Typography
                key={index}
                variant="caption"
                sx={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 500 }}
              >
                {val}
              </Typography>
            ))}
          </Box>

          {/* Bar chart area */}
          <Box
            sx={{
              ml: 5,
              height: 280,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              borderBottom: "1.5px solid #e5e7eb",
              position: "relative",
            }}
          >
            {/* Dashed grid lines */}
            {[0.25, 0.5, 0.75, 1.0].map((ratio, index) => (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  bottom: `${ratio * 100}%`,
                  left: 0,
                  right: 0,
                  borderTop: "1px dashed #e5e7eb",
                }}
              />
            ))}

            {/* Bars */}
            {(ccdcMonthlyData || []).map((item: any, index: number) => {
              const barHeight = (item.soLuong / maxCCDC) * 240;
              const prevItem = index > 0 ? ccdcMonthlyData[index - 1] : null;
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
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      color: "#475569",
                      fontSize: "0.72rem",
                    }}
                  >
                    {formattedPrice(item.soLuong)}
                  </Typography>
                  <Tooltip
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "rgba(15, 23, 42, 0.85)",
                          backdropFilter: "blur(12px)",
                          borderRadius: "10px",
                          border: "1px solid rgba(255,255,255,0.10)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                          px: 1.5,
                          py: 1,
                        },
                      },
                      arrow: {
                        sx: {
                          color: "rgba(15, 23, 42, 0.85)",
                        },
                      },
                    }}
                    title={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: "#fff",
                          }}
                        >
                          {formattedPrice(item.soLuong)} CCDC
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              pctChange !== null && pctChange >= 0
                                ? "#34d399"
                                : pctChange !== null
                                  ? "#f87171"
                                  : "rgba(255,255,255,0.7)",
                            fontWeight: 600,
                            fontSize: "0.73rem",
                          }}
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
                          "linear-gradient(180deg, #04b46e 0%, #36d399 60%, #6ee7b7 100%)",
                        borderRadius: "8px 8px 2px 2px",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                        transformOrigin: "bottom",
                        position: "relative",
                        "&:hover": {
                          filter: "brightness(1.08)",
                          transform: "scaleX(1.12)",
                          boxShadow: "0 4px 16px rgba(4, 180, 110, 0.25)",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "15%",
                          width: "35%",
                          height: "100%",
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
                          borderRadius: "8px 0 0 0",
                          pointerEvents: "none",
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
              display: "flex",
              justifyContent: "space-around",
              ml: 5,
              mt: 1,
            }}
          >
            {(ccdcMonthlyData || []).map((item: any, index: number) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  flex: 1,
                  textAlign: "center",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                }}
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
