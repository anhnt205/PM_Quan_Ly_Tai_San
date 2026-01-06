import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { TypeAssetType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useTypeAssetMutation = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  assetGroup?: string
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: TypeAssetType) => {
      const res = await api.post("/loaitaisancon", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert("Tạo loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo loại ccdc thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TypeAssetType) => {
      const res = await api.put(`/loaitaisancon/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert("Sửa loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa loại ccdc thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/loaitaisancon/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert("Xóa loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại ccdc thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/loaitaisancon/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allTypeAssets"] });
      showSuccessAlert(data || "Xóa loại ccdc thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa loại ccdc thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["typeAssetsPage", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/loaitaisancon/paged", {
        params: {
          idcongty: "ct001",
          page: page,
          size: pageSize,
          search: searchValue,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: allTypeAssets = [] } = useQuery({
    queryKey: ["allTypeAssets"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/loaitaisancon");
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: typeAssetsByAssetGroup = [] } = useQuery({
    queryKey: ["typeAssetsByAssetGroup", assetGroup], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get(`/loaitaisancon/byloaitaisan/${assetGroup}`);
      return res.data;
    },
    enabled: !!assetGroup,
  });

  const { data: assetGroups = [] } = useQuery({
    queryKey: ["assetGroups"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/nhomtaisan", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    allTypeAssets,
    typeAssets: data,
    isLoading,
    assetGroups,
    typeAssetsByAssetGroup,
  };
};
