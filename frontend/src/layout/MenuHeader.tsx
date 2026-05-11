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
  Storage,
  Description,
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { ROUTES } from "../utils/routes";
import ExpirationSettingDialog from "../components/common/ExpirationSettingDialog";
import MssqlConfigDialog from "../components/common/MssqlConfigDialog";
import { useAssetTransferPageQuery } from "../pages/AssetTransfer/Mutation";
import {
  getAssetHandoverCount,
  getAssetTransferCount,
  getToolHandoverCount,
  getToolTransferCount,
  getMaintenanceRepairCount,
  findById,
} from "../utils/helpers";
import { ShowCount } from "../components/common/ShowCount";
import { ShowCountInSubMenu } from "../components/common/ShowCountInSubMenu";
import { useToolTransferPageQuery } from "../pages/ToolTransfer/Mutation";
import { useToolHandoverPageQuery } from "../pages/ToolHandover/Mutation";
import { useAssetHandoverPageQuery } from "../pages/AssetHandover/Mutation";
import {
  useMaintenanceRepairPageQuery,
  useMaintenanceRepairResultPageQuery,
} from "../pages/MaintenanceRepair/Mutation";
import api from "../config/api.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useAllDepartmentsQuery } from "../pages/Department/Mutation";
import { useAllPositionsQuery } from "../pages/Position/Mutation";
import { showErrorAlert } from "../components/Alert";
import { useConfig } from "../hooks/useContext";

const isMenuActive = (item: any, pathname: string): boolean => {
  if (item.path === pathname) {
    return true;
  }
  if (item.subMenu) {
    return item.subMenu.some((subItem: any) => isMenuActive(subItem, pathname));
  }
  return false;
};

