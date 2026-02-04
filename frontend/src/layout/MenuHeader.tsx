import {
  ArrowRight,
  KeyboardArrowDown,
  Logout,
  ManageAccounts,
  Person,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import logo from "../assets/images/logo_1.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { ROUTES } from "../utils/routes";
import ExpirationSettingDialog from "../components/common/ExpirationSettingDialog";
import { useAssetTransferAllQuery } from "../pages/AssetTransfer/Mutation";
import {
  getAssetHandoverCount,
  getAssetTransferCount,
  getToolHandoverCount,
  getToolTransferCount,
} from "../utils/helpers";
import { ShowCount } from "../components/common/ShowCount";
import { ShowCountInSubMenu } from "../components/common/ShowCountInSubMenu";
import { useToolTransferAllQuery } from "../pages/ToolTransfer/Mutation";
import { useToolHandoverAllQuery } from "../pages/ToolHandover/Mutation";
import { useAssetHandoverAllQuery } from "../pages/AssetHandover/Mutation";
import api from "../config/api.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const NavMenuItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Xử lý mở submenu
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Xử lý đóng submenu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const buttonStyle = {
    color: "white",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    whiteSpace: "nowrap", // QUAN TRỌNG: Không cho text xuống dòng
    minWidth: "auto", // Đảm bảo nút co giãn theo độ dài text
    px: 2, // Padding ngang cho thoáng
    position: "relative",
  };

  // Xử lý khi click vào item con
  const handleSubItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  // Trường hợp 1: Có menu con (subMenu)
  if (item.subMenu && item.subMenu.length > 0) {
    return (
      <>
        <Button
          color="inherit"
          onClick={handleOpen}
          endIcon={<KeyboardArrowDown />} // Icon mũi tên chỉ xuống
          sx={buttonStyle}
        >
          {item.text}
          {item.count > 0 && <ShowCount count={item.count} />}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {item.subMenu.map((subItem: any, index: number) => (
            <MenuItem
              key={index}
              onClick={() => handleSubItemClick(subItem.path)}
              sx={{ fontSize: "14px", display: "flex", gap: 2 }}
            >
              {subItem.text}
              {subItem.count > 0 && (
                <ShowCountInSubMenu count={subItem.count} />
              )}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  // Trường hợp 2: Menu đơn (không có con)
  return (
    <Button onClick={() => navigate(item.path)} sx={buttonStyle}>
      {item.text}
      {item.count > 0 && <ShowCount count={item.count} />}
    </Button>
  );
};

export default function Menuheader() {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissions = user?.role?.map((r: any) => r.permissionCode) || [];
  const hasPermission = (code?: string) => {
    if (!code) return true; // menu không yêu cầu quyền
    return permissions.includes(code);
  };
  const queryClient = useQueryClient();

  const [anchorElSetting, setAnchorElSetting] = useState<null | HTMLElement>(
    null,
  );
  const [openExpirationDialog, setOpenExpirationDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenSettingMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSetting(event.currentTarget);
  };
  const handleCloseSettingMenu = () => {
    setAnchorElSetting(null);
  };

  const handleOpenExpirationDialog = () => {
    handleCloseSettingMenu();
    setOpenExpirationDialog(true);
  };

  const handleCloseExpirationDialog = () => {
    setOpenExpirationDialog(false);
  };

  // 1. Lấy dữ liệu cấu hình cũ (nếu có)
  const { data: config } = useQuery({
    queryKey: ["expirationConfig", user?.id],
    queryFn: async () => (await api.get(`/config/expiration/${user?.id}`)).data,
    enabled: !!user?.id,
  });

  // 2. Mutation để lưu dữ liệu (Tương đương ConfigReponsitory bên Flutter)
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: {
      thoiHanTaiLieu: number;
      ngayBaoHetHan: number;
    }) =>
      // POST /api/config với đúng 3 trường Swagger yêu cầu
      await api.post("/config", {
        idAccount: user?.taiKhoan?.tenDangNhap, // Sử dụng tenDangNhap làm ID account như bản Flutter
        thoiHanTaiLieu: newConfig.thoiHanTaiLieu,
        ngayBaoHetHan: newConfig.ngayBaoHetHan,
      }),
    onSuccess: () => {
      // Làm tươi lại cache config
      queryClient.invalidateQueries({
        queryKey: ["expirationConfig", user?.id],
      });
      setOpenSnackbar(true);
      handleCloseExpirationDialog();
    },
    onError: (error: any) => {
      console.error("Lỗi POST config:", error);
    },
  });

  const handleConfirmExpiration = async (
    expirationDays: number,
    warningDays: number,
  ) => {
    // Kiểm tra nếu có thay đổi mới gọi API (giống logic Flutter)
    if (
      config?.thoiHanTaiLieu !== expirationDays ||
      config?.ngayBaoHetHan !== warningDays
    ) {
      updateConfigMutation.mutate({
        thoiHanTaiLieu: expirationDays,
        ngayBaoHetHan: warningDays,
      });
    } else {
      handleCloseExpirationDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const { data: assetTransfer = [] } = useAssetTransferAllQuery();
  const { data: toolTransfer = [] } = useToolTransferAllQuery();
  const { data: toolHandover = [] } = useToolHandoverAllQuery();
  const { data: assetHandover = [] } = useAssetHandoverAllQuery();

  const assetTransferCount1 = getAssetTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer,
  );
  const assetTransferCount2 = getAssetTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer,
  );
  const assetTransferCount3 = getAssetTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer,
  );

  const toolTransferCount1 = getToolTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer,
  );
  const toolTransferCount2 = getToolTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer,
  );
  const toolTransferCount3 = getToolTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer,
  );

  const assetHandoverCount = getAssetHandoverCount(
    user?.taiKhoan?.tenDangNhap,
    assetHandover,
  );
  const toolHandoverCount = getToolHandoverCount(
    user?.taiKhoan?.tenDangNhap,
    toolHandover,
  );
  const menuItems = [
    {
      text: "Tổng quan",
      path: ROUTES.MAIN,
    },
    {
      text: "Danh mục",
      icon: <ArrowRight color="primary" />,
      path: "#",
      subMenu: [
        { text: "Quản lý nhân viên", path: ROUTES.STAFF, code: "NHANVIEN" },
        {
          text: "Quản lý phòng ban",
          path: ROUTES.DEPARTMENT,
          code: "PHONGBAN",
        },
        { text: "Quản lý chức vụ", path: ROUTES.POSITION },
        { text: "Quản lý dự án", path: ROUTES.PROJECT, code: "DUAN" },
        { text: "Quản lý nguồn vốn", path: ROUTES.CAPITALSOURCE },
        { text: "Nhóm tài sản", path: ROUTES.ASSETGROUP },
        { text: "Mô hình tài sản", path: ROUTES.MODELASSET },
        { text: "Loại tài sản", path: ROUTES.TYPEASSET },
        { text: "Nhóm ccdc", path: ROUTES.TOOLGROUP },
        { text: "Loại ccdc", path: ROUTES.TOOLTYPE },
        { text: "Đơn vị tính", path: ROUTES.UNIT },
        { text: "Lý do tăng", path: ROUTES.REASONINCREASE },
        { text: "Hiện trạng", path: ROUTES.CURRENTSTATUS },
      ].filter((sub) => hasPermission(sub.code)),
    },
    {
      text: "Quản lý tài sản",
      path: ROUTES.ASSETMANAGER,
      code: "TAISAN",
    },
    {
      text: "Quản lý CCDC-Vật tư",
      path: ROUTES.TOOLMANAGER,
      code: "CCDCVT",
    },
    {
      text: "Điều động tài sản",
      path: "/",
      code: "DIEUDONG_TAISAN",
      count: assetTransferCount1 + assetTransferCount2 + assetTransferCount3,
      subMenu: [
        {
          text: "Cấp phát tài sản",
          path: `${ROUTES.ASSETTRANSFER}?type=1`,
          count: assetTransferCount1,
        },
        {
          text: "Điều chuyển tài sản",
          path: `${ROUTES.ASSETTRANSFER}?type=2`,
          count: assetTransferCount2,
        },
        {
          text: "Thu hồi tài sản",
          path: `${ROUTES.ASSETTRANSFER}?type=3`,
          count: assetTransferCount3,
        },
      ],
    },
    {
      text: "Điều động CCDC - vật tư",
      path: "/",
      code: "DIEUDONG_CCDC",
      count: toolTransferCount1 + toolTransferCount2 + toolTransferCount3,
      subMenu: [
        {
          text: "Cấp phát CCDC - vật tư",
          path: `${ROUTES.TOOLTRANSFER}?type=1`,
          count: toolTransferCount1,
        },
        {
          text: "Điều chuyển CCDC - vật tư",
          path: `${ROUTES.TOOLTRANSFER}?type=2`,
          count: toolTransferCount2,
        },
        {
          text: "Thu hồi CCDC - vật tư",
          path: `${ROUTES.TOOLTRANSFER}?type=3`,
          count: toolTransferCount3,
        },
      ],
    },
    {
      text: "Bàn giao tài sản",
      path: "/ban_giao_tai_san",
      code: "BANGIAO_TAISAN",
      count: assetHandoverCount,
    },
    {
      text: "Bàn giao CCDC-Vật tư",
      path: ROUTES.TOOLHANDOVER,
      code: "BANGIAO_CCDC",
      count: toolHandoverCount,
    },
    {
      text: "Báo cáo",
      path: "/",
      code: "BAOCAO",
      subMenu: [
        { text: "Báo cáo S22-DN", path: `${ROUTES.REPORT}?type=1` },
        { text: "Biên bản kiểm kê", path: `${ROUTES.REPORT}?type=2` },
        {
          text: "Báo cáo 05-TSCD-24-2017-TT-BTC",
          path: `${ROUTES.REPORT}?type=3`,
        },
        { text: "Mẫu số-01", path: `${ROUTES.REPORT}?type=4` },
        { text: "Mẫu số-21", path: `${ROUTES.REPORT}?type=5` },
      ],
    },
  ].filter((item) => {
    // 1. Kiểm tra quyền của menu chính
    const canSeeMenu = hasPermission(item.code);

    // 2. Nếu menu chính có subMenu, chỉ hiện menu chính nếu có ít nhất 1 subMenu bên trong
    if (item.subMenu) {
      return canSeeMenu && item.subMenu.length > 0;
    }

    return canSeeMenu;
  });

  return (
    <Box
      sx={{
        height: "60px",
        display: "flex",
        gap: 3,
        px: 3,
        background:
          "linear-gradient(to right,rgb(0, 158, 96, 1) 0%,rgb(2, 110, 66, 1) 100%)",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          gap: 0.5, // Giảm khoảng cách giữa các nút
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none", // Ẩn trên Firefox
          msOverflowStyle: "none", // Ẩn trên IE/Edge cũ
          "&::-webkit-scrollbar": {
            display: "none", // Ẩn trên Chrome/Safari
          },
        }}
      >
        {menuItems.map((item, index) => (
          <NavMenuItem key={index} item={item} />
        ))}
      </Box>
      <Box sx={{ flexGrow: 0 }}>
        <IconButton
          sx={{ display: "flex", gap: 2 }}
          onClick={handleOpenSettingMenu}
        >
          <Typography sx={{ color: "white", fontSize: 14 }}>
            {user?.taiKhoan?.hoTen}
          </Typography>
          <Avatar src={logo} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElSetting}
          open={Boolean(anchorElSetting)}
          onClose={handleCloseSettingMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          slotProps={{
            paper: {
              sx: {
                padding: "8px", // Padding cho khung bao ngoài menu
                borderRadius: "12px",
                boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          <MenuItem
            sx={{ borderBottom: "1px solid black", display: "flex", gap: 2 }}
          >
            <ListItemIcon>
              <Avatar src={logo} alt="avatar" />
            </ListItemIcon>
            <Typography>{user?.taiKhoan?.hoTen}</Typography>
          </MenuItem>
          <MenuItem sx={{ py: 2 }} onClick={handleCloseSettingMenu}>
            <ListItemIcon>
              <Person fontSize="small" color="success" />
            </ListItemIcon>
            <Typography
              component={Link}
              to="/tai_khoan"
              sx={{
                textDecoration: "none",
                color: "black",
                cursor: "pointer",
              }}
            >
              Quản lý tài khoản
            </Typography>
          </MenuItem>
          <MenuItem sx={{ py: 2 }} onClick={handleOpenExpirationDialog}>
            <ListItemIcon>
              <Settings fontSize="small" color="success" />
            </ListItemIcon>
            <Typography>Thiết lập thời gian hết hạn</Typography>
          </MenuItem>
          <MenuItem
            sx={{ py: 2 }}
            onClick={() => {
              handleCloseSettingMenu();
              dispatch(logout());
              navigate(ROUTES.LOGIN);
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" color="success" />
            </ListItemIcon>
            <Typography>Đăng xuất</Typography>
          </MenuItem>
        </Menu>
      </Box>

      {/* Dialog Thiết lập thời gian hết hạn */}
      <ExpirationSettingDialog
        open={openExpirationDialog}
        onClose={handleCloseExpirationDialog}
        onConfirm={handleConfirmExpiration}
        initialConfig={config}
        loading={updateConfigMutation.isPending}
      />

      {/* Snackbar thông báo thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Thiết lập thời gian hết hạn thành công"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: {
            backgroundColor: "#1b8a4a",
            color: "white",
            fontWeight: 500,
          },
        }}
      />
    </Box>
  );
}
