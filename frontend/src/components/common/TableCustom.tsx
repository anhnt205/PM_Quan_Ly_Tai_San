import {
  BarChart,
  Close,
  CloseRounded,
  Delete,
  Search,
  Settings,
  TableView,
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
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import FieldInput from "../TextField/FieldInput";
import FieldDate from "../TextField/FieldDate";
import { showConfirmAlert } from "../Alert";
import { Dispatch, SetStateAction } from "react";
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
  searchValue?: string;
  setSearchValue?: Dispatch<SetStateAction<string>>;
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
  searchValue,
  setSearchValue,
}: Props) {
  const navigate = useNavigate();
  return (
    <Paper sx={{ my: 2, width: "100%" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        p={1}
        gap={2}
        sx={{ background: "#f5efefff" }}
      >
        <TableView />
        <Typography>
          {title} ({total})
        </Typography>
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
          <Box display={"flex"} justifyContent={"flex-end"} gap={2}>
            <Button variant="outlined" size="small" startIcon={<Settings />}>
              Cấu hình cột
            </Button>
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
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
          checkboxSelection
          onRowSelectionModelChange={(newSelection: any) => {
            let selectedIds: string[] = [];

            // Kiểm tra nếu là cơ chế mới (Object có ids)
            if (
              newSelection &&
              typeof newSelection === "object" &&
              "ids" in newSelection
            ) {
              if (newSelection.type === "exclude") {
                selectedIds = rows.map((row) => row.Id || row.id);

                // Nếu có ids trong Set (những dòng bị bỏ chọn), thì lọc chúng ra
                if (newSelection.ids.size > 0) {
                  const excludedSet = newSelection.ids;
                  selectedIds = selectedIds.filter(
                    (id) => !excludedSet.has(id)
                  );
                }
              } else {
                // Nếu là 'include', lấy trực tiếp từ Set
                selectedIds = Array.from(newSelection.ids);
              }
            } else {
              // Nếu là mảng ID thông thường (cơ chế cũ)
              selectedIds = newSelection;
            }
            onSelectionChange?.(selectedIds);
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
