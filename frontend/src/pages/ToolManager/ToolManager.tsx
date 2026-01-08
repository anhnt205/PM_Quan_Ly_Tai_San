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
  Grid,
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
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ToolForm from "./components/ToolForm";
import ToolTableCustom from "./components/ToolTableCustom";
import ToolDetailSidebar from "./components/ToolDetailSidebar";
import { useToolManagerMutation } from "./Mutation";
//import ToolGroupItem from "./components/ToolGroupItem";

export default function ToolManager() {
  const [tab, setTab] = React.useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    toolsPage,
    toolGroups,
    isLoading,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
  } = useToolManagerMutation(
    tab,
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
    selectedGroup
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedTool(params.row);
    setReadOnly(true);
    setShowForm(false);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = (values: any) => {
    if (selectedTool) {
      updateMutation.mutate(values, {
        onSuccess: () => {
          setShowForm(false);
          setSelectedTool(null);
        },
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setShowForm(false);
          setSelectedTool(null);
        },
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "toolNumber",
      headerName: "Mã CCDC",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolName",
      headerName: "Tên CCDC",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolInput",
      headerName: "Đơn vị nhập",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolGroupName",
      headerName: "Nhóm CCDC",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolInputedAt",
      headerName: "Ngày nhập",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolUnit",
      headerName: "Đơn vị tính",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolQuantity",
      headerName: "Số lượng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolValue",
      headerName: "Giá trị",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolSign",
      headerName: "Ký hiệu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolNote",
      headerName: "Ghi chú",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolCreator",
      headerName: "Người tạo",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolCreatedAt",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolStatus",
      headerName: "Trạng thái",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Quản lý CCDC - Vật tư"
        onNewClick={() => {
          setShowForm(true);
          setSelectedTool(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2} px={2}>
            <ToolForm
              key={`${selectedTool?.id}-${readOnly}`}
              onCancel={() => {
                setShowForm(false);
                setReadOnly(true);
              }}
              selectedTool={selectedTool}
              readOnly={readOnly}
              onEdit={handleEdit}
              onSave={handleSave}
            />
          </Box>
        )}

        <Box
          sx={{
            mx: 2,
            mb: 2,
            mt: 2,
            display: "flex",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          {/* Table */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              overflowX: "auto",
              overflowY: "hidden",
              borderRight: selectedTool && showSidebar ? "1px solid" : "none",
              borderColor: "divider",
              transition: "border 0.3s ease",
            }}
          >
            <ToolTableCustom
              title="Quản lý CCDC - Vật tư"
              rows={toolsPage?.items || []}
              onRowClick={(row) => {
                setSelectedTool(row);
                setReadOnly(true);
                setShowForm(true);
                setShowSidebar(true);
              }}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onDelete={(ids) => {
                deleteManyMutation.mutate(ids);
              }}
            />
          </Box>

          {/* Sidebar */}
          {selectedTool && showSidebar && (
            <Box
              sx={{
                width: 380,
                flexShrink: 0,
                borderLeft: "1px solid",
                borderColor: "divider",
                transition: "all 0.3s ease",
              }}
            >
              <ToolDetailSidebar
                selectedTool={selectedTool}
                onClose={() => {
                  setShowSidebar(false);
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
