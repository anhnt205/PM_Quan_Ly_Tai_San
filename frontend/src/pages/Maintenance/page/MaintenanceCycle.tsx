import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  TableContainer,
  Tabs,
  Tab,
} from "@mui/material";
import {
  LoopOutlined, // icon cho "Chu kỳ theo nhóm"
  HistoryOutlined, // icon cho "Lịch sử bảo dưỡng"
} from "@mui/icons-material";
import { FilterOption } from "../../../components/common/FilterStatusGroup";
import PageAction from "../../../components/common/PageAction";
import TableCustom from "../../../components/common/TableCustom";
import { useChuKySuaChuaQuery } from "../mutation/chukysuachua";
import { useDebounce } from "../../../hooks/useDebounce";
import { maintenanceLevelColors } from "../../../mockdata/mockPlans";
import { GridColDef } from "@mui/x-data-grid";

// --- Mock lịch sử bảo dưỡng (giữ lại nếu chưa có API cho tab 2) ---
const maintenanceHistory = [
  {
    id: "TB-001",
    name: "Quạt gió lò 1",
    group: "QG",
    lastDate: "03/04/2026",
    lastType: "SCN",
    status: "da-bt",
  },
  {
    id: "TB-002",
    name: "Máng cào 1",
    group: "MC",
    lastDate: "03/04/2026",
    lastType: "CST",
    status: "da-bt",
  },
  {
    id: "TB-003",
    name: "Băng tải B800",
    group: "BT-B800",
    lastDate: "15/03/2026",
    lastType: "SCC",
    status: "da-bt",
  },
  {
    id: "TB-004",
    name: "Cảm biến khí",
    group: "KDT",
    lastDate: "21/03/2026",
    lastType: "SCN",
    status: "da-bt",
  },
  {
    id: "TB-005",
    name: "Tời điện 1",
    group: "TD",
    lastDate: "—",
    lastType: "—",
    status: "chua-bt",
  },
  {
    id: "TB-006",
    name: "Bơm nước 1",
    group: "BM-Đ",
    lastDate: "10/02/2026",
    lastType: "SCN",
    status: "da-bt",
  },
  {
    id: "TB-007",
    name: "Máy nén khí",
    group: "MNK",
    lastDate: "05/04/2026",
    lastType: "CST",
    status: "da-bt",
  },
  {
    id: "TB-008",
    name: "Tủ nạp ắc quy",
    group: "TN",
    lastDate: "—",
    lastType: "—",
    status: "chua-bt",
  },
];

const historyStatusConfig: Record<
  string,
  { label: string; color: "success" | "default" }
> = {
  "da-bt": { label: "Đã BT", color: "success" },
  "chua-bt": { label: "Chưa BT", color: "default" },
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

  // ── Tab 1: Lịch sử bảo dưỡng (Mock) ────────────────────────
  const countByStatus = (s: string) =>
    maintenanceHistory.filter((h) => h.status === s).length;

  const filteredHistory = maintenanceHistory.filter((h) => {
    const matchSearch =
      !searchValue ||
      h.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      h.group.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = !statusFilter || h.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginatedHistory = filteredHistory.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize,
  );

  const historyStatusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      value: "",
      count: maintenanceHistory.length,
      color: "primary",
    },
    {
      label: "Đã BT",
      value: "da-bt",
      count: countByStatus("da-bt"),
      color: "success",
    },
    {
      label: "Chưa BT",
      value: "chua-bt",
      count: countByStatus("chua-bt"),
      color: "default",
    },
  ];

  const historyColumns = [
    { field: "id", headerName: "Mã TB", width: 110 },
    { field: "name", headerName: "Tên thiết bị", flex: 1, minWidth: 160 },
    {
      field: "group",
      headerName: "Nhóm",
      width: 110,
      renderCell: (p: any) => (
        <Chip label={p.value} size="small" variant="outlined" />
      ),
    },
    { field: "lastDate", headerName: "Lần BT gần nhất", width: 140 },
    {
      field: "lastType",
      headerName: "Loại BT",
      width: 90,
      renderCell: (p: any) =>
        p.value !== "—" ? (
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
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (p: any) => {
        const cfg =
          historyStatusConfig[p.value] ?? historyStatusConfig["chua-bt"];
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
                    rows={paginatedHistory}
                    columns={historyColumns}
                    total={filteredHistory.length}
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
