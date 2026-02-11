import { Box, Grid, IconButton, Tooltip, Button, Dialog } from "@mui/material";
import { useState, useMemo, useCallback, useEffect } from "react";
import PageAction from "../../components/common/PageAction";
import MaintenanceRepairForm from "./components/MaintenanceRepairForm";
import MaintenanceRepairResultForm from "./components/MaintenanceRepairResultForm";
import MaintenanceRepairDetailSidebar from "./components/MaintenanceRepairDetailSidebar";
import TableCustom from "../../components/common/TableCustom";
import { useSelector } from "react-redux";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import { useAllStaffsQuery, useStaffMutation } from "../Staff/Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { GridColDef } from "@mui/x-data-grid";
import { Trash2, FileText, FileCheck } from "lucide-react";
import { SignHeader } from "../../components/SignDocument/SignHeader";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { showStatus, showShareStatus } from "./config";

export default function MaintenanceRepair() {
  const { user } = useSelector((state: any) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedRepairForResult, setSelectedRepairForResult] =
    useState<any>(null);
  const [maintenanceRepairs, setMaintenanceRepairs] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();
  const { data: allStaffs = [] } = useAllStaffsQuery();
  const { handlePreviewS3 } = useStaffMutation();

  // Initialize with sample/test data
  useEffect(() => {
    if (
      maintenanceRepairs.length === 0 &&
      allDepartments.length > 0 &&
      allStaffs.length > 0
    ) {
      const firstDept = allDepartments[0];
      const secondDept =
        allDepartments.length > 1 ? allDepartments[1] : firstDept;
      const firstStaff = allStaffs[0];

      const sampleData = {
        id: "SCB-TEST-001",
        soQuyetDinh: "QD-001/2026",
        tenPhieu: "Phiếu sửa chữa bảo dưỡng mẫu",
        idLoaiSuaChua: "LSC-001",
        idPhanXuong: firstDept?.id || "",
        ngayYeuCauHoanThanh: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        idDonViTiepNhanTaiSan: secondDept?.id || "",
        idDonViGiao: firstDept?.id || "",
        idDonViNhan: secondDept?.id || "",
        tenDonViGiao: firstDept?.tenPhongBan || "Phòng Công nghệ thông tin",
        tenDonViNhan: secondDept?.tenPhongBan || "Phòng Vật tư cơ khí",
        idNguoiKyNhay: firstStaff?.id || "",
        trangThaiKyNhay: false,
        nguoiLapPhieuKyNhay: false,
        idDonViDeNghi: firstDept?.id || "",
        idTrinhDuyetCapPhong: firstStaff?.id || "",
        trinhDuyetCapPhongXacNhan: false,
        idTrinhDuyetGiamDoc: firstStaff?.id || "",
        tenTrinhDuyetGiamDoc: firstStaff?.hoTen || "Nguyễn Văn A",
        trinhDuyetGiamDocXacNhan: false,
        diaDiemGiaoNhan: "Kho lưu trữ",
        idPhongBanXemPhieu: firstDept?.id || "",
        noiNhan: "Kho công ty",
        trangThai: 0,
        idCongTy: "ct001",
        ngayTao: new Date().toLocaleString("vi-VN"),
        ngayCapNhat: new Date().toLocaleString("vi-VN"),
        nguoiTao: user?.taiKhoan?.tenDangNhap || "admin",
        nguoiCapNhat: "",
        coHieuLuc: 1,
        share: false,
        daBanGiao: false,
        byStep: false,
        coPhieuBanGiao: false,
        tenFile: "sample-repair-form.pdf",
        duongDanFile: "/files/sample-repair-form.pdf",
        nguoiKyList: [],
        chiTietSuaChuaBaoDuongDTOS: [
          {
            id: "CTSC-TEST-001",
            idSuaChuaBaoDuong: "SCB-TEST-001",
            tentaiSan: "Máy tính để bàn",
            idTaiSan: "TS-001",
            soLuong: 0,
            ghiChu: "",
            ngayTao: new Date().toLocaleString("vi-VN"),
            ngayCapNhat: new Date().toLocaleString("vi-VN"),
            nguoiTao: user?.taiKhoan?.tenDangNhap || "admin",
            nguoiCapNhat: "",
            isActive: true,
            hienTrang: "",
            moTa: "Bảo dưỡng định kỳ hàng quý",
          },
        ],
      };

      setMaintenanceRepairs([sampleData]);
    }
  }, [allDepartments, allStaffs, user]);

  const statusOptions: FilterOption[] = useMemo(
    () => [
      {
        label: "Tất cả",
        count: maintenanceRepairs.length,
        color: "default",
        value: "",
      },
      {
        label: "Nháp",
        count: maintenanceRepairs.filter((item) => item.trangThai === 0).length,
        color: "default",
        value: "0",
      },
      {
        label: "Duyệt",
        count: maintenanceRepairs.filter((item) => item.trangThai === 1).length,
        color: "info",
        value: "1",
      },
      {
        label: "Đang sửa chữa",
        count: maintenanceRepairs.filter((item) => item.trangThai === 2).length,
        color: "secondary",
        value: "2",
      },
      {
        label: "Hủy",
        count: maintenanceRepairs.filter((item) => item.trangThai === 3).length,
        color: "error",
        value: "3",
      },
      {
        label: "Hoàn thành",
        count: maintenanceRepairs.filter((item) => item.trangThai === 4).length,
        color: "success",
        value: "4",
      },
    ],
    [maintenanceRepairs],
  );

  const filteredRepairs = useMemo(() => {
    const result =
      status === ""
        ? maintenanceRepairs
        : maintenanceRepairs.filter(
            (item) => item.trangThai === parseInt(status),
          );
    console.log(
      "filteredRepairs recalculated:",
      result.length,
      "items, status:",
      status,
    );
    return result;
  }, [maintenanceRepairs, status]);

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleClose = useCallback(() => {
    setSelectedRepair(null);
    setShowForm(false);
    setShowResultForm(false);
    setReadOnly(false);
    setShowSidebar(false);
  }, []);

  const handleRowClick = useCallback(
    (params: any) => {
      const fullRepair = maintenanceRepairs.find((r) => r.id === params.row.id);
      setSelectedRepair(fullRepair || params.row);
      setShowForm(true);
      setShowResultForm(false);
      setReadOnly(true);
      setShowSidebar(true);
    },
    [maintenanceRepairs],
  );

  const handleSave = useCallback(
    async (values: any) => {
      const enrichedValues = {
        ...values,
        tenDonViGiao:
          allDepartments.find((d: any) => d.id === values.idDonViGiao)
            ?.tenPhongBan || "",
        tenDonViNhan:
          allDepartments.find((d: any) => d.id === values.idDonViNhan)
            ?.tenPhongBan || "",
        tenTrinhDuyetGiamDoc:
          allStaffs.find((s: any) => s.id === values.idTrinhDuyetGiamDoc)
            ?.hoTen || "",
      };

      setMaintenanceRepairs((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === values.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...enrichedValues,
          };
          console.log("Cập nhật:", enrichedValues);
          return updated;
        } else {
          const newRepair = {
            ...enrichedValues,
            id: `SCB-${Date.now()}`,
            ngayTao: new Date().toLocaleString("vi-VN"),
            trangThai: 0,
            nguoiTao: user?.taiKhoan?.tenDangNhap || "",
          };
          console.log("Tạo mới:", newRepair);
          return [newRepair, ...prev];
        }
      });
      handleClose();
    },
    [allDepartments, allStaffs, user, handleClose],
  );

  const handleCancel = useCallback(async () => {
    if (selectedRepair) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu sửa chữa bảo dưỡng "${selectedRepair?.id}"`,
      );
      if (confirm && confirm.isConfirmed) {
        setMaintenanceRepairs((prev) =>
          prev.map((item) =>
            item.id === selectedRepair.id ? { ...item, trangThai: 3 } : item,
          ),
        );
        console.log("Hủy:", selectedRepair?.id);
        handleClose();
      }
    }
  }, [selectedRepair, handleClose]);

  const handleDeleteSelected = useCallback(
    (ids: string[]) => {
      console.log("handleDeleteSelected called with IDs:", ids);
      setMaintenanceRepairs((prev) => {
        const filtered = prev.filter((item) => !ids.includes(item.id));
        console.log(
          "Deleted",
          ids.length,
          "items. Remaining:",
          filtered.length,
        );
        return filtered;
      });
      setSelectedIds([]);
      if (selectedRepair && ids.includes(selectedRepair.id)) {
        handleClose();
      }
    },
    [selectedRepair, handleClose],
  );

  const handleDelete = useCallback(
    async (rowId: string) => {
      console.log("handleDelete called with rowId:", rowId);
      const confirm = await showConfirmAlert(
        `Xóa phiếu sửa chữa bảo dưỡng "${rowId}"`,
      );
      console.log(
        "Delete confirm result:",
        confirm,
        "IsConfirmed:",
        confirm?.isConfirmed,
      );

      if (confirm?.isConfirmed) {
        console.log("Confirmed delete for:", rowId);

        setMaintenanceRepairs((prev) => {
          console.log("Before delete - total items:", prev.length);
          const filtered = prev.filter((item) => item.id !== rowId);
          console.log("After delete - total items:", filtered.length);
          console.log(
            "Remaining IDs:",
            filtered.map((i) => i.id),
          );
          return filtered;
        });

        setSelectedRepair((current: any) => {
          if (current?.id === rowId) {
            console.log("Closing form because deleted item was selected");
            handleClose();
          }
          return current;
        });
      } else {
        console.log("Delete cancelled");
      }
    },
    [handleClose],
  );

  const handleViewPdf = useCallback(
    async (fileName: string, filePath: string) => {
      try {
        const blob = await handlePreviewS3(filePath);
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          setSelectedDocument(url);
          setShowSignDocument(true);
        }
      } catch (error) {
        console.error("Error loading file:", error);
      }
    },
    [handlePreviewS3],
  );

  const columns: GridColDef<any>[] = useMemo(
    () => [
      {
        field: "tenPhieu",
        headerName: "Tên Phiếu",
        width: 180,
        headerAlign: "center",
        align: "left",
      },

      {
        field: "idLoaiSuaChua",
        headerName: "Loại sửa chữa",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "ngayTao",
        headerName: "Ngày lập phiếu",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell(params) {
          if (!params.row?.ngayTao) return "";
          return new Date(params.row?.ngayTao).toLocaleString("vi-VN");
        },
      },

      {
        field: "ngayYeuCauHoanThanh",
        headerName: "Thời gian yêu cầu hoàn thành",
        width: 180,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenTrinhDuyetGiamDoc",
        headerName: "Trình duyệt biên bản",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenFile",
        headerName: "Tài liệu duyệt",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "id",
        headerName: "Ký số",
        width: 140,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "idPhanXuong",
        headerName: "Phân xưởng quản lý",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const dept = allDepartments.find(
            (d: any) => d.id === params.row?.idPhanXuong,
          );
          return dept?.tenPhongBan || params.row?.idPhanXuong || "";
        },
      },

      {
        field: "idDonViTiepNhanTaiSan",
        headerName: "Đơn vị tiếp nhận",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const dept = allDepartments.find(
            (d: any) => d.id === params.row?.idDonViTiepNhanTaiSan,
          );
          return dept?.tenPhongBan || params.row?.idDonViTiepNhanTaiSan || "";
        },
      },

      {
        field: "trangThai",
        headerName: "Trạng thái phiếu",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => showStatus(params.row?.trangThai ?? 0),
      },

      {
        field: "share",
        headerName: "Trình duyệt",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const isMyCreated =
            params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap;
          return showShareStatus(params.row?.share ?? false, isMyCreated);
        },
      },

      {
        field: "HanhDong",
        headerName: "Hành động",
        width: 140,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const hasFile = !!params.row?.tenFile;
          return (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
              <Tooltip title={hasFile ? "Xem tài liệu" : "Chưa có tài liệu"}>
                <span>
                  <IconButton
                    color="info"
                    disabled={!hasFile}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPdf(
                        params.row.tenFile,
                        params.row.duongDanFile,
                      );
                    }}
                    sx={{
                      padding: "4px",
                      "&:hover:not(:disabled)": {
                        bgcolor: "rgba(2, 136, 209, 0.08)",
                      },
                    }}
                  >
                    <FileText size={20} strokeWidth={2} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Lập phiếu kết quả sửa chữa">
                <span>
                  <IconButton
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowForm(false);
                      setSelectedRepairForResult(params.row);
                      setShowResultForm(true);
                    }}
                    sx={{
                      padding: "4px",
                      "&:hover": { bgcolor: "rgba(76, 175, 80, 0.08)" },
                    }}
                  >
                    <FileCheck size={20} strokeWidth={2} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(params.row.id);
                  }}
                  sx={{
                    padding: "4px",
                    "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
                  }}
                >
                  <Trash2 size={20} strokeWidth={2} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [user, handleRowClick, handleDelete, handleViewPdf],
  );

  return (
    <>
      {!showSignDocument ? (
        <>
          <PageAction
            title="Sửa chữa bảo dưỡng"
            onNewClick={() => {
              handleClose();
              setShowForm(true);
            }}
          />
          <Box sx={{ p: 2 }}>
            {showForm && !showResultForm && (
              <Box sx={{ mb: 2 }}>
                <MaintenanceRepairForm
                  key={showForm ? "new-form" : `edit-${selectedRepair?.id}`}
                  onClose={handleClose}
                  readOnly={readOnly}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  selectedRepair={selectedRepair}
                  departments={allDepartments}
                  staffs={(allStaffs || []).filter(
                    (staff: any) => staff.hasAccount,
                  )}
                  allUnits={allUnits}
                  allCurrentStatus={allCurrentStatus}
                />
              </Box>
            )}

            {showResultForm && selectedRepairForResult && !showForm && (
              <Box sx={{ mb: 2 }}>
                <MaintenanceRepairResultForm
                  key={`result-form-${selectedRepairForResult?.id}`}
                  onClose={() => setShowResultForm(false)}
                  selectedRepair={selectedRepairForResult}
                  readOnly={false}
                  onSave={(data) => {
                    console.log("Result form saved:", data);
                    // TODO: Implement API call to save result
                    setShowResultForm(false);
                  }}
                  onCancel={() => setShowResultForm(false)}
                  departments={allDepartments}
                  staffs={(allStaffs || []).filter(
                    (staff: any) => staff.hasAccount,
                  )}
                />
              </Box>
            )}

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
                size={{ xs: showSidebar ? 9 : 12 }}
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
                  title="Danh sách sửa chữa bảo dưỡng"
                  columns={columns}
                  rows={filteredRepairs}
                  total={filteredRepairs.length}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  showStatusFilter={true}
                  statusOptions={statusOptions}
                  onStatusChange={(value) => {
                    setStatus(value);
                  }}
                  statusValue={status}
                  selectedIds={selectedIds}
                  onSelectionChange={(ids) => {
                    setSelectedIds(ids);
                  }}
                  onDelete={handleDeleteSelected}
                  showDelete={true}
                />
              </Grid>

              {showSidebar && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fafafa",
                  }}
                >
                  <MaintenanceRepairDetailSidebar
                    selectedRepair={selectedRepair}
                    onClose={() => setShowSidebar(false)}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      ) : (
  <Dialog
  fullScreen
  open={showSignDocument}
  onClose={() => {
    setShowSignDocument(false);
    setSelectedDocument(null);
  }}
>
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#ced4da' }}>
    <SignHeader
      pagesCount={1}
      handleExportPDF={() => {}}
      onCancel={() => {
        setShowSignDocument(false);
        setSelectedDocument(null);
      }}
    />

    <Box 
      sx={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        p: 4,
      }}
    > 
      <Box sx={{ 
        width: '100%', 
        maxWidth: '850px', 
        bgcolor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        lineHeight: 0, 
      }}>
        <iframe
          src={`${selectedDocument}#toolbar=0&navpanes=0&scrollbar=0&view=FitW`}
          style={{
            width: "100%",
            height: "1200px", 
            border: "none",
          }}
          title="PDF Viewer"
        />
      </Box>
    </Box>
  </Box>
</Dialog>
)}
    </>
  );
}
