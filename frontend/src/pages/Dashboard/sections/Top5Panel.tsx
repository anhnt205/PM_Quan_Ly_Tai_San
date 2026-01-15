import React from "react";
import { Paper, Typography, Button, Box, Divider } from "@mui/material";

export default function Top5Panel() {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "#f0faf5" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#04b46e", fontWeight: 700 }}>
          Top 5 tài sản giá trị cao
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            background: "#d7d8ff",
            color: "#2e2e7a",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Giá trị cao nhất
        </Button>
      </Box>

      <Box>
        {[
          { name: "Lò chứa nước -150", value: 87778000000 },
          { name: "Dây chuyền tuyển khí", value: 71118600000 },
          { name: "Giếng chính bảng tai +27", value: 60282000000 },
          { name: "Lò dọc via đá vận tải -15", value: 60187300000 },
          { name: "Tổ hợp dàn chống 2ANSH", value: 52420900000 },
        ].map((item, idx) => (
          <Box
            key={idx}
            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
          >
            <Typography sx={{ width: 220, color: "#2e7d32" }}>
              {item.name}
            </Typography>
            <Box
              sx={{
                flex: 1,
                bgcolor: "rgba(47,84,235,0.08)",
                height: 14,
                borderRadius: 2,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  bgcolor: "#6f7be6",
                  borderRadius: 2,
                  width: `${Math.min(100, (item.value / 90000000000) * 100)}%`,
                }}
              />
            </Box>
            <Typography sx={{ color: "#2e7d32", fontWeight: 700 }}>
              {Number(item.value).toLocaleString()} đ
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper
          sx={{ flex: 1, p: 2, bgcolor: "#eaf8ee", borderRadius: 2 }}
          elevation={0}
        >
          <Typography variant="caption" sx={{ color: "#2e7d32" }}>
            Tổng giá trị
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            331.787.600.000 đ
          </Typography>
        </Paper>
        <Paper
          sx={{ flex: 1, p: 2, bgcolor: "#eaf8ee", borderRadius: 2 }}
          elevation={0}
        >
          <Typography variant="caption" sx={{ color: "#2e7d32" }}>
            Số lượng
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            5
          </Typography>
        </Paper>
        <Paper
          sx={{ flex: 1, p: 2, bgcolor: "#eaf8ee", borderRadius: 2 }}
          elevation={0}
        >
          <Typography variant="caption" sx={{ color: "#2e7d32" }}>
            Giá trị TB
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            66.357.520.000 đ
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}
