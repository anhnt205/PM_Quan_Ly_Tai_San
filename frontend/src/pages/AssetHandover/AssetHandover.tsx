import { useEffect, useState } from "react";
import { Box, Chip, Grid, IconButton } from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useSearchParams } from "react-router-dom";

import TableCustom from "../../components/common/TableCustom";
import PageAction from "../../components/common/PageAction";
import AssetHandoverForm from "./components/AssetHandoverForm/AssetHandoverForm";
import SignDocumentForm from "../AssetTransfer/components/SignDocumentForm";
import SignerSidebar from "../AssetTransfer/components/SignerSidebar";

import { AssetHandoverData } from "./types";
import { useAssetHandoverMutation } from "./Mutation";
import { Download, Eye, Trash2 } from "lucide-react";

export default function AssetHandover() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AssetHandoverData | null>(
    null
  );
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [selectedAssetHandover, setSelectedAssetHandover] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);

  const { handoverPage, createMutation, updateMutation, deleteOneMutation } =
    useAssetHandoverMutation(
      paginationModel.page,
      paginationModel.pageSize,
      searchValue
    );

  useEffect(() => {
    setSelectedIds([]);
    setSelectedDocuments(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowForm(false);
  }, [type]);

  const getTypeInfo = (typeValue: any) => {
    switch (Number(typeValue)) {
      case 1:
        return { title: "Cấp phát tài sản", label: "cấp phát tài sản" };
      case 2:
        return { title: "Điều chuyển tài sản", label: "điều chuyển tài sản" };
      case 3:
        return { title: "Thu hồi tài sản", label: "thu hồi tài sản" };
      default:
        return { title: "Bàn giao tài sản", label: "bàn giao tài sản" };
    }
  };

  const { title, label } = getTypeInfo(type);

  const handleRowClick = (params: GridRowParams) => {
    window.scrollTo({ top: 140, behavior: "smooth" });

    const data = params.row as AssetHandoverData;
    setSelectedRow(data);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleNewClick = () => {
    setSelectedRow(null);
    setReadOnly(false);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (!selectedRow) {
      setShowForm(false);
      setSelectedRow(null);
    } else {
      setReadOnly(true);
    }
  };

  // --- XỬ LÝ LƯU (CREATE/UPDATE) ---
  const handleSave = (values: any) => {
    if (values.Id) {
      updateMutation.mutate(values, {
        onSuccess: () => handleCloseForm(),
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => handleCloseForm(),
      });
    }
  };

  // --- XỬ LÝ XÓA ---
  const handleDelete = (ids: string[]) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} bản ghi đã chọn?`)
    ) {
      // Vì deleteOneMutation nhận 1 ID, nếu xóa nhiều bạn có thể dùng deleteManyMutation (nếu có)
      // Ở đây ví dụ xóa từng cái một hoặc dùng batch API
      ids.forEach((id) => deleteOneMutation.mutate(id));
    }
  };

  const handleSignAssets = (id: string) => {
    const document = handoverPage?.items?.find((row: any) => row.Id === id);
    setSelectedDocuments(document);
    setShowSignDocument(true);
  };

  const columns: GridColDef<AssetHandoverData>[] = [
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
      valueGetter: (params, row: any) => row.tenFile,
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={
              params.value.length > 15
                ? params.value.substring(0, 12) + "..."
                : params.value
            }
            size="small"
            variant="outlined"
            sx={{
              color: "#2e7d32",
              borderColor: "#2e7d32",
              bgcolor: "#f1f8e9",
              borderRadius: "4px",
              width: "180px",
              "& .MuiChip-icon": {
                color: "#2e7d32",
                marginRight: "2px",
              },
            }}
            icon={<Download size={16} strokeWidth={2} />}
            clickable
            title={params.value}
          />
        ) : null,
    },
    {
      field: "giamDocKy",
      headerName: "Trạng thái ký",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.giamDocKy,
      renderCell: (params) => (
        <Chip
          label="Không được phép ký"
          sx={{
            bgcolor: "#ff7043",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "4px",
            width: "180px",
          }}
          size="small"
        />
      ),
    },
    {
      field: "trangThaiPhieu",
      headerName: "Trạng thái phiếu",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.trangThaiPhieu,
      renderCell: (params) => {
        const statusConfig: Record<number, { label: string; color: string }> = {
          0: { label: "Chưa hoàn thành", color: "#FFC121" },
          1: { label: "Đã hủy", color: "#d32f2f" },
          2: { label: "Đã hoàn thành", color: "#4caf50" },
        };

        const status = statusConfig[params.value as number] || statusConfig[0];

        return (
          <Chip
            label={status.label}
            sx={{
              bgcolor: status.color,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "4px",
              width: "180px",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.trangThai,
      renderCell: (params) => {
        const statusMap: Record<number, { label: string; color: string }> = {
          0: { label: "Nháp", color: "#bdbdbd" },
          1: { label: "Duyệt", color: "#FFC121" },
          2: { label: "Hủy", color: "#ff2121ff" },
          3: { label: "Hoàn thành", color: "#ff7043" },
        };
        const status = statusMap[params.value as number] || {
          label: "Nháp",
          color: "#bdbdbd",
        };
        return (
          <Chip
            label={status.label}
            sx={{
              bgcolor: status.color,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "4px",
              width: "180px",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "trinhDuyet",
      headerName: "Trình duyệt",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.share,
      renderCell: (params) => (
        <Chip
          label={params.value === false ? "Chưa gửi" : "Được gửi"}
          sx={{
            bgcolor: params.value === false ? "#f44336" : "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "4px",
            width: "100px",
          }}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete([params.row.id]);
            }}
          >
            <Trash2
              fontSize="small"
              size={20}
              strokeWidth={2}
              color="#f44336"
            />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleRowClick(params as any)}
          >
            <Eye fontSize="small" size={20} strokeWidth={2} color="#4caf50" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      {showSignDocument ? (
        <SignDocumentForm
          selectedIds={selectedIds}
          documents={selectedDocuments}
          onCancel={() => {
            setShowSignDocument(false);
            setSelectedDocuments(null);
          }}
          onSign={() => {
            setShowSignDocument(false);
            setSelectedIds([]);
          }}
          fullscreen={true}
        />
      ) : (
        <>
          <PageAction
            title={title}
            onNewClick={() => {
              setSelectedRow(null);
              setReadOnly(false);
              setShowForm(true);
            }}
          />
          <Box sx={{ p: 2 }}>
            {showForm && (
              <Box sx={{ mb: 2 }}>
                <AssetHandoverForm
                  key={selectedRow?.id || "new-form"}
                  onCancel={handleCloseForm}
                  onSave={handleSave}
                  onEdit={() => setReadOnly(false)}
                  readOnly={readOnly}
                  selectedTransfer={selectedRow}
                  label={label}
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
                size={{ xs: selectedRow ? 9 : 12 }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight: selectedRow ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <TableCustom
                  title={`Danh sách ${label}`}
                  columns={columns}
                  rows={handoverPage?.items || []} // Lấy từ API
                  total={handoverPage?.totalItems || 0} // Lấy từ API
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onDelete={handleDelete}
                  onSign={handleSignAssets}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showStatusFilter={true}
                />
              </Grid>

              {selectedRow && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fafafa",
                  }}
                >
                  <SignerSidebar
                    selectedRow={selectedRow}
                    onClose={() => setSelectedRow(null)}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
