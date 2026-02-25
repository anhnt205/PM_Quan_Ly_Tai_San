import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import BarChart from "../components/BarChart";
import CustomLoading from "../../../components/loading/CustomLoading/CustomLoading";

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
            <CustomLoading />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Không có dữ liệu nhóm tài sản
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
