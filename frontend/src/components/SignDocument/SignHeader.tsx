import { useState, useEffect } from "react";
import { Close, PictureAsPdf, Description, Edit, Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export const SignHeader = ({
  pagesCount,
  handleExportPDF,
  onCancel,
  title,
  trangThai,
  initialNote,
  onSaveNote,
  onReject,
}: {
  pagesCount: number;
  handleExportPDF: () => void;
  onCancel: () => void;
  title?: string;
  trangThai?: number;
  initialNote?: string;
  onSaveNote?: (note: string) => Promise<void>;
  onReject?: () => Promise<void>;
}) => {
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    setNoteText(initialNote || "");
  }, [initialNote]);

  const handleOpenNoteDialog = () => {
    setNoteText(initialNote || "");
    setOpenNoteDialog(true);
  };

  const handleSaveNote = async () => {
    if (onSaveNote) {
      setSavingNote(true);
      try {
        await onSaveNote(noteText);
        setOpenNoteDialog(false);
      } catch (error) {
        console.error("Lỗi khi lưu ghi chú:", error);
      } finally {
        setSavingNote(false);
      }
    } else {
      setOpenNoteDialog(false);
    }
  };

  const showReject = trangThai !== undefined && trangThai !== 0 && trangThai !== 3;

  return (
    <Box
      sx={{
        bgcolor: "white",
        px: 3,
        py: 2,
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: "#f3f4f6",
            border: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Description sx={{ color: "#4b5563", fontSize: 22 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "#111827",
              mb: 0.25,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title || "Soạn & Ký Tài Liệu"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${pagesCount} trang`}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.75rem",
                fontWeight: 500,
                bgcolor: "#f3f4f6",
                color: "#6b7280",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexShrink: 0 }}>
        {/* Nút Ghi chú - luôn luôn hiển thị */}
        <Button
          variant="outlined"
          size="medium"
          onClick={handleOpenNoteDialog}
          startIcon={<Edit sx={{ fontSize: 18, color: "#028a54" }} />}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            px: 2.5,
            py: 0.8,
            borderRadius: "10px",
            color: "#028a54",
            borderColor: "rgba(2, 138, 84, 0.25)",
            bgcolor: "white",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              borderColor: "#028a54",
              bgcolor: "rgba(2, 138, 84, 0.04)",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 8px rgba(2, 138, 84, 0.08)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          Ghi chú
        </Button>

        {/* Nút Từ chối - hiển thị có điều kiện */}
        {showReject && (
          <Button
            variant="contained"
            color="error"
            size="medium"
            onClick={onReject}
            startIcon={<Cancel sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              px: 2.5,
              py: 0.8,
              borderRadius: "10px",
              boxShadow: "none",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: "#d32f2f",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(211, 47, 47, 0.2)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Từ chối
          </Button>
        )}

        <Button
          variant="outlined"
          size="medium"
          onClick={handleExportPDF}
          startIcon={<PictureAsPdf sx={{ fontSize: 18, color: "#ef4444" }} />}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            px: 2.5,
            py: 0.8,
            borderRadius: "10px",
            color: "#ef4444",
            borderColor: "rgba(239, 68, 68, 0.25)",
            bgcolor: "white",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              borderColor: "#ef4444",
              bgcolor: "rgba(239, 68, 68, 0.04)",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.08)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          Xuất PDF
        </Button>

        <IconButton
          onClick={onCancel}
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#f3f4f6",
            "&:hover": {
              bgcolor: "#e5e7eb",
            },
          }}
        >
          <Close sx={{ fontSize: 20, color: "#6b7280" }} />
        </IconButton>
      </Box>

      {/* Popup Dialog nhập ghi chú */}
      <Dialog
        open={openNoteDialog}
        onClose={() => !savingNote && setOpenNoteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Ghi chú tài liệu</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nội dung ghi chú"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            disabled={savingNote}
            InputProps={{
              sx: {
                borderRadius: "8px",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenNoteDialog(false)}
            color="inherit"
            disabled={savingNote}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveNote}
            variant="contained"
            color="primary"
            disabled={savingNote}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              bgcolor: "#028a54",
              "&:hover": {
                bgcolor: "#027244",
              },
            }}
          >
            {savingNote ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
