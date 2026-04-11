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
  Collapse,
} from "@mui/material";
import {
  Delete,
  Search as SearchIcon,
  TableView,
  ExpandMore,
  ExpandLess,
  Edit as EditIcon,
} from "@mui/icons-material";
import { showConfirmAlert } from "../../../components/Alert";

export interface ColumnConfig {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
  visible?: boolean;
  isShow?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

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
  onEdit?: (row: any) => void;
  onColumnsChange?: (columns: ColumnConfig[]) => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue?: string;
  paginationModel?: { page: number; pageSize: number };
  onPaginationModelChange?: (model: any) => void;
  loading?: boolean;
}

export default function RepairNormTableCustom({
  tableId,
  title,
  rows,
  total,
  columns,
  onRowClick,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onEdit,
  onColumnsChange,
  setSearchValue,
  searchValue = "",
  paginationModel,
  onPaginationModelChange,
  loading = false,
}: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const columnsRef = useRef(columns);
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  useEffect(() => {
    if (tableId && columns.length > 0) {
      const saved = localStorage.getItem(`table_columns_${tableId}`);
      if (saved) {
        try {
          const parsedSavedColumns = JSON.parse(saved);
          const mergedColumns = columns.map((col) => {
            const savedCol = parsedSavedColumns.find(
              (s: any) => s.key === col.key,
            );
            if (savedCol) {
              return {
                ...col,
                visible: savedCol.visible ?? true,
                isShow: savedCol.isShow ?? true,
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
  }, [tableId]);

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

  const handleColumnsChange = (newColumns: ColumnConfig[]) => {
    onColumnsChange?.(newColumns);
    if (tableId) {
      localStorage.setItem(
        `table_columns_${tableId}`,
        JSON.stringify(newColumns),
      );
    }
  };

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

  const isAllSelected =
    total > 0 &&
    rows.length > 0 &&
    rows.every((row) => selectedIds.includes(String(row.id)));
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

  const visibleColumns = useMemo(
    () => columns.filter((c) => c.visible !== false && c.isShow !== false),
    [columns],
  );

  const tableMinWidth = useMemo(() => {
    const colsWidth = visibleColumns.reduce(
      (s, c) => s + (c.width ? Number(c.width) : 150),
      0,
    );
    return colsWidth + 150;
  }, [visibleColumns]);

  const handleMouseDown = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    const startX = e.pageX;
    const currentCol = columnsRef.current.find((c) => c.key === colKey);
    const startWidth = Number(currentCol?.width) || 150;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.pageX;
      const diffX = currentX - startX;
      const newWidth = Math.max(50, startWidth + diffX);
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

  const tableRows: React.ReactNode[] = [];
  rows.forEach((row) => {
    const isExpanded = expandedRows.has(row.id);
    const isSelected = selectedIds.includes(String(row.id));
    tableRows.push(
      <TableRow
        key={`row-${row.id}`}
        hover
        sx={{
          backgroundColor: isSelected ? "#f0f0f0" : "inherit",
          cursor: "pointer",
        }}
        onClick={() => onRowClick?.(row)}
      >
        <TableCell
          align="center"
          sx={{ width: "40px", minWidth: "40px", padding: "0 4px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton size="small" onClick={() => handleExpandClick(row.id)}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
        <TableCell
          align="center"
          sx={{ width: "40px", minWidth: "40px", padding: "0 4px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelectRow(row.id)}
          />
        </TableCell>
        {visibleColumns.map((col) => {
          const rawValue = row[col.key];
          const displayValue = col.render
            ? col.render(rawValue, row)
            : (rawValue ?? "-");
          return (
            <TableCell
              key={col.key}
              align={col.align || "left"}
              sx={{
                width: col.width || 150,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayValue}
            </TableCell>
          );
        })}
      </TableRow>,
    );

    if (isExpanded) {
      tableRows.push(
        <TableRow key={`detail-${row.id}`} sx={{ backgroundColor: "#f9f9f9" }}>
          <TableCell
            colSpan={visibleColumns.length + 2}
            sx={{ p: 0, border: "none" }}
          >
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, bgcolor: "#fff9f9" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Danh sách vật tư định mức
                </Typography>
                <Table
                  size="small"
                  sx={{ backgroundColor: "#fff", border: "1px solid #e0e0e0" }}
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell width="50px">STT</TableCell>
                      <TableCell>Tên vật tư</TableCell>
                      <TableCell width="120px">ĐVT</TableCell>
                      <TableCell width="120px" align="center">
                        Số lượng
                      </TableCell>
                      <TableCell width="120px" align="center">
                        Quy cách
                      </TableCell>
                      <TableCell width="120px" align="center">
                        Ghi chú
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.dinhMucVatTuList?.length > 0 ? (
                      row.dinhMucVatTuList.map((vt: any, idx: number) => (
                        <TableRow key={vt.id || idx}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{vt.tenCCDCVT}</TableCell>
                          <TableCell>{vt.donViTinh}</TableCell>
                          <TableCell align="center">{vt.soLuong}</TableCell>
                          <TableCell align="center">{vt.kyHieu}</TableCell>
                          <TableCell align="center">{vt.ghiChu}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Chưa có vật tư nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>,
      );
    }
  });

  return (
    <Paper sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        display="flex"
        alignItems="center"
        p={2}
        gap={2}
        sx={{ background: "#f5f5f5" }}
      >
        <TableView sx={{ color: "#1FA463" }} />
        <Typography fontWeight="bold">
          {title} ({total})
        </Typography>
      </Box>

      <Grid container spacing={2} p={2} sx={{ backgroundColor: "#fafafa" }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Tìm kiếm"
            fullWidth
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#666" }} />,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
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

      <Box ref={containerRef} sx={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
        <Table
          sx={{
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1FA463" }}>
              <TableCell
                align="center"
                sx={{ color: "#fff", padding: "0 4px", width: "40px", minWidth: "40px" }}
              >
                <ExpandMore />
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff !important", padding: "0 4px", width: "40px", minWidth: "40px" }}
              >
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  sx={{
                    color: "#fff !important",
                    "&.Mui-checked": { color: "#fff !important" },
                  }}
                />
              </TableCell>
              {visibleColumns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align || "left"}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    width: col.width || 150,
                    position: "relative",
                    padding: "6px",
                    "&:hover .resizer": { opacity: 1 },
                  }}
                >
                  {col.label}
                  <Box
                    className="resizer"
                    onMouseDown={(e) => {
                      e.stopPropagation();
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
                      opacity: 0,
                      transition: "opacity 0.2s",
                      zIndex: 1,
                      "&:hover": { backgroundColor: "#fff", width: "6px" },
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : tableRows.length > 0 ? (
              tableRows
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={total}
        rowsPerPage={paginationModel?.pageSize || 10}
        page={paginationModel?.page || 0}
        onPageChange={(_, newPage) =>
          onPaginationModelChange?.({
            page: newPage,
            pageSize: paginationModel?.pageSize || 10,
          })
        }
        onRowsPerPageChange={(event) =>
          onPaginationModelChange?.({
            page: 0,
            pageSize: parseInt(event.target.value, 10),
          })
        }
        labelRowsPerPage="Số hàng trên trang:"
      />
    </Paper>
  );
}
