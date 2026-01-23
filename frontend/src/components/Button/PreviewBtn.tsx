import { Visibility } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

export default function PreviewBtn({
  handleClick,
}: {
  handleClick: () => void;
}) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={0.5}
      sx={{
        cursor: "pointer",
        color: "#1976d2",
        width: "fit-content",
        "&:hover": { textDecoration: "underline" },
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Xem trước tài liệu
      </Typography>
      <Visibility sx={{ fontSize: 18 }} />
    </Box>
  );
}
