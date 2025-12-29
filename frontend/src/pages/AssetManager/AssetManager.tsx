import {
  Archive,
  Cases,
  Delete,
  Download,
  Inventory,
  Inventory2,
  Settings,
  Upload,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Assets from "../../data/Assets.json";
import AssetParents from "../../data/AssetParent.json";
import AssetManagerForm from "./components/AssetManagerForm";
import AssetGroupItem from "./components/AssetGroupItem";

export default function AssetManager() {
  const [tab, setTab] = React.useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [AssetData, setAssetData] = useState(Assets);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedAsset(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = (values: any) => {
    if (selectedAsset) {
      // Update existing capital source
      const updatedAssets = AssetData.map((Asset) =>
        Asset.id === selectedAsset.id ? { ...Asset, ...values } : Asset
      );
      setAssetData(updatedAssets);
    } else {
      // Create new capital Source
      const newAsset = { ...values, id: Date.now() }; // Simple ID generation
      console.log(newAsset);
      setAssetData([...AssetData, newAsset]);
    }
    setShowForm(false);
    setSelectedAsset(null);
  };

  const columns: GridColDef[] = [
    {
      field: "assetNumber",
      headerName: "Mã tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetCode",
      headerName: "Số thẻ",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetName",
      headerName: "Tên tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "recordedDate",
      headerName: "Ngày sào sổ",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "stateBudgetCapital",
      headerName: "Vốn NS",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "loanCapital",
      headerName: "Vốn vay",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "otherCapital",
      headerName: "Vốn khác",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "usedDate",
      headerName: "Ngày sử dụng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "currentUnitId",
      headerName: "Đơn vị hiện thời",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quantityAsset",
      headerName: "Số lượng TS con",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetGroupId",
      headerName: "Nhóm tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetTypeId",
      headerName: "Loại tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetStatus",
      headerName: "Hiện trạng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "unitId",
      headerName: "Đơn vị tính",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "brand",
      headerName: "Mã hiệu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "brandCode",
      headerName: "Số mã hiệu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Quản lý tài sản"
        onNewClick={() => {
          setShowForm(true);
          setSelectedAsset(null);
          setReadOnly(false);
        }}
      />
      {showForm && (
        <Box py={2}>
          <AssetManagerForm
            onCancel={() => {
              setShowForm(false);
              setSelectedAsset(null);
              setReadOnly(false);
            }}
            selectedAsset={selectedAsset}
            readOnly={readOnly}
            onEdit={handleEdit}
            onSave={handleSave}
          />
        </Box>
      )}
      <Paper sx={{ bgcolor: "#04b46eff", p: 2, mt: 2, width: "100%" }}>
        <Typography fontWeight={600} color="white">
          Quản lý tài sản
        </Typography>
        <Divider sx={{ bgcolor: "white", my: 2 }} />
        <Box
          display="flex"
          gap={2}
          sx={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            py: 1,

            // Thanh cuộn mỏng
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.6)",
              borderRadius: 10,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          {AssetParents.map((i, index) => (
            <AssetGroupItem key={index} item={i} />
          ))}
        </Box>
      </Paper>
      <Box>
        <Box display={"flex"} justifyContent={"flex-end"} bgcolor={"#f5efefff"}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab
              label="Kho thu hồi"
              icon={<Inventory2 fontSize="small" />}
              sx={{ fontSize: 12 }}
            />
            <Tab
              label="Tài sản đã bàn giao"
              icon={<Inventory2 fontSize="small" />}
              sx={{ fontSize: 12 }}
            />
            <Tab
              label="Kho công ty"
              icon={<Inventory2 fontSize="small" />}
              sx={{ fontSize: 12 }}
            />
          </Tabs>
        </Box>
        <TableCustom
          title="Quản lý tài sản"
          columns={columns}
          rows={AssetData}
          onRowClick={handleRowClick}
          isDepreciation={true}
        />
      </Box>
    </Box>
  );
}
