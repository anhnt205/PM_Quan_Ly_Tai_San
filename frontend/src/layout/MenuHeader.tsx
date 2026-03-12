import {
  ArrowRight,
  KeyboardArrowDown,
  Logout,
  Person,
  Settings,
  ChevronRight,
  ChevronLeft,
  Dashboard,
  Category,
  Inventory,
  SwapHoriz,
  LocalShipping,
  Handshake,
  Engineering,
  Assessment,
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
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { ROUTES } from "../utils/routes";
import ExpirationSettingDialog from "../components/common/ExpirationSettingDialog";
import { useAssetTransferPageQuery } from "../pages/AssetTransfer/Mutation";
import {
  getAssetHandoverCount,
  getAssetTransferCount,
  getToolHandoverCount,
  getToolTransferCount,
  getMaintenanceRepairCount,
} from "../utils/helpers";
import { ShowCount } from "../components/common/ShowCount";
import { ShowCountInSubMenu } from "../components/common/ShowCountInSubMenu";
import { useToolTransferPageQuery } from "../pages/ToolTransfer/Mutation";
import { useToolHandoverPageQuery } from "../pages/ToolHandover/Mutation";
import { useAssetHandoverPageQuery } from "../pages/AssetHandover/Mutation";
import { useMaintenanceRepairPageQuery } from "../pages/MaintenanceRepair/Mutation";
import api from "../config/api.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const NavMenuItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const buttonStyle = {
    color: "white",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    minWidth: "auto",
    px: 2,
    position: "relative",
  };

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
          startIcon={item.icon} // THÊM DÒNG NÀY ĐỂ HIỂN THỊ ICON
          endIcon={<KeyboardArrowDown />}
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
    <Button
      onClick={() => navigate(item.path)}
      startIcon={item.icon} // THÊM DÒNG NÀY ĐỂ HIỂN THỊ ICON
      sx={buttonStyle}
    >
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
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const menuScrollRef = React.useRef<HTMLDivElement>(null);

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

  // 1. Lấy dữ liệu cấu hình (Gọi endpoint chung /config)
  const { data: configResponse } = useQuery({
    queryKey: ["expirationConfig", user?.taiKhoan?.tenDangNhap],
    queryFn: async () => {
      const res = await api.get("/config"); // Không truyền ID lên URL nữa
      return res.data;
    },
    enabled: !!user?.taiKhoan?.tenDangNhap,
  });

  // 2. Bóc tách dữ liệu:
  // Vì gọi /config thường trả về mảng hoặc object chứa data,
  // ta cần tìm đúng config của user hiện tại trong mảng đó.
  const config = React.useMemo(() => {
    const rawData = configResponse?.data || configResponse;
    console.log("Dữ liệu thô từ API:", rawData); // Thêm dòng này

    if (Array.isArray(rawData)) {
      // Nếu là mảng, tìm cái nào có idAccount khớp với user đang đăng nhập
      return rawData.find(
        (item: any) => item.idAccount === user?.taiKhoan?.tenDangNhap,
      );
    }
    // Nếu là object đơn lẻ (Trường hợp Server tự lọc theo Token)
    return rawData;
  }, [configResponse, user]);

  // 2. Mutation để lưu dữ liệu (Tương đương ConfigReponsitory bên Flutter)
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: {
      thoiHanTaiLieu: number;
      ngayBaoHetHan: number;
    }) =>
      await api.post("/config", {
        idAccount: user?.taiKhoan?.tenDangNhap,
        thoiHanTaiLieu: newConfig.thoiHanTaiLieu,
        ngayBaoHetHan: newConfig.ngayBaoHetHan,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expirationConfig", user?.taiKhoan?.tenDangNhap],
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

  const { data: assetTransfer = { items: [] } } = useAssetTransferPageQuery(
    0,
    999999,
  );
  const { data: toolTransfer = { items: [] } } = useToolTransferPageQuery(
    0,
    999999,
  );
  const { data: toolHandover = { items: [] } } = useToolHandoverPageQuery(
    0,
    999999,
  );
  const { data: assetHandover = { items: [] } } = useAssetHandoverPageQuery(
    0,
    999999,
  );
  const { data: maintenanceRepair = { items: [] } } =
    useMaintenanceRepairPageQuery(0, 999999);

  const assetTransferCount1 = getAssetTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
  );
  const assetTransferCount2 = getAssetTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
  );
  const assetTransferCount3 = getAssetTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
  );

  const toolTransferCount1 = getToolTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
  );
  const toolTransferCount2 = getToolTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
  );
  const toolTransferCount3 = getToolTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
  );

  const assetHandoverCount = getAssetHandoverCount(
    user?.taiKhoan?.tenDangNhap,
    assetHandover.items,
  );
  const toolHandoverCount = getToolHandoverCount(
    user?.taiKhoan?.tenDangNhap,
    toolHandover.items,
  );

  const maintenanceRepairCount = getMaintenanceRepairCount(
    user?.taiKhoan?.tenDangNhap,
    maintenanceRepair.items,
  );

  const menuItems = [
    {
      text: "Tổng quan",
      icon: <Dashboard fontSize="small" />,
      path: ROUTES.MAIN,
    },
    {
      text: "Danh mục",
      icon: <Category fontSize="small" />,
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
        { text: "Loại kế hoạch sửa chữa", path: ROUTES.PlanType },
        { text: "Loại sửa chữa bảo dưỡng", path: ROUTES.MAINTENANCEREPAIRTYPE },
        { text: "Đơn vị tính", path: ROUTES.UNIT },
        { text: "Lý do tăng", path: ROUTES.REASONINCREASE },
        { text: "Hiện trạng", path: ROUTES.CURRENTSTATUS },
      ].filter((sub) => hasPermission(sub.code)),
    },
    {
      text: "Quản lý tài sản",
      icon: <Inventory fontSize="small" />,
      path: ROUTES.ASSETMANAGER,
      code: "TAISAN",
    },
    {
      text: "Quản lý CCDC-Vật tư",
      icon: <Inventory fontSize="small" />,
      path: ROUTES.TOOLMANAGER,
      code: "CCDCVT",
    },
    {
      text: "Điều động tài sản",
      icon: <LocalShipping fontSize="small" />,
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
      icon: <LocalShipping fontSize="small" />,
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
      icon: <Handshake fontSize="small" />,
      path: "/ban_giao_tai_san",
      code: "BANGIAO_TAISAN",
      count: assetHandoverCount,
    },
    {
      text: "Bàn giao CCDC-Vật tư",
      icon: <Handshake fontSize="small" />,
      path: ROUTES.TOOLHANDOVER,
      code: "BANGIAO_CCDC",
      count: toolHandoverCount,
    },
    {
      text: "Sửa chữa bảo dưỡng",
      icon: <Engineering fontSize="small" />,
      path: "/",
      count: maintenanceRepairCount,
      subMenu: [
        {
          text: "Kế hoạch sửa chữa bảo dưỡng",
          path: `${ROUTES.MAINTENANCEPLANREPAIR}`,
        },
        {
          text: "Phiếu sửa chữa bảo dưỡng",
          path: `${ROUTES.MAINTENANCEREPAIR}`,
          count: maintenanceRepairCount,
        },
      ],
    },
    {
      text: "Báo cáo",
      icon: <Assessment fontSize="small" />,
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

  // Hàm kiểm tra xem có thể cuộn hay không
  const checkScroll = () => {
    if (menuScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Hàm cuộn menu sang phải
  const handleScrollRight = () => {
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Hàm cuộn menu sang trái
  const handleScrollLeft = () => {
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Kiểm tra cuộn khi component mount hoặc khi menuItems thay đổi
  React.useEffect(() => {
    checkScroll();
    const ref = menuScrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      return () => {
        ref.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [menuItems]);

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
      {/* Nút cuộn trái */}
      {canScrollLeft && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleScrollLeft}
            sx={{
              color: "white",
              p: 0.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Box>
      )}

      <Box
        ref={menuScrollRef}
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

      {/* Nút cuộn phải */}
      {canScrollRight && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleScrollRight}
            sx={{
              color: "white",
              p: 0.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      )}
      <Box sx={{ flexGrow: 0 }}>
        <IconButton
          sx={{ display: "flex", gap: 2 }}
          onClick={handleOpenSettingMenu}
        >
          <Typography
            noWrap
            sx={{
              color: "white",
              fontSize: 12,
              maxWidth: "150px", // Hoặc độ rộng bạn muốn (ví dụ: 100%, 200px)
              display: "block", // Đảm bảo nó nhận thuộc tính width/maxWidth
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
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
