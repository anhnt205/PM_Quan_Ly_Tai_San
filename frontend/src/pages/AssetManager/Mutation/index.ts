import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { AssetChildType, AssetType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import axios from "axios";

export const useAssetManagerMutation = (
  tab?: number,
  page?: number,
  pageSize?: number,
  searchValue?: string,
  date?: string,
  idNhomTaiSan?: string,
  idloaitaisan?: string
) => {
  const queryClient = useQueryClient();

  //taisan
  const createMutation = useMutation({
    mutationFn: async (data: AssetType) => {
      const res = await api.post("/taisan", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"] });
      showSuccessAlert("Tạo tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Tạo tài sản thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AssetType) => {
      const res = await api.put(`/taisan/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"] });
      showSuccessAlert("Sửa tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Sửa tài sản thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/taisan/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"] });
      showSuccessAlert("Xóa tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Xóa tài sản thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/taisan/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsPage"] });
      showSuccessAlert(data || "Xóa tài sản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Xóa tài sản thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["assetsPage", page, pageSize, searchValue, idNhomTaiSan, tab], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get(
        tab === 0
          ? "/taisan/by-donvi-hienthoi/paged"
          : tab === 1
          ? "/taisan/paged-da-ban-giao"
          : tab === 2
          ? "/taisan/paged-chua-ban-giao"
          : "/taisan/by-donvi-hienthoi/paged",
        {
          params: {
            idcongty: "ct001",
            page: page,
            size: pageSize,
            search: searchValue,
            idNhomTaiSan: idNhomTaiSan,
            ...(tab === 0 && { iddonvihienthoi: "kth" }),
          },
        }
      );
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
  const { data: assetsByType = [] } = useQuery({
    queryKey: ["assetsByType", idloaitaisan], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/taisan/loaitaisan/", {
        params: {
          idloataisan: idloaitaisan,
        },
      });
      return res.data;
    },
    enabled: !!idloaitaisan,
  });

  // taisancon
  const createChildAssetBulkMutation = useMutation({
    mutationFn: async (data: AssetChildType) => {
      const res = await api.post("/taisan/taisancon/bulk", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsChild"] });
      console.log("Tạo tài sản con thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Tạo tài sản con thất bại"
      );
    },
  });

  const deleteOneChildAsssetMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/taisan/taisancon/`, {
        params: { idTaiSanCon: id },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assetsChild"] });
      console.log("Xóa tài sản thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message || error.message || "Xóa tài sản thất bại"
      );
    },
  });

  // khauhaotaisan
  const { data: assetDepreciations = [] } = useQuery({
    queryKey: ["assetsPage", date], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/taisan/khauhaotaisan", {
        params: {
          idcongty: "ct001",
          ngay: date ? new Date(date).getDate() : undefined,
          thang: date ? new Date(date).getMonth() + 1 : undefined,
          nam: date ? new Date(date).getFullYear() : undefined,
        },
      });
      return res.data.data || res.data;
    },
    enabled: !!date,
    placeholderData: (previousData) => previousData,
  });
  const { data: countries = [] } = useQuery({
    queryKey: ["countries"], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await axios.get("https://open.oapi.vn/location/countries");
      return res.data.data;
    },
  });
  return {
    createMutation,
    updateMutation,
    deleteOneMutation,
    deleteManyMutation,
    createChildAssetBulkMutation,
    deleteOneChildAsssetMutation,
    assetsPage: data,
    assetsByType,
    countries,
    assetDepreciations,
    isLoading,
  };
};
