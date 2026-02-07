import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  History as HistoryIcon,
  East as EastIcon, // Icon mũi tên thanh mảnh hơn
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";

interface TransferHistory {
  id: string;
  fromDepartment: string;
  toDepartment: string;
  transferDate: string;
  note?: string;
}

interface AssetHistoryModalProps {
  open: boolean;
  onClose: () => void;
  assetName: string;
  historyData: TransferHistory[];
}

export default function AssetHistoryModal({
  open,
  onClose,
  assetName,
  historyData,
}: AssetHistoryModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "20px", backgroundImage: "none" },
      }}
    >
      {/* Tiêu đề Modal */}
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#EEF2FF",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HistoryIcon sx={{ color: "#4F46E5" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#111827" }}
              >
                Nhật ký điều chuyển
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                {assetName}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: "#9CA3AF" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 0 }}>
        <Divider sx={{ mb: 3, opacity: 0.6 }} />

        {historyData.length > 0 ? (
          <Timeline
            sx={{
              p: 0,
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.25,
                paddingLeft: 0,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#6B7280",
              },
            }}
          >
            {historyData.map((item, index) => (
              <TimelineItem key={item.id}>
                <TimelineOppositeContent>
                  {item.transferDate}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot
                    variant="outlined"
                    sx={{
                      borderColor: "#4F46E5",
                      borderWidth: 2,
                      bgcolor: "transparent",
                    }}
                  />
                  {index !== historyData.length - 1 && (
                    <TimelineConnector sx={{ bgcolor: "#E5E7EB", width: 2 }} />
                  )}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: 4, pt: 0, px: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: "#E0E7FF",
                      bgcolor: "#eee7e7",
                      mb: 1,
                    }}
                  >
                    {/* Luồng điều chuyển */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#374151" }}
                      >
                        {item.fromDepartment}
                      </Typography>
                      <EastIcon sx={{ fontSize: 16, color: "#9CA3AF" }} />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: "#4F46E5" }}
                      >
                        {item.toDepartment}
                      </Typography>
                    </Stack>

                    {/* Ghi chú nếu có */}
                    {/* {item.note && (
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{
                          color: "#6B7280",
                          bgcolor: "#F3F4F6",
                          p: 1,
                          borderRadius: "8px",
                          mt: 1,
                        }}
                      >
                        {item.note}
                      </Typography>
                    )} */}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              Tài sản này chưa có lịch sử điều chuyển.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
