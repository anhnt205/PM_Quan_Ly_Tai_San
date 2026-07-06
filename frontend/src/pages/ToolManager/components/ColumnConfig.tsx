import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { SearchRounded, ViewColumn } from "@mui/icons-material";
import React, { useMemo } from "react";
// Giả định interface của bạn, hãy điều chỉnh nếu cần
// interface ColumnConfig { key: string; label: string; visible: boolean; }
import { ColumnConfig } from "../columnConfig";
import FieldSearch from "../../../components/TextField/FieldSearch";

interface Props {
  columns: ColumnConfig[];
  onChange?: (columns: ColumnConfig[]) => void;
}

export default function ColumnConfigMenu({ columns, onChange }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = React.useState("");

  const open = Boolean(anchorEl);

  // 1. Logic lọc cột dựa trên tìm kiếm
  const filteredColumns = useMemo(() => {
    return columns.filter((col) =>
      col.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [columns, searchValue]);

  // 2. Kiểm tra trạng thái của nút "Tất cả"
  const isAllVisible = columns.every((col) => col.visible);
  const isSomeVisible = columns.some((col) => col.visible) && !isAllVisible;

  const toggleColumn = (key: string) => {
    onChange?.(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const toggleAll = () => {
    const newValue = !isAllVisible;
    onChange?.(columns.map((col) => ({ ...col, visible: newValue })));
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="primary">
        <ViewColumn />
        <Typography ml={1} variant="button">
          Cột
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: { maxHeight: 400, width: "250px" },
        }}
      >
        {/* Thanh tìm kiếm cố định ở trên đầu */}
        <Box
          sx={{
            p: 1,
            sticky: "top",
            backgroundColor: "background.paper",
            zIndex: 1,
          }}
        >
          <FieldSearch
            titleSearch="Tìm kiếm"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </Box>

        <Divider />

        {/* Danh sách các cột đã được lọc */}
        <Box sx={{ maxHeight: 250, overflow: "auto" }}>
          {filteredColumns.length > 0 ? (
            filteredColumns.map((col) => (
              <MenuItem key={col.key} onClick={() => toggleColumn(col.key)}>
                <Checkbox size="small" checked={col.visible} />
                <Typography variant="body2">{col.label}</Typography>
              </MenuItem>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
            >
              Không tìm thấy cột
            </Typography>
          )}
        </Box>
        <Divider />

        {/* Nút Chọn tất cả / Bỏ chọn tất cả */}
        <MenuItem onClick={toggleAll}>
          <Checkbox
            checked={isAllVisible}
            indeterminate={isSomeVisible} // Hiện dấu gạch ngang nếu chỉ chọn một vài cột
          />
          <Typography variant="body2" fontWeight="bold">
            {isAllVisible ? "Ẩn tất cả" : "Hiện tất cả"}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
