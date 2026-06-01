import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import {
  Sync,
  Close,
  KeyboardArrowDown,
  Add,
  DriveFileRenameOutline,
} from "@mui/icons-material";
import CustomProgress from "../loading/CustomProgress";
import ImportSignatureModal from "./ImportSignatureModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addTab, removeTab, setActiveTab } from "../../redux/tabsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

interface Props {
  loading?: boolean;
  title: string;
  onNewClick?: () => void;
  /** @deprecated Chuyển xuống dùng onImportExcel trong TableCustom */
  onExport?: () => void;
  /** @deprecated Chuyển xuống dùng onImportExcel trong TableCustom */
  onImport?: (file: File) => void;
  onSyncDb?: () => void;
  /** @deprecated Không còn dùng để kiểm soát dropdown */
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
  showImportSignature = false,
  onImportSignature,
  hideActionRow = false,
}: Props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs } = useSelector((state: RootState) => state.tabs);

  const [openSignatureModal, setOpenSignatureModal] = useState(false);

  // Chỉ hiển thị dropdown "Tiện ích" khi còn chức năng lẻ (Đồng bộ CSDL)
  const hasDropdownItems = !!onSyncDb;

  const [anchorElExtra, setAnchorElExtra] = useState<null | HTMLElement>(null);

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
    const currentPath = location.pathname + location.search;
    if (path === currentPath) {
      const remainingTabs = tabs.filter((t) => t.path !== path);
      if (remainingTabs.length > 0) {
        navigate(remainingTabs[remainingTabs.length - 1].path);
      } else {
        navigate("/");
      }
    }
  };

  const handleSyncDbClick = () => {
    setAnchorElExtra(null);
    if (onSyncDb) onSyncDb();
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
        borderColor: "divider",
      }}
    >
      {/* Hàng 1: Thanh Tab Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
          px: 1,
          py: 0.5,
          borderBottom: "1px solid",
          borderColor: "grey.200",
          bgcolor: "#f8fafc",
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
          const isActive = tab.path === location.pathname + location.search;
          return (
            <Box
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: isActive ? "#e3f2fd" : "transparent",
                color: isActive ? "#1565c0" : "#64748b",
                border: isActive
                  ? "1px solid #bbdefb"
                  : "1px solid transparent",
                "&:hover": {
                  bgcolor: isActive ? "#e3f2fd" : "#f1f5f9",
                  color: isActive ? "#1565c0" : "#334155",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
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
                  color: isActive ? "#1565c0" : "#94a3b8",
                  "&:hover": {
                    color: "#ef4444",
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                  },
                }}
              >
                <Close sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          );
        })}
      </Box>

      {/* Hàng 2: Các nút hành động */}
      {!hideActionRow && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 4,
            p: 1.5,
            px: 3,
            bgcolor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Tiêu đề trang nằm bên trái */}
          <Box
            sx={{
              borderLeft: "4px solid #14a760",
              pl: 1.5,
              py: 0.5,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 750,
                color: "#1e293b",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Các nút hành động nằm bên phải */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Nút Import chữ ký - render trực tiếp (không qua dropdown) */}
            {showImportSignature && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenSignatureModal(true)}
                startIcon={<DriveFileRenameOutline />}
                sx={{
                  borderRadius: "10px",
                  borderColor: "rgba(59, 130, 246, 0.3)",
                  color: "#3b82f6",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.85rem",
                  px: 2,
                  py: 0.75,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#3b82f6",
                    bgcolor: "rgba(59, 130, 246, 0.05)",
                  },
                }}
              >
                Import chữ ký
              </Button>
            )}

            {/* Dropdown "Tiện ích" - chỉ hiện khi có chức năng lẻ (Đồng bộ CSDL) */}
            {hasDropdownItems && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setAnchorElExtra(e.currentTarget)}
                  endIcon={<KeyboardArrowDown />}
                  sx={{
                    borderRadius: "10px",
                    borderColor: "rgba(20, 167, 96, 0.3)",
                    color: "#14a760",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.85rem",
                    px: 2,
                    py: 0.75,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "#14a760",
                      bgcolor: "rgba(20, 167, 96, 0.05)",
                    },
                  }}
                >
                  Tiện ích
                </Button>
                <Menu
                  open={Boolean(anchorElExtra)}
                  onClose={() => setAnchorElExtra(null)}
                  anchorEl={anchorElExtra}
                  slotProps={{
                    paper: {
                      sx: {
                        padding: "4px",
                        borderRadius: "12px",
                        boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                >
                  {onSyncDb && (
                    <MenuItem
                      onClick={handleSyncDbClick}
                      sx={{ borderRadius: "8px", mx: 0.5, my: 0.25 }}
                    >
                      <ListItemIcon>
                        <Sync fontSize="small" color="primary" />
                      </ListItemIcon>
                      <Typography variant="body2">
                        Đồng bộ CSDL Server (Config)
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}

            {onNewClick && (
              <Button
                variant="contained"
                size="small"
                onClick={onNewClick}
                startIcon={<Add />}
                sx={{
                  borderRadius: "10px",
                  bgcolor: "#14a760",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "0.85rem",
                  px: 2.5,
                  py: 0.8,
                  boxShadow: "0 4px 12px rgba(20, 167, 96, 0.2)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "#118f51",
                    boxShadow: "0 6px 16px rgba(20, 167, 96, 0.3)",
                  },
                }}
              >
                Thêm mới
              </Button>
            )}
          </Box>
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
