import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  LoopOutlined, // icon cho "Chu kỳ theo nhóm"
  HistoryOutlined, // icon cho "Lịch sử bảo dưỡng"
} from "@mui/icons-material";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import { useChuKySuaChuaQuery, useMaintenanceHistoryQuery } from "./mutation/chukysuachua";
import { useDebounce } from "../../hooks/useDebounce";
import { maintenanceLevelColors } from "../../mockdata/mockPlans";
import { GridColDef } from "@mui/x-data-grid";


const historyStatusConfig: Record<
  string,
  { label: string; color: "success" | "default" | "warning" }
> = {
  "1": { label: "Đã BT", color: "success" },
  "0": { label: "Đang bảo trì", color: "warning" },
};

// ── Tab configs — giống pattern MaintenanceRecordPage ────
const tabConfigs = [
  { label: "Chu kỳ theo tài sản", icon: <LoopOutlined /> },
  { label: "Lịch sử bảo dưỡng", icon: <HistoryOutlined /> },
];

// ── Component chính ──────────────────────────────────────
export default function MaintenanceCycles() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const searchDebounce = useDebounce(searchValue, 500);

  // ── Tab 0: Chu kỳ theo tài sản (API) ─────────────────────────
  const { data: pagedData, isLoading } = useChuKySuaChuaQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
  );

  const cycles = (pagedData?.data?.items || []).map(
    (item: any, idx: number) => ({
      ...item,
      stt: paginationModel.page * paginationModel.pageSize + idx + 1,
    }),
  );

  const cycleColumns: GridColDef[] = [
    { field: "stt", headerName: "STT", width: 60 },
    { field: "idTaiSan", headerName: "Mã tài sản", width: 120 },
    { field: "tenTaiSan", headerName: "Tên tài sản", flex: 1, minWidth: 200 },
    {
      field: "tenLoaiSuaChua",
      headerName: "Loại bảo trì",
      width: 150,
    },
    {
      field: "idLoaiSuaChua",
      headerName: "Mã",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (p: any) => (
        <Chip
          label={p.value}
          size="small"
          sx={{
            bgcolor: maintenanceLevelColors[p.value] || "transparent",
          }}
        />
      ),
    },
    { field: "chuKy", headerName: "Chu kỳ", width: 90 },
    { field: "donViChuKy", headerName: "Đơn vị", width: 90 },
  ];

  // ── Tab 1: Lịch sử bảo dưỡng (API) ────────────────────────
  const { data: historyPagedData, isLoading: isHistoryLoading } =
    useMaintenanceHistoryQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      statusFilter,
    );

  const historyRows = (historyPagedData?.items || []).map(
    (item: any, idx: number) => ({
      ...item,
      id: item.thietBiId, // Dùng thietBiId làm key
      stt: paginationModel.page * paginationModel.pageSize + idx + 1,
    }),
  );

  const hCounts = historyPagedData?.trangThaiCounts || {};
  const historyStatusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      value: "",
      count: (hCounts["0"] || 0) + (hCounts["1"] || 0),
      color: "primary",
    },
    {
      label: "Đã BT",
      value: "1",
      count: hCounts["1"] || 0,
      color: "success",
    },
    {
      label: "Đang bảo trì",
      value: "0",
      count: hCounts["0"] || 0,
      color: "warning",
    },
  ];

  const historyColumns = [
    { field: "thietBiId", headerName: "Mã TB", width: 110 },
    { field: "thietBi", headerName: "Tên thiết bị", flex: 1, minWidth: 160 },
    {
      field: "nhomTaiSan",
      headerName: "Nhóm",
      width: 110,
      renderCell: (p: any) => (
        <Chip label={p.value} size="small" variant="outlined" />
      ),
    },
    { field: "lanBTGanNhat", headerName: "Lần BT gần nhất", width: 140 },
    {
      field: "loaiBT",
      headerName: "Loại BT",
      width: 110,
      renderCell: (p: any) =>
        p.value ? (
          <Chip
            label={p.value}
            size="small"
            sx={{
              bgcolor: maintenanceLevelColors[p.value] || "transparent",
            }}
          />
        ) : (
          <span>—</span>
        ),
    },
    {
      field: "idNghiemThu",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (p: any) => {
        const isDone = !!p.value;
        const cfg = isDone ? historyStatusConfig["1"] : historyStatusConfig["0"];
        return <Chip label={cfg.label} size="small" color={cfg.color} />;
      },
    },
  ];

  // reset khi đổi tab
  const handleTabChange = (_: any, val: number) => {
    setActiveTab(val);
    setSearchValue("");
    setStatusFilter("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  return (
    <>
      <PageAction title="Chu kỳ bảo dưỡng thiết bị" />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* ── Tabs ── */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "bold",
                  minHeight: 64,
                },
              }}
            >
              {tabConfigs.map((t, i) => (
                <Tab key={i} iconPosition="top" icon={t.icon} label={t.label} />
              ))}
            </Tabs>
          </Box>

          {/* ── Nội dung theo tab ── */}
          <Box sx={{ minHeight: 500 }}>
            {/* Tab 0: Chu kỳ theo tài sản */}
            {activeTab === 0 && (
              <Card elevation={0} sx={{ borderRadius: 0 }}>
                <CardContent sx={{ p: "0 !important" }}>
                  <TableCustom
                    title="Danh sách chu kỳ"
                    rows={cycles}
                    columns={cycleColumns}
                    total={pagedData?.data?.total || 0}
                    loading={isLoading}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    checkboxSelection={false}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    showDelete={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Tab 1: Lịch sử bảo dưỡng */}
            {activeTab === 1 && (
              <Card elevation={0} sx={{ borderRadius: 0 }}>
                <CardContent sx={{ p: "0 !important" }}>
                  <TableCustom
                    title="Lịch sử bảo dưỡng gần nhất"
                    rows={historyRows}
                    columns={historyColumns}
                    total={historyPagedData?.totalItems || 0}
                    loading={isHistoryLoading}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    checkboxSelection={false}
                    statusOptions={historyStatusOptions}
                    statusValue={statusFilter}
                    onStatusChange={setStatusFilter}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    showDelete={false}
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
