import React from "react";
import { Box, Typography, styled } from "@mui/material";

interface StepItemProps {
  active?: boolean;
  isLast?: boolean;
}

const steps = ["Nháp", "Duyệt", "Hủy", "Hoàn thành"];

const StepItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "isLast",
})<StepItemProps>(({ theme, active, isLast }) => {
  const activeColor = theme.palette.primary.main;
  const activeBg = "#f0f9fa";
  const inactiveBg = "#eeeeee";

  return {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px 0 30px",
    height: "40px",
    backgroundColor: active ? activeBg : inactiveBg,
    color: active ? activeColor : theme.palette.text.secondary,
    fontWeight: active ? 600 : 400,
    fontSize: "14px",
    marginRight: isLast ? 0 : "5px", // Giảm khoảng cách để mũi tên khớp hơn

    // Chỉ thêm border top và bottom khi active
    borderTop: active ? `1px solid ${activeColor}` : "1px solid transparent",
    borderBottom: active ? `1px solid ${activeColor}` : "1px solid transparent",

    // Phần nhọn của mũi tên (Lớp viền ngoài)
    "&:after": {
      content: '""',
      position: "absolute",
      right: "-20px",
      top: "-1px", // Khớp với border top
      bottom: "-1px", // Khớp với border bottom
      borderLeft: `20px solid ${active ? activeColor : inactiveBg}`,
      borderTop: "20px solid transparent",
      borderBottom: "20px solid transparent",
      zIndex: 2,
    },

    // Phần lùi vào của bước tiếp theo (Để tạo khoảng trống mũi tên)
    "&:before": {
      content: '""',
      position: "absolute",
      left: "0",
      top: "-1px",
      bottom: "-1px",
      borderLeft: `20px solid ${theme.palette.background.paper}`,
      zIndex: 1,
      borderTop: "20px solid transparent",
      borderBottom: "20px solid transparent",
    },

    // Ruột của mũi tên (Đè lên để tạo hiệu ứng viền cho phần nhọn)
    "& .inner-arrow": active
      ? {
          content: '""',
          position: "absolute",
          right: "-18.5px", // Lùi lại một chút để lộ viền từ lớp :after
          top: "0px",
          borderLeft: `19px solid ${activeBg}`,
          borderTop: "19px solid transparent",
          borderBottom: "19px solid transparent",
          zIndex: 3,
        }
      : {},

    "&:first-of-type": {
      paddingLeft: "20px",
      borderRadius: "4px 0 0 4px",
      borderLeft: active ? `1px solid ${activeColor}` : "none",
      "&:before": { display: "none" },
    },

    ...(isLast && {
      borderRadius: "0 4px 4px 0",
      paddingRight: "25px",
      borderRight: active ? `1px solid ${activeColor}` : "none",
      "&:after": { display: "none" }, // Bước cuối không có mũi tên nhọn ra
    }),
  };
});

interface CustomStepperProps {
  activeStep?: number;
}

const CustomStepper: React.FC<CustomStepperProps> = ({ activeStep = 0 }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {steps.map((label, index) => (
        <StepItem
          key={label}
          active={index === activeStep}
          isLast={index === steps.length - 1}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: "inherit",
              position: "relative",
              zIndex: 4,
              fontSize: "inherit",
            }}
          >
            {label}
          </Typography>
          {index === activeStep && <div className="inner-arrow" />}
        </StepItem>
      ))}
    </Box>
  );
};

export default CustomStepper;
