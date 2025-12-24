import { Badge, Box, Chip, IconButton } from '@mui/material'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef } from '@mui/x-data-grid'
import ToolGroups from '../../data/ToolGroup.json'
import { Delete } from '@mui/icons-material'
import ToolGroupForm from './components/ToolGroupForm'
import React, { useState } from 'react'

export default function ToolGroup() {
  const [showForm, setShowForm] = useState(false)
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã nhóm ccdc",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "name",
      headerName: "Tên nhóm ccdc",
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "updatedAt",
      headerName: "Ngày cập nhật",
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "updatedBy",
      headerName: "Người cập nhật",
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
      <PageAction title="Quản lý nhóm ccdc" onNewClick={() => setShowForm(true)} />
      {showForm && (  
        <Box py={2}>
          <ToolGroupForm onCancel={() => setShowForm(false)} />
        </Box>
      )}
      <TableCustom title="Quản lý nhóm ccdc" columns={columns} rows={ToolGroups} />
    </Box>
  )
}
