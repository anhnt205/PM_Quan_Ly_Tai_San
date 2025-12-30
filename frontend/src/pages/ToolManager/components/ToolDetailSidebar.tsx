import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { Close, Info } from "@mui/icons-material";

interface ToolDetailSidebarProps {
  selectedTool: any;
  onClose: () => void;
}

export default function ToolDetailSidebar({
  selectedTool,
  onClose,
}: ToolDetailSidebarProps) {
  if (!selectedTool) return null;

  // Sample detail items grouped by title (matching the image structure)
  const groupedDetails = [
    {
      title: "CCDC_01-STT-0",
      nsx: "2020",
      items: [
        {
          status: "Đang ủy",
          code: "CCDC_01-STT-0",
          quantity: 5,
          transferTime: "2025-11-29 02:30:48",
        },
      ],
    },
    {
      title: "CCDC_01-STT-1",
      nsx: "2025",
      items: [
        {
          status: "Đang ủy",
          code: "CCDC_01-STT-1",
          quantity: 5,
          transferTime: "2025-11-29 02:30:48",
        },
        {
          status: "null",
          code: "CCDC_01-STT-1",
          quantity: 0,
          transferTime: "-",
        },
      ],
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        height: "fit-content",
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
              Chi tiết Chi tiết đơn vị sở hữu "{selectedTool?.toolName || ""}"
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Title */}
      <Box px={2} py={2} borderBottom="1px solid" borderColor="divider">
        <Typography
          variant="body2"
          sx={{
            color: "#ff4444",
            fontWeight: 600,
            backgroundColor: "#fff0f0",
            padding: "8px 12px",
            borderRadius: "8px",
          }}
        >
          {selectedTool?.toolNumber} - NSX: 2020
        </Typography>
      </Box>

      {/* Detail Items Timeline */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        {groupedDetails.map((group, groupIndex) => (
          <Box key={groupIndex} display="flex" flexDirection="column" gap={2}>
            {/* Title Section */}
            <Typography
              variant="body2"
              sx={{
                color: "#ff4444",
                fontWeight: 600,
                backgroundColor: "#fff0f0",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              {group.title} - NSX: {group.nsx}
            </Typography>

            {/* Items for this group */}
            <Box display="flex" flexDirection="column" gap={2}>
              {group.items.map((item, itemIndex) => (
                <Box key={itemIndex} display="flex" gap={2}>
                  {/* Timeline */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#666",
                      }}
                    />
                    {itemIndex < group.items.length - 1 && (
                      <Box
                        sx={{
                          width: "2px",
                          height: "80px",
                          backgroundColor: "#ddd",
                        }}
                      />
                    )}
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: "#f9f9f9",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    {/* Status Label */}
                    <Typography
                      variant="body2"
                      sx={{
                        marginBottom: "8px",
                        fontSize: "12px",
                        color: "#333",
                      }}
                    >
                      {item.status}
                    </Typography>

                    {/* Detail Code */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#0066cc",
                        marginBottom: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      Mã chỉ tiết CCDC - Vật tư: {item.code}
                    </Typography>

                    {/* Quantity */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#28a745",
                        marginBottom: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      Số lượng đang sở hữu: {item.quantity}
                    </Typography>

                    {/* Transfer Time */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "12px",
                      }}
                    >
                      Thời gian ban giao: {item.transferTime}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
