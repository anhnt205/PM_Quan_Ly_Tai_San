import { useState } from "react";
import { Box, Grid, IconButton, Tabs, Tab } from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { VisibilityOff } from "@mui/icons-material";

import TableCustom from "../../components/common/TableCustom";
import { AssetHandoverData, SignaturesData } from "../AssetHandover/types";
import {
  useAssetHandoverMutation,
  useAssetHandoverPageQuery,
} from "../AssetHandover/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllPositionsQuery } from "../Position/Mutation";
import S3Service from "../../services/S3Service";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { showDownloadFile } from "../AssetTransfer/config";
import {
  canSign,
  getPermissionSigning,
  handleSignDocument,
  ShowPermissionSigning,
  showStatus,
  StatusHandover,
} from "../AssetHandover/config";
import SignDocumentForm from "../AssetHandover/components/SignDocumentForm";
import SignerSidebar from "../AssetHandover/components/SignerSidebar";

export default function AssetApprovalTab() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isFullPageSign, setIsFullPageSign] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [sidebarMode, setSidebarMode] = useState<"document" | "signer" | null>(
    null,
  );

  const { user } = useSelector((state: any) => state.user);
  const { signMutation } = useAssetHandoverMutation();

  const searchDebounce = useDebounce(searchValue, 600);

  const { data: handoverPage = { items: [], totalItems: 0 }, isLoading } =
    useAssetHandoverPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      user?.taiKhoan?.tenDangNhap,
      currentStatus !== "" ? Number(currentStatus) : undefined,
      true,
    );

  const { data: staffs = [] } = useAllStaffsQuery();
  const { data: departments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: positions = [] } = useAllPositionsQuery();

  const handleClose = () => {
    setSelectedIds([]);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowSidebar(false);
    setSidebarMode(null);
  };

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count:
        (handoverPage?.groupCounts?.["0"] ?? 0) +
        (handoverPage?.groupCounts?.["1"] ?? 0) +
        (handoverPage?.groupCounts?.["2"] ?? 0) +
        (handoverPage?.groupCounts?.["3"] ?? 0),
      color: "default",
      value: "",
    },
    {
      label: "Nháp",
      count: handoverPage?.groupCounts?.["0"] ?? 0,
      color: "default",
      value: "0",
    },
    {
      label: "Phê duyệt",
      count: handoverPage?.groupCounts?.["1"] ?? 0,
      color: "info",
      value: "1",
    },
    {
      label: "Hủy",
      count: handoverPage?.groupCounts?.["2"] ?? 0,
      color: "error",
      value: "2",
    },
    {
      label: "Hoàn thành",
      count: handoverPage?.groupCounts?.["3"] ?? 0,
      color: "success",
      value: "3",
    },
  ];

  const handleRowClick = (params: GridRowParams) => {
    const data = params.row as any;
    setSelectedRow({ ...data, isNew: false });
    setShowSidebar(true);
    setSidebarMode("document");
    setShowSignDocument(true);
    setIsFullPageSign(false);
    setTabValue(0);
  };

  const handleViewSignAssets = async (fileName: string, item: any) => {
    setShowSignDocument(true);
    setSelectedRow(item);
    setIsFullPageSign(true);
    setShowSidebar(false);
  };

  const handleSign = (
    data: SignaturesData[],
    assetHandover: AssetHandoverData,
  ) => {
    signMutation.mutate({ data, assetHandover });
  };

  const columns: GridColDef<AssetHandoverData>[] = [
    {
      field: "trangThaiPhieu",
      headerName: "Trạng thái phiếu",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => StatusHandover(params.row.trangThaiPhieu ?? 0),
    },
    {
      field: "soQuyetDinh",
      headerName: "Số quyết định",
      width: 150,
      valueGetter: (params, row: any) => row.id,
      renderCell: (params) => params.value,
    },
    {
      field: "lenhDieuDong",
      headerName: "Lệnh điều động",
      width: 150,
      valueGetter: (params, row: any) => row.lenhDieuDong,
    },
    {
      field: "idDonViGiao",
      headerName: "Đơn vị giao",
      width: 180,
      valueGetter: (params, row: any) => row.tenDonViGiao,
    },
    {
      field: "idDonViNhan",
      headerName: "Đơn vị nhận",
      width: 180,
      valueGetter: (params, row: any) => row.tenDonViNhan,
    },
    {
      field: "ngayBanGiao",
      headerName: "Ngày bàn giao",
      width: 150,
      valueGetter: (params, row: any) => row.ngayBanGiao,
    },
    {
      field: "ngayTaoChungTu",
      headerName: "Ngày tạo chứng từ",
      width: 150,
      valueGetter: (params, row: any) => row.ngayTaoChungTu,
    },
    {
      field: "nguoiTao",
      headerName: "Người lập phiếu",
      width: 160,
      valueGetter: (params, row: any) => row.tenDaiDienBenGiao || row.nguoiTao,
    },
    {
      field: "tenFile",
      headerName: "Tài liệu",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (!params.value) return null;
        return showDownloadFile(params.value, () =>
          S3Service.download(params.row.duongDanFile),
        );
      },
    },
    {
      field: "trangThaiKy",
      headerName: "Trạng thái ký",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ShowPermissionSigning(getPermissionSigning(params.row, user, staffs)),
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => showStatus(params.row.trangThai ?? 0),
    },
  ];

  if (showSignDocument && isFullPageSign) {
    return (
      <SignDocumentForm
        key={selectedRow?.id}
        selectedIds={
          selectedIds.length > 0
            ? selectedIds
            : selectedRow
              ? [selectedRow.id]
              : []
        }
        onCancel={handleClose}
        onSign={handleSign}
        assetHandover={selectedRow}
        showSignerSidebar={true}
        allUnits={allUnits}
        fullscreen={true}
        staffs={staffs}
        departments={departments}
        positions={positions}
        isEdit={false}
        bangKe={selectedRow.taiLieuBangKe}
      />
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid
        container
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
          height: "calc(100vh - 220px)",
        }}
      >
        <Grid
          size={{ xs: showSidebar && sidebarMode === "document" ? 6 : 12 }}
          sx={{
            transition: "all 0.3s ease",
            borderRight:
              showSidebar && sidebarMode === "document" ? "1px solid" : "none",
            borderColor: "divider",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <TableCustom
            tableId="assetHandoverApproval"
            sx={{ height: "100%" }}
            loading={isLoading}
            title="Phê duyệt bàn giao tài sản"
            columns={columns}
            rows={handoverPage?.items || []}
            total={handoverPage?.totalItems || 0}
            showStatusFilter={true}
            statusOptions={statusOptions}
            statusValue={currentStatus}
            onStatusChange={(val) => setCurrentStatus(val)}
            onSign={handleViewSignAssets}
            handleSignDocument={handleSignDocument}
            canSign={canSign}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowClick={handleRowClick}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            showDelete={false}
            isCheckShowShare={() => false}
          />
        </Grid>

        {showSidebar && sidebarMode === "document" && (
          <Grid
            size={{ xs: 6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "white",
                pr: 1,
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#04b46eff",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    minWidth: 100,
                    "&.Mui-selected": {
                      color: "#04b46eff",
                    },
                  },
                }}
              >
                <Tab label="Tài liệu" />
                <Tab label="Quy trình ký" />
              </Tabs>
              <IconButton
                size="small"
                onClick={() => {
                  setShowSidebar(false);
                  setSidebarMode(null);
                }}
              >
                <VisibilityOff sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflow: "hidden" }}>
              {tabValue === 0 ? (
                <Box sx={{ height: "100%", overflow: "hidden" }}>
                  <SignDocumentForm
                    key={selectedRow?.id}
                    selectedIds={[selectedRow?.id]}
                    onCancel={handleClose}
                    onSign={handleSign}
                    assetHandover={selectedRow}
                    showSignerSidebar={false}
                    allUnits={allUnits}
                    fullscreen={false}
                    staffs={staffs}
                    departments={departments}
                    positions={positions}
                    isEdit={false}
                    bangKe={selectedRow.taiLieuBangKe}
                    title={`${selectedRow?.banGiaoTaiSan || ""} (${selectedRow?.id || ""})`}
                  />
                </Box>
              ) : (
                <Box sx={{ height: "100%", overflow: "hidden" }}>
                  <SignerSidebar
                    key={selectedRow?.id}
                    selectedRow={selectedRow}
                    onClose={() => {
                      setShowSidebar(false);
                      setSidebarMode(null);
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
