import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  TablePagination,
} from "@mui/material";
import {
  Delete,
  Search as SearchIcon,
  TableView,
  ExpandMore,
  ExpandLess,
  Settings,
} from "@mui/icons-material";

interface DetailItem {
  id: string | number;
  detailCode: string;
  ownerUnit: string;
  quantity: number | string;
  transferTime: string;
}

interface ToolData {
  id: string | number;
  toolNumber: string;
  toolName: string;
  toolInput: string;
  toolGroupName: string;
  toolInputedAt: string;
  toolUnit: string;
  toolQuantity: number | string;
  toolValue: string | number;
  toolSign: string;
  toolNote: string;
  toolCreator: string;
  toolCreatedAt: string;
  toolStatus: string;
  details?: DetailItem[];
  [key: string]: any;
}

interface Props {
  title: string;
  rows: ToolData[];
  onRowClick?: (row: ToolData) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDelete?: (ids: string[]) => void;
}

export default function ToolTableCustom({
  title,
  rows,
  onRowClick,
  selectedIds = [],
  onSelectionChange,
  onDelete,
}: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchValue.toLowerCase());
      })
    );
  }, [rows, searchValue]);

  // Paginate filtered rows
  const paginatedRows = useMemo(() => {
    const startIndex = page * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, page, pageSize]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = filteredRows.map((row) => String(row.id));
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string | number) => {
    const newSelectedIds = [...selectedIds];
    const idStr = String(id);

    if (newSelectedIds.includes(idStr)) {
      newSelectedIds.splice(newSelectedIds.indexOf(idStr), 1);
    } else {
      newSelectedIds.push(idStr);
    }

    onSelectionChange?.(newSelectedIds);
  };

  const handleExpandClick = (id: string | number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpandAll = () => {
    if (expandedRows.size === filteredRows.length) {
      // Collapse all
      setExpandedRows(new Set());
    } else {
      // Expand all
      const allIds = new Set(filteredRows.map((row) => row.id));
      setExpandedRows(allIds);
    }
  };

  const isAllSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selectedIds.includes(String(row.id)));

  const isIndeterminate =
    selectedIds.length > 0 &&
    selectedIds.length < filteredRows.length &&
    paginatedRows.every((row) => selectedIds.includes(String(row.id)));

  const tableRows: React.ReactNode[] = [];

  paginatedRows.forEach((row, index) => {
    const isExpanded = expandedRows.has(row.id);
    const isSelected = selectedIds.includes(String(row.id));

    // Main row
    tableRows.push(
      <TableRow
        key={`row-${row.id}`}
        hover
        sx={{ backgroundColor: isSelected ? "#f0f0f0" : "inherit" }}
      >
        {/* Expand Button Column */}
        <TableCell width="50px" align="center">
          <IconButton
            size="small"
            onClick={() => handleExpandClick(row.id)}
            sx={{ padding: "4px" }}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>

        {/* Checkbox Column */}
        <TableCell padding="checkbox" width="50px">
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelectRow(row.id)}
            inputProps={{ "aria-label": `Select row ${row.id}` }}
          />
        </TableCell>

        {/* Data Columns */}
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolNumber || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolName || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolInput || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolGroupName || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolInputedAt || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolUnit || "-"}
        </TableCell>
        <TableCell align="center" onClick={() => onRowClick?.(row)}>
          {row.toolQuantity || "-"}
        </TableCell>
        <TableCell align="right" onClick={() => onRowClick?.(row)}>
          {row.toolValue || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolSign || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolNote || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolCreator || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolCreatedAt || "-"}
        </TableCell>
        <TableCell onClick={() => onRowClick?.(row)}>
          {row.toolStatus || "-"}
        </TableCell>
      </TableRow>
    );

    // Expanded detail row
    if (isExpanded) {
      // Sample data if no details exist
      const detailsToShow =
        row.details && row.details.length > 0
          ? row.details
          : [
              {
                id: "detail-1",
                detailCode: `${row.toolNumber}-STT-0`,
                ownerUnit: "Phân xưởng Co điện lộ 1",
                quantity: row.toolQuantity || 120,
                transferTime: "2025-11-01 17:54:14",
              },
            ];

      tableRows.push(
        <TableRow key={`detail-${row.id}`} sx={{ backgroundColor: "#fff9e6" }}>
          <TableCell colSpan={15} sx={{ padding: 0 }}>
            <Box sx={{ p: 2, bgcolor: "#fff9e6" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: "14px",
                }}
              >
                Chi tiết đơn vị sở hữu - {row.toolName} ({row.toolNumber})
              </Typography>

              <Table size="small" sx={{ backgroundColor: "#ffffff" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#fff3cd",
                      "& .MuiTableCell-head": {
                        color: "#856404",
                        fontWeight: 700,
                        padding: "12px",
                        border: "1px solid #e0e0e0",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#856404",
                        fontWeight: 700,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Mã chỉ tiết CCDC - Vật tư
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#856404",
                        fontWeight: 700,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Đơn vị sở hữu
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#856404",
                        fontWeight: 700,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Số lượng đang sở hữu
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#856404",
                        fontWeight: 700,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Thời gian ban giao
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailsToShow.map((detail) => (
                    <TableRow key={`detail-item-${detail.id}`}>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.detailCode || "-"}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.ownerUnit || "-"}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.quantity || "-"}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.transferTime || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableCell>
        </TableRow>
      );
    }
  });

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        p={2}
        gap={2}
        sx={{ background: "#f5f5f5" }}
      >
        <TableView sx={{ color: "#1FA463" }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title} ({filteredRows.length})
        </Typography>
      </Box>

      {/* Search and Action Bar */}
      <Grid container spacing={2} p={2} sx={{ backgroundColor: "#fafafa" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Tìm kiếm"
            fullWidth
            size="small"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#666" }} />,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" size="small" startIcon={<Settings />}>
              Cấu hình cột
            </Button>
            {selectedIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  onDelete?.(selectedIds);
                  onSelectionChange?.([]);
                }}
              >
                Xóa ({selectedIds.length})
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Table */}
      <Box
        sx={{ flex: 1, minWidth: 0, overflowX: "auto", overflowY: "hidden" }}
      >
        <Table
          sx={{
            width: "100%",
            minWidth: "fit-content",
            borderCollapse: "collapse",
            "& .MuiTableCell-root": {
              padding: "12px",
              borderBottom: "1px solid #e0e0e0",
              whiteSpace: "nowrap",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1FA463",
                "& .MuiTableCell-head": {
                  color: "#ffffff",
                  fontWeight: 700,
                  padding: "12px",
                  fontSize: "14px",
                },
              }}
            >
              <TableCell
                width="50px"
                align="center"
                sx={{ color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
                onClick={handleExpandAll}
              >
                {expandedRows.size === filteredRows.length ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </TableCell>
              <TableCell
                padding="checkbox"
                width="50px"
                sx={{ color: "#ffffff", fontWeight: 700 }}
              >
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  inputProps={{ "aria-label": "Select all" }}
                  sx={{
                    color: "#ffffff !important",
                    "&.Mui-checked": {
                      color: "#ffffff !important",
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Mã CCDC
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Tên CCDC
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Đơn vị nhập
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Nhóm CCDC
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Ngày nhập
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Đơn vị tính
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#ffffff", fontWeight: 700 }}
              >
                Số lượng
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "#ffffff", fontWeight: 700 }}
              >
                Giá trị
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Ký hiệu
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Ghi chú
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Người tạo
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: 700 }}>
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.length > 0 ? (
              tableRows
            ) : (
              <TableRow>
                <TableCell colSpan={15} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        labelRowsPerPage="Số hàng trên trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  );
}
