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
  Typography,
} from "@mui/material";
import logo from "../assets/images/logo_1.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { ROUTES } from "../utils/routes";

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
              sx={{ fontSize: "14px" }}
            >
              {subItem.text}
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
    </Button>
  );
};
export default function Menuheader() {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorElSetting, setAnchorElSetting] = useState<null | HTMLElement>(
    null
  );
  const handleOpenSettingMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSetting(event.currentTarget);
  };
  const handleCloseSettingMenu = () => {
    setAnchorElSetting(null);
  };
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
        { text: "Quản lý nhân viên", path: ROUTES.STAFF },
        { text: "Quản lý phòng ban", path: ROUTES.DEPARTMENT },
        { text: "Quản lý chức vụ", path: ROUTES.POSITION },
        { text: "Quản lý dự án", path: ROUTES.PROJECT },
        { text: "Quản lý nguồn vốn", path: ROUTES.CAPITALSOURCE },
        { text: "Loại tài sản", path: ROUTES.TYPEASSET },
        { text: "Nhóm ccdc", path: ROUTES.TOOLGROUP },
        { text: "Loại ccdc", path: ROUTES.TOOLTYPE },
        { text: "Đơn vị tính", path: ROUTES.UNIT },
        { text: "Lý do tăng", path: ROUTES.REASONINCREASE },
        { text: "Hiện trạng", path: ROUTES.CURRENTSTATUS },
      ],
    },
    {
      text: "Quản lý tài sản",
      path: ROUTES.ASSETMANAGER,
    },
    {
      text: "Quản lý CCDC-Vật tư",
      path: "/",
    },
    {
      text: "Điều động tài sản",
      path: "/",
      subMenu: [
        { text: "Cấp phát tài sản", path: ROUTES.ASSETTRANSFER },
        { text: "Điều chuyển tài sản", path: "/" },
        { text: "Thu hồi tài sản", path: "/" },
      ],
    },
    {
      text: "Điều động CCDC - vật tư",
      path: "/",
      subMenu: [
        { text: "Cấp phát CCDC - vật tư", path: "/" },
        { text: "Điều chuyển CCDC - vật tư", path: "/" },
        { text: "Thu hồi CCDC - vật tư", path: "/" },
      ],
    },
    {
      text: "Bàn giao tài sản",
      path: "/",
    },
    {
      text: "Bàn giao CCDC-Vật tư",
      path: "/",
    },
    {
      text: "Báo cáo",
      path: "/",
      subMenu: [
        { text: "Báo cáo S22-DN", path: "/" },
        { text: "Biên bản kiểm kê", path: "/" },
        { text: "Báo cáo 05-TSCD-24-2017-TT-BTC", path: "/" },
        { text: "Mẫu số-01", path: "/" },
        { text: "Mẫu số-21", path: "/" },
      ],
    },
  ].filter(Boolean);

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
          <Typography sx={{ color: "white", fontSize: 18 }}>
            {user?.username}
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
            <Typography>{user?.username}</Typography>
          </MenuItem>
          <MenuItem sx={{ py: 2 }} onClick={handleCloseSettingMenu}>
            <ListItemIcon>
              <Person fontSize="small" color="success" />
            </ListItemIcon>
            <Typography>Quản lý tài khoản</Typography>
          </MenuItem>
          <MenuItem sx={{ py: 2 }} onClick={handleCloseSettingMenu}>
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
    </Box>
  );
}
