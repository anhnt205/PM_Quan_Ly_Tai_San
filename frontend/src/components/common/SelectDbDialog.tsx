import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Typography,
  Box,
  Radio,
  alpha,
  Divider,
} from "@mui/material";
import { Storage, Sync } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/api.config";
import { useState } from "react";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (dbConfigId: string) => void;
}

export default function SelectDbDialog({ open, onClose, onConfirm }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["dbConfigListSelect"],
    queryFn: async () => {
      const res = await api.get("/dbconfig");
      return res.data.data || [];
    },
    enabled: open,
  });

  const handleConfirm = () => {
    if (selectedId) {
      onConfirm(selectedId);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px" },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha("#667eea", 0.05),
          fontWeight: 700,
          color: "#111827",
          py: 2.5,
        }}
      >
        Chọn nguồn dữ liệu để đồng bộ
      </DialogTitle>
      <DialogContent sx={{ p: 0, minHeight: "200px" }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress size={30} />
          </Box>
        ) : configs.length === 0 ? (
          <Box textAlign="center" py={6} px={3}>
            <Storage sx={{ fontSize: 48, color: "#d1d5db", mb: 1 }} />
            <Typography color="textSecondary" variant="body2">
              Chưa có cấu hình kết nối nào được tạo.
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {configs.map((item: any, index: number) => (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedId(item.id)}
                    sx={{
                      px: 3,
                      py: 2,
                      bgcolor: selectedId === item.id ? alpha("#667eea", 0.04) : "transparent",
                      borderLeft: "4px solid",
                      borderColor: selectedId === item.id ? "#667eea" : "transparent",
                      "&:hover": {
                        bgcolor: alpha("#667eea", 0.08),
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Radio
                        checked={selectedId === item.id}
                        color="primary"
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontWeight={600} color={selectedId === item.id ? "#667eea" : "#111827"}>
                          {item.dbName} ({item.dbms})
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="#6b7280">
                           {item.ip}:{item.port} • User: {item.username}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < configs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha("#6b7280", 0.02) }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
          Hủy bỏ
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleConfirm}
          disabled={!selectedId}
          variant="contained"
          startIcon={<Sync />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
            "&:disabled": { opacity: 0.5, color: "white" },
            "&:hover": {
                background: "linear-gradient(135deg, #5a6ed0 0%, #694291 100%)",
            }
          }}
        >
          Bắt đầu đồng bộ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
