import { Box, IconButton } from '@mui/material'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef } from '@mui/x-data-grid'
import Departments from '../../data/Department.json'
import DepartmentForm from './components/DepartmentForm'
import { Delete } from '@mui/icons-material'

export default function Department() {

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã phòng ban",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "name",
      headerName: "Tên phòng/ban",
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "employee",
      headerName: "Số lượng nhân viên",
      width: 200,
      align: 'center',
      headerAlign: 'center'
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
      <PageAction title="Quản lý phòng ban" />
      <Box py={2}>
        <DepartmentForm />
      </Box>
      <TableCustom title="Quản lý phòng ban" columns={columns} rows={Departments} />
    </Box>
  )
}
