import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import PageAction from "../../components/common/PageAction";
import { GridRowParams } from "@mui/x-data-grid";
import ToolForm from "./components/ToolForm";
import ToolTableCustom from "./components/ToolTableCustom";
import ToolDetailSidebar from "./components/ToolDetailSidebar";
import { useToolManagerMutation, useToolPageQuery } from "./Mutation";
import { createColumns } from "./columnConfig";
import {
  useAllDepartmentsQuery,
  useDepartmentMutation,
} from "../Department/Mutation";
import { useAllToolTypeQuery, useToolTypeMutation } from "../ToolType/Mutation";
import { useAllUnitsQuery, useUnitMutation } from "../Unit/Mutation";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { useDebounce } from "../../hooks/useDebounce";
import AssetHistoryModal from "./components/ToolHistoryModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function ToolManager() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedHistoryTool, setSelectedHistoryTool] = useState<any>(null);

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.autoCreate) {
      setShowForm(true);
      setSelectedTool(null);
      setReadOnly(false);

      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const {
    toolGroups,
    createMutation,
    updateMutation,
    deleteManyMutation,
    exportExcelMutation,
    importExcelMutation,
  } = useToolManagerMutation((messages) => {
    setImportErrors(messages);
    setOpenErrorModal(true);
  });

  const searchDebounce = useDebounce(searchValue, 600);
  const { data: toolsPage, isLoading } = useToolPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
  );
  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: toolTypes = [] } = useAllToolTypeQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();

  const handleOpenHistory = (tool: any) => {
    setSelectedHistoryTool(tool);
    setOpenHistory(true);
  };

  const [columns, setColumns] = useState(() =>
    createColumns(handleOpenHistory),
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

  return (
    <Box sx={{ width: "100%" }}>
      <AssetHistoryModal
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        selectedTool={selectedHistoryTool}
      />
      <ImportErrorDialog
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        errors={importErrors}
      />
      <PageAction
        title="Quản lý CCDC - Vật tư"
        onNewClick={() => {
          setShowForm(true);
          setSelectedTool(null);
          setReadOnly(false);
        }}
        onExport={() => exportExcelMutation.mutate()}
        onImport={(file) => importExcelMutation.mutate(file)}
        showExcel={true}
      />
      <Box p={2}>
        {showForm && (
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
            departments={allDepartments}
            toolTypes={toolTypes}
            allUnits={allUnits}
            toolGroups={toolGroups}
          />
        )}

        <Box
          sx={{
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
              tableId="toolManager"
              title="Quản lý CCDC - Vật tư"
              rows={toolsPage?.items || []}
              total={toolsPage?.totalItems || 0}
              columns={columns}
              onColumnsChange={setColumns}
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
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={isLoading}
              allDepartments={allDepartments}
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
                departments={allDepartments}
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
