import { useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { VisibilityOff } from "@mui/icons-material";

import TableCustom from "../../components/common/TableCustom";
import { AssetHandoverData } from "../AssetHandover/types";
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
import {
  showDownloadFile,
} from "../AssetTransfer/config";
import {
  getPermissionSigning,
  handleSendToSigner,
  isCheckShowShare,
  ShowPermissionSigning,
  showStatus,
  StatusHandover,
} from "../AssetHandover/config";
import SignDocumentForm from "../AssetHandover/components/SignDocumentForm";
import SignerSidebar from "../AssetHandover/components/SignerSidebar";

export default function AssetRecordTab() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const { user } = useSelector((state: any) => state.user);
  const { updateManyMutation } = useAssetHandoverMutation();

  const searchDebounce = useDebounce(searchValue, 600);
  
  const { data: handoverPage = { items: [], totalItems: 0 }, isLoading } =
    useAssetHandoverPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      undefined,
      currentStatus ? Number(currentStatus) : undefined,
    );

  const { data: staffs = [] } = useAllStaffsQuery();
  const { data: departments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: positions = [] } = useAllPositionsQuery();

  const handleClose = () => {
    setSelectedIds([]);
    setSearchValue("");
    setSelectedRow(null);
    setShowSidebar(false);
    setTabValue(0);
  };

  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, () => {
      setSelectedIds([]);
    });
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
    setTabValue(0);
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

  return (
    <Box sx={{ p: 2 }}>
      <Grid
        container
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Grid 
          size={{ xs: showSidebar ? 6 : 12 }}
          sx={{
            transition: "all 0.3s ease",
            borderRight: showSidebar ? "1px solid" : "none",
            borderColor: "divider",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <TableCustom
            tableId="assetHandoverRecord"
            sx={{ height: "100%" }}
            loading={isLoading}
            title=""
            columns={columns}
            rows={handoverPage?.items || []}
            total={handoverPage?.totalItems || 0}
            showStatusFilter={true}
            statusOptions={statusOptions}
            statusValue={currentStatus}
            onStatusChange={(val) => setCurrentStatus(val)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowClick={handleRowClick}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            showDelete={false}
            isCheckShowShare={isCheckShowShare}
            handleSendToSigner={handleSend}
          />
        </Grid>

        {showSidebar && (
          <Grid
            size={{ xs: 6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pr: 1,
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": { backgroundColor: "#04b46eff" },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    minWidth: 100,
                    "&.Mui-selected": { color: "#04b46eff" },
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
                  setTabValue(0);
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
                    onSign={() => {}} // Read-only
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
                      setTabValue(0);
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
