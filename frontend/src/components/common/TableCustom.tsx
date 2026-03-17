import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Close,
  Delete,
  Search,
  Edit,
  TableChart,
  Mail,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridFilterPanel,
  GridColumnVisibilityModel,
  GridFeatureMode,
} from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import FieldDate from "../TextField/FieldDate";
import { showConfirmAlert } from "../Alert";
import { Dispatch, SetStateAction } from "react";
import { FilterOption, FilterStatusGroup } from "./FilterStatusGroup";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DecisionButton from "../Button/DecisionButton";
import { usePositionMutation } from "../../pages/Position/Mutation";

const CustomFilterPanel = (props: any) => {
  return (
    <GridFilterPanel
      {...props}
      filterFormProps={{
        operatorInputProps: { disabled: true, style: { display: "none" } },
      }}
    />
  );
};

interface Props {
  tableId?: string;
  title: string;
  columns: GridColDef[];
  rows: any[];
  total?: number;
  paginationModel?: { page: number; pageSize: number };
  onPaginationModelChange?: (model: any) => void;
  loading?: boolean;
  onRowClick?: (params: any) => void;
  isFilterDate?: boolean;
  isDepreciation?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDelete?: (ids: string[]) => void;
  canSign?: (items: any[], user: any) => boolean;
  onSign?: (fileName: string, item: any) => void;
  searchValue?: string;
  setSearchValue?: Dispatch<SetStateAction<string>>;
  showStatusFilter?: boolean;
  selectedDate?: string;
  setSelectedDate?: Dispatch<SetStateAction<string>>;
  paginationMode?: GridFeatureMode;
  statusOptions?: FilterOption[];
  statusValue?: any;
  onStatusChange?: (val: any) => void;
  checkboxSelection?: boolean;
  showDelete?: boolean;
  handleSendToSigner?: (selectedItem: any[]) => void;
  handleAssetTransfer?: (department: string) => void;
  isCheckShowShare?: (item: any) => boolean;
  handleSignDocument?: (item: any, user: any, onSign: () => void) => void;
  titleSearch?: string;
  extraActions?: React.ReactNode;
  customContent?: React.ReactNode;
  departments?: any[];
  selectedDepartment?: string;
  setSelectedDepartment?: Dispatch<SetStateAction<string>>;
  isFilterDepartment?: boolean;
  showDeleteAll?: boolean;
  onDeleteAll?: () => void;
  isDecision?: (data: any[]) => boolean;
  handleDecision?: (item: any) => void;
}

