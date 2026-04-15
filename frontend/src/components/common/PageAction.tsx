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
import ImportSignatureModal from "./ImportSignatureModal";

interface Props {
  loading?: boolean;
  title: string;
  onNewClick?: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onSyncDb?: () => void;
  showExcel?: boolean;
  showImportSignature?: boolean;
  onImportSignature?: (files: File[]) => void;
}

export default function PageAction({
  loading = false,
  title,
  onNewClick,
  onExport,
  onImport,
  onSyncDb,
  showExcel = false,
  showImportSignature=false,
  onImportSignature
}: Props) {
  const [anchorElExcel, setAnchorElExcel] = useState<null | HTMLElement>(null);
  const [openSignatureModal, setOpenSignatureModal] = useState(false);

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

  const handleSyncDbClick = () => {
    handleCloseMenu();
    if (onSyncDb) onSyncDb();
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
        bgcolor: "background.paper",
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {onNewClick && <NewButton onClick={onNewClick} />}
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

        {/* MỤC MỚI: Đồng bộ từ SQL Server (Dùng Config) */}
        {onSyncDb && (
          <MenuItem onClick={handleSyncDbClick}>
            <ListItemIcon>
              <Sync fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography variant="body2">
              Đồng bộ CSDL Server (Config)
            </Typography>
          </MenuItem>
        )}

        {showImportSignature && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              setOpenSignatureModal(true);
            }}
          >
            <ListItemIcon>
              <Upload fontSize="small" color="success" />
            </ListItemIcon>
            <Typography variant="body2">Import chữ ký</Typography>
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

      <ImportSignatureModal
        open={openSignatureModal}
        onClose={() => setOpenSignatureModal(false)}
        onUpload={(files) => {
          if (onImportSignature) onImportSignature(files);
          setOpenSignatureModal(false);
        }}
      />
    </Box>
  );
}
