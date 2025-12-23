import { Badge, Box, Chip, IconButton } from '@mui/material'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef } from '@mui/x-data-grid'
import Projects from '../../data/Project.json'
import ProjectForm from './components/ProjectForm'
import { Delete } from '@mui/icons-material'

export default function Project() {

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã dự án",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "name",
      headerName: "Tên dự án",
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "active",
      headerName: "Hiệu lực",
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const isActive = params.row.active;
        return <Chip
          label={isActive ? 'Có hiệu lực' : 'Không hiệu lực'}
          size="small" // Nên để small cho gọn trong bảng
          sx={{
            bgcolor: isActive ? '#baf7cbff' : '#f5f5f5',

            color: isActive ? '#137333' : '#616161',

            // Bỏ viền nếu không cần
            border: 'none',
          }}
        />
      },
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
      <PageAction title="Quản lý dự án" />
      <Box py={2}>
        <ProjectForm />
      </Box>
      <TableCustom title="Quản lý dự án" columns={columns} rows={Projects} />
    </Box>
  )
}