export default function TableCustom({
  tableId,
  title,
  columns,
  rows,
  total,
  paginationModel,
  onPaginationModelChange,
  loading = false,
  onRowClick,
  isFilterDate = false,
  isDepreciation = false,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onSign,
  canSign,
  searchValue,
  setSearchValue,
  showStatusFilter = true,
  paginationMode = "server",
  statusOptions = [],
  statusValue,
  onStatusChange,
  checkboxSelection = true,
  showDelete = true,
  handleSendToSigner,
  handleAssetTransfer,
  isCheckShowShare,
  handleSignDocument,
  selectedDate,
  setSelectedDate,
  titleSearch = "Tìm kiếm ...",
  extraActions,
  customContent,
  departments,
  selectedDepartment,
  setSelectedDepartment,
  isFilterDepartment = false,
  showDeleteAll = false,
  onDeleteAll,
  isDecision,
  handleDecision,
}: Props) {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedItem, setSelectedItem] = useState<any[]>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({});

  const [isPermissionBanHanh, setIsPermissionBanHanh] = useState(false);
  const { getByIdMutation } = usePositionMutation();

  useEffect(() => {
    const checkPermission = async () => {
      if (user?.taiKhoan?.chucVuId) {
        try {
          const chucvu = await getByIdMutation.mutateAsync(
            user.taiKhoan.chucVuId,
          );
          setIsPermissionBanHanh(!!chucvu?.data?.banHanhQuyetDinh);
        } catch (error) {
          console.error("Lỗi lấy quyền:", error);
        }
      }
    };

    checkPermission();
  }, [user?.taiKhoan?.chucVuId]);

  useEffect(() => {
    if (tableId) {
      const savedColumns = localStorage.getItem(`table_columns_${tableId}`);
      if (savedColumns) {
        try {
          setColumnVisibilityModel(JSON.parse(savedColumns));
        } catch (error) {
          console.error("Lỗi khi đọc cấu hình cột:", error);
        }
      }
    }
  }, [tableId]);

  // Hàm xử lý khi người dùng thay đổi trạng thái ẩn/hiện cột
  const handleColumnVisibilityChange = (
    newModel: GridColumnVisibilityModel,
  ) => {
    setColumnVisibilityModel(newModel);
    if (tableId) {
      localStorage.setItem(
        `table_columns_${tableId}`,
        JSON.stringify(newModel),
      );
    }
  };

  return (
    <Paper sx={{ my: 2, width: "100%" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={1}
        sx={{ background: "#f5efefff" }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TableChart
            sx={{
              fontSize: 20,
              color: "#737373ff",
            }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              color: "#737373ff",
              fontSize: "14px",
            }}
          >
            {title} ({total})
          </Typography>
        </Box>

        {/* Cụm Checkbox trạng thái hiển thị dựa trên biến boolean */}
        {showStatusFilter && (
          <FilterStatusGroup
            options={statusOptions}
            selectedValue={statusValue}
            onChange={(val) => onStatusChange?.(val)}
          />
        )}
      </Box>

      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label={titleSearch}
            fullWidth
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue?.(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
              endAdornment: (
                <IconButton onClick={() => setSearchValue?.("")}>
                  <Close />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          {isFilterDepartment && (
            <Autocomplete
              options={departments || []}
              value={
                departments?.find((d) => d.id === selectedDepartment) || null
              }
              getOptionLabel={(option) => option.tenPhongBan || ""}
              onChange={(e, newValue) => {
                setSelectedDepartment?.(newValue ? newValue.id : null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Tìm kiếm theo phòng ban..."
                  size="small"
                />
              )}
            />
          )}
          {isFilterDate && (
            <FieldDate
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              title="Chọn thời gian khấu hao"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            gap={2}
            flexWrap="wrap"
          >
            {/* <Button variant="outlined" size="small" startIcon={<Settings />}>
              Cấu hình cột
            </Button> */}
            {selectedItem && canSign?.(selectedItem, user) && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={async (e) => {
                  e.stopPropagation();
                  handleSignDocument?.(selectedItem[0], user, () =>
                    onSign?.(
                      selectedItem[0]?.taiLieuCuoi ||
                        selectedItem[0]?.taiLieuBangKe,
                      selectedItem[0],
                    ),
                  );
                }}
              >
                Ký biên bản
              </Button>
            )}
            {selectedItem.length > 0 &&
              isPermissionBanHanh &&
              isDecision?.(selectedItem) && (
                <DecisionButton
                  data={selectedItem}
                  handleDecision={handleDecision}
                  onClose={() => {
                    setSelectedItem([]);
                    onSelectionChange?.([]);
                  }}
                />
              )}
            {selectedItem && isCheckShowShare?.(selectedItem) && (
              <Button
                size="small"
                variant="contained"
                color="warning"
                sx={{ color: "#fff" }}
                startIcon={<Mail />}
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleSendToSigner?.(selectedItem);
                  setSelectedItem([]);
                }}
              >
                Trình duyệt người ký ({selectedItem.length})
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
            {selectedIds.length > 0 && showDelete && (
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirm = await showConfirmAlert(
                    `Xác nhận xóa ${selectedIds.length} bản ghi?`,
                  );
                  if (confirm.isConfirmed) {
                    onDelete?.(selectedIds);
                    onSelectionChange?.([]);
                  }
                }}
              >
                {selectedIds.length} Xóa đã chọn
              </Button>
            )}
            {isDepreciation && (
              <Button
                variant="contained"
                size="small"
                startIcon={<BarChart />}
                onClick={() => navigate(ROUTES.ASSETDEPRECIATION)}
              >
                Khấu hao tài sản
              </Button>
            )}
            {extraActions}
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        {customContent ? (
          customContent
        ) : (
          <DataGrid
            getRowId={(row) => row.Id || row.id || row.soThe}
            onRowClick={onRowClick}
            columns={columns}
            rows={rows}
            rowCount={total}
            paginationMode={paginationMode}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={[10, 20, 50]}
            loading={loading}
            checkboxSelection={checkboxSelection}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={handleColumnVisibilityChange}
            rowSelectionModel={
              selectedIds && selectedIds.length > 0
                ? { type: "include" as const, ids: new Set(selectedIds) }
                : { type: "include" as const, ids: new Set() }
            }
            onRowSelectionModelChange={(newSelection: any) => {
              let result: string[] = [];
              if (newSelection?.type === "exclude") {
                const excludedIds = Array.from(newSelection.ids as Set<string>);
                result = rows
                  .map((row) => row.Id || row.id || row.soThe)
                  .filter((id) => !excludedIds.includes(id as string));
              } else if (newSelection?.type === "include") {
                if (newSelection.ids && newSelection.ids.size > 0) {
                  result = Array.from(newSelection.ids as Set<string>);
                }
              } else if (Array.isArray(newSelection)) {
                result = newSelection;
              }
              onSelectionChange?.(result);
              const selectedRows = rows.filter((row) => {
                const rowId = row.Id || row.id || row.soThe;
                return result.includes(rowId);
              });
              setSelectedItem(selectedRows);
              handleAssetTransfer?.(selectedRows[0]?.idDonViGiao);
            }}
            disableRowSelectionOnClick
            showToolbar
            slots={{ toolbar: GridToolbar, filterPanel: CustomFilterPanel }}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            slotProps={{
              filterPanel: { disableAddFilterButton: false },
              toolbar: {
                csvOptions: { disableToolbarButton: true },
                printOptions: { disableToolbarButton: true },
              },
            }}
            sx={{
              fontSize: "14px",
              "& .MuiDataGrid-toolbarContainer .MuiButton-root": {
                color: "#1FA463",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(31, 164, 99, 0.04)",
                },
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#1FA463",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#fff",
                fontWeight: 700,
              },
              "& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton": {
                background: "#1FA463",
                color: "black",
              },
              "& .MuiDataGrid-iconButtonContainer": {
                visibility: "visible",
              },
              "& .MuiDataGrid-sortIcon": {
                opacity: 1,
                color: "#fff",
              },
              "& .MuiDataGrid-menuIcon": {
                opacity: 1,
                color: "#fff",
              },
              "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
                color: "#fff",
              },
            }}
          />
        )}
      </Box>
    </Paper>
  );
}
