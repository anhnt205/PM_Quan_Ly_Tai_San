import { Download, Settings, Upload } from "@mui/icons-material";
import NewButton from "../Button/NewButton";
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";

interface Props {
  title: string;
  onNewClick: () => void;
  onExport?: () => void; // Thêm prop xuất file
  onImport?: (file: File) => void; // Thêm prop nhập file
  showExcel?: boolean;
}

export default function PageAction({
  title,
  onNewClick,
  onExport,
  onImport,
  showExcel = false,
}: Props) {
  const [anchorElExcel, setAnchorElExcel] = useState<null | HTMLElement>(null);

  // Ref để gọi click vào input file ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenElExcel = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElExcel(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElExcel(null);
  };

  const handleImportClick = () => {
    handleCloseMenu();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
      event.target.value = "";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "sticky",
        gap: 2,
        top: 60,
        zIndex: 99,
        bgcolor: "white",
        p: 1,
      }}
    >
      <NewButton onClick={onNewClick} />
      <Typography>{title}</Typography>

      {showExcel && (
        <IconButton onClick={handleOpenElExcel}>
          <Settings color="success" />
        </IconButton>
      )}

      {/* Input file ẩn để phục vụ Import */}
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />

      <Menu
        open={Boolean(anchorElExcel)}
        onClose={handleCloseMenu}
        anchorEl={anchorElExcel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {/* Chỉ hiện nút Import nếu có truyền hàm onImport */}
        {onImport && (
          <MenuItem onClick={handleImportClick}>
            <ListItemIcon>
              <Download color="primary" />
            </ListItemIcon>
            Import dữ liệu
          </MenuItem>
        )}

        {/* Chỉ hiện nút Export nếu có truyền hàm onExport */}
        {onExport && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onExport();
            }}
          >
            <ListItemIcon>
              <Upload color="secondary" />
            </ListItemIcon>
            Xuất toàn bộ
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
