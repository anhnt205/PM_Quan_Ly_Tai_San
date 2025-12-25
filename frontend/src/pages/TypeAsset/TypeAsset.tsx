import { Delete, Download, Settings, Upload } from '@mui/icons-material'
import { Box, Button, Chip, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import PageAction from '../../components/common/PageAction'
import TableCustom from '../../components/common/TableCustom'
import { GridColDef, GridRowParams } from '@mui/x-data-grid'
import TypeAssets from '../../data/TypeAsset.json'
import TypeAssetForm from './components/TypeAssetForm'

export default function TypeAsset() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTypeAsset, setSelectedTypeAsset] = useState<any>(null);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedTypeAsset(params.row);
    setShowForm(true);
  };
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã loại tài sản",
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "assetParent",
      headerName: "Mã loại tài sản cha",
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: "name",
      headerName: "Tên loại tài sản",
      flex: 1,
      minWidth: 150,
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
      <PageAction title="Quản lý loại tài sản" onNewClick={() => {
        setShowForm(true);
        setSelectedTypeAsset(null);
      }}/>
      {showForm && (
        <Box py={2}>
          <TypeAssetForm onCancel={() => {
            setShowForm(false);
            setSelectedTypeAsset(null);
          }} typeAsset={selectedTypeAsset} />
        </Box>
      )}
      <TableCustom title="Quản lý loại tài sản" columns={columns} rows={TypeAssets}
        onRowClick={handleRowClick} />
    </Box>
  )
}
