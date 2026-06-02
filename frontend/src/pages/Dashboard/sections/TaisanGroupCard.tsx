import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Inventory, AttachMoney } from "@mui/icons-material";

import PieChart, { COLORS } from "../components/PieChart";

import { useAllAssetGroupQuery } from "../../TypeAsset/Mutation";

import { formattedPrice } from "../../../utils/helpers";

// ─── Types ────────────────────────────────────────────────────────────────

interface PieItem {
  ten: string;
  soLuong: number;
  phanTram?: number;
  color: string;
}

interface Statistics {
  tongTaiSan?: number;
  tongNguyenGia?: number;
}

interface AssetGroup {
  ten?: string;
  tenNhom?: string;
  soLuongTaiSan?: number;
  soLuong?: number;
}

interface TaisanGroupCardProps {
  taiSanPieData?: PieItem[];
  statistics?: Statistics;
}

// ─── Component ────────────────────────────────────────────────────────────

export default function TaisanGroupCard({
  taiSanPieData,
  statistics,
}: TaisanGroupCardProps) {
  const { data: assetGroups = [] } = useAllAssetGroupQuery();

  // ─── Fallback data from API ────────────────────────────────────────────

  let pieData: PieItem[] = taiSanPieData || [];

  if (!pieData.length) {
    const mapped: PieItem[] = (assetGroups as AssetGroup[]).map(
      (item, idx) => ({
        ten: item.ten || item.tenNhom || "",
        soLuong: item.soLuongTaiSan ?? item.soLuong ?? 0,
        color: COLORS[idx % COLORS.length],
      }),
    );

    const total = mapped.reduce((sum, item) => sum + item.soLuong, 0) || 1;

    pieData = mapped.map((item) => ({
      ...item,
      phanTram: (item.soLuong / total) * 100,
    }));
  }

  // ─── Empty state ───────────────────────────────────────────────────────

  const allEmptyGroup =
    !pieData.length ||
    pieData.every(
      (item) =>
        !item.ten ||
        item.ten.trim() === "" ||
        item.ten.trim() === "Chưa xác định",
    );

  const displayData: PieItem[] = allEmptyGroup
    ? [
        {
          ten: "",
          soLuong: 1,
          phanTram: 100,
          color: COLORS[0],
        },
      ]
    : pieData;

  // ─── Render ────────────────────────────────────────────────────────────

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
        transition: "all 0.3s ease",

        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
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

      <Box
        sx={{
          p: 2.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* ─── Content ─────────────────────────────────────────────── */}
        <Box>
          {/* Header */}
          <Box
            sx={{
              borderLeft: "4px solid #0d9e6d",
              pl: 1.5,
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#0d9e6d",
                fontWeight: 700,
              }}
            >
              Phân bố tài sản theo nhóm (%)
            </Typography>
          </Box>

          {/* Pie Chart */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <PieChart
              data={displayData.map((item) => ({
                ...item,
                phanTram: item.phanTram ?? 0,
              }))}
              size={250}
            />
          </Box>

          {/* Legend */}
          <Box
            sx={{
              maxHeight: 120,
              overflowY: "auto",
              px: 0.5,
            }}
          >
            {displayData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: item.color,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#475569",
                      fontWeight: 600,
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {formattedPrice(item.soLuong)} ({item.phanTram?.toFixed(1)}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── Footer Stats ───────────────────────────────────────── */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1.5,
          }}
        >
          {/* Total Assets */}
          <Box
            sx={{
              flex: 1,
              p: 1.2,
              borderRadius: 2,
              background: "#f0fdf8",
              border: "1px solid #d1fae9",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                borderColor: "#04b46e",
                background: "#f0fdf8",
              },
            }}
          >
            <Inventory
              sx={{
                fontSize: 18,
                color: "#0d9e6d",
              }}
            />

            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#0d9e6d",
                  display: "block",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Tổng tài sản
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#1e293b",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  mt: 0.2,
                }}
              >
                {(statistics?.tongTaiSan || 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Total Price */}
          <Box
            sx={{
              flex: 1.2,
              p: 1.2,
              borderRadius: 2,
              background: "#eff6ff",
              border: "1px solid #dbeafe",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                borderColor: "#3b82f6",
                background: "#eff6ff",
              },
            }}
          >
            <AttachMoney
              sx={{
                fontSize: 20,
                color: "#1a73e8",
              }}
            />

            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#1a73e8",
                  display: "block",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Tổng nguyên giá
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#1e293b",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  mt: 0.2,
                  whiteSpace: "nowrap",
                }}
              >
                {(statistics?.tongNguyenGia || 0).toLocaleString()} đ
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
