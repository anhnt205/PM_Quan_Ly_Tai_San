import { useState, SyntheticEvent } from "react";
import { Badge, Box, Tab, Tabs, Grid, IconButton } from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import TableCustom from "../../components/common/TableCustom";
import { AssetTransferData, SignaturesData } from "../AssetTransfer/types";
import {
  useAssetTranferMutation,
  useAssetTransferPageQuery,
} from "../AssetTransfer/Mutation";
import {
  canSign,
  getDecision,
  getPermissionSigning,
  getTypeInfo,
  handleSendToSigner,
  handleSignDocument,
  isCheckShowShare,
  showDownloadFile,
  ShowPermissionSigning,
  showShareStatus,
  showStatus,
  showStatusDocument,
} from "../AssetTransfer/config";
import { useDebounce } from "../../hooks/useDebounce";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import S3Service from "../../services/S3Service";
import SignDocumentForm from "../AssetTransfer/components/SignDocumentForm";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { Construction, VisibilityOff } from "@mui/icons-material";
import SignerSidebar from "../AssetTransfer/components/SignerSidebar";
import BienBanTabContent from "../AssetTransfer/components/BienBanTabContent";
import { currentBrandConfig } from "../../config/brandConfig";
import { useTabForm } from "../../redux/useTabForm";

interface AssetTransferApprovalTabProps {
  assetTransferCounts: any;
}

interface AssetTransferTabState {
  showForm: boolean;
  selectedRow: any | null;
  showSidebar: boolean;
  readOnly: boolean;
  tabValue: number;
  sidebarMode: "document" | "signer" | null;
  status: string;
  showSignDocument: boolean;
  isFullPageSign: boolean;
  selectedDocument: any | null;
  draftForm?: Record<string, any>;
  prevType: string | null;
}

