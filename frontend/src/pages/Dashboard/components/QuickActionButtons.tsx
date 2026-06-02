import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import HandymanIcon from "@mui/icons-material/Handyman";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/routes";
import { Box, Typography } from "@mui/material";
import * as React from "react";

interface ActionCategory {
  label: string;
  color: string;
  bgColor: string;
  hoverBorder: string;
  hoverShadow: string;
  icon: React.ReactElement;
  actions: {
    label: string;
    icon: React.ReactElement;
    path: string;
  }[];
}

export const QuickActionButtons = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path, { state: { autoCreate: true } });
  };

  const categories: ActionCategory[] = [
    {
      label: "Tài sản",
      color: "#04b46e",
      bgColor: "#dcfce7",
      hoverBorder: "rgba(4, 180, 110, 0.4)",
      hoverShadow: "rgba(4, 180, 110, 0.12)",
      icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 16 }} />,
      actions: [
        {
          label: "Thêm tài sản",
          icon: <InventoryIcon sx={{ fontSize: 20 }} />,
          path: ROUTES.ASSETMANAGER,
        },
        {
          label: "Cấp phát TS",
          icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
          path: `${ROUTES.ASSETTRANSFER}?type=1`,
        },
        {
          label: "Điều chuyển TS",
          icon: <SwapHorizIcon sx={{ fontSize: 20 }} />,
          path: `${ROUTES.ASSETTRANSFER}?type=2`,
        },
        {
          label: "Thu hồi TS",
          icon: <AssignmentReturnIcon sx={{ fontSize: 20 }} />,
          path: `${ROUTES.ASSETTRANSFER}?type=3`,
        },
      ],
    },
    {
      label: "Công cụ dụng cụ",
      color: "#3b82f6",
      bgColor: "#dbeafe",
      hoverBorder: "rgba(59, 130, 246, 0.4)",
      hoverShadow: "rgba(59, 130, 246, 0.12)",
      icon: <BuildCircleOutlinedIcon sx={{ fontSize: 16 }} />,
      actions: [
        {
          label: "Thêm CCDC",
          icon: <InventoryIcon sx={{ fontSize: 20 }} />,
          path: ROUTES.TOOLMANAGER,
        },
        {
          label: "Cấp phát CCDC",
          icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
          path: `${ROUTES.TOOLTRANSFER}?type=1`,
        },
        {
          label: "Điều chuyển CCDC",
          icon: <SwapHorizIcon sx={{ fontSize: 20 }} />,
          path: `${ROUTES.TOOLTRANSFER}?type=2`,
        },
        {
          label: "Thu hồi CCDC",
          icon: <AssignmentReturnIcon sx={{ fontSize: 20 }} />,
          path: `${ROUTES.TOOLTRANSFER}?type=3`,
        },
      ],
    },
    {
      label: "Sửa chữa bảo dưỡng",
      color: "#f97316",
      bgColor: "#ffedd5",
      hoverBorder: "rgba(249, 115, 22, 0.4)",
      hoverShadow: "rgba(249, 115, 22, 0.12)",
      icon: <EngineeringIcon sx={{ fontSize: 16 }} />,
      actions: [
        {
          label: "Quản lý sửa chữa",
          icon: <HandymanIcon sx={{ fontSize: 20 }} />,
          path: ROUTES.MAINTENANCE_MANAGER,
        },
        {
          label: "Kế hoạch sửa chữa",
          icon: <CalendarMonthIcon sx={{ fontSize: 20 }} />,
          path: ROUTES.MAINTENANCEPLANREPAIR,
        },
        {
          label: "Phê duyệt",
          icon: <FactCheckIcon sx={{ fontSize: 20 }} />,
          path: ROUTES.MAINTENANCE_APPROVAL,
        },
        {
          label: "Quản lý biên bản",
          icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
          path: ROUTES.MAINTENANCE_RECORD,
        },
      ],
    },
  ];

  return (
    <Box sx={{ mb: 1 }}>
      {/* Section title styled like SectionHeader */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mt: 1,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 4,
            height: 22,
            borderRadius: "4px",
            bgcolor: "#3b82f6",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "18px",
            color: "#1e293b",
            lineHeight: 1,
          }}
        >
          Thao tác nhanh
        </Typography>
        <Box
          sx={{
            flex: 1,
            height: "1px",
            ml: 1,
            background: `linear-gradient(90deg, #3b82f633 0%, transparent 100%)`,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2.5 }}>
        {categories.map((cat, catIdx) => (
          <Box key={catIdx} sx={{ flex: 1, minWidth: "300px" }}>
            {/* Category label */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: cat.color,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: cat.color,
                  letterSpacing: "0.3px",
                  fontSize: "0.75rem",
                }}
              >
                {cat.label}
              </Typography>
            </Box>

            {/* Action cards row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "10px",
                overflowX: "auto",
                pb: 1,
                width: "100%",
                "&::-webkit-scrollbar": {
                  height: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(0,0,0,0.1)",
                  borderRadius: "2px",
                },
                "&::-webkit-scrollbar-track": {
                  bgcolor: "transparent",
                },
              }}
            >
              {cat.actions.map((action, idx) => (
                <Box
                  key={idx}
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
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 18px 12px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${cat.bgColor}`,
                    cursor: "pointer",
                    userSelect: "none",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                    minWidth: "80px",
                    flex: 1,

                    "& .qa-icon-circle": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: cat.bgColor,
                      color: cat.color,
                      transition: "all 0.2s ease",
                    },

                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: cat.hoverBorder,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: `0 8px 20px ${cat.hoverShadow}`,
                      "& .qa-icon-circle": {
                        backgroundColor: cat.color,
                        color: "#fff",
                        transform: "scale(1.05)",
                      },
                    },

                    "&:active": {
                      transform: "translateY(0) scale(0.97)",
                      boxShadow: `0 2px 6px ${cat.hoverShadow}`,
                    },

                    "&:focus-visible": {
                      boxShadow: `0 0 0 3px ${cat.hoverBorder}`,
                      borderColor: cat.color,
                    },
                  }}
                >
                  <span className="qa-icon-circle">{action.icon}</span>
                  <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "0.65rem", sm: "0.72rem", md: "0.78rem" },
                        lineHeight: 1.2,
                        color: "#334155",
                        textAlign: "center",
                        whiteSpace: { xs: "normal", sm: "nowrap" },
                        wordBreak: "break-word",
                      }}
                  >
                    {action.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
