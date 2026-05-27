import React from "react";
import { Grid, Paper, Typography, Box, Skeleton } from "@mui/material";
import {
  InventoryOutlined,
  MonetizationOnOutlined,
  ConstructionOutlined,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";

interface SummaryCardsProps {
  tongTaiSan: number;
  tongNguyenGia: number;
  tongCCDC: number;
  tongGiaTriCCDC: number;
  isLoading?: boolean;
}

export default function SummaryCards({
  tongTaiSan = 0,
  tongNguyenGia = 0,
  tongCCDC = 0,
  tongGiaTriCCDC = 0,
  isLoading = false,
}: SummaryCardsProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("₫", "đ");
  };

  const cards = [
    {
      title: "Tổng số lượng tài sản",
      value: tongTaiSan.toLocaleString("vi-VN"),
      icon: <InventoryOutlined sx={{ fontSize: 22, color: "#04b46e" }} />,
      accentColor: "#04b46e",
      iconBg: "#f0fdf8",
    },
    {
      title: "Tổng nguyên giá tài sản",
      value: formatPrice(tongNguyenGia),
      icon: <MonetizationOnOutlined sx={{ fontSize: 22, color: "#1a73e8" }} />,
      accentColor: "#1a73e8",
      iconBg: "#eff6ff",
    },
    {
      title: "Tổng số lượng CCDC",
      value: tongCCDC.toLocaleString("vi-VN"),
      icon: <ConstructionOutlined sx={{ fontSize: 22, color: "#f59e0b" }} />,
      accentColor: "#f59e0b",
      iconBg: "#fffbeb",
    },
    {
      title: "Tổng giá trị CCDC",
      value: formatPrice(tongGiaTriCCDC),
      icon: (
        <AccountBalanceWalletOutlined sx={{ fontSize: 22, color: "#8b5cf6" }} />
      ),
      accentColor: "#8b5cf6",
      iconBg: "#faf5ff",
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {cards.map((card, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "14px",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.07)",
              overflow: "hidden",
              transition: "box-shadow 0.2s, transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 8px 24px rgba(0,0,0,0.08)`,
              },
            }}
          >
            {/* Top accent line */}
            <Box
              sx={{
                height: "4px",
                background: card.accentColor,
                borderRadius: "14px 14px 0 0",
              }}
            />

            <Box
              sx={{
                p: 4.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    mb: 0.8,
                  }}
                >
                  {card.title}
                </Typography>

                {isLoading ? (
                  <Skeleton width={120} height={36} animation="wave" />
                ) : (
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      fontSize: { xs: "1.5rem", lg: "1.8rem" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.value}
                  </Typography>
                )}
              </Box>

              {/* Icon box */}
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "12px",
                  bgcolor: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  ml: 2,
                }}
              >
                {isLoading ? (
                  <Skeleton variant="circular" width={24} height={24} />
                ) : (
                  card.icon
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