export default function AssetTransferApprovalTab({
  assetTransferCounts,
}: AssetTransferApprovalTabProps) {
  const [subTab, setSubTab] = useState(0); // 0: Cấp phát, 1: Điều chuyển, 2: Thu hồi
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<"document" | "signer" | null>(
    null,
  );
  const [tabValue, setTabValue] = useState(0);
  const [assetTransferDetail, setAssetTransferDetail] = useState<any[]>([]);
  const [assetHandover, setAssetHandover] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const type = subTab + 1; // 1, 2, 3

  const { formData, setField } = useTabForm<AssetTransferTabState>(
    `/dieu_chuyen_thiet_bi/phe_duyet`,
  );

  // Đọc từ Redux
  const showSignDocument = formData.showSignDocument ?? false;
  const isFullPageSign = formData.isFullPageSign ?? false;

  // Setter helpers
  const setShowSignDocument = (v: boolean) => setField({ showSignDocument: v });
  const setIsFullPageSign = (v: boolean) => setField({ isFullPageSign: v });

  const { user } = useSelector((state: any) => state.user);
  const {
    signMutation,
    updateManyMutation,
    decisionMutation,
    getAssetHandoverMutation,
    handleSignatureList,
  } = useAssetTranferMutation();

  const debouncedSearch = useDebounce(searchValue, 600);

  const {
    data: pageData = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
      loaiCounts: {},
    },
    isLoading,
  } = useAssetTransferPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    debouncedSearch,
    type,
    user?.taiKhoan?.tenDangNhap,
    status !== "" ? Number(status) : undefined,
    undefined,
    undefined,
    true,
  );

  const { data: allStaffs = [] } = useAllStaffsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();

  const handleSubTabChange = (_event: SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
    setPaginationModel({ ...paginationModel, page: 0 });
    setSelectedIds([]);
  };

  const handleClose = () => {
    setField({ draftForm: undefined });
    setSelectedIds([]);
    setSelectedDocument(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowSidebar(false);
    setAssetHandover([]);
    setSidebarMode(null);
    setIsFullPageSign(false);
    setTabValue(0);
  };

  const handleRowClick = async (params: GridRowParams) => {
    const data = params.row as AssetTransferData;
    setSelectedRow(data);
    setSelectedDocument(data.taiLieuCuoi);
    setAssetTransferDetail(data.chiTietDieuDongTaiSanDTOS || []);
    setShowSidebar(true);
    setSidebarMode("document");
    setTabValue(0);

    if (data.coPhieuBanGiao) {
      const result: any[] = await getAssetHandoverMutation.mutateAsync(data.id);
      setAssetHandover(result);
    } else {
      setAssetHandover([]);
    }
  };

  const handleSign = (data: SignaturesData[]) => {
    signMutation.mutate({
      SignaturesData: data,
      asset: selectedRow,
    });
  };

  const handleDecision = (data: any[]) => {
    decisionMutation.mutate(data);
  };

  const handleViewSignAssets = async (fileName: string, item: any) => {
    setSelectedDocument(fileName);
    setShowSignDocument(true);
    setIsFullPageSign(true);
    setSelectedRow(item);
    setAssetTransferDetail(item.chiTietDieuDongTaiSanDTOS);
    setShowSignerSidebar(true);
  };

  const { label } = getTypeInfo(type.toString());

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count: pageData.loaiCounts?.[`${type}`] ?? 0,
      color: "default",
      value: "",
    },
    {
      label: "Nháp",
      count: pageData?.trangThaiCounts?.["0"] ?? 0,
      color: "default",
      value: "0",
    },
    {
      label: "Phê duyệt",
      count: pageData?.trangThaiCounts?.["1"] ?? 0,
      color: "info",
      value: "1",
    },
    {
      label: "Hủy",
      count: pageData?.trangThaiCounts?.["2"] ?? 0,
      color: "error",
      value: "2",
    },
    {
      label: "Chưa ban hành",
      count: pageData?.trangThaiCounts?.["3"] ?? 0,
      color: "secondary",
      value: "3",
    },
    {
      label: "Đã ban hành",
      count: pageData?.trangThaiCounts?.["4"] ?? 0,
      color: "success",
      value: "4",
    },
  ];

  const columns: GridColDef<any>[] = [
    {
      field: "trangThai",
      headerName: "Trạng thái phiếu",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => showStatus(params.row.trangThai ?? 0),
    },
    {
      field: "id",
      headerName: "Mã",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tenPhieu",
      headerName: "Phiếu ký nội sinh",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "trichYeu",
      headerName: "Trích yếu",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tenFile",
      headerName: "Tài liệu duyệt",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return showDownloadFile(params.value, () =>
          S3Service.download(params.row.duongDanFile),
        );
      },
    },
    {
      field: "tenDonViGiao",
      headerName: "Đơn vị giao",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tenDonViNhan",
      headerName: "Đơn vị nhận",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "TrangThaiKy",
      headerName: "Trạng thái ký",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ShowPermissionSigning(
          getPermissionSigning(params.row, user, allStaffs),
        ),
    },
    {
      field: "TrangThaiBanGiao",
      headerName: "Trạng thái bàn giao",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showStatusDocument(params.row?.trangThaiPhieuDieuDong ?? 0),
    },
    {
      field: "share",
      headerName: "Trình duyệt",
      width: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showShareStatus(
          params.row?.share ?? false,
          params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap,
        ),
    },
  ];

  return (
    <>
      {showSignDocument && isFullPageSign ? (
        <SignDocumentForm
          key={selectedRow?.id}
          selectedIds={
            selectedIds.length > 0
              ? selectedIds
              : selectedRow
                ? [selectedRow.id]
                : []
          }
          document={selectedDocument}
          onCancel={handleClose}
          onSign={handleSign}
          assetTransferDetail={assetTransferDetail}
          showSignerSidebar={showSignerSidebar}
          allUnits={allUnits}
          allCurrentStatus={allCurrentStatus}
          fullscreen={true}
          staffs={allStaffs}
          isEdit={false}
        />
      ) : (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Tabs
              value={subTab}
              onChange={handleSubTabChange}
              sx={{
                minHeight: "40px",
                "& .MuiTabs-indicator": {
                  backgroundColor: currentBrandConfig.primaryColor,
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  minHeight: "40px",
                  "&.Mui-selected": {
                    color: currentBrandConfig.primaryColor,
                  },
                },
              }}
            >
              <Tab
                icon={
                  <Badge
                    badgeContent={assetTransferCounts?.c1 ?? 0}
                    color="error"
                  >
                    <Construction sx={{ fontSize: 20 }} />
                  </Badge>
                }
                label="Cấp phát tài sản"
              />
              <Tab
                icon={
                  <Badge
                    badgeContent={assetTransferCounts?.c2 ?? 0}
                    color="error"
                  >
                    <Construction sx={{ fontSize: 20 }} />
                  </Badge>
                }
                label="Điều chuyển tài sản"
              />
              <Tab
                icon={
                  <Badge
                    badgeContent={assetTransferCounts?.c3 ?? 0}
                    color="error"
                  >
                    <Construction sx={{ fontSize: 20 }} />
                  </Badge>
                }
                label="Thu hồi tài sản"
              />
            </Tabs>
          </Box>

          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "stretch",
              bgcolor: "background.paper",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Grid
              size={{
                xs: showSidebar ? (sidebarMode === "document" ? 6 : 9) : 12,
              }}
              sx={{
                transition: "all 0.3s ease",
                borderRight: showSidebar ? "1px solid" : "none",
                borderColor: "divider",
                "& .MuiPaper-root": {
                  margin: 0,
                  boxShadow: "none",
                  borderRadius: 0,
                },
              }}
            >
              <TableCustom
                tableId={`assetTransferApproval-${subTab}`}
                title={`Phiếu ${subTab === 0 ? "cấp phát" : subTab === 1 ? "điều chuyển" : "thu hồi"} tài sản`}
                columns={columns}
                rows={pageData.items}
                total={pageData.totalItems}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowClick={handleRowClick}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onSign={handleViewSignAssets}
                handleSignDocument={handleSignDocument}
                canSign={canSign}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                showStatusFilter={true}
                showDelete={false}
                statusOptions={statusOptions}
                onStatusChange={setStatus}
                handleDecision={handleDecision}
                isDecision={getDecision}
                statusValue={status}
                loading={isLoading}
              />
            </Grid>
            {showSidebar && (
              <Grid
                size={{ xs: sidebarMode === "document" ? 6 : 3 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                  borderLeft: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
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
                    <Box
                      sx={{
                        height: "calc(100vh - 120px)",
                        overflow: "hidden",
                      }}
                    >
                      <SignDocumentForm
                        key={selectedRow?.id}
                        selectedIds={
                          selectedIds.length > 0
                            ? selectedIds
                            : selectedRow
                              ? [selectedRow.id]
                              : []
                        }
                        document={selectedDocument}
                        onCancel={handleClose}
                        onSign={handleSign}
                        assetTransferDetail={assetTransferDetail}
                        showSignerSidebar={false}
                        allUnits={allUnits}
                        allCurrentStatus={allCurrentStatus}
                        fullscreen={false}
                        staffs={allStaffs}
                        isEdit={false}
                        title={`${selectedRow?.tenPhieu || ""} (${selectedRow?.id || ""})`}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: "calc(100vh - 120px)",
                        overflow: "hidden",
                      }}
                    >
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
      )}
    </>
  );
}
