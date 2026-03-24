import {
  Dialog,
  DialogContent,
  Typography,
  LinearProgress,
  Box,
  Stack,
} from "@mui/material";
import { CloudSync } from "@mui/icons-material";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
}

export default function SyncLoadingModal({
  open,
  title = "Đang đồng bộ dữ liệu...",
  description = "Quá trình này có thể mất vài phút. Vui lòng không đóng trình duyệt.",
}: Props) {
  return (
    <Dialog
      open={open}
      // Ngăn người dùng bấm ra ngoài hoặc bấm nút Esc để đóng Modal
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: 300, sm: 400 },
          p: 2,
        },
      }}
    >
      <DialogContent>
        <Stack spacing={3} alignItems="center">
          {/* Icon minh họa */}
          <CloudSync sx={{ fontSize: 64, color: "primary.main" }} />

          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>

          {/* Thanh tiến trình chạy ngang (Indeterminate) */}
          <Box sx={{ width: "100%" }}>
            <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
