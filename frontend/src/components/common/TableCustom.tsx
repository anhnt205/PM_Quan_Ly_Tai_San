import React from "react";
import {
  BarChart,
  Close,
  Delete,
  Search,
  Settings,
  TableView,
  Edit,
} from "@mui/icons-material";
import {
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
  GridFeatureMode,
} from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import FieldDate from "../TextField/FieldDate";
import { showConfirmAlert } from "../Alert";
import { Dispatch, SetStateAction } from "react";
import { FilterStatusGroup } from "./FilterStatusGroup";
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
  onSign?: (ids: string) => void;
  searchValue?: string;
  setSearchValue?: Dispatch<SetStateAction<string>>;
  showStatusFilter?: boolean;
  paginationMode?: GridFeatureMode;
}

export default function TableCustom({
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
  searchValue,
  setSearchValue,
  showStatusFilter = false,
  paginationMode = "server",
}: Props) {
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("TableCustom selectedIds:", selectedIds);
    console.log(
      "TableCustom onSign:",
      typeof onSign,
      onSign ? "defined" : "undefined"
    );
  }, [selectedIds, onSign]);

  return (
    <Paper sx={{ my: 2, width: "100%" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={1}
        sx={{ background: "#f5efefff" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <TableView />
          <Typography>
            {title} ({total})
          </Typography>
        </Box>

        {/* Cụm Checkbox trạng thái hiển thị dựa trên biến boolean */}
        {showStatusFilter && <FilterStatusGroup />}
      </Box>

      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Tìm kiếm"
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
        <Grid size={{ xs: 12, sm: 2 }}>
          {isFilterDate && <FieldDate title="Chọn thời gian khấu hao" />}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            gap={2}
            flexWrap="wrap"
          >
            {/* <Button variant="outlined" size="small" startIcon={<Settings />}>
              Cấu hình cột
            </Button> */}
            {selectedIds.length === 1 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                sx={{ mb: 2 }}
                onClick={(e) => {
                  console.log(
                    "Button Ký biên bản clicked! selectedIds:",
                    selectedIds
                  );
                  e.stopPropagation();
                  onSign?.(selectedIds[0]);
                }}
              >
                Ký biên bản
              </Button>
            )}
            {selectedIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                sx={{ mb: 2 }}
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirm = await showConfirmAlert(
                    `Xác nhận xóa ${selectedIds.length} bản ghi?`
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
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          getRowId={(row) => row.Id || row.id}
          onRowClick={onRowClick}
          columns={columns}
          rows={rows}
          rowCount={total}
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
          checkboxSelection
          rowSelectionModel={
            selectedIds && selectedIds.length > 0
              ? { type: "include" as const, ids: new Set(selectedIds) }
              : { type: "include" as const, ids: new Set() }
          }
          onRowSelectionModelChange={(newSelection: any) => {
            let result: string[] = [];

            if (newSelection?.ids && newSelection.ids.size > 0) {
              // Set model: { type: "include", ids: Set }
              result = Array.from(newSelection.ids as Set<string>);
            }

            onSelectionChange?.(result);
          }}
          disableRowSelectionOnClick
          showToolbar
          slots={{ toolbar: GridToolbar, filterPanel: CustomFilterPanel }}
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          // disableVirtualization={true}
          slotProps={{
            filterPanel: { disableAddFilterButton: false },
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
            },
          }}
          sx={{
            fontSize: "14px",
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

            // Checkbox header
            "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
              color: "#fff",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>
    </Paper>
  );
}
