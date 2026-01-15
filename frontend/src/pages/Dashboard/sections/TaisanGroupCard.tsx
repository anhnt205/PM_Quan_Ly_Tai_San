import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Inventory, AttachMoney } from "@mui/icons-material";
import PieChart, { COLORS } from "../components/PieChart";
import { useTypeAssetMutation } from "../../TypeAsset/Mutation";

export default function TaisanGroupCard({ taiSanPieData, statistics }: any) {
  // If `taiSanPieData` not provided, fallback to assetGroups from typeAsset hook
  const { assetGroups = [] } = useTypeAssetMutation();

  // Prefer prop data; otherwise build from assetGroups
  let pieData = taiSanPieData || [];
  if (!pieData || (Array.isArray(pieData) && pieData.length === 0)) {
    const mapped = (assetGroups || []).map((item: any, idx: number) => ({
      ten: item.ten || item.tenNhom || "",
      soLuong: item.soLuongTaiSan ?? item.soLuong ?? 0,
      color: COLORS[idx % COLORS.length],
    }));

    const total =
      mapped.reduce((s: number, it: any) => s + (it.soLuong || 0), 0) || 1;
    pieData = mapped.map((it: any) => ({
      ...it,
      phanTram: (it.soLuong / total) * 100,
    }));
  }

  const allEmptyGroup =
    !pieData ||
    pieData.length === 0 ||
    pieData.every(
      (it: any) =>
        !it.ten ||
        String(it.ten).trim() === "" ||
        String(it.ten).trim() === "Chưa xác định"
    );

  const displayData = allEmptyGroup
    ? [{ ten: "", soLuong: 1, phanTram: 100, color: COLORS[0] }]
    : pieData;

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
      <Typography
        variant="subtitle1"
        sx={{ color: "#04b46e", fontWeight: 600, mb: 2 }}
      >
        Phân bố tài sản theo nhóm (%)
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box sx={{ flexShrink: 0 }}>
          <PieChart data={displayData} size={120} />
        </Box>
        <Box sx={{ flex: 1, maxHeight: 180, overflowY: "auto" }}>
          {displayData.map((item: any, index: number) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
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
              <Typography
                variant="caption"
                sx={{ color: item.color, fontWeight: 500 }}
              >
                {item.ten}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.soLuong} ({item.phanTram?.toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Inventory sx={{ fontSize: 16, color: "#666" }} />
          <Typography variant="body2">
            Tổng tài sản:{" "}
            <strong>{(statistics?.tongTaiSan || 0).toLocaleString()}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachMoney sx={{ fontSize: 16, color: "#666" }} />
          <Typography variant="body2">
            Tổng nguyên giá:{" "}
            <strong>
              {(statistics?.tongNguyenGia || 0).toLocaleString()} đ
            </strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
