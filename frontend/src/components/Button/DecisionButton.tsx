import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import GavelIcon from "@mui/icons-material/Gavel";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // Icon cho nhập nhanh

export default function DecisionButton({
  data, // data bây giờ là mảng các hàng đã chọn: any[]
  handleDecision,
  onClose,
}: {
  data: any[];
  handleDecision?: (payload: any[]) => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [decisionMap, setDecisionMap] = useState<{ [key: string]: string }>({});
  const [commonCode, setCommonCode] = useState("");

  // Cập nhật decisionMap khi data thay đổi (ví dụ: mở modal)
  useEffect(() => {
    if (open) {
      const initialMap: { [key: string]: string } = {};
      data.forEach((item) => {
        initialMap[item.id] = "";
      });
      setDecisionMap(initialMap);
    }
  }, [open, data]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setCommonCode("");
    onClose();
  };

  // Hàm nhập nhanh cho tất cả các hàng
  const applyToAll = () => {
    const updatedMap = { ...decisionMap };
    data.forEach((item) => {
      updatedMap[item.id] = commonCode;
    });
    setDecisionMap(updatedMap);
  };

  const handleInputChange = (id: string, value: string) => {
    setDecisionMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSend = async () => {
    // Chuyển format thành mảng các object gửi lên Backend
    const payload = data.map((item) => ({
      id: item.id,
      soQuyetDinh: decisionMap[item.id] || "",
    }));

    await handleDecision?.(payload);
    handleClose();
  };

  // Kiểm tra xem tất cả các ô đã được nhập số quyết định chưa
  const isInvalid = data.some((item) => !decisionMap[item.id]?.trim());

  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="contained"
        color="primary"
        disabled={data.length === 0}
        startIcon={<GavelIcon />}
        onClick={handleClickOpen}
        sx={{
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
          px: 3,
        }}
      >
        Ban hành ({data.length}) quyết định
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Xác nhận ban hành quyết định
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Vui lòng nhập **Số quyết định** để hoàn tất quy trình ban hành quyết định.
          </DialogContentText>

          {/* Bảng danh sách hàng đã chọn */}
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ maxHeight: 300 }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Mã</TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                    Số quyết định
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {item.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="Nhập số..."
                        fullWidth
                        value={decisionMap[item.id] || ""}
                        onChange={(e) =>
                          handleInputChange(item.id, e.target.value)
                        }
                        error={!decisionMap[item.id]?.trim()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={handleClose} color="inherit">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSend}
            variant="contained"
            endIcon={<SendIcon />}
            disabled={isInvalid}
          >
            Gửi ({data.length}) ban hành
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
