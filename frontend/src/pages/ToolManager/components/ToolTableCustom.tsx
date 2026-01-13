import React, { useState, useMemo, useRef, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Delete,
  Search as SearchIcon,
  TableView,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { ColumnConfig } from "../columnConfig";
import ColumnConfigMenu from "./ColumnConfig";
import { CircleCheck } from "lucide-react";

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(updateWidth);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updateWidth();
    return () => resizeObserver.disconnect();
  }, []);

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
      const detailsToShow = row.chiTietDonViSoHuuList || [];

      tableRows.push(
        <TableRow
          key={`detail-${row.id}`}
          sx={{
            backgroundColor: "#fff9e6",
            "& td": { borderBottom: "none" },
          }}
        >
          <TableCell
            colSpan={visibleColumns.length + 2}
            sx={{
              padding: 0,
              border: "none",
              // Removed position: "relative" here to fix positioning context and misalignment
            }}
          >
            <Box
              sx={{
                position: "sticky",
                left: 0,
                width: `${containerWidth}px`,
                maxWidth: `${containerWidth}px`,
                boxSizing: "border-box",
                p: 0, // Moved padding out to prevent content shrinkage
                bgcolor: "#fff9e6",
                zIndex: 1,
                margin: 0,
                marginLeft: 0,
              }}
            >
              {/* Wrap content in an inner Box for padding, so the outer Box width remains exact */}
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  Chi tiết đơn vị sở hữu
                </Typography>

                {/* Sub-table */}
                <Table
                  size="small"
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    width: "100%",
                    tableLayout: "fixed",
                    boxSizing: "border-box", // Added to include border in width calculation
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#fff3cd",
                        "& .MuiTableCell-head": {
                          color: "#856404",
                          fontWeight: 700,
                          padding: "10px",
                          border: "1px solid #e0e0e0",
                        },
                      }}
                    >
                      <TableCell>Mã chi tiết CCDC - Vật tư</TableCell>
                      <TableCell>Đơn vị sở hữu</TableCell>
                      <TableCell>Số lượng đang sở hữu</TableCell>
                      <TableCell>Thời gian bàn giao</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={24} color="warning" />
                        </TableCell>
                      </TableRow>
                    ) : detailsToShow.length > 0 ? (
                      detailsToShow.map((detail: any) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                          Không có dữ liệu chi tiết
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </TableCell>
        </TableRow>
      );
    }
  });

  // 2. Tạo một ref để giữ giá trị columns mới nhất
  const columnsRef = useRef(columns);
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  const handleMouseDown = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault(); // Ngăn việc bôi đen văn bản khi kéo

    const startX = e.pageX;
    // Lấy độ rộng hiện tại từ ref để đảm bảo luôn chính xác
    const currentCol = columnsRef.current.find((c) => c.key === colKey);
    const startWidth = Number(currentCol?.width) || 150;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.pageX;
      const diffX = currentX - startX;
      const newWidth = Math.max(50, startWidth + diffX);

      // Sử dụng columnsRef.current để đảm bảo danh sách các cột khác không bị mất dữ liệu
      const updatedColumns = columnsRef.current.map((col) =>
        col.key === colKey ? { ...col, width: newWidth } : col
      );

      onColumnsChange?.(updatedColumns);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
  };

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
        ref={containerRef}
        sx={{ flex: 1, minWidth: 0, overflowX: "auto", overflowY: "hidden" }}
      >
        <Table
          sx={{
            width: "max-content",
            minWidth: tableMinWidth,
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              padding: "8px",
              borderBottom: "1px solid #e0e0e0",
              borderRight: "1px solid #e0e0e0",
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
                    position: "relative", // Quan trọng để đặt resizer
                    "&:hover .resizer": {
                      opacity: 1,
                    },
                  }}
                >
                  {col.label}

                  {/* Thanh Resizer */}
                  <Box
                    className="resizer"
                    onMouseDown={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện click vào header
                      handleMouseDown(e, col.key);
                    }}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      width: "4px",
                      cursor: "col-resize",
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      opacity: 0, // Chỉ hiện khi hover vào cell
                      transition: "opacity 0.2s",
                      zIndex: 1,
                      "&:hover": {
                        backgroundColor: "#fff",
                        width: "6px",
                      },
                    }}
                  />
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
