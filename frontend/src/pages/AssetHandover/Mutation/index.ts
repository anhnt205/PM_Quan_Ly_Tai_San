import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useAssetHandoverMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string
) => {
  const queryClient = useQueryClient();
  const mainKey = "assetHandoverPage";
  const idCongTy = "ct001";

  // --- 1. QUERIES DANH MỤC ---
  const { data: departments = [] } = useQuery({
    queryKey: ["departments", idCongTy],
    queryFn: async () =>
      (await api.get("/phongban", { params: { idcongty: idCongTy } })).data,
  });

  const { data: staffs = [] } = useQuery({
    queryKey: ["staffs", idCongTy],
    queryFn: async () =>
      (await api.get("/nhanvien", { params: { idcongty: idCongTy } })).data,
  });

  const { data: allAssets = [] } = useQuery({
    queryKey: ["allAssets", idCongTy],
    queryFn: async () =>
      (await api.get("/taisan", { params: { idcongty: idCongTy } })).data,
  });

  // --- 2. MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: async (data: any) =>
      (await api.post("/bangiaotaisan", data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Thành công");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) =>
      (await api.put(`/bangiaotaisan/${data.id}`, data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Cập nhật thành công");
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) =>
      (await api.delete(`/bangiaotaisan/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Xóa thành công");
    },
  });

  // --- 3. QUERIES LẤY DỮ LIỆU BẢNG ---

  // GET Bàn giao (Paged)
  const { data: handoverPage, isLoading: loadingHandover } = useQuery({
    queryKey: [mainKey, page, pageSize, searchValue],
    queryFn: async () => {
      const res = await api.get("/bangiaotaisan/paged", {
        params: {
          page,
          size: pageSize,
          search: searchValue,
          idcongty: idCongTy,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  // GET Điều động (Mới thêm)
  const { data: transferPage, isLoading: loadingTransfer } = useQuery({
    queryKey: ["assetTransferPage", idCongTy],
    queryFn: async () => {
      const res = await api.get("/dieudongtaisan", {
        params: { idcongty: idCongTy },
      });
      // Map về cùng cấu trúc items để TableCustom đọc được
      return { items: res.data || [], totalItems: res.data?.length || 0 };
    },
  });

  const handlePreviewFile = (fileName: string) => {
    if (!fileName) return;
    // Trình duyệt tự mở file nếu là PDF/Ảnh
    window.open(`${api.defaults.baseURL}/upload/preview/${fileName}`, "_blank");
  };

  const handleDownloadFile = async (fileName: string) => {
    if (!fileName) return;
    try {
      const response = await api.get(`/upload/download/${fileName}`, {
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

  return {
    handoverPage,
    transferPage,
    departments,
    staffs,
    allAssets,
    isLoading: loadingHandover || loadingTransfer,
    createMutation,
    updateMutation,
    deleteOneMutation,
    handlePreviewFile,
    handleDownloadFile,
  };
};
