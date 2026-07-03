import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";

export default function DialogLoading({
  loading,
  title,
}: {
  loading: boolean;
  title?: string;
}) {
  return (
    <Dialog
      open={loading}
      PaperProps={{
        sx: {
          borderRadius: 0,
          boxShadow: "none",
          border: "1px solid #d9d9d9",
          minWidth: "240px",
        },
      }}
    >
      <DialogContent>
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={20} color="inherit" thickness={4} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {title || "Đang xử lý dữ liệu..."}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
