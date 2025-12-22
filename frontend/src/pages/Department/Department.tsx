import { Download, Settings, Upload } from '@mui/icons-material'
import { Box, Button, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef } from '@mui/x-data-grid'
import Staffs from '../../data/Staff.json'
import StaffForm from './components/DepartmentForm'

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
      field: "count",
      headerName: "Số lượng nhân viên",
      width: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
  ];


  return (
    <Box sx={{ width: '100%', }}>
      <PageAction title="Quản lý phòng ban" />
      <Box py={2}>
        <StaffForm />
      </Box>
      <TableCustom title="Quản lý phòng ban" columns={columns} rows={Staffs} />
    </Box>
  )
}
