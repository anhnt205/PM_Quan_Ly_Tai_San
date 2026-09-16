import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import PageAction from "../../components/common/PageAction";
import ToolTableCustom from "./components/ToolTableCustom";
import ToolDetailSidebar from "./components/ToolDetailSidebar";
import { useToolPageQuery, fetchToolDetails } from "./Mutation";
import { createColumns } from "./columnConfig";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllToolGroupQuery } from "../ToolGroup/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import AssetHistoryModal from "./components/ToolHistoryModal";
import ToolOwnershipModal from "./components/ToolOwnershipModal";
import { useTabForm } from "../../redux/useTabForm";
import { currentBrandConfig } from "../../config/brandConfig";

interface ToolManagerTabState {
  showSidebar: boolean;
  selectedTool: any | null;
  activeTab?: number;
}

export default function ToolManager() {
  const { formData, setField } =
    useTabForm<ToolManagerTabState>("/quan_ly_ccdc");
  const selectedTool = formData.selectedTool ?? null;
  const showSidebar = formData.showSidebar ?? false;
  const activeTab = formData.activeTab ?? 0;

  const setSelectedTool = (v: any) => setField({ selectedTool: v });
  const setShowSidebar = (v: boolean) => setField({ showSidebar: v });
  const setActiveTab = (v: number) => setField({ activeTab: v });

  const [searchValue, setSearchValue] = useState("");
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedHistoryTool, setSelectedHistoryTool] = useState<any>(null);
  const [openOwnership, setOpenOwnership] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedToolGroup, setSelectedToolGroup] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const searchDebounce = useDebounce(searchValue, 600);
  const loai = activeTab === 1 ? "vattu" : "ccdc";
  const { data: toolsPage, isLoading, refetch } = useToolPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    selectedDepartment,
    selectedToolGroup,
    loai,
  );
  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: toolGroups = [] } = useAllToolGroupQuery();

  const handleOpenHistory = (tool: any) => {
    setSelectedHistoryTool(tool);
    setOpenHistory(true);
  };

  const [columns, setColumns] = useState(() =>
    createColumns(
      handleOpenHistory,
      activeTab === 1,
    ),
  );

  useEffect(() => {
    setColumns((prevColumns) => {
      return prevColumns.map((col) => {
        if (col.key === "id") {
          return { ...col, label: activeTab === 1 ? "Mã vật tư" : "Mã CCDC" };
        }
        if (col.key === "ten") {
          return { ...col, label: activeTab === 1 ? "Tên vật tư" : "Tên CCDC" };
        }
        if (col.key === "tenNhomCCDC") {
          return {
            ...col,
            label: activeTab === 1 ? "Nhóm vật tư" : "Nhóm CCDC",
          };
        }
        if (col.key === "donViTinh2" || col.key === "soLuong2") {
          return { ...col, isShow: activeTab === 1 };
        }
        return col;
      });
    });
  }, [activeTab]);

  return (
    <Box sx={{ width: "100%" }}>
      <AssetHistoryModal
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        selectedTool={selectedHistoryTool}
      />
      <ToolOwnershipModal
        open={openOwnership}
        onClose={() => setOpenOwnership(false)}
        departments={allDepartments}
      />
      <PageAction
        title="Quản lý CCDC - Vật tư"
        showExcel={false}
        onRefresh={() => refetch()}
      />
      <Box
        sx={{
          px: 3,
          bgcolor: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => {
            setActiveTab(newValue);
          }}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: currentBrandConfig.primaryColor,
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minHeight: "48px",
              color: "#67748e",
              px: 0,
              mr: 4,
              minWidth: "auto",
              "&.Mui-selected": {
                color: currentBrandConfig.primaryColor,
              },
            },
          }}
        >
          <Tab label="CCDC" />
          <Tab label="Vật tư" />
        </Tabs>
      </Box>
      <Box p={2}>
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
              title={activeTab === 1 ? "Quản lý Vật tư" : "Quản lý CCDC"}
              rows={toolsPage?.items || []}
              total={toolsPage?.totalItems || 0}
              columns={columns}
              onColumnsChange={setColumns}
              onRowClick={async (row) => {
                try {
                  const fullTool = await fetchToolDetails(row.id);
                  setSelectedTool(fullTool);
                  setShowSidebar(true);
                } catch (e) {
                  console.error(e);
                }
              }}
              selectedIds={[]}
              onSelectionChange={() => {}}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={isLoading}
              allDepartments={allDepartments}
              selectedDepartment={selectedDepartment}
              onSelectedDepartmentChange={setSelectedDepartment}
              toolGroups={toolGroups}
              selectedToolGroup={selectedToolGroup}
              onSelectedToolGroupChange={setSelectedToolGroup}
              onViewOwnership={() => setOpenOwnership(true)}
              isVatTu={activeTab === 1}
              hideSelection={true}
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