const NestedMenuItem = ({
  item,
  handleCloseMenu,
}: {
  item: any;
  handleCloseMenu: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isActive = isMenuActive(item, location.pathname);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (path: string) => {
    if (path !== "#") {
      navigate(path);
      handleClose();
      handleCloseMenu();
    }
  };

  const menuItemStyle = (active: boolean) => ({
    fontSize: "14px",
    display: "flex",
    gap: 2,
    justifyContent: "space-between",
    borderRadius: "6px",
    mx: 1,
    my: 0.5,
    backgroundColor: active ? "action.hover" : "transparent",
    "&:hover": {
      backgroundColor: "action.hover",
    },
  });

  if (item.subMenu && item.subMenu.length > 0) {
    return (
      <Box onMouseLeave={handleClose}>
        <MenuItem onClick={handleOpen} sx={menuItemStyle(isActive)}>
          {item.text}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {item.count > 0 && <ShowCountInSubMenu count={item.count} />}
            <ArrowRight fontSize="small" />
          </Box>
        </MenuItem>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          MenuListProps={{ onMouseLeave: handleClose }}
          slotProps={{
            paper: {
              sx: {
                padding: "8px",
                borderRadius: "12px",
                boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          {item.subMenu.map((subItem: any, index: number) => {
            const isSubActive = isMenuActive(subItem, location.pathname);
            return (
              <MenuItem
                key={index}
                onClick={() => handleClick(subItem.path)}
                sx={menuItemStyle(isSubActive)}
              >
                {subItem.text}
                {subItem.count > 0 && (
                  <ShowCountInSubMenu count={subItem.count} />
                )}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
    );
  }

  return (
    <MenuItem
      onClick={() => handleClick(item.path)}
      sx={menuItemStyle(isActive)}
    >
      {item.text}
      {item.count > 0 && <ShowCountInSubMenu count={item.count} />}
    </MenuItem>
  );
};

const NavMenuItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isActive = isMenuActive(item, location.pathname);

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
    borderRadius: "8px",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  };

  // Trường hợp 1: Có menu con (subMenu)
  if (item.subMenu && item.subMenu.length > 0) {
    return (
      <>
        <Button
          color="inherit"
          onClick={handleOpen}
          startIcon={item.icon}
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
          slotProps={{
            paper: {
              sx: {
                padding: "8px",
                borderRadius: "10px",
                boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
                maxHeight: 300,
                "&::-webkit-scrollbar": {
                  width: "6px", // Thanh cuộn nhỏ lại
                  borderRadius: "10px", // Bo góc thanh cuộn
                },

                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1", // Màu nền track
                  borderRadius: "10px",
                },

                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1", // Màu thanh cuộn
                  borderRadius: "10px",

                  "&:hover": {
                    background: "#a8a8a8", // Màu khi hover
                  },
                },
              },
            },
          }}
        >
          {item.subMenu.map((subItem: any, index: number) => (
            <NestedMenuItem
              key={index}
              item={subItem}
              handleCloseMenu={handleClose}
            />
          ))}
        </Menu>
      </>
    );
  }

  // Trường hợp 2: Menu đơn (không có con)
  return (
    <Button
      onClick={() => navigate(item.path)}
      startIcon={item.icon}
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
  const [openMssqlDialog, setOpenMssqlDialog] = useState(false);
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

  const handleOpenMssqlDialog = () => {
    handleCloseSettingMenu();
    setOpenMssqlDialog(true);
  };

  const handleCloseMssqlDialog = () => {
    setOpenMssqlDialog(false);
  };

  const handleSaveMssqlConfig = (config: any) => {
    setOpenSnackbar(true);
  };

  const { data: chucVu = [] } = useAllPositionsQuery();
  const { config, setConfig } = useConfig();

  // 1. Lấy dữ liệu cấu hình (Gọi endpoint chung /config)
  const { data: configResponse } = useQuery({
    queryKey: ["expirationConfig", user?.taiKhoan?.tenDangNhap],
    queryFn: async () => {
      const res = await api.get(`/config/${user?.taiKhoan?.tenDangNhap}`); // Không truyền ID lên URL nữa
      setConfig(res.data);
      return res.data;
    },
    enabled: !!user?.taiKhoan?.tenDangNhap,
  });

  // 2. Mutation để lưu dữ liệu (Tương đương ConfigReponsitory bên Flutter)
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: {
      thoiHanTaiLieu: number;
      ngayBaoHetHan: number;
      ngayBaoDangKiem: number;
    }) =>
      await api.post("/config", {
        idAccount: user?.taiKhoan?.tenDangNhap,
        thoiHanTaiLieu: newConfig.thoiHanTaiLieu,
        ngayBaoHetHan: newConfig.ngayBaoHetHan,
        ngayBaoDangKiem: newConfig.ngayBaoDangKiem,
      }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["expirationConfig", user?.taiKhoan?.tenDangNhap],
      });
      setConfig({
        idAccount: user?.taiKhoan?.tenDangNhap,
        thoiHanTaiLieu: variables.thoiHanTaiLieu,
        ngayBaoHetHan: variables.ngayBaoHetHan,
        ngayBaoDangKiem: variables.ngayBaoDangKiem,
      });
      setOpenSnackbar(true);
      handleCloseExpirationDialog();
    },
    onError: (error: any) => {
      showErrorAlert(
        `Lỗi cấu hình: ${error.response.data.message || error.response.data}`,
      );
    },
  });

  const handleConfirmExpiration = async (
    expirationDays: number,
    warningDays: number,
    registrationWarningDays: number,
  ) => {
    // Kiểm tra nếu có thay đổi mới gọi API (giống logic Flutter)
    if (
      config?.thoiHanTaiLieu !== expirationDays ||
      config?.ngayBaoHetHan !== warningDays ||
      config?.ngayBaoDangKiem !== registrationWarningDays
    ) {
      updateConfigMutation.mutate({
        thoiHanTaiLieu: expirationDays,
        ngayBaoHetHan: warningDays,
        ngayBaoDangKiem: registrationWarningDays,
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

  const { data: transferAssetPage = { items: [], totalItems: 0 } } =
    useAssetTransferPageQuery(
      0,
      999999,
      "",
      undefined,
      undefined,
      4,
      user.taiKhoan?.phongBanId,
      true,
    );
  const {
    data: transferToolPage = { items: [], totalItems: 0, loaiCounts: {} },
  } = useToolTransferPageQuery(
    0,
    999999,
    "",
    undefined,
    undefined,
    4,
    true,
    user.taiKhoan?.phongBanId,
  );
  const { data: maintenanceRepair = { items: [] } } =
    useMaintenanceRepairPageQuery(0, 999999);
  const { data: maintenanceRepairResult = { items: [] } } =
    useMaintenanceRepairResultPageQuery(0, 999999);

  const isBanHanh =
    findById(chucVu, user?.taiKhoan?.chucVuId)?.banHanhQuyetDinh ||
    (false as boolean);

  const assetTransferCount1 = getAssetTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );
  const assetTransferCount2 = getAssetTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );
  const assetTransferCount3 = getAssetTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    assetTransfer.items,
    isBanHanh,
  );

  const toolTransferCount1 = getToolTransferCount(
    1,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );
  const toolTransferCount2 = getToolTransferCount(
    2,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
    isBanHanh,
  );
  const toolTransferCount3 = getToolTransferCount(
    3,
    user?.taiKhoan?.tenDangNhap,
    toolTransfer.items,
    isBanHanh,
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
  const maintenanceRepairResultCount = getMaintenanceRepairCount(
    user?.taiKhoan?.tenDangNhap,
    maintenanceRepairResult.items,
  );

  const filterMenuItemsRecursive = (items: any[]): any[] => {
    return items
      .filter((item) => hasPermission(item.code))
      .map((item) => {
        if (item.subMenu) {
          const filteredSubMenu = filterMenuItemsRecursive(item.subMenu);
          return { ...item, subMenu: filteredSubMenu };
        }
        return item;
      })
      .filter((item) => (item.subMenu ? item.subMenu.length > 0 : true));
  };

  const menuItemsRaw = [
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
        {
          text: "Danh mục hệ thống",
          path: "#",
          subMenu: [
            { text: "Quản lý nhân viên", path: ROUTES.STAFF, code: "NHANVIEN" },
            {
              text: "Quản lý phòng ban",
              path: ROUTES.DEPARTMENT,
              code: "PHONGBAN",
            },
            { text: "Quản lý chức vụ", path: ROUTES.POSITION },
          ],
        },
        {
          text: "Danh mục thiết bị",
          path: "#",
          subMenu: [
            { text: "Nhóm tài sản", path: ROUTES.ASSETGROUP },
            { text: "Mô hình tài sản", path: ROUTES.MODELASSET },
            { text: "Loại tài sản", path: ROUTES.TYPEASSET },
            { text: "Nhóm ccdc", path: ROUTES.TOOLGROUP },
            { text: "Loại ccdc", path: ROUTES.TOOLTYPE },
          ],
        },
        {
          text: "Danh mục khác",
          path: "#",
          subMenu: [
            { text: "Quản lý dự án", path: ROUTES.PROJECT, code: "DUAN" },
            { text: "Quản lý nguồn vốn", path: ROUTES.CAPITALSOURCE },
            { text: "Loại sửa chữa", path: ROUTES.MAINTENANCEREPAIRTYPE },
            { text: "Đơn vị tính", path: ROUTES.UNIT },
            { text: "Lý do tăng", path: ROUTES.REASONINCREASE },
            { text: "Hiện trạng", path: ROUTES.CURRENTSTATUS },
          ],
        },
      ],
    },
    {
      text: "Quản lý tài sản",
      icon: <Inventory fontSize="small" />,
      path: "#",
      subMenu: [
        { text: "Quản lý tài sản", path: ROUTES.ASSETMANAGER, code: "TAISAN" },
        {
          text: "Quản lý CCDC-Vật tư",
          path: ROUTES.TOOLMANAGER,
          code: "CCDCVT",
        },
      ],
    },
    {
      text: "Điều chuyển thiết bị",
      icon: <LocalShipping fontSize="small" />,
      path: "#",
      count:
        assetTransferCount1 +
        assetTransferCount2 +
        assetTransferCount3 +
        toolTransferCount1 +
        toolTransferCount2 +
        toolTransferCount3,
      subMenu: [
        {
          text: "Điều chuyển tài sản",
          path: "#",
          code: "DIEUDONG_TAISAN",
          count:
            assetTransferCount1 + assetTransferCount2 + assetTransferCount3,
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
          text: "Điều chuyển CCDC - vật tư",
          path: "#",
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
          text: "Phê duyệt",
          path: ROUTES.TRANSFER_APPROVAL,
          count: assetTransferCount1 + assetTransferCount2 + assetTransferCount3 + toolTransferCount1 + toolTransferCount2 + toolTransferCount3,
        },
        {
          text: "Quản lý biên bản",
          path: ROUTES.TRANSFER_RECORD,
        },
      ],
    },
    {
      text: "Bàn giao thiết bị",
      icon: <Handshake fontSize="small" />,
      path: "#",
      count:
        assetHandoverCount +
        toolHandoverCount +
        transferAssetPage.totalItems +
        transferToolPage.totalItems,
      subMenu: [
        {
          text: "Bàn giao tài sản",
          path: "/ban_giao_tai_san",
          code: "BANGIAO_TAISAN",
          count: assetHandoverCount + transferAssetPage.totalItems,
        },
        {
          text: "Bàn giao CCDC-Vật tư",
          path: ROUTES.TOOLHANDOVER,
          code: "BANGIAO_CCDC",
          count: toolHandoverCount + transferToolPage.totalItems,
        },
        {
          text: "Phê duyệt",
          path: ROUTES.HANDOVER_APPROVAL,
          count: assetHandoverCount + toolHandoverCount + transferAssetPage.totalItems + transferToolPage.totalItems,
        },
        {
          text: "Quản lý biên bản",
          path: ROUTES.HANDOVER_RECORD,
        },
      ],
    },
    {
      text: "Sửa chữa bảo dưỡng",
      icon: <Engineering fontSize="small" />,
      path: "#",
      count: maintenanceRepairCount + maintenanceRepairResultCount,
      subMenu: [
        {
          text: "Quản lý sửa chữa",
          path: ROUTES.MAINTENANCE_MANAGER,
        },
        {
          text: "Chu kỳ bảo dưỡng",
          path: ROUTES.MAINTENANCE_CYCLE,
        },
        {
          text: "Định mức",
          path: ROUTES.REPAIRNORM,
        },
        {
          text: "Kế hoạch sửa chữa",
          path: ROUTES.MAINTENANCEPLANREPAIR,
        },
        {
          text: "Phê duyệt",
          path: ROUTES.MAINTENANCE_APPROVAL,
        },
        {
          text: "Quản lý biên bản",
          path: ROUTES.MAINTENANCE_RECORD,
        },
      ],
    },
    {
      text: "Báo cáo",
      icon: <Assessment fontSize="small" />,
      path: ROUTES.REPORT,
      code: "BAOCAO",
    },
    {
      text: "HDSD",
      icon: <Description fontSize="small" />,
      path: ROUTES.HUONGDAN,
    },
  ];

  const menuItems = filterMenuItemsRecursive(menuItemsRaw);

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
            <Typography>Thiết lập thời gian</Typography>
          </MenuItem>
          <MenuItem sx={{ py: 2 }} onClick={handleOpenMssqlDialog}>
            <ListItemIcon>
              <Storage fontSize="small" color="success" />
            </ListItemIcon>
            <Typography>Cấu hình server</Typography>
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
        initialConfig={config || undefined}
        loading={updateConfigMutation.isPending}
      />

      {/* Dialog Mssql config */}
      <MssqlConfigDialog
        open={openMssqlDialog}
        onClose={handleCloseMssqlDialog}
        onSave={handleSaveMssqlConfig}
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
