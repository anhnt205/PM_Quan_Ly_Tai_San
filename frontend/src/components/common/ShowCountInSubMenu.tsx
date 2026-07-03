import { Box, Typography } from "@mui/material";

interface ShowCountInSubMenuProps {
  count: number;
}

export const ShowCountInSubMenu = ({ count }: ShowCountInSubMenuProps) => {
  if (count <= 0) return null;

  let bgColor = "";
  let text = "";

  if (count > 99) {
    bgColor = "#2196F3"; // Blue
    text = "99+ mới";
  } else if (count > 50) {
    bgColor = "#4CAF50"; // Green
    text = `${count} mới`;
  } else if (count > 10) {
    bgColor = "#FF9800"; // Orange
    text = `${count} mới`;
  } else {
    bgColor = "#FF7F50"; // Coral
    text = `${count} mới`;
  }

  return (
    <Box
      sx={{
        px: "10px",
        py: "2px",
        minWidth: 24,
        minHeight: 20,
        bgcolor: bgColor,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 2px 6px ${bgColor}33`,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: "0.2px",
          lineHeight: 1.2,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
