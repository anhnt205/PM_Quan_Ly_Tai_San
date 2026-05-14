import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import NewButton from "../Button/NewButton";
import { Download, Settings, Sync, Upload, Close } from "@mui/icons-material";
import CustomProgress from "../loading/CustomProgress";
import ImportSignatureModal from "./ImportSignatureModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addTab, removeTab, setActiveTab } from "../../redux/tabsSlice";
import { useLocation, useNavigate } from "react-router-dom";

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
  hideActionRow?: boolean;
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
  onImportSignature,
  hideActionRow = false
}: Props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs } = useSelector((state: RootState) => state.tabs);

  const [anchorElExcel, setAnchorElExcel] = useState<null | HTMLElement>(null);
  const [openSignatureModal, setOpenSignatureModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (title) {
      dispatch(addTab({ title, path: location.pathname + location.search }));
    }
  }, [dispatch, title, location.pathname, location.search]);

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const handleRemoveTab = (path: string) => {
    dispatch(removeTab(path));
    // If we removed the active tab, navigate to the new active tab
    const currentPath = location.pathname + location.search;
    if (path === currentPath) {
      const remainingTabs = tabs.filter(t => t.path !== path);
      if (remainingTabs.length > 0) {
        navigate(remainingTabs[remainingTabs.length - 1].path);
      } else {
        navigate('/'); // Or some default route
      }
    }
  };

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
        flexDirection: "column",
        position: "sticky",
        top: 60,
        zIndex: 99,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Hàng 1: Thanh Tab Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          overflowX: 'auto', 
          px: 1,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'grey.400',
          "&::-webkit-scrollbar": {
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#ccc",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#999",
          },
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.path === (location.pathname + location.search);
          return (
            <Box
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 1,
                borderRadius: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: isActive ? '#e3f2fd' : 'transparent',
                color: isActive ? '#1565c0' : '#64748b',
                border: isActive ? '1px solid #bbdefb' : '1px solid transparent',
                '&:hover': {
                  bgcolor: isActive ? '#e3f2fd' : '#f1f5f9',
                  color: isActive ? '#1565c0' : '#334155',
                },
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '14px'
                }}
              >
                {tab.title}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTab(tab.path);
                }}
                sx={{
                  p: 0.1,
                  ml: 0.5,
                  color: isActive ? '#1565c0' : '#94a3b8',
                  '&:hover': { 
                    color: '#ef4444',
                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                  },
                }}
              >
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          );
        })}
      </Box>

      {/* Hàng 2: Các nút hành động (Thêm mới, Excel, Sync...) */}
      {!hideActionRow && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1,
          }}
        >
          {onNewClick && <NewButton onClick={onNewClick} />}
          
          {/* Có thể hiển thị tiêu đề trang hiện tại ở đây nếu muốn */}
          <Typography sx={{ fontWeight: 600, color: "text.primary", }}>
            {title}
          </Typography>

          {/* <Box sx={{ flexGrow: 1 }} /> */}

          {showExcel && (
            <IconButton onClick={handleOpenElExcel} size="small">
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
            {onImport && (
              <MenuItem onClick={handleImportClick}>
                <ListItemIcon>
                  <Download fontSize="small" color="primary" />
                </ListItemIcon>
                <Typography variant="body2">Import từ Excel</Typography>
              </MenuItem>
            )}

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
        </Box>
      )}

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
