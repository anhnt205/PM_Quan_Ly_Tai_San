import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

interface ImportSignatureModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export default function ImportSignatureModal({
  open,
  onClose,
  onUpload,
}: ImportSignatureModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    // reset input so same files can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handeRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    onUpload(selectedFiles);
    // do not close immediately, let the parent handle close/loading state if needed
    // or we can close and clear here:
    setSelectedFiles([]);
    onClose();
  };

  const handleCancelClick = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>Tải lên chữ ký (Nhiều ảnh)</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            border: "2px dashed #1976d2",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: "#f5f9ff",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUpload color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body1" color="textSecondary">
            Nhấn vào đây để chọn ảnh chữ ký
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Hỗ trợ chọn nhiều ảnh (PNG, JPG, JPEG)
          </Typography>
        </Box>
        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        {selectedFiles.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle2" mb={1}>
              Danh sách file đã chọn ({selectedFiles.length}):
            </Typography>
            <List dense sx={{ maxHeight: 200, overflow: "auto", border: "1px solid #eee", borderRadius: 1 }}>
              {selectedFiles.map((file, index) => (
                <ListItem key={index} divider={index < selectedFiles.length - 1}>
                  <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(1)} KB`} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => handeRemoveFile(index)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleUploadClick}
          color="primary"
          variant="contained"
          disabled={selectedFiles.length === 0}
        >
          Tải lên
        </Button>
      </DialogActions>
    </Dialog>
  );
}
