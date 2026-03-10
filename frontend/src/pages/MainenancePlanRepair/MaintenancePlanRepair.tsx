import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useMemo } from "react";
import PageAction from "../../components/common/PageAction";
import MaintenancePlanCalendar from "./components/MaintenancePlanCalendar";
import MaintenancePlanningForm from "./components/MaintenancePlanningForm";
import TableCustom from "../../components/common/TableCustom";
import { useSelector } from "react-redux";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { Trash2, Calendar } from "lucide-react";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { MaintenancePlanData } from "./types";
import {
  useMaintenancePlanningPageQuery,
  useMaintenancePlanningMutation,
} from "./Mutation";
import { useAllAssetsQuery } from "../AssetManager/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { showPeriod, showPlanType, showStatus } from "./config";
import { Devicetype, StatusPlan } from "../../utils/const";
import { useToolDetailAllQuery } from "../ToolTransfer/Mutation";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";

export default function MaintenancePlanRepair() {
  const [showForm, setShowForm] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [status, setStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MaintenancePlanData | null>(
    null,
  );
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { data: allStaffs = [] } = useAllStaffsQuery();
  const { data: rawAssets = [] } = useAllAssetsQuery();
  const { data: rawTools = [] } = useToolDetailAllQuery();
  const allEquipment = useMemo(
    () => [
      ...rawAssets.map((a: any) => ({
        ...a,
        ten: a.tenTaiSan || a.ten || "",
        type: Devicetype.ASSET,
      })),
      ...rawTools.map((t: any) => ({
        ...t,
        ten: t.ten || "",
        type: Devicetype.TOOL,
      })),
    ],
    [rawAssets, rawTools],
  );
  const searchDebounce = useDebounce(searchValue, 600);
  const { data: planPageData = { items: [], totalItems: 0 } } =
    useMaintenancePlanningPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      status,
    );

  const {
    createMutation: createPlanMutation,
    updateMutation: updatePlanMutation,
    deleteMutation: deletePlanMutation,
  } = useMaintenancePlanningMutation();

  const handlePlanningClose = () => {
    setShowForm(false);
    setReadOnly(false);
  };

  const handlePlanningEdit = () => {
    setReadOnly(false);
  };

  const handlePlanningSave = (planData: MaintenancePlanData) => {
    if (selectedPlan?.id) {
      updatePlanMutation.mutate(planData, {
        onSuccess: () => {
          handleClose();
        },
      });
    } else {
      createPlanMutation.mutate(planData, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  // Define planning table columns
  const planningColumns = [
    {
      field: "tenKeHoach",
      headerName: "Tên kế hoạch",
      flex: 2,
      minWidth: 160,
      editable: false,
    },
    {
      field: "loaiKeHoach",
      headerName: "Loại kế hoạch",
      flex: 1.5,
      minWidth: 130,
      editable: false,
      renderCell: (params: any) => showPlanType(params.value),
    },
    {
      field: "thuocKy",
      headerName: "Thuộc kỳ",
      flex: 1,
      minWidth: 100,
      editable: false,
      renderCell: (params: any) => showPeriod(params.row.ngayBatDau),
    },
    {
      field: "tenDonViThucHien",
      headerName: "Đơn vị",
      flex: 1.5,
      minWidth: 130,
      editable: false,
    },
    {
      field: "tenNguoiPhuTrach",
      headerName: "Người phụ trách",
      flex: 1.5,
      minWidth: 120,
      editable: false,
    },
    {
      field: "ngayBatDau",
      headerName: "Ngày bắt đầu",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "ngayKetThuc",
      headerName: "Ngày kết thúc",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      flex: 1.2,
      minWidth: 120,
      editable: false,
      renderCell: (params: any) => showStatus(params.value),
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 100,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Xóa kế hoạch">
            <IconButton
              size="small"
              color="error"
              onClick={async (e) => {
                e.stopPropagation();
                const confirm = await showConfirmAlert(
                  `Xóa kế hoạch "${params.row.tenKeHoach}"?`,
                );
                if (confirm?.isConfirmed) {
                  deletePlanMutation.mutate(params.row);
                }
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Planning status filter options
  const planningStatusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      value: "",
      count:
        planPageData?.groupCounts?.[StatusPlan.PENDING] +
          planPageData?.groupCounts?.[StatusPlan.PROGRESS] +
          planPageData?.groupCounts?.[StatusPlan.COMPLETED] || 0,
      color: "primary",
    },
    {
      label: "Chưa thực hiện",
      value: StatusPlan.PENDING,
      count: planPageData?.groupCounts?.[StatusPlan.PENDING] ?? 0,
      color: "warning",
    },
    {
      label: "Đang thực hiện",
      value: StatusPlan.PROGRESS,
      count: planPageData?.groupCounts?.[StatusPlan.PROGRESS] ?? 0,
      color: "info",
    },
    {
      label: "Đã hoàn thành",
      value: StatusPlan.COMPLETED,
      count: planPageData?.groupCounts?.[StatusPlan.COMPLETED] ?? 0,
      color: "success",
    },
  ];

  const handleClose = () => {
    setSelectedIds([]);
    setSearchValue("");
    setSelectedPlan(null);
    setShowForm(false);
    setShowSidebar(false);
    setReadOnly(false);
  };

  return (
    <>
      <PageAction
        title={"Lập kế hoạch sửa chữa bảo dưỡng"}
        onNewClick={() => {
          handleClose();
          setShowForm(true);
        }}
      />
      <Box sx={{ p: 2 }}>
        {showForm && (
          <Box sx={{ mb: 2 }}>
            <MaintenancePlanningForm
              key={
                selectedPlan
                  ? `view-planning-${selectedPlan.id}`
                  : "new-planning-form"
              }
              onClose={handlePlanningClose}
              readOnly={readOnly}
              onEdit={handlePlanningEdit}
              onSave={handlePlanningSave}
              selectedPlan={selectedPlan}
              staffs={allStaffs}
              assets={allEquipment}
            />
          </Box>
        )}

        <Grid container spacing={2} sx={{ height: "100vh" }}>
          <Grid size={{ xs: showSidebar ? 9 : 12 }}>
            <TableCustom
              title="Danh sách kế hoạch"
              rows={planPageData.items}
              columns={planningColumns}
              total={planPageData.totalItems}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              checkboxSelection
              onRowClick={(params) => {
                setSelectedPlan(params.row);
                setReadOnly(true);
                setShowForm(true);
                setShowSidebar(true);
              }}
              statusOptions={planningStatusOptions}
              statusValue={status}
              onStatusChange={(value: string) => {
                setStatus(value);
              }}
              selectedIds={selectedIds}
              onSelectionChange={(ids) => {
                setSelectedIds(ids);
              }}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              onDelete={() => {}}
              showDelete={false}
              extraActions={
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Calendar size={16} />}
                  sx={{
                    bgcolor: showCalendar ? "success.dark" : "success.main",
                    "&:hover": { bgcolor: "success.dark" },
                  }}
                  onClick={() => setShowCalendar((v) => !v)}
                >
                  {showCalendar ? "Bảng" : "Lịch"}
                </Button>
              }
              customContent={
                showCalendar ? (
                  <MaintenancePlanCalendar
                    onClose={() => setShowCalendar(false)}
                    plans={planPageData.items}
                    onPlanClick={(plan) => {
                      setSelectedPlan(plan);
                      setReadOnly(true);
                      setShowForm(true);
                      setShowSidebar(true);
                      setShowCalendar(false);
                    }}
                    onCreateRepair={(plan) => {
                      navigate(ROUTES.MAINTENANCEREPAIR, {
                        state: { createFromPlan: plan },
                      });
                    }}
                  />
                ) : undefined
              }
            />
          </Grid>

          {showSidebar && selectedPlan && (
            <Grid
              size={{ xs: 3 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fafafa",
                borderLeft: "1px solid",
                borderColor: "divider",
                p: 2,
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Chi tiết kế hoạch
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setShowSidebar(false);
                    // Xóa plan chỉ khi form cũng không mở
                    if (!showForm) setSelectedPlan(null);
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tên kế hoạch
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {selectedPlan?.tenKeHoach || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Loại kế hoạch
                  </Typography>
                  <Typography variant="body2">
                    {showPlanType(selectedPlan?.loaiKeHoach) || "-"}
                  </Typography>
                </Box>
                {selectedPlan?.ngayBatDau &&
                  (() => {
                    const d = new Date(selectedPlan.ngayBatDau);
                    const thang = d.getMonth() + 1;
                    const quy = Math.ceil(thang / 3);
                    const nam = d.getFullYear();
                    return (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Thuộc kỳ
                        </Typography>
                        <Typography variant="body2">
                          Tháng {thang} · Quý {quy} · Năm {nam}
                        </Typography>
                      </Box>
                    );
                  })()}
                {selectedPlan?.loaiKeHoach === "CHU_KY" && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Chu kỳ (ngày)
                    </Typography>
                    <Typography variant="body2">
                      {selectedPlan?.chuKyNgay} ngày
                    </Typography>
                  </Box>
                )}
                {selectedPlan?.loaiKeHoach === "GIO_MAY" && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mốc giờ máy
                    </Typography>
                    <Typography variant="body2">
                      {selectedPlan?.mocGioMay} giờ
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Đơn vị thực hiện
                  </Typography>
                  <Typography variant="body2">
                    {selectedPlan?.tenDonViThucHien || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Người phụ trách
                  </Typography>
                  <Typography variant="body2">
                    {selectedPlan?.tenNguoiPhuTrach || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ngày bắt đầu
                  </Typography>
                  <Typography variant="body2">
                    {selectedPlan?.ngayBatDau || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ngày kết thúc
                  </Typography>
                  <Typography variant="body2">
                    {selectedPlan?.ngayKetThuc || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Typography variant="body2">
                    {selectedPlan?.trangThai === StatusPlan.PENDING
                      ? "❓ Chưa thực hiện"
                      : selectedPlan?.trangThai === StatusPlan.PROGRESS
                        ? "⏳ Đang thực hiện"
                        : "✅ Đã hoàn thành"}
                  </Typography>
                </Box>
                {selectedPlan?.ghiChu && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ghi chú
                    </Typography>
                    <Typography variant="body2">
                      {selectedPlan.ghiChu}
                    </Typography>
                  </Box>
                )}
                {selectedPlan?.chiTiets && selectedPlan.chiTiets.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Thiết bị ({selectedPlan.chiTiets.length})
                    </Typography>
                    {selectedPlan.chiTiets.map((tb, i) => (
                      <Typography key={i} variant="body2">
                        •{" "}
                        {selectedPlan.loaiDoiTuong === Devicetype.ASSET
                          ? tb.tenTaiSan || tb.idTaiSan
                          : `${tb.tenCCDC + "" + `(${tb.soKyHieu})` + "-" + tb.namSanXuat}`}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
