import React from "react";
import { Box, Typography, Paper, IconButton, ListItem } from "@mui/material";
import { Close, Info } from "@mui/icons-material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from "@mui/lab";
import { findById } from "../../../utils/helpers";

interface ToolDetailSidebarProps {
  selectedTool: any;
  departments: any[];
  onClose: () => void;
}

export default function ToolDetailSidebar({
  selectedTool,
  departments,
  onClose,
}: ToolDetailSidebarProps) {
  if (!selectedTool) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: "fit-content",
        maxHeight: "calc(100vh - 200px)",
        borderLeft: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <Box
        p={2}
        borderBottom="1px solid"
        borderColor="divider"
        display="flex"
        justifyContent="space-between"
        alignItems="start"
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Info fontSize="small" sx={{ color: "#00BCD4" }} />
            <Typography variant="body2" color="text.secondary">
              Chi tiết đơn vị sở hữu "{selectedTool?.ten || ""}"
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Lặp qua danh sách tài sản (như CCDC-TEST-STT-0, STT-1) */}
      {selectedTool?.chiTietTaiSanList?.map((taiSan: any) => (
        <Box key={taiSan.id} sx={{ px: 2, mb: 4 }}>
          {/* PHẦN ĐẦU (HEADER GROUP) */}
          <Box
            sx={{
              border: "1px solid #ffebee",
              borderRadius: "12px",
              p: 1.5,
              mb: 1,
              bgcolor: "#fff9f9",
            }}
          >
            <Typography sx={{ color: "#ff5252", fontWeight: "bold" }}>
              {taiSan?.id} -- NSX: {taiSan?.namSanXuat}
            </Typography>
          </Box>

          <Timeline
            sx={{
              p: 0,
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {/* LỌC DỮ LIỆU TỪ DANH SÁCH TỔNG CỦA selectedTool */}
            {(selectedTool?.chiTietDonViSoHuuList || [])
              .filter((donVi: any) => donVi.idTsCon === taiSan.id)
              .map((item: any, index: number) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineConnector
                      sx={{ height: 20, bgcolor: "#bdbdbd" }}
                    />
                    <TimelineDot
                      variant="outlined"
                      sx={{ borderColor: "#bdbdbd", p: 0.5 }}
                    />
                    <TimelineConnector sx={{ bgcolor: "#bdbdbd" }} />
                  </TimelineSeparator>

                  <TimelineContent sx={{ pr: 0 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: "1px solid #f0f0f0",
                        borderRadius: 3,
                        bgcolor: "#fcfaff",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {/* Chỗ này cần lưu ý: Nếu API trả về mã K30, bạn có thể cần map sang tên "Kho công ty" */}
                        {findById(departments, item?.idDonViSoHuu)
                          ?.tenPhongBan ||
                          item?.idDonViSoHuu ||
                          "Không xác định"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        Mã chi tiết CCDC - : {item.idTsCon}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Số lượng đang sở hữu: {item?.soLuong}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Thời gian bàn giao: {item?.thoiGianBanGiao}
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
          </Timeline>
        </Box>
      ))}
    </Paper>
  );
}
