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

  // --- 1. QUERIES DANH MỤC (Dùng cho Dropdowns) ---

  // Lấy danh sách phòng ban
  const { data: departments = [] } = useQuery({
    queryKey: ["departments", idCongTy],
    queryFn: async () => {
      const res = await api.get("/phongban", {
        params: { idcongty: idCongTy },
      });
      return res.data;
    },
  });

  // Lấy danh sách nhân viên
  const { data: staffs = [] } = useQuery({
    queryKey: ["staffs", idCongTy],
    queryFn: async () => {
      const res = await api.get("/nhanvien", {
        params: { idcongty: idCongTy },
      });
      return res.data;
    },
  });

  const { data: allAssets = [] } = useQuery({
    queryKey: ["allAssets", idCongTy],
    queryFn: async () => {
      const res = await api.get("/taisan", {
        params: { idcongty: idCongTy },
      });
      return res.data;
    },
  });

  // --- 2. MUTATIONS CHÍNH ---

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return (await api.post("/bangiaotaisan", data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Tạo biên bản bàn giao thành công");
    },
    onError: (error: any) =>
      showErrorAlert(error.response?.data?.message || "Tạo thất bại"),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return (await api.put(`/bangiaotaisan/${data.id}`, data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Cập nhật biên bản thành công");
    },
    onError: (error: any) =>
      showErrorAlert(error.response?.data?.message || "Cập nhật thất bại"),
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/bangiaotaisan/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mainKey] });
      showSuccessAlert("Xóa biên bản thành công");
    },
  });

  // --- 3. QUERIES LẤY DỮ LIỆU BẢNG ---

  const { data: handoverPage, isLoading } = useQuery({
    queryKey: [mainKey, page, pageSize, searchValue],
    queryFn: async () => {
      const res = await api.get("/bangiaotaisan/paged", {
        params: {
          page: page,
          size: pageSize,
          search: searchValue,
          idcongty: idCongTy,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    handoverPage,
    departments, // Trả ra để dùng trong FieldAutoCompleted
    staffs, // Trả ra để dùng trong FieldAutoCompleted
    allAssets,
    isLoading,
    createMutation,
    updateMutation,
    deleteOneMutation,
  };
};
