import { Badge, Box, Chip, IconButton } from '@mui/material'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef, GridRowParams } from '@mui/x-data-grid'
import Projects from '../../data/Project.json'
import ProjectForm from './components/ProjectForm'
import { Delete } from '@mui/icons-material'
import React, { useState } from 'react'

export default function Project() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedProject(params.row);
    setShowForm(true);
  };
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
      minWidth: 200,
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
      <PageAction title="Quản lý dự án" onNewClick={() => {
        setShowForm(true);
        setSelectedProject(null);
      }} />
      {showForm && (
        <Box py={2}>
          <ProjectForm onCancel={() => {
            setShowForm(false);
            setSelectedProject(null);
          }} project={selectedProject} />
        </Box>
      )}  
      <TableCustom title="Quản lý dự án" columns={columns} rows={Projects}
      onRowClick={handleRowClick} />
    </Box>
  )
}
