import { Search, Settings, TableView } from '@mui/icons-material'
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbar,
  GridFilterPanel,
} from '@mui/x-data-grid'
import { viVN } from "@mui/x-data-grid/locales";
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
  title: string,
  columns: GridColDef[],
  rows: any[]
}

export default function TableCustom({
  title,
  columns,
  rows
}: Props) {
  return (
    <Paper sx={{ my: 2, width: '100%' }}>
      <Box display={'flex'} alignItems={'center'} p={1} gap={2} sx={{ background: '#f5efefff' }}>
        <TableView />
        <Typography>{title} ({rows.length})</Typography>
      </Box>
      {/* <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            size='small'
            fullWidth
            placeholder='Tìm kiếm'
            InputProps={{
              startAdornment: (
                <Search />
              ),
              style: { borderRadius: '12px' }
            }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box display={"flex"} justifyContent={'flex-end'}>
            <Button variant='outlined' size='small' startIcon={<Settings />}>Cấu hình cột</Button>
          </Box>
        </Grid>
      </Grid> */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <DataGrid
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
          getRowHeight={() => 'auto'}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1FA463",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontWeight: 700,
            },
            "& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton": {
              background: "#1FA463",
              color: 'black'
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
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />
      </Box>
    </Paper>
  )
}
