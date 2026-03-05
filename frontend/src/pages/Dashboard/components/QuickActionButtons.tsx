import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/routes";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import * as React from "react";
import { Engineering } from "@mui/icons-material";

/**
 * Nâng cấp giao diện:
 * - Màu chủ đạo: #04b46e (đồng bộ với CcdcTypeCard)
 * - Nền "soft" xanh nhạt: #f0faf5
 * - Hiệu ứng light sweep khi hover và release sweep khi mouseup
 */
export const QuickActionButtons = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const actions = [
    {
      label: "+ Tài sản",
      icon: <InventoryIcon fontSize="large" />,
      path: ROUTES.ASSETMANAGER,
    },
    {
      label: "+ CCDC-VT",
      icon: <InventoryIcon fontSize="large" />,
      path: ROUTES.TOOLMANAGER,
    },
    {
      label: "+ Cấp phát TS",
      icon: <LocalShippingIcon fontSize="large" />,
      path: `${ROUTES.ASSETTRANSFER}?type=1`,
    },
    {
      label: "+ Điều chuyển TS",
      icon: <SwapHorizIcon fontSize="large" />,
      path: `${ROUTES.ASSETTRANSFER}?type=2`,
    },
    {
      label: "+ Thu hồi TS",
      icon: <AssignmentReturnIcon fontSize="large" />,
      path: `${ROUTES.ASSETTRANSFER}?type=3`,
    },
    {
      label: "+ Cấp phát CCDC-VT",
      icon: <LocalShippingIcon fontSize="large" />,
      path: `${ROUTES.TOOLTRANSFER}?type=1`,
    },
    {
      label: "+ Điều chuyển CCDC-VT",
      icon: <SwapHorizIcon fontSize="large" />,
      path: `${ROUTES.TOOLTRANSFER}?type=2`,
    },
    {
      label: "+ Thu hồi CCDC-VT",
      icon: <AssignmentReturnIcon fontSize="large" />,
      path: `${ROUTES.TOOLTRANSFER}?type=3`,
    },
    {
      label: "+ Kế hoạch sửa chữa bảo dưỡng",
      icon: <Engineering fontSize="large" />,
      path: `${ROUTES.MAINTENANCEREPAIR}?type=2`,
    },
    {
      label: "+ Sửa chữa bảo dưỡng",
      icon: <Engineering fontSize="large" />,
      path: `${ROUTES.MAINTENANCEREPAIR}?type=1`,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path, { state: { autoCreate: true } });
  };

  // Màu chủ đạo và biến thể để đồng bộ
  const greenMain = "#04b46e";
  const greenSoft = "#f0faf5"; // nền nhẹ giống CcdcTypeCard
  const greenBorder = "#a8e5cd"; // border nhạt hài hòa
  const greenHover = "#0ac07a";
  const amber = "#FF9800"; // phù hợp với BarChart để tương hỗ màu

  // Tạo style card cho nút + hiệu ứng light sweep
  const cardSx = {
    position: "relative" as const,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "1",
    border: "1px solid",
    borderColor: greenBorder,
    borderRadius: 2,
    bgcolor: greenSoft,
    color: greenMain,
    cursor: "pointer",
    userSelect: "none" as const,
    outline: "none",
    transition:
      "transform 180ms ease, box-shadow 200ms ease, border-color 200ms ease, color 200ms ease, background-color 200ms ease",
    boxShadow: "0 2px 0 rgba(0,0,0,0.02), inset 0 0 0 0 rgba(0,0,0,0)",
    overflow: "hidden",

    // Pseudo-element cho light sweep
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-120%",
      width: "60%",
      height: "100%",
      background: `linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)`,
      transform: "skewX(-20deg)",
      pointerEvents: "none",
      transition: "left 550ms ease",
    },

    // Vệt sáng thứ hai cho hiệu ứng release ngược
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: "-120%",
      width: "60%",
      height: "100%",
      background: `linear-gradient(240deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)`,
      transform: "skewX(20deg)",
      pointerEvents: "none",
      transition: "right 550ms ease",
    },

    // Hover: nâng card + đổi màu nhấn + chạy sweep left->right
    "&:hover": {
      transform: "translateY(-4px)",
      borderColor: greenMain,
      color: greenHover,
      boxShadow: "0 10px 24px rgba(4,180,110,0.16), 0 2px 0 rgba(0,0,0,0.04)",
      // nền gradient nhẹ để card sống động hơn
      background: `linear-gradient(180deg, ${greenSoft} 0%, rgba(4,180,110,0.06) 100%)`,
    },
    "&:hover::before": {
      left: "160%",
    },

    // Active: ấn xuống một chút, giảm shadow
    "&:active": {
      transform: "translateY(-1px) scale(0.99)",
      boxShadow: "0 6px 16px rgba(4,180,110,0.12), 0 1px 0 rgba(0,0,0,0.04)",
    },

    // Khi thả chuột: chạy sweep ngược right->left (dùng class toggling nhỏ)
    "&.release::after": {
      right: "160%",
    },

    // Focus visible: ring rõ ràng
    "&:focus-visible": {
      boxShadow: `0 0 0 3px rgba(4,180,110,0.24)`,
      borderColor: greenMain,
    },
  };

  // Để kích hoạt hiệu ứng release, ta toggle class "release" trong 600ms sau mouseup
  const [releaseIdx, setReleaseIdx] = React.useState<number | null>(null);
  const onMouseUp = (i: number) => {
    setReleaseIdx(i);
    // remove sau 600ms
    window.setTimeout(() => setReleaseIdx(null), 600);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} columns={10}>
        {actions.map((action, index) => (
          <Grid size={{ xs: 1 }} key={index}>
            <Box
              role="button"
              aria-label={action.label}
              tabIndex={0}
              onClick={() => handleNavigate(action.path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigate(action.path);
                }
              }}
              onMouseUp={() => onMouseUp(index)}
              className={releaseIdx === index ? "release" : ""}
              sx={cardSx}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: "16px",
                  background: "white",
                  boxShadow:
                    "inset 0 0 0 1px rgba(4,180,110,0.22), 0 2px 6px rgba(4,180,110,0.08)",
                  color: greenMain,
                }}
              >
                {action.icon}
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mt: 1.2,
                  fontWeight: 600,
                  textAlign: "center",
                  color: "inherit",
                  px: 1,
                  lineHeight: 1.2,
                }}
              >
                {action.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
