import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import NewButton from "../Button/NewButton";
import { Download, Settings, Sync, Upload } from "@mui/icons-material";
import CustomProgress from "../loading/CustomProgress";

interface Props {
  loading?: boolean;
  title: string;
  onNewClick: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onSyncBak?: (file: File) => void;
  showExcel?: boolean;
}

export default function PageAction({
  loading = false,
  title,
  onNewClick,
  onExport,
  onImport,
  onSyncBak,
  showExcel = false,
}: Props) {
  const [anchorElExcel, setAnchorElExcel] = useState<null | HTMLElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bakInputRef = useRef<HTMLInputElement>(null);

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

  const handleSyncBakClick = () => {
    // <--- Hàm mở dialog chọn file .bak
    handleCloseMenu();
    bakInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
      event.target.value = "";
    }
  };

  const handleBakFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // <--- Xử lý file .bak
    const file = event.target.files?.[0];
    if (file && onSyncBak) {
      onSyncBak(file);
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
        bgcolor: "background.paper",
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <NewButton onClick={onNewClick} />
      <Typography sx={{ fontWeight: "medium", color: "text.primary" }}>
        {title}
      </Typography>

      {showExcel && (
        <IconButton onClick={handleOpenElExcel}>
          <Settings color="success" />
        </IconButton>
      )}

      {/* Input file Excel */}
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />

      {/* Input file .bak */}
      <input
        type="file"
        hidden
        ref={bakInputRef}
        accept=".bak"
        onChange={handleBakFileChange}
      />

      <Menu
        open={Boolean(anchorElExcel)}
        onClose={handleCloseMenu}
        anchorEl={anchorElExcel}
      >
        {/* Mục Import Excel cũ */}
        {onImport && (
          <MenuItem onClick={handleImportClick}>
            <ListItemIcon>
              <Download fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography variant="body2">Import từ Excel</Typography>
          </MenuItem>
        )}

        {/* MỤC MỚI: Đồng bộ từ SQL Server */}
        {onSyncBak && (
          <MenuItem onClick={handleSyncBakClick}>
            <ListItemIcon>
              <Sync fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography variant="body2">
              Đồng bộ từ SQL Server (.bak)
            </Typography>
          </MenuItem>
        )}

        {onExport && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onExport();
            }}
          >
            <ListItemIcon>
              <Upload fontSize="small" color="secondary" />
            </ListItemIcon>
            <Typography variant="body2">Xuất toàn bộ Excel</Typography>
          </MenuItem>
        )}
      </Menu>

      <CustomProgress
        title="Hệ thống đang xử lý dữ liệu..."
        loading={loading}
      />
    </Box>
  );
}
