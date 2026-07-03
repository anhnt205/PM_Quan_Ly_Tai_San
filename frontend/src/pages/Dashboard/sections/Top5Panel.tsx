import React from "react";
import { Paper, Typography, Button, Box, Divider } from "@mui/material";
import { useDashboardMutation } from "../Mutation";
import {
  MonetizationOn,
  FormatListNumbered,
  InsertChart,
} from "@mui/icons-material";

export default function Top5Panel() {
  const dashboard = useDashboardMutation();
  const stats = dashboard?.statistics || {};
  const rawTop5 =
    stats.top5TaiSanGiaTriCao || stats.top5TaiSan || dashboard.top5TaiSan || [];

  const normalized: { name: string; value: number }[] = Array.isArray(rawTop5)
    ? rawTop5.map((it: any) => {
        const name =
          it?.TenTaiSan ??
          it?.tenTaiSan ??
          it?.Ten ??
          it?.name ??
          it?.ten ??
          it?.label ??
          (typeof it === "string" ? it : "") ??
          "—";
        const valueRaw =
          it?.NguyenGia ??
          it?.nguyenGia ??
          it?.GiaTri ??
          it?.giaTri ??
          it?.value ??
          it?.soLuong ??
          it?.count ??
          0;
        const value = Number(valueRaw) || 0;
        return { name, value };
      })
    : [];

  const maxVal =
    normalized.length > 0 ? Math.max(...normalized.map((i) => i.value)) : 1;

  const computeNiceMax = (v: number) => {
    if (!v || v <= 0) return 1;
    const exp = Math.floor(Math.log10(v));
    const base = Math.pow(10, Math.max(0, exp - 1));
    return Math.ceil(v / base) * base;
  };

  const niceMax = computeNiceMax(maxVal);

  const totalValue = normalized.reduce((s, i) => s + i.value, 0);
  const totalCount = normalized.length || 5;
  const avg = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;

  if ((window as any)?.console) console.log("Top5 stats raw:", stats, rawTop5);

  const rawJson = JSON.stringify(stats || rawTop5 || {}, null, 2);

  const LABEL_WIDTH = 180;
  const RIGHT_PADDING = 120;
  const TICK_FRAC = [0.25, 0.5, 0.75, 1];

  return (
    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "#f6fffa" }}>
      {normalized.length === 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
            Debug: Không tìm thấy dữ liệu Top5 trong payload. Raw response (rút
            gọn):
          </Typography>
          <Box
            component="pre"
            sx={{
              maxHeight: 160,
              overflow: "auto",
              bgcolor: "#ffffff",
              p: 1,
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            {rawJson.slice(0, 3000)}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#06a25e", fontWeight: 700, fontSize: 16 }}
        >
          Top 5 tài sản giá trị cao
        </Typography>
        <Button
          disableRipple
          disableElevation
          variant="contained"
          size="small"
          sx={{
            background: "#dcd3ff",
            color: "#4b3fb5",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 20,
            px: 2,
            py: 0.5,
            boxShadow: "none",
            "&:hover": { background: "#dcd3ff" },
          }}
        >
          Giá trị cao nhất
        </Button>
      </Box>

      <Box sx={{ position: "relative", pb: 3 }}>
        <Box
          sx={{
            position: "absolute",
            left: LABEL_WIDTH,
            right: RIGHT_PADDING,
            top: 0,
            bottom: 36,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                left: `${(i * 25).toFixed(2)}%`,
                top: 8,
                bottom: 8,
                borderLeft: "1px solid rgba(0,0,0,0.04)",
              }}
            />
          ))}
        </Box>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {normalized.map((item, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}
            >
              <Typography
                sx={{ width: LABEL_WIDTH, color: "#2e7d32", fontSize: 13 }}
              >
                {item.name}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "transparent",
                  height: 12,
                  borderRadius: 2,
                  position: "relative",
                  pr: 1,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 2,
                    width: `${Math.min(100, (item.value / niceMax) * 100)}%`,
                    bgcolor: "#3f51b5",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "#1b5e20",
                  fontWeight: 700,
                  fontSize: 13,
                  minWidth: `${RIGHT_PADDING}px`,
                  textAlign: "right",
                }}
              >
                {Number(item.value).toLocaleString()} đ
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: LABEL_WIDTH,
            right: RIGHT_PADDING,
            bottom: 4,
            height: 18,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {TICK_FRAC.map((f, i) => (
            <Typography
              key={i}
              variant="caption"
              sx={{
                position: "absolute",
                left: `${f * 100}%`,
                transform: "translateX(-50%)",
                color: "#bdbdbd",
                fontSize: 11,
                whiteSpace: "nowrap",
              }}
            >
              {Number(Math.round(niceMax * f)).toLocaleString()}
            </Typography>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Paper
          sx={{ flex: 1, p: 1, bgcolor: "#ecf9ef", borderRadius: 3 }}
          elevation={0}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                bgcolor: "#dff3e6",
                borderRadius: 1.5,
                p: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MonetizationOn sx={{ color: "#25a35f", fontSize: 18 }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "#2e7d32", fontSize: 12 }}
            >
              Tổng giá trị
            </Typography>
          </Box>
          <Typography
            sx={{ fontWeight: 800, fontSize: 15, color: "#1b5e20", mt: 0.75 }}
          >
            {Number(totalValue).toLocaleString()} đ
          </Typography>
        </Paper>

        <Paper
          sx={{ flex: 1, p: 1, bgcolor: "#ecf9ef", borderRadius: 3 }}
          elevation={0}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                bgcolor: "#dff3e6",
                borderRadius: 1.5,
                p: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FormatListNumbered sx={{ color: "#25a35f", fontSize: 18 }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "#2e7d32", fontSize: 12 }}
            >
              Số lượng
            </Typography>
          </Box>
          <Typography
            sx={{ fontWeight: 800, fontSize: 15, color: "#1b5e20", mt: 0.75 }}
          >
            {totalCount}
          </Typography>
        </Paper>

        <Paper
          sx={{ flex: 1, p: 1, bgcolor: "#ecf9ef", borderRadius: 3 }}
          elevation={0}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                bgcolor: "#dff3e6",
                borderRadius: 1.5,
                p: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InsertChart sx={{ color: "#25a35f", fontSize: 18 }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "#2e7d32", fontSize: 12 }}
            >
              Giá trị TB
            </Typography>
          </Box>
          <Typography
            sx={{ fontWeight: 800, fontSize: 15, color: "#1b5e20", mt: 0.75 }}
          >
            {Number(avg).toLocaleString()} đ
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}
