import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Build, AttachMoney } from "@mui/icons-material";
import PieChart from "../components/PieChart";

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
        p: 2,
        borderRadius: 2,
        height: "100%",
        minHeight: 320,
        bgcolor: "#f0faf5",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: "#04b46e", fontWeight: 600, mb: 2 }}
      >
        Phân bố CCDC theo nhóm (%)
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box sx={{ flexShrink: 0 }}>
          <PieChart data={ccdcPieData} size={100} />
        </Box>
        <Box sx={{ flex: 1 }}>
          {!hideCcdcLegend &&
            (ccdcPieData || []).map((item: any, index: number) => (
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

      <Box sx={{ mt: 2, pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Build sx={{ fontSize: 16, color: "#04b46e" }} />
          <Typography variant="body2" sx={{ color: "#04b46e" }}>
            Tổng CCDC: <strong>{tongCCDC?.toLocaleString()}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachMoney sx={{ fontSize: 16, color: "#04b46e" }} />
          <Typography variant="body2" sx={{ color: "#04b46e" }}>
            Tổng giá trị CCDC:{" "}
            <strong>{tongGiaTriCCDC?.toLocaleString()} đ</strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
