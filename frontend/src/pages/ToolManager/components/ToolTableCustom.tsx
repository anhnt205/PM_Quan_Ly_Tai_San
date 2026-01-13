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
import { ColumnConfig } from "../columnConfig";
import ColumnConfigMenu from "./ColumnConfig";
import { GridFeatureMode } from "@mui/x-data-grid";

interface Props {
  title: string;
  rows: any[];
  total: number;
  columns: ColumnConfig[];
  onRowClick?: (row: any) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDelete?: (ids: string[]) => void;
  onColumnsChange?: (columns: ColumnConfig[]) => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue?: string;
  paginationModel?: { page: number; pageSize: number };
  onPaginationModelChange?: (model: any) => void;
  loading?: boolean;
}

export default function ToolTableCustom({
  title,
  rows,
  total,
  columns,
  onRowClick,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onColumnsChange,
  setSearchValue,
  searchValue = "",
  paginationModel,
  onPaginationModelChange,
  loading = false,
}: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set()
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = rows.map((row: any) => String(row.id));
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

  const handleExpandAll = () => {
    if (expandedRows.size === total) {
      // Collapse all
      setExpandedRows(new Set());
    } else {
      // Expand all
      const allIds = new Set(rows.map((row) => row.id));
      setExpandedRows(allIds);
    }
  };

  const isAllSelected =
    total > 0 && rows.every((row) => selectedIds.includes(String(row.id)));

  const isIndeterminate =
    selectedIds.length > 0 &&
    selectedIds.length < total &&
    rows.every((row) => selectedIds.includes(String(row.id)));

  const tableRows: React.ReactNode[] = [];

  // Visible columns used for sizing and colSpan calculations
  const visibleColumns = useMemo(
    () => columns.filter((c) => c.visible && c.isShow),
    [columns]
  );

  // Compute a reasonable minWidth for the table so it can overflow horizontally
  const tableMinWidth = useMemo(() => {
    const colsWidth = visibleColumns.reduce(
      (s, c) => s + (c.width ? Number((c as any).width) : 150),
      0
    );
    // extra space for expand + checkbox columns and paddings
    const extra = 120;
    return colsWidth + extra;
  }, [visibleColumns]);

  rows.forEach((row, index) => {
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
        <TableCell width="50px" align="center">
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelectRow(row.id)}
            inputProps={{ "aria-label": `Select row ${row.id}` }}
          />
        </TableCell>

        {/* Data Columns */}
        {visibleColumns.map((col) => {
          const rawValue = row[col.key];
          const displayValue = col.render
            ? col.render(rawValue, row)
            : rawValue ?? "-";

          return (
            <TableCell
              key={col.key}
              onClick={() => onRowClick?.(row)}
              align={col.align || "left"}
              sx={{ minWidth: (col as any).width || 150 }}
            >
              {displayValue}
            </TableCell>
          );
        })}
      </TableRow>
    );

    // Expanded detail row
    if (isExpanded) {
      // Sample data if no details exist
      const detailsToShow =
        row.chiTietDonViSoHuuList && row.chiTietDonViSoHuuList.length > 0
          ? row.chiTietDonViSoHuuList
          : [];

      tableRows.push(
        <TableRow key={`detail-${row.id}`} sx={{ backgroundColor: "#fff9e6" }}>
          <TableCell colSpan={visibleColumns.length + 2} sx={{ padding: 0 }}>
            <Box sx={{ p: 2, bgcolor: "#fff9e6" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: "14px",
                }}
              >
                Chi tiết đơn vị sở hữu
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
                  {detailsToShow.map((detail: any) => (
                    <TableRow key={`detail-item-${detail.id}`}>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.idTsCon || "-"}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.idDonViSoHuu || "-"}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.soLuong || "-"}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                        {detail.thoiGianBanGiao || "-"}
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
        <Typography>
          {title} ({total})
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
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#666" }} />,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            {/* <Button variant="outlined" size="small" startIcon={<Settings />}>
              Cấu hình cột
            </Button> */}
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
      <Box display="flex" justifyContent="flex-start" gap={2}>
        <ColumnConfigMenu
          columns={columns.filter((col) => col.isShow)}
          onChange={onColumnsChange}
        />
      </Box>
      {/* Table */}
      <Box
        sx={{ flex: 1, minWidth: 0, overflowX: "auto", overflowY: "hidden" }}
      >
        <Table
          sx={{
            // Allow the table to size to content and enable horizontal scrolling
            width: "max-content",
            minWidth: tableMinWidth,
            borderCollapse: "collapse",
            tableLayout: "auto",
            "& .MuiTableCell-root": {
              padding: "8px",
            },
            // "& .MuiTableCell-root:last-child": {
            //   borderRight: "none",
            // },
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
                  borderRight: "1px solid rgba(255, 255, 255, 0.3)",
                },
                "& .MuiTableCell-head:last-child": {
                  borderRight: "none",
                },
              }}
            >
              <TableCell
                width="50px"
                align="center"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  minWidth: 50,
                }}
                onClick={handleExpandAll}
              >
                {expandedRows.size === total ? <ExpandLess /> : <ExpandMore />}
              </TableCell>
              <TableCell
                padding="checkbox"
                width="50px"
                sx={{ color: "#ffffff", fontWeight: 700, minWidth: 50 }}
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
              {visibleColumns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align || "center"}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    minWidth: (col as any).width || 150,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.length > 0 ? (
              tableRows
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 2}
                  align="center"
                  sx={{ py: 4 }}
                >
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
        count={total}
        rowsPerPage={paginationModel?.pageSize || 10}
        page={paginationModel?.page || 0}
        onPageChange={(_, newPage) => {
          onPaginationModelChange?.({
            page: newPage,
            pageSize: paginationModel?.pageSize || 10,
          });
        }}
        onRowsPerPageChange={(event) => {
          onPaginationModelChange?.({
            page: 0,
            pageSize: parseInt(event.target.value, 10),
          });
        }}
        labelRowsPerPage="Số hàng trên trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </Paper>
  );
}
