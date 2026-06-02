import React, { useState, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
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
  Autocomplete,
} from "@mui/material";
import {
  Delete,
  Search as SearchIcon,
  TableView,
  ExpandMore,
  ExpandLess,
  TableChart,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { ColumnConfig } from "../columnConfig";
import ColumnConfigMenu from "./ColumnConfig";
import { findById } from "../../../utils/helpers";
import { showConfirmAlert } from "../../../components/Alert";

interface Props {
  tableId?: string;
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
  allDepartments?: any[];
  showDeleteAll?: boolean;
  onDeleteAll?: () => void;
  onViewOwnership?: () => void;
  selectedDepartment?: string;
  onSelectedDepartmentChange?: (id: string) => void;
  toolGroups?: any[];
  selectedToolGroup?: string;
  onSelectedToolGroupChange?: (id: string) => void;
  onExportExcel?: () => void;
}

export default function ToolTableCustom({
  tableId,
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
  allDepartments = [],
  showDeleteAll = false,
  onDeleteAll,
  onViewOwnership,
  selectedDepartment,
  onSelectedDepartmentChange,
  toolGroups = [],
  selectedToolGroup,
  onSelectedToolGroupChange,
  onExportExcel,
}: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set(),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (tableId && columns.length > 0) {
      const saved = localStorage.getItem(`table_columns_${tableId}`);
      if (saved) {
        try {
          const parsedSavedColumns = JSON.parse(saved);

          // Hợp nhất: Lấy hàm render từ 'columns' mới (props)
          // và lấy trạng thái visible/width từ 'saved'
          const mergedColumns = columns.map((col) => {
            const savedCol = parsedSavedColumns.find(
              (s: any) => s.key === col.key,
            );
            if (savedCol) {
              return {
                ...col, // Giữ lại render, align... từ code mới
                visible: savedCol.visible,
                isShow: savedCol.isShow,
                width: savedCol.width,
              };
            }
            return col;
          });

          onColumnsChange?.(mergedColumns);
        } catch (error) {
          console.error("Lỗi khi hợp nhất cấu hình cột:", error);
        }
      }
    }
  }, [tableId]); // Chỉ chạy khi tableId thay đổi hoặc load lần đầu

  const handleColumnsChange = (newColumns: ColumnConfig[]) => {
    onColumnsChange?.(newColumns);
    if (tableId) {
      localStorage.setItem(
        `table_columns_${tableId}`,
        JSON.stringify(newColumns),
      );
    }
  };

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
    [columns],
  );

  const handleExportSelectedExcel = () => {
    const selectedRows = rows.filter((row) =>
      selectedIds.includes(String(row.id)),
    );
    if (selectedRows.length === 0) return;

    const dataToExport = selectedRows.map((row) => {
      const item: Record<string, any> = {};
      visibleColumns.forEach((col) => {
        const rawValue = row[col.key];
        let displayValue = rawValue;
        if (col.key === "giaTri") {
          displayValue = rawValue || 0;
        } else if (col.key === "soLuong") {
          displayValue = rawValue || 0;
        } else if (col.key === "trangThai") {
          displayValue =
            rawValue === true ||
            rawValue === "Active" ||
            rawValue === "Hoạt động"
              ? "Hoạt động"
              : "Không hoạt động";
        } else if (col.key === "chiTietDonViSoHuuList") {
          return;
        } else if (typeof rawValue === "object" && rawValue !== null) {
          displayValue =
            rawValue.ten || rawValue.name || JSON.stringify(rawValue);
        } else {
          displayValue = rawValue ?? "-";
        }
        item[col.label] = displayValue;
      });
      const details = row.chiTietDonViSoHuuList || [];
      item["Số chứng từ sở hữu"] = details
        .map((d: any) => d.soChungTu || "-")
        .join("\n");
      item["Đơn vị sở hữu"] = details
        .map((d: any) => {
          return (
            findById(allDepartments, d.idDonViSoHuu)?.tenPhongBan ||
            d.idDonViSoHuu ||
            "-"
          );
        })
        .join("\n");
      item["Số lượng sở hữu"] = details
        .map((d: any) => d.soLuong || 0)
        .join("\n");
      item["Số lượng đã bàn giao"] = details
        .map((d: any) => d.soLuongDaBanGiao || 0)
        .join("\n");
      item["Ngày vào sổ sở hữu"] = details
        .map((d: any) => d.ngayTao || "-")
        .join("\n");

      return item;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, "CCDC Da Chon");
    XLSX.writeFile(
      wb,
      `Danh_sach_CCDC_da_chon_${dayjs().format("YYYYMMDD")}.xlsx`,
    );
  };

  // Compute a reasonable minWidth for the table so it can overflow horizontally
  const tableMinWidth = useMemo(() => {
    const colsWidth = visibleColumns.reduce(
      (s, c) => s + (c.width ? Number((c as any).width) : 150),
      0,
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
            : (rawValue ?? "-");

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
      </TableRow>,
    );

    // Expanded detail row
    if (isExpanded) {
      const detailsToShow = row.chiTietDonViSoHuuList || [];

      tableRows.push(
        <TableRow
          key={`detail-${row.id}`}
          sx={{
            backgroundColor: "#f4fbf7",
            "& td": { borderBottom: "none" },
          }}
        >
          <TableCell
            colSpan={visibleColumns.length + 2}
            sx={{
              padding: 0,
              border: "none",
            }}
          >
            <Box
              sx={{
                position: "sticky",
                left: 0,
                width: `${containerWidth}px`,
                maxWidth: `${containerWidth}px`,
                boxSizing: "border-box",
                p: 0,
                bgcolor: "#f4fbf7",
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
                    color: "#115230",
                  }}
                >
                  Chi tiết đơn vị sở hữu
                </Typography>

                {/* Sub-table */}
                <Table
                  size="small"
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cce5d3",
                    width: "100%",
                    tableLayout: "fixed",
                    boxSizing: "border-box",
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#d8eedf",
                        "& .MuiTableCell-head": {
                          color: "#13633b",
                          fontWeight: 700,
                          padding: "10px",
                          border: "1px solid #cce5d3",
                        },
                      }}
                    >
                      <TableCell>Số chứng từ</TableCell>
                      <TableCell>Đơn vị sở hữu</TableCell>
                      <TableCell>Số lượng đang sở hữu</TableCell>
                      <TableCell>Số lượng đã bàn giao</TableCell>
                      <TableCell>Ngày vào sổ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={24} color="success" />
                        </TableCell>
                      </TableRow>
                    ) : detailsToShow.length > 0 ? (
                      detailsToShow.map((detail: any) => (
                        <TableRow key={`detail-item-${detail.soKyHieu}`}>
                          <TableCell sx={{ border: "1px solid #e2ece5" }}>
                            {detail.soChungTu || "-"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e2ece5" }}>
                            {findById(allDepartments, detail.idDonViSoHuu)
                              ?.tenPhongBan ||
                              detail.idDonViSoHuu ||
                              "-"}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e2ece5" }}>
                            {detail.soLuong || 0}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e2ece5" }}>
                            {detail.soLuongDaBanGiao || 0}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #e2ece5" }}>
                            {detail.ngayTao || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                          Không có dữ liệu chi tiết
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </TableCell>
        </TableRow>,
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
        col.key === colKey ? { ...col, width: newWidth } : col,
      );

      handleColumnsChange(updatedColumns);
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
        <Grid size={{ xs: 12, sm: 3 }}>
          <Autocomplete
            options={allDepartments}
            getOptionLabel={(option) => option.tenPhongBan}
            value={
              allDepartments.find((item) => item.id === selectedDepartment) ||
              null
            }
            onChange={(event, newValue) => {
              onSelectedDepartmentChange?.(newValue?.id || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Đơn vị sở hữu"
                fullWidth
                size="small"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Autocomplete
            options={toolGroups}
            getOptionLabel={(option) => option.ten}
            value={
              toolGroups.find((item) => item.id === selectedToolGroup) || null
            }
            onChange={(event, newValue) => {
              onSelectedToolGroupChange?.(newValue?.id || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nhóm ccdc"
                fullWidth
                size="small"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
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
            {showDeleteAll && (
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirm = await showConfirmAlert(
                    `Xác nhận xóa tất cả bản ghi?. bạn không thể hoàn tác!.`,
                  );
                  if (confirm.isConfirmed) {
                    onDeleteAll?.();
                    onSelectionChange?.([]);
                  }
                }}
              >
                Xóa tất cả
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={1}
        px={2}
      >
        <ColumnConfigMenu
          columns={columns.filter((col) => col.isShow)}
          onChange={handleColumnsChange}
        />
        <Box display="flex" alignItems="center" gap={1.5}>
          {onExportExcel && (
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={onExportExcel}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#1FA463",
                color: "#1FA463",
                "&:hover": {
                  borderColor: "#177e4b",
                  bgcolor: "rgba(31, 164, 99, 0.04)",
                },
              }}
            >
              Xuất Excel
            </Button>
          )}

          {selectedIds.length > 0 && (
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportSelectedExcel}
              sx={{
                borderColor: "#1FA463",
                color: "#1FA463",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#177e4b",
                  bgcolor: "rgba(31, 164, 99, 0.04)",
                },
              }}
            >
              Xuất đã chọn ({selectedIds.length})
            </Button>
          )}

          <Button
            variant="outlined"
            color="success"
            size="small"
            startIcon={<TableChart />}
            onClick={onViewOwnership}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#1FA463",
              color: "#1FA463",
              "&:hover": {
                borderColor: "#177e4b",
                bgcolor: "rgba(31, 164, 99, 0.04)",
              },
            }}
          >
            Danh sách nhập vật tư
          </Button>
        </Box>
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
                    width: (col as any).width || 150,
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
