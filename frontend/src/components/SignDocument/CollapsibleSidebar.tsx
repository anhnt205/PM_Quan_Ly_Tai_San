import React, { useState } from "react";
import { Box, Paper, styled, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const SidebarWrapper = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1300,
  borderRadius: "24px 24px 0 0",
  transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ffffff",
  borderBottom: "none",
}));

const ToggleBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "-31px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#ffffff",
  borderRadius: "12px 12px 0 0",
  padding: "6px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.08)",
  cursor: "pointer",
  border: "1px solid #e0e0e0",
  borderBottom: "none", // Quan trọng: bỏ border đáy để nối liền với sidebar
  whiteSpace: "nowrap",
}));

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxHeight?: string | number;
}

export default function CollapsibleSidebar({
  children,
  defaultOpen = true, // Nên để true để người dùng thấy công cụ trước
  maxHeight = "70vh",
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SidebarWrapper
      elevation={6}
      sx={{
        transform: isOpen ? "translateY(0)" : "translateY(calc(100%))",
        pointerEvents: "auto",
      }}
    >
      <ToggleBadge onClick={() => setIsOpen(!isOpen)}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "#8b5cf6",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {isOpen ? "Đóng công cụ ký" : "Mở công cụ ký"}
        </Typography>

        {isOpen ? (
          <KeyboardArrowDown sx={{ color: "#8b5cf6", fontSize: "1.1rem" }} />
        ) : (
          <KeyboardArrowUp sx={{ color: "#8b5cf6", fontSize: "1.1rem" }} />
        )}
      </ToggleBadge>

      <Box
        sx={{
          p: 2,
          pb: 4,
          overflowY: "auto",
          maxHeight: maxHeight,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {children}
      </Box>
    </SidebarWrapper>
  );
}
