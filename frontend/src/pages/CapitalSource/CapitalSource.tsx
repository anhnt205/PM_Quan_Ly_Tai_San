import { Delete, Download, Settings, Upload } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import CapitalSources from "../../data/CapitalSource.json";
import CapitalSourceForm from "./components/CapitalSourceForm";

export default function CapitalSource() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCapitalSource, setSelectedCapitalSource] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [CapitalSourceData, setCapitalSourceData] = useState(CapitalSources);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCapitalSource(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = (values: any) => {
    if (selectedCapitalSource) {
      // Update existing capital source
      const updatedCapitalSources = CapitalSourceData.map((CapitalSource) =>
        CapitalSource.id === selectedCapitalSource.id ? { ...CapitalSource, ...values } : CapitalSource
      );
      setCapitalSourceData(updatedCapitalSources);
    } else {
      // Create new capital Source
      const newCapitalSource = { ...values, id: Date.now() }; // Simple ID generation
      console.log(newCapitalSource);
      setCapitalSourceData([...CapitalSourceData, newCapitalSource]);
    }
    setShowForm(false);
    setSelectedCapitalSource(null);
  };
  console.log(CapitalSourceData);
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã nguồn kinh phí",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên nguồn kinh phí",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.row.status;
        return (
          <Chip
            label={isActive ? "Hoạt động" : "Không hoạt động"}
            size="small" // Nên để small cho gọn trong bảng
            sx={{
              bgcolor: isActive ? "#baf7cbff" : "#f5f5f5",

              color: isActive ? "#137333" : "#616161",

              // Bỏ viền nếu không cần
              border: "none",
            }}
          />
        );
      },
    },
    {
      field: "active",
      headerName: "Hiệu lực",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.row.active;
        return (
          <Chip
            label={isActive ? "Có hiệu lực" : "Không hiệu lực"}
            size="small" // Nên để small cho gọn trong bảng
            sx={{
              bgcolor: isActive ? "#baf7cbff" : "#f5f5f5",

              color: isActive ? "#137333" : "#616161",

              // Bỏ viền nếu không cần
              border: "none",
            }}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton>
          <Delete color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Quản lý nguồn vốn"
        onNewClick={() => {
          setShowForm(true);
          setSelectedCapitalSource(null);
          setReadOnly(false);
        }}
      />
      {showForm && (
        <Box py={2}>
          <CapitalSourceForm onCancel={() => {
            setShowForm(false);
            setSelectedCapitalSource(null);
            setReadOnly(false);
          }}
          capitalSource={selectedCapitalSource}
          readOnly={readOnly}
          onEdit={handleEdit}
          onSave={handleSave}
        />
        </Box>
      )}
      <TableCustom
        title="Quản lý nguồn vốn"
        columns={columns}
        rows={CapitalSourceData}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
