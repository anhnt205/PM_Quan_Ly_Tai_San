import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import BarChart from "../components/BarChart";

export default function TaisanTypeCard({ taiSanBarData }: any) {
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
        Phân bố tài sản theo loại
      </Typography>

      <Box sx={{ height: 200 }}>
        {taiSanBarData.length > 0 ? (
          <BarChart data={taiSanBarData} height={200} barColor="#FF9800" />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 8L8 16V32L24 40L40 32V16L24 8Z"
                stroke="#9E9E9E"
                strokeWidth="2"
              />
              <path
                d="M24 8V24M24 24L8 16M24 24L40 16"
                stroke="#9E9E9E"
                strokeWidth="2"
              />
              <path d="M24 24V40" stroke="#9E9E9E" strokeWidth="2" />
            </svg>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Không có dữ liệu nhóm tài sản
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
