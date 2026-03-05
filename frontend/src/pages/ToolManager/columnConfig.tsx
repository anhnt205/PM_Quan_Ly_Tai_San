import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { ContentCopy, History as HistoryIcon } from "@mui/icons-material";
import { ReactNode } from "react";

export interface ColumnConfig {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: number;
  visible: boolean;
  isShow: boolean;
  render?: (value: any, row?: any) => ReactNode;
}

export const createColumns = (
  handleOpenHistory: (row: any) => void,
  handleCopy: (row: any) => void,
): ColumnConfig[] => [
  {
    key: "id",
    label: "Mã CCDC",
    visible: true,
    isShow: true,
    width: 150,
  },
  {
    key: "ten",
    label: "Tên CCDC",
    visible: true,
    isShow: true,
    width: 400,
  },
  {
    key: "tenDonVi",
    label: "Đơn vị nhập",
    visible: true,
    isShow: true,
    width: 200,
  },
  {
    key: "tenNhomCCDC",
    label: "Nhóm CCDC",
    visible: true,
    isShow: true,
    width: 100,
    align: "center",
  },
  {
    key: "ngayNhap",
    label: "Ngày nhập",
    visible: true,
    isShow: true,
    width: 120,
    align: "center",
  },
  {
    key: "donViTinh",
    label: "Đơn vị tính",
    visible: true,
    isShow: true,
    width: 100,
    align: "center",
  },
  {
    key: "soLuong",
    label: "Số lượng",
    align: "center",
    visible: true,
    isShow: true,
    width: 100,
    render: (v: any) => Number(v).toLocaleString("vi-VN"),
  },
  {
    key: "giaTri",
    label: "Giá trị",
    align: "center",
    visible: true,
    isShow: true,
    width: 100,
    render: (v: any) => Number(v).toLocaleString("vi-VN"),
  },
  { key: "kyHieu", label: "Ký hiệu", visible: true, isShow: true, width: 100 },
  { key: "ghiChu", label: "Ghi chú", visible: true, isShow: true, width: 100 },
  {
    key: "nguoiTao",
    label: "Người tạo",
    visible: true,
    isShow: true,
    width: 100,
  },
  {
    key: "ngayTao",
    label: "Ngày tạo",
    visible: true,
    isShow: true,
    width: 120,
  },
  {
    key: "isActive",
    label: "Trạng thái",
    visible: true,
    isShow: true,
    width: 100,
    render: (v: any) => (
      <Chip
        label={v ? "Hoạt động" : "Không hoạt động"}
        color={v ? "success" : "error"}
        size="small"
        variant="filled"
        sx={{
          color: "#fff",
          fontWeight: "bold",
        }}
      />
    ),
  },
  {
    key: "action",
    label: "Hành động",
    visible: true,
    isShow: true,
    width: 100,
    render: (_: any, row: any) => (
      <Box display="flex" gap={1} justifyContent="center" alignItems="center">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(row);
          }}
        >
          <ContentCopy color="primary" />
        </IconButton>
        <Tooltip title="Xem lịch sử điều chuyển">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenHistory(row);
            }}
            sx={{
              color: "primary.main",
              bgcolor: "action.hover",
              "&:hover": {
                bgcolor: "action.selected",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s",
            }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
  {
    key: "chiTietTaiSanList",
    label: "Chi tiết",
    visible: true,
    isShow: false,
  },
  {
    key: "chiTietDonViSoHuuList",
    label: "Chi tiết",
    visible: true,
    isShow: false,
  },
  {
    key: "taiSanConList",
    label: "Chi tiết",
    visible: true,
    isShow: false,
  },
];
