import { Download, Settings, Upload } from '@mui/icons-material'
import { Box, Button, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef } from '@mui/x-data-grid'
import Staffs from '../../data/Staff.json'
import StaffForm from './components/StaffForm'

export default function Staff() {

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã nhân viên",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "name",
      headerName: "Tên nhân viên",
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "department",
      headerName: "Phòng ban",
      width: 180,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "position",
      headerName: "Chức vụ",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "signature",
      headerName: "Quyền ký",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
  ];


  return (
    <Box sx={{ width: '100%', }}>
      <PageAction title="Quản lý nhân viên" />
      <Box py={2}>
        <StaffForm />
      </Box>
      <TableCustom title="Quản lý nhân viên" columns={columns} rows={Staffs} />
    </Box>
  )
}
