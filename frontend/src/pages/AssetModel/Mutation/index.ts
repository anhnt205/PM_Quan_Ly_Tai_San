import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { AssetModel } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useAssetModelMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: AssetModel) => {
      const res = await api.post("/taisan", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsModelPage"] });
      showSuccessAlert("Tạo mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo mô hình tài sản thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AssetModel) => {
      const res = await api.put(`/taisan/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsModelPage"] });
      showSuccessAlert("Sửa mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa mô hình tài sản thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/taisan/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsModelPage"] });
      showSuccessAlert("Xóa mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa mô hình tài sản thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/taisan/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsModelPage"] });
      showSuccessAlert(data || "Xóa mô hình tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa mô hình tài sản thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["assetsModelPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/mohinhtaisan/paged", {
        params: {
          idcongty: "ct001",
          page: page,
          size: pageSize,
          search: searchValue,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
  const { data: allAssetModel = [] } = useQuery({
    queryKey: ["allAssetModel"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/mohinhtaisan", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    assetsModelPage: data,
    allAssetModel,
    isLoading,
  };
};
