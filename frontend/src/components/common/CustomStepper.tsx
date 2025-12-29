import React from "react";
import { Box, Typography, styled, Theme } from "@mui/material";

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
    color: active ? "#000" : theme.palette.text.secondary,
    fontWeight: active ? 600 : 400,
    fontSize: "14px",
    cursor: "pointer",
    marginRight: isLast ? 0 : "10px",
    border: active ? `1.5px solid ${activeColor}` : "none",
    borderRight: "none",

    "&:after": {
      content: '""',
      position: "absolute",
      right: "-20px",
      top: active ? "-1.5px" : 0,
      bottom: active ? "-1.5px" : 0,
      borderLeft: `20px solid ${active ? activeColor : inactiveBg}`,
      borderTop: "20px solid transparent",
      borderBottom: "20px solid transparent",
      zIndex: 2,
    },

    "&:before": {
      content: '""',
      position: "absolute",
      left: "0",
      top: 0,
      bottom: 0,
      borderLeft: `20px solid ${theme.palette.background.paper}`,
      zIndex: 1,
      borderTop: "20px solid transparent",
      borderBottom: "20px solid transparent",
    },

    "& .inner-arrow": active
      ? {
          content: '""',
          position: "absolute",
          right: "-17px",
          top: "0px",
          borderLeft: `18px solid ${activeBg}`,
          borderTop: "18.5px solid transparent",
          borderBottom: "18.5px solid transparent",
          zIndex: 3,
        }
      : {},

    "&:first-of-type": {
      paddingLeft: "20px",
      borderRadius: "4px 0 0 4px",
      "&:before": { display: "none" },
    },

    ...(isLast && {
      borderRadius: "0 4px 4px 0",
      overflow: "hidden",
    }),
  };
});

interface CustomStepperProps {
  activeStep?: number;
}

const CustomStepper: React.FC<CustomStepperProps> = ({ activeStep = 3 }) => {
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
            sx={{ fontWeight: "inherit", position: "relative", zIndex: 4 }}
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
