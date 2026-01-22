import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import api from "../../../config/api.config";

const ID_CONG_TY = "ct001";

export const useToolTransferMutation = (
  page?: number,
  pageSize?: number,
  search?: string,
  type?: number | undefined,
  userName?: string,
  trangThai?: number,
  selectedId?: string,
) => {
  const queryClient = useQueryClient();
  const [departmentId, setDepartmentId] = useState<string>("");

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  const staffQuery = useQuery({
    queryKey: ["allStaff", ID_CONG_TY],
    queryFn: async () => {
      const res = await api.get("/nhanvien", {
        params: { idcongty: ID_CONG_TY },
      });
      return res.data;
    },
  });

  const departmentQuery = useQuery({
    queryKey: ["allDepartments", ID_CONG_TY],
    queryFn: async () => {
      const res = await api.get("/phongban", {
        params: { idcongty: ID_CONG_TY },
      });
      return res.data;
    },
  });

  const allUnitsQuery = useQuery({
    queryKey: ["allUnits"],
    queryFn: async () => {
      const res = await api.get("/donvitinh");
      return res.data;
    },
  });

  const allToolsByDonViQuery = useQuery({
    queryKey: ["toolsNotHandedOver", "ct001"],
    queryFn: async () => {
      const res = await api.get("/dieudongccdcvattu/chua-ban-giao-het", {
        params: { idCongTy: "ct001" },
      });
      return res.data.data || [];
    },
  });

  const toolTransferPageQuery = useQuery({
    queryKey: ["toolTransfers", type, page, pageSize, search, userName],
    queryFn: async () => {
      const res = await api.get("/dieudongccdcvattu/paged", {
        params: {
          idcongty: ID_CONG_TY,
          page: page,
          size: pageSize,
          loai: type,
          search: search,
          userid: userName || "",
          trangThai: undefined,
        },
      });
      return res.data;
    },
    enabled: !!type,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      request: any;
      details: any[];
      signatories: any[];
    }) => {
      const resMain = await api.post("/dieudongccdcvattu", payload.request);

      await api.post("/chitietdieudongccdcvattu/batch", payload.details);

      if (payload.signatories && payload.signatories.length > 0) {
        for (const signer of payload.signatories) {
          await api.post("/nguoiky", {
            ...signer,
            idTaiLieu: payload.request.id,
          });
        }
      }
      return resMain.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolTransfers"] });
      showSuccessAlert("Thêm mới phiếu điều động thành công!");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Không thể tạo phiếu.";
      showErrorAlert(errorMsg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      api.put(`/dieudongccdcvattu/${payload.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolTransfers"] });
      showSuccessAlert("Cập nhật dữ liệu thành công!");
    },
    onError: (error: any) => showErrorAlert(error.response?.data?.message),
  });

  const signMutation = useMutation({
    mutationFn: (data: { id: string; userId: string }) =>
      api.post("/dieudongccdcvattu/capnhattrangthai", null, {
        params: { id: data.id, userId: data.userId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolTransfers"] });
      showSuccessAlert("Đã cập nhật trạng thái ký thành công!");
    },
    onError: () => showErrorAlert("Lỗi khi thực hiện ký phiếu."),
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post("/dieudongccdcvattu/huy", null, { params: { id } });
      await api.delete(`/chuky/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolTransfers"] });
      showSuccessAlert("Phiếu đã được hủy bỏ.");
    },
    onError: () => showErrorAlert("Không thể hủy phiếu vào lúc này."),
  });

  const deleteOneMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/dieudongccdcvattu/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolTransfers"] });
      showSuccessAlert("Đã xóa bản ghi khỏi hệ thống.");
    },
    onError: () => showErrorAlert("Lỗi khi xóa dữ liệu."),
  });

  const handleDownloadFile = async (fileName: string) => {
    if (!fileName) return;
    try {
      const encodedFileName = encodeURIComponent(fileName);
      const response = await api.get(`/upload/download/${encodedFileName}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showErrorAlert("Không thể tải tập tin");
    }
  };

  const handlePreview = async (fileName: string) => {
    try {
      const response = await api.get(`/download/${fileName}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải file preview:", error);
      throw error;
    }
  };

  const handleToolByDonVi = async (loai: number, idDonViGiao: string) => {
    try {
      const res = await api.get(
        loai === 1
          ? "/ccdcvattu/by-donvi-bandau/paged"
          : "/ccdcvattu/by-donvi-hienthoi/paged",
        {
          params: {
            idcongty: "ct001",
            page: 0,
            size: 999,
            ...(loai === 1
              ? { iddonvibandau: idDonViGiao }
              : { iddonvihienthoi: idDonViGiao }),
          },
        },
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy công cụ theo đơn vị:", error);
      throw error;
    }
  };

  // list chu ky theo tai lieu
  const handleSignatureList = async (idTaiLieu: string) => {
    if (!idTaiLieu) return [];
    try {
      const res = await api.get(`/chuky/${idTaiLieu}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người ký:", error);
      return [];
    }
  };

  const handoverDetailsQuery = useQuery({
    queryKey: ["handoverDetails", selectedId],
    queryFn: async () => {
      if (!selectedId) return [];
      const res = await api.get(
        `/chitietbangiaoccdcvattu/by-dieu-dong/${selectedId}`,
      );
      return res.data;
    },
    enabled: !!selectedId, // Chỉ chạy khi có selectedId
  });

  return {
    toolTransferPage: toolTransferPageQuery.data || {
      items: [],
      totalItems: 0,
    },
    allStaff: staffQuery.data || [],
    allDepartments: departmentQuery.data || [],
    allToolsByDonVi: allToolsByDonViQuery.data || [],
    handoverDetails: handoverDetailsQuery.data || [],
    isHandoverLoading: handoverDetailsQuery.isFetching,
    setDepartmentId,
    handleDownloadFile,
    handlePreview,
    handleToolByDonVi,
    handleSignatureList,
    createMutation,
    updateMutation,
    signMutation,
    cancelMutation,
    deleteOneMutation,
    isFetching: toolTransferPageQuery.isFetching,
    allUnits: allUnitsQuery.data || [],
    allCurrentStatus: [
      { id: "Mới", tenHTKT: "Mới" },
      { id: "Cũ", tenHTKT: "Cũ" },
      { id: "Hỏng", tenHTKT: "Hỏng" },
      { id: "Đang sử dụng", tenHTKT: "Đang sử dụng" },
    ],
    errorState: {
      errors: importErrors,
      open: openErrorDialog,
      onClose: () => setOpenErrorDialog(false),
    },
  };
};
