import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ProjectForm from "./components/ProjectForm";
import { ContentCopy, Delete } from "@mui/icons-material";
import { useState } from "react";
import {
  useAllProjectsQuery,
  useProjectMutation,
  useProjectsPageQuery,
} from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTabForm } from "../../redux/useTabForm";

interface ProjectTabState {
  showForm: boolean;
  selectedProject: any | null;
  readOnly: boolean;
  isCopy: boolean;
  draftForm?: Record<string, any>;
}

export default function Project() {
  const { formData, setField } = useTabForm<ProjectTabState>("/du_an");
  const showForm = formData.showForm ?? false;
  const selectedProject = formData.selectedProject ?? null;
  const readOnly = formData.readOnly ?? false;
  const isCopy = formData.isCopy ?? false;
  const setShowForm = (v: boolean) => setField({ showForm: v });
  const setSelectedProject = (v: any) => setField({ selectedProject: v });
  const setReadOnly = (v: boolean) => setField({ readOnly: v });
  const setIsCopy = (v: boolean) => setField({ isCopy: v });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useSelector((state: RootState) => state.user);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    exportMutation,
    importExcelMutation,
    deleteAllMutation,
  } = useProjectMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
  );

  const debouncedSearchValue = useDebounce(searchValue, 600);
  const { data: projectsPage = { items: [], totalItems: 0 }, isLoading } =
    useProjectsPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      debouncedSearchValue,
    );
  const { data: allProjects = [] } = useAllProjectsQuery();

  const handleRowClick = (params: GridRowParams) => {
    setSelectedProject(params.row);
    window.scrollTo({ top: 140, behavior: "smooth" });
    setReadOnly(true);
    setShowForm(true);
  };

  const handleSave = (values: any) => {
    if (selectedProject && !isCopy) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    setShowForm(false);
    setSelectedProject(null);
    setIsCopy(false);
    setField({ draftForm: undefined });
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
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              const { id, ...copyData } = params.row;
              setSelectedProject({ ...copyData, id: "" });
              setIsCopy(true);
              setReadOnly(false);
              setShowForm(true);
            }}
          >
            <ContentCopy color="primary" />
          </IconButton>
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
        </Box>
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
        onExport={() => exportMutation.mutate(allProjects)}
        onImport={(file) => importExcelMutation.mutate(file)}
        showExcel={true}
      />
      <Box p={2}>
        <Dialog
          open={exportMutation.isPending || importExcelMutation.isPending}
          PaperProps={{
            sx: {
              borderRadius: 0,
              boxShadow: "none",
              border: "1px solid #d9d9d9",
              minWidth: "200px",
            },
          }}
        >
          <DialogContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} color="inherit" thickness={4} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Đang xử lý dữ liệu...
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
        {showForm && (
          <Box py={2}>
            <ProjectForm
              onCancel={() => {
                setShowForm(false);
                setSelectedProject(null);
                setReadOnly(false);
                setField({ draftForm: undefined });
              }}
              onEdit={handleEdit}
              selectedProject={selectedProject}
              readOnly={readOnly}
              onSave={handleSave}
              onFormChange={(values) => setField({ draftForm: values })}
              initialFormData={formData.draftForm}
            />
          </Box>
        )}
        <TableCustom
          tableId="project"
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
          onDeleteAll={deleteAllMutation.mutate}
          showDeleteAll={user?.taiKhoan?.tenDangNhap === "admin"}
        />
      </Box>
    </Box>
  );
}
