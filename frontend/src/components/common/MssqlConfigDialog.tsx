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
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../Alert";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export default function MssqlConfigDialog({ open, onClose, onSave }: Props) {
  const queryClient = useQueryClient();

  const [config, setConfig] = useState({
    id: "",
    dbms: "MSSQL",
    ip: "",
    port: "",
    dbName: "",
    username: "",
    password: "",
  });

  // Fetch dữ liệu đầu tiên (nếu có)
  const { data: fetchConfig, isLoading: isFetching } = useQuery({
    queryKey: ["dbConfig"],
    queryFn: async () => {
      const res = await api.get("/dbconfig");
      const list = res.data.data;
      if (list && list.length > 0) {
        return list[0]; // Lấy data đầu tiên như yêu cầu
      }
      return null;
    },
    enabled: open,
  });

  useEffect(() => {
    if (fetchConfig) {
      setConfig({
        id: fetchConfig.id || "",
        dbms: fetchConfig.dbms || "MSSQL",
        ip: fetchConfig.ip || "",
        port: fetchConfig.port || "",
        dbName: fetchConfig.dbName || "",
        username: fetchConfig.username || "",
        password: fetchConfig.password || "",
      });
    }
  }, [fetchConfig]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (payload.id) {
        // Cập nhật
        const res = await api.put(`/dbconfig/${payload.id}`, payload);
        return res.data;
      } else {
        // Thêm mới
        const res = await api.post("/dbconfig", payload);
        return res.data;
      }
    },
    onSuccess: (data) => {
      showSuccessAlert("Lưu cấu hình CSDL thành công");
      queryClient.invalidateQueries({ queryKey: ["dbConfig"] });
      onSave(config); // Pass back to MenuHeader to show snackbar or handle close
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Lỗi lưu cấu hình");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    saveMutation.mutate(config);
  };

  const handleTestConnection = () => {
    testConnectionMutation.mutate(config);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cấu hình kết nối Cơ sở dữ liệu</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            select
            label="Hệ quản trị CSDL"
            name="dbms"
            value={config.dbms}
            onChange={handleChange}
            fullWidth
            size="small"
          >
            <MenuItem value="MSSQL">SQL Server</MenuItem>
            {/* <MenuItem value="MySQL">MySQL</MenuItem>
            <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
            <MenuItem value="Oracle">Oracle</MenuItem> */}
          </TextField>
          <TextField
            label="IP (ex: 127.0.0.1)"
            name="ip"
            value={config.ip}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Port"
            name="port"
            value={config.port}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Tên Database (Database Name)"
            name="dbName"
            value={config.dbName}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Username"
            name="username"
            value={config.username}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={config.password}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button 
           onClick={handleTestConnection} 
           color="info" 
           variant="outlined"
           disabled={testConnectionMutation.isPending || isFetching}
        >
          {testConnectionMutation.isPending ? <CircularProgress size={20} /> : "Kiểm tra kết nối"}
        </Button>
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Hủy
          </Button>
          <Button 
            onClick={handleSave} 
            color="primary" 
            variant="contained"
            disabled={saveMutation.isPending || isFetching}
          >
            {saveMutation.isPending ? <CircularProgress size={20} /> : "Lưu cấu hình"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
