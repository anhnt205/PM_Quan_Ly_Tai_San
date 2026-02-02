import { Box, Typography } from "@mui/material";

interface ShowCountProps {
  count: number;
}

export const ShowCount = ({ count }: ShowCountProps) => {
  if (count <= 0) return null;

  return (
    <Box
      sx={{
        px: "6px",
        py: "2px",
        minWidth: 18,
        minHeight: 18,
        bgcolor: "error.main",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position:'absolute',
        top:5,
        right:5
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: "bold",
          color: "#fff",
          lineHeight: 1,
        }}
      >
        {count > 99 ? "99+" : count}
      </Typography>
    </Box>
  );
};
