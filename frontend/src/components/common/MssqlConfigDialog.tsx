import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  ArrowBack,
  PlayArrow,
  Storage,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../Alert";
import { useEffect, useState } from "react";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

const defaultConfig = {
  id: "",
  dbms: "MSSQL",
  ip: "",
  port: "1433",
  dbName: "",
  username: "",
  password: "",
};

export default function MssqlConfigDialog({ open, onClose, onSave }: Props) {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"list" | "form">("list");
  const [currentConfig, setCurrentConfig] = useState(defaultConfig);

  // Fetch all configurations
  const { data: configs = [], isLoading: isFetching } = useQuery({
    queryKey: ["dbConfigList"],
    queryFn: async () => {
      const res = await api.get("/dbconfig");
      // res.data.data expected to be an array of configs
      return res.data.data || [];
    },
    enabled: open,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (payload.id) {
        // Update
        const res = await api.put(`/dbconfig/${payload.id}`, payload);
        return res.data;
      } else {
        // Create
        const res = await api.post("/dbconfig", payload);
        return res.data;
      }
    },
    onSuccess: () => {
      showSuccessAlert("Lưu cấu hình CSDL thành công");
      queryClient.invalidateQueries({ queryKey: ["dbConfigList"] });
      setView("list");
      onSave(currentConfig); 
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Lỗi lưu cấu hình");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/dbconfig/${id}`);
      return res.data;
    },
    onSuccess: () => {
      showSuccessAlert("Xóa cấu hình thành công");
      queryClient.invalidateQueries({ queryKey: ["dbConfigList"] });
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Lỗi xóa cấu hình");
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/dbconfig/test-connection", payload);
      return res.data;
    },
    onSuccess: (data) => {
      showSuccessAlert(data.message || "Kết nối thành công!");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Kết nối thất bại!");
    },
  });

  const handleAdd = () => {
    setCurrentConfig(defaultConfig);
    setView("form");
  };

  const handleEdit = (item: any) => {
    setCurrentConfig(item);
    setView("form");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentConfig({ ...currentConfig, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    saveMutation.mutate(currentConfig);
  };

  const handleTestConnection = (item?: any) => {
    testConnectionMutation.mutate(item || currentConfig);
  };

  // Reset to list view when dialog re-opens
  useEffect(() => {
    if (open) setView("list");
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={"sm"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: alpha("#667eea", 0.05),
          py: 2,
        }}
      >
        {view === "form" && (
          <IconButton
            onClick={() => setView("list")}
            size="small"
            sx={{
              color: "#6b7280",
              "&:hover": { bgcolor: alpha("#667eea", 0.1) },
            }}
          >
            <ArrowBack />
          </IconButton>
        )}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ flex: 1, color: "#111827" }}
        >
          {view === "list"
            ? "Danh sách kết nối CSDL"
            : currentConfig.id
              ? "Sửa cấu hình kết nối"
              : "Thêm mới cấu hình kết nối"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {view === "list" ? (
          <Box>
            {isFetching ? (
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
                <Typography color="textSecondary" fontWeight={500}>
                  Chưa có cấu hình kết nối nào được tạo.
                </Typography>
              </Box>
            ) : (
              <List sx={{ py: 1 }}>
                {configs.map((item: any, index: number) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        px: 3,
                        py: 2,
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: alpha("#667eea", 0.02) },
                      }}
                      secondaryAction={
                        <Box display="flex" gap={0.5}>
                          <Tooltip title="Thử kết nối">
                            <IconButton
                              onClick={() => handleTestConnection(item)}
                              color="info"
                              size="small"
                              sx={{
                                "&:hover": { bgcolor: alpha("#0288d1", 0.1) },
                              }}
                            >
                              <PlayArrow fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sửa">
                            <IconButton
                              onClick={() => handleEdit(item)}
                              color="primary"
                              size="small"
                              sx={{
                                "&:hover": { bgcolor: alpha("#1976d2", 0.1) },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              onClick={() => handleDelete(item.id)}
                              color="error"
                              size="small"
                              sx={{
                                "&:hover": { bgcolor: alpha("#d32f2f", 0.1) },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "10px",
                          bgcolor: alpha("#667eea", 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <Storage sx={{ color: "#667eea", fontSize: 20 }} />
                      </Box>
                      <ListItemText
                        primary={
                          <Typography fontWeight={600} color="#111827">
                            {item.dbName} ({item.dbms})
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="#6b7280">
                            {item.ip}:{item.port} • User: {item.username}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < configs.length - 1 && (
                      <Divider component="li" sx={{ mx: 3 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} p={3}>
            <TextField
              select
              label="Hệ quản trị CSDL"
              name="dbms"
              value={currentConfig.dbms}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="MSSQL">SQL Server</MenuItem>
              {/* <MenuItem value="ORACLE">Oracle</MenuItem>
              <MenuItem value="MYSQL">MySQL</MenuItem> */}
            </TextField>
            <TextField
              label="IP / Hostname (ví dụ: 127.0.0.1)"
              name="ip"
              value={currentConfig.ip}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Nhập địa chỉ máy chủ"
            />
            <TextField
              label="Port"
              name="port"
              value={currentConfig.port}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="1433"
            />
            <TextField
              label="Tên Database (Cơ sở dữ liệu)"
              name="dbName"
              value={currentConfig.dbName}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Nhập tên CSDL"
            />
            <TextField
              label="Tài khoản truy cập"
              name="username"
              value={currentConfig.username}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="sa"
            />
            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              value={currentConfig.password}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="••••••••"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: alpha("#6b7280", 0.03),
          gap: 1,
        }}
      >
        {view === "list" ? (
          <>
            <Button
              onClick={onClose}
              color="inherit"
              sx={{ fontWeight: 600, textTransform: "none" }}
            >
              Đóng
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              onClick={handleAdd}
              color="primary"
              variant="contained"
              startIcon={<Add />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6941a0 100%)",
                },
              }}
            >
              Thêm cấu hình
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => handleTestConnection()}
              color="info"
              variant="outlined"
              disabled={testConnectionMutation.isPending}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              {testConnectionMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                "Kiểm tra kết nối"
              )}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              onClick={() => setView("list")}
              color="inherit"
              sx={{ fontWeight: 600, textTransform: "none" }}
            >
              Quay lại
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                "Lưu cấu hình"
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
