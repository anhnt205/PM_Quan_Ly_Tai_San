import { BarChart, Search, Settings, TableView } from "@mui/icons-material";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridFilterPanel,
} from "@mui/x-data-grid";
import { viVN } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import FieldInput from "../TextField/FieldInput";
import FieldDate from "../TextField/FieldDate";
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
  onRowClick?: (params: any) => void;
  isFilterDate?: boolean;
  isDepreciation?: boolean;
}

export default function TableCustom({
  title,
  columns,
  rows,
  onRowClick,
  isFilterDate = false,
  isDepreciation = false,
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
          {title} ({rows.length})
        </Typography>
      </Box>
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FieldInput
            title="Tìm kiếm"
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          {isFilterDate && <FieldDate title="Chọn thời gian khấu hao" />}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box display={"flex"} justifyContent={"flex-end"} gap={2}>
            {/* <Button variant="outlined" size="small" startIcon={<Settings />}>
              Cấu hình cột
            </Button> */}
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
          onRowClick={onRowClick}
          columns={columns}
          rows={rows}
          checkboxSelection
          disableRowSelectionOnClick
          showToolbar
          slots={{ toolbar: GridToolbar, filterPanel: CustomFilterPanel }}
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          disableVirtualization={true}
          slotProps={{
            filterPanel: { disableAddFilterButton: false },
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
            },
          }}
          getRowHeight={() => "auto"}
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
