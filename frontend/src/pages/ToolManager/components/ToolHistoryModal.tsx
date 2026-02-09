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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Close as CloseIcon,
  History as HistoryIcon,
  East as EastIcon, // Icon mũi tên thanh mảnh hơn
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
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
import { useHistoryAssethandoverQuery } from "../Mutation";
import dayjs from "dayjs";

interface AssetHistoryModalProps {
  open: boolean;
  onClose: () => void;
  selectedTool: any;
}

export default function AssetHistoryModal({
  open,
  onClose,
  selectedTool,
}: AssetHistoryModalProps) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const { data: historyData = { items: [], totalItems: 0 } } =
    useHistoryAssethandoverQuery(
      paginationModel.page,
      paginationModel.pageSize,
      undefined,
      undefined,
      selectedTool?.id,
    );

  const groupedHistory = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    if (Array.isArray(historyData?.items)) {
      historyData.items.forEach((item: any) => {
        const key = item.idChiTietCCDCVatTu || "Khác";
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
      });
    }
    return groups;
  }, [historyData]);

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
                {selectedTool?.tenCCDCVatTu}
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

        {historyData.totalItems > 0 ? (
          <Box>
            {Object.entries(groupedHistory).map(([key, items]) => (
              <Accordion
                key={key}
                defaultExpanded
                disableGutters
                elevation={0}
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px !important",
                  mb: 2,
                  "&:before": { display: "none" },
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: "#F9FAFB", minHeight: 48 }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    Mã chi tiết: {key}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 1 }}>
          <Timeline
            sx={{
              p: 0,
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
                paddingLeft: 0,
                textAlign: "right",
                paddingRight: 2,
              },
            }}
          >
            {items.map((item: any, index: number) => (
              <TimelineItem key={item.id}>
                <TimelineOppositeContent>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ lineHeight: 1.2 }}
                  >
                    {dayjs(item.thoiGianBanGiao).format("DD/MM")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(item.thoiGianBanGiao).format("YYYY")}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      bgcolor: "primary.main",
                      boxShadow: "0 0 0 4px #EEF2FF",
                      m: "12px 0",
                      p: 0.5,
                    }}
                  >
                    {/* <HistoryIcon sx={{ fontSize: 14, color: "white" }} /> */}
                  </TimelineDot>
                  {index !== items.length - 1 && (
                    <TimelineConnector sx={{ bgcolor: "#E5E7EB", width: 2 }} />
                  )}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: 4, pt: 0, px: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      {/* Từ đơn vị */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mb: 0.5,
                          }}
                        >
                          <LocationIcon sx={{ fontSize: 14 }} /> Từ đơn vị
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                          noWrap
                          title={item?.tenDonViGiao}
                        >
                          {item?.tenDonViGiao}
                        </Typography>
                      </Box>

                      {/* Icon mũi tên */}
                      <Stack alignItems="center" spacing={0.5}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "primary.main",
                            bgcolor: "#EEF2FF",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                          }}
                        >
                          <EastIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          SL: {item?.soLuong}
                        </Typography>
                      </Stack>

                      {/* Đến đơn vị */}
                      <Box sx={{ flex: 1, minWidth: 0, textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 0.5,
                            mb: 0.5,
                          }}
                        >
                          Đến đơn vị <LocationIcon sx={{ fontSize: 14 }} />
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="primary.main"
                          noWrap
                          title={item?.tenDonViNhan}
                        >
                          {item?.tenDonViNhan}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              CCDC-Vật tư này chưa có lịch sử điều chuyển.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
