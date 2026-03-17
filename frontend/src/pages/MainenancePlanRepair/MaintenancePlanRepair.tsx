import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import PageAction from "../../components/common/PageAction";
import MaintenancePlanCalendar from "./components/MaintenancePlanCalendar";
import MaintenancePlanningForm from "./components/MaintenancePlanningForm";
import TableCustom from "../../components/common/TableCustom";
import { useSelector } from "react-redux";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { Trash2, Calendar, FilePlus, ListPlus } from "lucide-react";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { MaintenancePlanData } from "./types";
import {
  useMaintenancePlanningPageQuery,
  useMaintenancePlanningMutation,
  useChiTietTaiSanByKeHoachQuery,
  useVatTuTieuHaoByKeHoachQuery,
  useWorkItemsByPlanQuery,
} from "./Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { showPeriod, showStatus } from "./config";
import { StatusPlan } from "../../utils/const";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import { RootState } from "../../redux/store";

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
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const { data: taiSanList = [] } = useChiTietTaiSanByKeHoachQuery(
    selectedPlan?.id,
  );
  const { data: ccdcList = [] } = useVatTuTieuHaoByKeHoachQuery(
    selectedPlan?.id,
  );
  const { data: workItems = [], isLoading: isLoadingWorks } =
    useWorkItemsByPlanQuery(selectedPlan?.id);

  const fullSelectedPlan = useMemo(() => {
    if (!selectedPlan) return null;
    return {
      ...selectedPlan,
      // Cung cấp đúng tên mảng mà Form đang mong đợi
      danhSachTaiSan: taiSanList || [],
      danhSachVatTu: ccdcList || [],
      congViecs: workItems || [],
    };
  }, [selectedPlan, taiSanList, ccdcList, workItems]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const { data: allStaffs = [] } = useAllStaffsQuery();
  const searchDebounce = useDebounce(searchValue, 600);
  const { data: planPageData = { items: [], totalItems: 0 } } =
    useMaintenancePlanningPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      status,
      user?.taiKhoan?.phongBanId,
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
    // Nếu có ID thì gọi Update, không có thì gọi Create
    if (selectedPlan?.id) {
      updatePlanMutation.mutate(planData, {
        onSuccess: () => {
          handleClose(); // Chỉ cần đóng form, việc lưu bảng con Mutation đã lo xong
        },
      });
    } else {
      createPlanMutation.mutate(planData, {
        onSuccess: () => {
          handleClose(); // Chỉ cần đóng form
        },
      });
    }
  };

  const planningColumns = [
    {
      field: "tenKeHoach",
      headerName: "Tên kế hoạch",
      flex: 2,
      minWidth: 160,
      editable: false,
    },
    {
      field: "tenLoaiKeHoach",
      headerName: "Loại kế hoạch",
      flex: 1.5,
      minWidth: 130,
      editable: false,
    },
    {
      field: "tenLoaiSuaChua",
      headerName: "Loại sửa chữa",
      flex: 1.5,
      minWidth: 130,
      editable: false,
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
      field: "tenDonViGiao",
      headerName: "Đơn vị giao",
      flex: 1.5,
      minWidth: 130,
      editable: false,
    },
    {
      field: "tenDonViThucHien",
      headerName: "Đơn vị thực hiện",
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
      width: 120,
      editable: false,
      renderCell: (params: any) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 1,
            justifyContent: "center",
          }}
        >
          {[StatusPlan.PENDING].includes(params.row?.trangThai) && (
            <Tooltip title="Tạo phiếu sửa chữa">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.MAINTENANCEREPAIR, {
                    state: { createFromPlan: params.row },
                  });
                }}
              >
                <ListPlus size={16} />
              </IconButton>
            </Tooltip>
          )}

          {/* NÚT XÓA  */}
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
                fullSelectedPlan
                  ? `view-planning-${fullSelectedPlan.id}`
                  : "new-planning-form"
              }
              onClose={handlePlanningClose}
              readOnly={readOnly}
              onEdit={handlePlanningEdit}
              onSave={handlePlanningSave}
              selectedPlan={fullSelectedPlan}
              staffs={allStaffs}
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

          {showSidebar && fullSelectedPlan && (
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
                    {fullSelectedPlan?.tenKeHoach || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Loại kế hoạch
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.tenLoaiKeHoach || "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Loại sửa chữa
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.tenLoaiSuaChua || "-"}
                  </Typography>
                </Box>
                {fullSelectedPlan?.ngayBatDau &&
                  (() => {
                    const d = new Date(fullSelectedPlan.ngayBatDau);
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
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Đơn vị giao
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.tenDonViGiao || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Đơn vị thực hiện
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.tenDonViThucHien || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Người phụ trách
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.tenNguoiPhuTrach || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ngày bắt đầu
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.ngayBatDau || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ngày kết thúc
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.ngayKetThuc || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Typography variant="body2">
                    {fullSelectedPlan?.trangThai === StatusPlan.PENDING
                      ? "❓ Chưa thực hiện"
                      : fullSelectedPlan?.trangThai === StatusPlan.PROGRESS
                        ? "⏳ Đang thực hiện"
                        : "✅ Đã hoàn thành"}
                  </Typography>
                </Box>
                {fullSelectedPlan?.ghiChu && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ghi chú
                    </Typography>
                    <Typography variant="body2">
                      {fullSelectedPlan.ghiChu}
                    </Typography>
                  </Box>
                )}

                {/* Danh sách tài sản */}
                {fullSelectedPlan?.danhSachTaiSan &&
                  fullSelectedPlan.danhSachTaiSan.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tài sản ({fullSelectedPlan.danhSachTaiSan.length})
                      </Typography>
                      {fullSelectedPlan.danhSachTaiSan.map(
                        (ts: any, i: number) => (
                          <Typography key={i} variant="body2">
                            • {ts.tenTaiSan || "Tài sản chưa rõ tên"}
                          </Typography>
                        ),
                      )}
                    </Box>
                  )}

                {/* Danh sách vật tư */}
                {fullSelectedPlan?.danhSachVatTu &&
                  fullSelectedPlan.danhSachVatTu.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Vật tư - CCDC ({fullSelectedPlan.danhSachVatTu.length})
                      </Typography>
                      {fullSelectedPlan.danhSachVatTu.map(
                        (vt: any, i: number) => (
                          <Typography key={i} variant="body2">
                            • {vt.tenVatTu || "Vật tư chưa rõ tên"} (Số lượng:{" "}
                            {vt.soLuong})
                          </Typography>
                        ),
                      )}
                    </Box>
                  )}

                {/* Danh sách công việc */}
                {fullSelectedPlan?.congViecs &&
                  fullSelectedPlan.congViecs.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Công việc ({fullSelectedPlan.congViecs.length})
                      </Typography>
                      {fullSelectedPlan.congViecs.map((cv: any, i: number) => (
                        <Typography key={i} variant="body2">
                          • {cv.tenCongViec || "Công việc chưa rõ tên"} (
                          {cv.nguoiThucHien})
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
