import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

interface PageHeaderProps {
  onNewClick: () => void;
}

export default function PageHeader({ onNewClick }: PageHeaderProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        position: "sticky",
        top: 61,
        zIndex: 1100,
        bgcolor: "background.default",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 3,
        py: 2,
      }}
    >
      <Button
        variant="contained"
        color="success"
        startIcon={<Add />}
        onClick={onNewClick}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          color: "white",
          boxShadow: 2,
        }}
      >
        Mới
      </Button>
      <Typography variant="h6" fontWeight={700} color="text.primary">
        Cấp phát tài sản
      </Typography>
    </Box>
  );
}
