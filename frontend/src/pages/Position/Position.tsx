import { Badge, Box, Checkbox, Chip, IconButton } from '@mui/material'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef } from '@mui/x-data-grid'
import Positions from '../../data/Position.json'
import ProjectForm from './components/PositionForm'
import { Delete } from '@mui/icons-material'

export default function Position() {

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã chức vụ",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "name",
      headerName: "Tên chức vụ",
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "manager_staff",
      headerName: "Quản lý nhân viên",
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Checkbox checked={params.row.manager_staff} />
      )
    },
    {
      field: "manager_department",
      headerName: "Quản lý phòng ban",
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Checkbox checked={params.row.manager_department} />
      )
    },
    {
      field: "manager_project",
      headerName: "Quản lý dự án",
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Checkbox checked={params.row.manager_project} />
      )
    },
    {
      field: "manager_capital_source",
      headerName: "Quản lý nguồn vốn",
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Checkbox checked={params.row.manager_capital_source}/>
      )
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <IconButton>
        <Delete color='error' />
      </IconButton>
    },
  ];


  return (
    <Box sx={{ width: '100%', }}>
      <PageAction title="Quản lý chức vụ" />
      <Box py={2}>
        <ProjectForm />
      </Box>
      <TableCustom title="Quản lý chức vụ" columns={columns} rows={Positions} />
    </Box>
  )
}
