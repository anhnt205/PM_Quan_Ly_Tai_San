import { Badge, Box, Chip, IconButton } from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Projects from "../../data/Project.json";
import ProjectForm from "./components/ProjectForm";
import { Delete } from "@mui/icons-material";
import React, { useState } from "react";
import { useProjectMutation } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";

export default function Project() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    projectsPage,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    isLoading,
  } = useProjectMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedProject(params.row);
    setReadOnly(true); // Set readOnly to true when viewing details
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedProject) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedProject(null);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Mã dự án",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenDuAn",
      headerName: "Tên dự án",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ghiChu",
      headerName: "Ghi chú",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hieuLuc",
      headerName: "Hiệu lực",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.row.hieuLuc;
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
        <IconButton
          onClick={async (e) => {
            e.stopPropagation();
            const confirm = await showConfirmAlert("Xác nhận xóa!");
            if (confirm.isConfirmed) {
              deleteOneMutation.mutate(params.row.id);
            }
          }}
        >
          <Delete color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Quản lý dự án"
        onNewClick={() => {
          setShowForm(true);
          setSelectedProject(null);
          setReadOnly(false);
        }}
      />
      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <ProjectForm
              onCancel={() => {
                setShowForm(false);
                setSelectedProject(null);
                setReadOnly(false); // Reset readOnly when form is closed
              }}
              onEdit={handleEdit}
              selectedProject={selectedProject}
              readOnly={readOnly}
              onSave={handleSave}
            />
          </Box>
        )}
        <TableCustom
          title="Quản lý dự án"
          columns={columns}
          rows={projectsPage.items}
          total={projectsPage.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          onRowClick={handleRowClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={deleteManyMutation.mutate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Box>
    </Box>
  );
}
