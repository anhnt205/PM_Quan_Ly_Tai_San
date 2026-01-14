import { Box } from "@mui/material";
import { useState } from "react";
import PageAction from "../../components/common/PageAction";
import { GridRowParams } from "@mui/x-data-grid";
import ToolForm from "./components/ToolForm";
import ToolTableCustom from "./components/ToolTableCustom";
import ToolDetailSidebar from "./components/ToolDetailSidebar";
import { useToolManagerMutation } from "./Mutation";
import { DEFAULT_COLUMNS } from "./columnConfig";
import { useDepartmentMutation } from "../Department/Mutation";
import { useToolTypeMutation } from "../ToolType/Mutation";
import { useUnitMutation } from "../Unit/Mutation";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";

export default function ToolManager() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [openErrorModal, setOpenErrorModal] = useState(false);

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
    deleteManyMutation,
    exportExcelMutation,
    importExcelMutation,
  } = useToolManagerMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
    (messages) => {
      setImportErrors(messages);
      setOpenErrorModal(true);
    }
  );
  const { allDepartments } = useDepartmentMutation();
  const { toolTypes } = useToolTypeMutation();
  const { allUnits } = useUnitMutation();

  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

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
