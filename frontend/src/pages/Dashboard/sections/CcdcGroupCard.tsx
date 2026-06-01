import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Build, AttachMoney, CategoryOutlined } from "@mui/icons-material";
import PieChart from "../components/PieChart";
import { formattedPrice } from "../../../utils/helpers";

export default function CcdcGroupCard({
  ccdcPieData,
  hideCcdcLegend,
  tongCCDC,
  tongGiaTriCCDC,
}: any) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        height: "100%",
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(4,180,110,0.10)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition:
          "box-shadow 0.35s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1)",
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)"
          // transform: "translateY(-2px)",
        },
      }}
    >
      {/* accent line ─────────────────────────── */}
      <Box
        sx={{
          height: 3,
          background: "#04b46e",
          borderRadius: "16px 16px 0 0",
        }}
      />

      <Box
        sx={{
          p: 2.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {/* ─── Header with icon ────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2.5,
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
              <CategoryOutlined sx={{ fontSize: 20, color: "#04b46e" }} />
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
                Phân bố CCDC theo nhóm
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.72rem" }}
              >
                Tỷ lệ phần trăm theo số lượng
              </Typography>
            </Box>
          </Box>

          {/* ─── Pie Chart ───────────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <PieChart data={ccdcPieData} size={250} />
          </Box>

          {/* ─── Legend ───────────────────────────────────────────── */}
          <Box
            sx={{
              maxHeight: 110,
              overflowY: "auto",
              px: 0.5,
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(4,180,110,0.2)",
                borderRadius: 2,
              },
            }}
          >
            {!hideCcdcLegend &&
              (ccdcPieData || []).map((item: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 0.8,
                    py: 0.3,
                    px: 0.8,
                    borderRadius: "8px",
                    transition: "background 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(4,180,110,0.04)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: item.color,
                        borderRadius: "50%",
                        flexShrink: 0,
                        boxShadow: `0 0 0 2px ${item.color}22`,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#475569",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                      }}
                    >
                      {item.ten}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    {formattedPrice(item.soLuong)} ({item.phanTram?.toFixed(1)}
                    %)
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>

        {/* ─── Footer Stats ──────────────────────────────────────── */}
        <Box sx={{ mt: 2.5, display: "flex", gap: 1.5 }}>
          <Box
            sx={{
              flex: 1,
              p: 1.4,
              borderRadius: "12px",
              background: "#f0fdf8",
              border: "1px solid #d1fae9",
              display: "flex",
              alignItems: "center",
              gap: 1,
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "#04b46e" },
            }}
          >
            <Build sx={{ fontSize: 18, color: "#04b46e" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  display: "block",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "0.04em",
                }}
              >
                Tổng CCDC
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "##04b46e",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  mt: 0.2,
                }}
              >
                {tongCCDC?.toLocaleString() || 0}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1.2,
              p: 1.4,
              borderRadius: "12px",
              background: "#eff6ff",
              border: "1px solid #dbeafe",
              display: "flex",
              alignItems: "center",
              gap: 1,
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "#3b82f6" },
            }}
          >
            <AttachMoney sx={{ fontSize: 20, color: "#3b82f6" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  display: "block",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "0.04em",
                }}
              >
                Tổng giá trị
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#035aea",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  mt: 0.2,
                  whiteSpace: "nowrap",
                }}
              >
                {tongGiaTriCCDC?.toLocaleString() || 0} đ
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
