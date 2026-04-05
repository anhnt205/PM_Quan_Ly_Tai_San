import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Download,
  Upload,
  PictureAsPdf,
  ErrorOutline,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useHuongDanQuery, useHuongDanMutation } from "./Mutation";
import s3Service from "../../services/S3Service";

const HuongDanSuDung: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const isAdmin = user?.taiKhoan?.tenDangNhap === "admin";

  const { data: huongDanList, isLoading, error } = useHuongDanQuery();
  const { createMutation, updateMutation } = useHuongDanMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    tenHuongDan: "",
    taiLieu: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const currentHuongDan =
    huongDanList && huongDanList.length > 0 ? huongDanList[0] : null;

  useEffect(() => {
    if (currentHuongDan?.taiLieu) {
      loadPreview(currentHuongDan.taiLieu);
    }
  }, [currentHuongDan]);

  const loadPreview = async (key: string) => {
    try {
      const blob = await s3Service.preview(key);
      if (blob) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    } catch (err) {
      console.error("Error loading preview:", err);
    }
  };

  const handleDownload = () => {
    if (currentHuongDan?.taiLieu) {
      s3Service.download(currentHuongDan.taiLieu);
    }
  };

  const handleOpenEdit = () => {
    if (currentHuongDan) {
      setEditData({
        id: currentHuongDan.id,
        tenHuongDan: currentHuongDan.tenHuongDan,
        taiLieu: currentHuongDan.taiLieu,
      });
    } else {
      setEditData({ id: "", tenHuongDan: "", taiLieu: "" });
    }
    setOpenEdit(true);
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      let taiLieuKey = editData.taiLieu;

      if (selectedFile) {
        // Upload new file to S3
        taiLieuKey = await s3Service.put({
          name: selectedFile.name,
          file: selectedFile,
          type: "tailieu",
        });
      }

      const payload = {
        ...editData,
        taiLieu: taiLieuKey,
      };

      if (currentHuongDan) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      setOpenEdit(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Error saving huong dan:", err);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "calc(100vh)",
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Hướng dẫn sử dụng
        </Typography>
        {/* <Box display="flex" gap={1}>
          {currentHuongDan && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
              sx={{ textTransform: "none", borderRadius: "8px" }}
            >
              Tải tài liệu
            </Button>
          )}
        </Box> */}
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          bgcolor: "#f0f2f5",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #e0e0e0",
        }}
      >
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title="Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        ) : (
          <Box textAlign="center" color="text.secondary">
            <ErrorOutline sx={{ fontSize: 64, mb: 1, opacity: 0.5 }} />
            <Typography>
              Chưa có tài liệu hướng dẫn nào được tải lên.
            </Typography>
          </Box>
        )}
      </Paper>

      {isAdmin && (
        <Tooltip title="Chỉnh sửa hướng dẫn">
          <Fab
            color="success"
            aria-label="edit"
            sx={{ position: "fixed", bottom: 32, right: 32 }}
            onClick={handleOpenEdit}
          >
            <Edit sx={{ color: "white" }} />
          </Fab>
        </Tooltip>
      )}

      <Dialog
        open={openEdit}
        onClose={() => !uploading && setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentHuongDan ? "Cập nhật hướng dẫn" : "Tạo mới hướng dẫn"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            label="Tên hướng dẫn"
            fullWidth
            value={editData.tenHuongDan}
            onChange={(e) =>
              setEditData({ ...editData, tenHuongDan: e.target.value })
            }
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Tài liệu (PDF)
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
                sx={{ textTransform: "none" }}
              >
                Chọn File
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </Button>
              <Typography variant="body2">
                {selectedFile
                  ? selectedFile.name
                  : currentHuongDan?.taiLieu
                    ? "Đã có file"
                    : "Chưa chọn file"}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={uploading}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              uploading ||
              !editData.tenHuongDan ||
              (!selectedFile && !currentHuongDan)
            }
          >
            {uploading ? <CircularProgress size={24} /> : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HuongDanSuDung;
