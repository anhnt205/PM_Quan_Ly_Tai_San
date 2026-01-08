import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useToolManagerMutation = (
  tab?: number,
  page?: number,
  pageSize?: number,
  searchValue?: string,
  idNhomCCDC?: string
) => {
  const queryClient = useQueryClient();
  const idCongTy = "ct001";

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/ccdcvattu", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert("Tạo CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo CCDC/Vật tư thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/ccdcvattu/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert("Cập nhật CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật CCDC/Vật tư thất bại"
      );
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/ccdcvattu/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert("Xóa CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa CCDC/Vật tư thất bại"
      );
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/ccdcvattu/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["toolsPage"] });
      showSuccessAlert(data || "Xóa CCDC/Vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa CCDC/Vật tư thất bại"
      );
    },
  });

  // --- QUERIES ---
  const { data: toolsPage = { items: [], totalItems: 0 }, isLoading } =
    useQuery({
      queryKey: ["toolsPage", page, pageSize, searchValue, idNhomCCDC, tab],
      queryFn: async () => {
        const res = await api.get("/ccdcvattu/paged", {
          params: {
            idcongty: idCongTy,
            page: page,
            size: pageSize,
            search: searchValue,
            idNhomCCDC: idNhomCCDC,
          },
        });
        return res.data.data || res.data;
      },
      placeholderData: (previousData) => previousData,
    });

  // Lấy danh sách nhóm CCDC
  const { data: toolGroups = [] } = useQuery({
    queryKey: ["toolGroups", idCongTy],
    queryFn: async () => {
      const res = await api.get("/nhomccdc", {
        params: { idcongty: idCongTy },
      });
      return res.data;
    },
  });

  return {
    toolsPage,
    toolGroups,
    isLoading,
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
  };
};
