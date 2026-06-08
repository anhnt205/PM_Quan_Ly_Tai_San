import { Box, Typography, Paper, IconButton } from "@mui/material";
import { Close, Info, Business, CalendarToday } from "@mui/icons-material";
import { findById } from "../../../utils/helpers";

interface ToolDetailSidebarProps {
  selectedTool: any;
  departments: any[];
  onClose: () => void;
}

// Utility to format ISO datetime string to a human-readable DD/MM/YYYY HH:mm format
const formatDateTimeDisplay = (value: any) => {
  if (!value) return "Chưa xác định";
  try {
    const parts = value.toString().split("T");
    if (parts.length === 2) {
      const datePart = parts[0]; // YYYY-MM-DD
      const timePart = parts[1].split(".")[0]; // HH:mm:ss
      const dParts = datePart.split("-");
      if (dParts.length === 3) {
        const tParts = timePart.split(":");
        const timeStr = tParts.length >= 2 ? ` ${tParts[0]}:${tParts[1]}` : "";
        return `${dParts[2]}/${dParts[1]}/${dParts[0]}${timeStr}`;
      }
    }
    return value;
  } catch (e) {
    return value;
  }
};

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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8fafc",
        borderLeft: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        p={2.5}
        borderBottom="1px solid"
        borderColor="divider"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#fff"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "rgba(4, 180, 110, 0.08)",
              color: "#04b46eff",
              flexShrink: 0,
            }}
          >
            <Info fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.72rem" }}
            >
              Đơn vị sở hữu
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.95rem",
                lineHeight: 1.2,
              }}
            >
              {selectedTool?.ten || ""}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "text.secondary",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.05)",
              color: "text.primary",
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Main List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            bgcolor: "rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {selectedTool?.chiTietTaiSanList?.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" py={5} px={2}>
            <Info color="disabled" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              Chưa có thông tin chi tiết tài sản/đơn vị sở hữu
            </Typography>
          </Box>
        ) : (
          selectedTool?.chiTietTaiSanList?.map((taiSan: any) => (
            <Box
              key={taiSan.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {/* Asset Badge Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.8,
                  py: 1,
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                  borderRadius: "10px",
                  border: "1px dashed",
                  borderColor: "grey.300",
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#04b46eff",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.85rem",
                    }}
                  >
                    {taiSan?.id}
                  </Typography>
                </Box>
                {/* Year of Production */}
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: taiSan?.namSanXuat ? "rgba(4, 180, 110, 0.08)" : "grey.200",
                    color: taiSan?.namSanXuat ? "#04b46eff" : "text.secondary",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                  }}
                >
                  {taiSan?.namSanXuat ? `NSX: ${taiSan.namSanXuat}` : "NSX: --"}
                </Typography>
              </Box>

              {/* Ownership Items with Timeline */}
              <Box sx={{ pl: 0.5 }}>
                {(() => {
                  const items = (selectedTool?.chiTietDonViSoHuuList || []).filter(
                    (donVi: any) => donVi.idTsCon === taiSan.id
                  );
                  if (items.length === 0) {
                    return (
                      <Typography variant="caption" color="text.secondary" sx={{ pl: 3, fontStyle: "italic" }}>
                        Chưa bàn giao cho đơn vị nào
                      </Typography>
                    );
                  }
                  return items.map((item: any, index: number, arr: any[]) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="stretch"
                      gap={2}
                      position="relative"
                      sx={{ mb: index === arr.length - 1 ? 0 : 2 }}
                    >
                      {/* Timeline column */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{ width: 16 }}
                      >
                        {/* Upper Line */}
                        {index !== 0 && (
                          <Box sx={{ flex: 1, width: "1.5px", bgcolor: "#e2e8f0" }} />
                        )}

                        {/* Node Dot */}
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            border: "2.5px solid #04b46eff",
                            bgcolor: "#fff",
                            boxShadow: index === 0 ? "0 0 0 3.5px rgba(4, 180, 110, 0.15)" : "none",
                            mt: 1.2,
                            mb: 1.2,
                            zIndex: 1,
                          }}
                        />

                        {/* Lower Line */}
                        {index !== arr.length - 1 && (
                          <Box sx={{ flex: 1, width: "1.5px", bgcolor: "#e2e8f0" }} />
                        )}
                      </Box>

                      {/* Content Card */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          flex: 1,
                          border: "1px solid",
                          borderColor: "grey.200",
                          borderRadius: "12px",
                          bgcolor: "#fff",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            borderColor: "#04b46eff",
                            boxShadow: "0 4px 12px rgba(4, 180, 110, 0.06)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        {/* Department/Room name */}
                        <Box display="flex" alignItems="start" gap={1} mb={1.5}>
                          <Business fontSize="small" sx={{ color: "text.secondary", mt: 0.1, fontSize: "16px" }} />
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: "#1e293b",
                              lineHeight: 1.3,
                              fontSize: "0.85rem",
                            }}
                          >
                            {findById(departments, item?.idDonViSoHuu)?.tenPhongBan ||
                              item?.idDonViSoHuu ||
                              "Không xác định"}
                          </Typography>
                        </Box>

                        {/* Ownership Details */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1.5,
                            pt: 1.2,
                            borderTop: "1px solid",
                            borderColor: "grey.100",
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.72rem" }}>
                              Số lượng sở hữu
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#04b46eff" }}>
                              {item?.soLuong || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.72rem" }}>
                              Mã CCDC con
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                fontWeight: 600,
                                color: "#475569",
                                fontSize: "0.75rem",
                              }}
                            >
                              {item.idTsCon || "---"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Handover Time */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            mt: 1.5,
                            pt: 1,
                            borderTop: "1px dashed",
                            borderColor: "grey.100",
                          }}
                        >
                          <CalendarToday sx={{ fontSize: "12px", color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                            Bàn giao: {formatDateTimeDisplay(item?.thoiGianBanGiao)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  ));
                })()}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}
