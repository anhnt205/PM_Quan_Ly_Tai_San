import { useState, SyntheticEvent } from "react";
import { Box, Grid, IconButton, Tab, Tabs } from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import TableCustom from "../../components/common/TableCustom";
import { AssetTransferData } from "../AssetTransfer/types";
import { useAssetTransferPageQuery } from "../AssetTransfer/Mutation";
import {
  getTypeInfo,
  showDownloadFile,
  showShareStatus,
  showStatus,
  showStatusDocument,
  getPermissionSigning,
  ShowPermissionSigning,
} from "../AssetTransfer/config";
import { useDebounce } from "../../hooks/useDebounce";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import S3Service from "../../services/S3Service";
import SignDocumentForm from "../AssetTransfer/components/SignDocumentForm";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { VisibilityOff } from "@mui/icons-material";

export default function AssetTransferRecordTab() {
  const [subTab, setSubTab] = useState(0); // 0: Cấp phát, 1: Điều chuyển, 2: Thu hồi
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [showViewDocument, setShowViewDocument] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const { user } = useSelector((state: any) => state.user);

  const type = subTab + 1; // 1, 2, 3
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
    undefined, // Get all records
    status ? Number(status) : undefined,
  );

  const { data: allStaffs = [] } = useAllStaffsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();

  const handleSubTabChange = (_event: SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const handleRowClick = (params: GridRowParams) => {
    const data = params.row as AssetTransferData;
    setSelectedRow(data);
    setShowViewDocument(true);
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
      width: 200,
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
      width: 200,
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
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showShareStatus(
          params.row?.share ?? false,
          params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap,
        ),
    },
  ];

  // if (showViewDocument) {
  //   return (
  //     <SignDocumentForm
  //       key={selectedRow?.id}
  //       selectedIds={[selectedRow?.id]}
  //       document={selectedRow?.taiLieuCuoi}
  //       onCancel={() => setShowViewDocument(false)}
  //       onSign={() => {}} // Read-only
  //       assetTransferDetail={selectedRow?.chiTietDieuDongTaiSanDTOS || []}
  //       showSignerSidebar={true}
  //       allUnits={allUnits}
  //       allCurrentStatus={allCurrentStatus}
  //       fullscreen={true}
  //       staffs={allStaffs}
  //       isEdit={false}
  //     />
  //   );
  // }

  return (
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
              backgroundColor: "#04b46eff",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              minHeight: "40px",
              "&.Mui-selected": {
                color: "#04b46eff",
              },
            },
          }}
        >
          <Tab label="Cấp phát tài sản" />
          <Tab label="Điều chuyển tài sản" />
          <Tab label="Thu hồi tài sản" />
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
          height: "calc(100vh - 270px)",
        }}
      >
        <Grid
          size={{
            xs: showViewDocument ? 6 : 12,
          }}
          sx={{
            transition: "all 0.3s ease",
            borderRight: showViewDocument ? "1px solid" : "none",
            borderColor: "divider",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <TableCustom
            tableId={`assetTransferRecordTab-${subTab}`}
            sx={{ height: "100%" }}
            title=""
            columns={columns}
            rows={pageData.items}
            total={pageData.totalItems}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowClick={handleRowClick}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            showStatusFilter={true}
            showDelete={false}
            statusOptions={statusOptions}
            onStatusChange={setStatus}
            statusValue={status}
            isCheckShowShare={() => false}
            loading={isLoading}
          />
        </Grid>
        {showViewDocument && (
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
              <Box sx={{ ml: 2, fontWeight: "bold" }}>Xem tài liệu</Box>
              <IconButton
                size="small"
                onClick={() => {
                  setShowViewDocument(false);
                }}
              >
                <VisibilityOff sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <Box sx={{ height: "100%", overflow: "hidden" }}>
                <SignDocumentForm
                  key={selectedRow?.id}
                  selectedIds={[selectedRow?.id]}
                  document={selectedRow?.taiLieuCuoi}
                  onCancel={() => setShowViewDocument(false)}
                  onSign={() => {}} // Read-only
                  assetTransferDetail={
                    selectedRow?.chiTietDieuDongTaiSanDTOS || []
                  }
                  showSignerSidebar={false}
                  allUnits={allUnits}
                  allCurrentStatus={allCurrentStatus}
                  fullscreen={false}
                  staffs={allStaffs}
                  isEdit={false}
                />
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
