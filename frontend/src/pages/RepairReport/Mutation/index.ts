import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { BienBanSuaChua } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useBienBanSuaChuaPageQuery = (
  page: number,
  size: number,
  search: string,
  loaiBienBan?: string,
  macDinh?: boolean,
) => {
  return useQuery({
    queryKey: ["bienBanSuaChuaPage", page, size, search, loaiBienBan, macDinh],
    queryFn: async () => {
      const res = await api.get("/mau-bien-ban-sua-chua/paged", {
        params: { page, size, search, loaiBienBan, macDinh },
      });
      return res.data;
    },
  });
};

export const useBienBanSuaChuaMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: BienBanSuaChua) => {
      const res = await api.post("/mau-bien-ban-sua-chua", data);
      return res.data;
    },
    onSuccess: (res) => {
      if (res.success) {
        showSuccessAlert("Tạo biên bản thành công");
        queryClient.invalidateQueries({ queryKey: ["bienBanSuaChuaPage"] });
      } else {
        showErrorAlert(res.message);
      }
    },
    onError: (err: any) => {
      showErrorAlert(err.response?.data?.message || "Lỗi khi tạo biên bản");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BienBanSuaChua) => {
      const res = await api.put(`/mau-bien-ban-sua-chua/${data.id}`, data);
      return res.data;
    },
    onSuccess: (res) => {
      if (res.success) {
        showSuccessAlert("Cập nhật biên bản thành công");
        queryClient.invalidateQueries({ queryKey: ["bienBanSuaChuaPage"] });
      } else {
        showErrorAlert(res.message);
      }
    },
    onError: (err: any) => {
      showErrorAlert(
        err.response?.data?.message || "Lỗi khi cập nhật biên bản",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/mau-bien-ban-sua-chua/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      if (res.success) {
        showSuccessAlert("Xóa biên bản thành công");
        queryClient.invalidateQueries({ queryKey: ["bienBanSuaChuaPage"] });
      } else {
        showErrorAlert(res.message);
      }
    },
    onError: (err: any) => {
      showErrorAlert(err.response?.data?.message || "Lỗi khi xóa biên bản");
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/mau-bien-ban-sua-chua/batch`, {
        data: ids,
      });
      return res.data;
    },
    onSuccess: (res) => {
      if (res.success) {
        showSuccessAlert(`Xóa biên bản thành công`);
        queryClient.invalidateQueries({ queryKey: ["bienBanSuaChuaPage"] });
      } else {
        showErrorAlert(res.message);
      }
    },
    onError: (err: any) => {
      showErrorAlert(err.response?.data?.message || "Lỗi khi xóa biên bản");
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/mau-bien-ban-sua-chua/all`);
      return res.data;
    },
    onSuccess: (res) => {
      if (res.success) {
        showSuccessAlert("Xóa biên bản thành công");
        queryClient.invalidateQueries({ queryKey: ["bienBanSuaChuaPage"] });
      } else {
        showErrorAlert(res.message);
      }
    },
    onError: (err: any) => {
      showErrorAlert(err.response?.data?.message || "Lỗi khi xóa biên bản");
    },
  });
  return {
    createMutation,
    deleteMutation,
    updateMutation,
    deleteAllMutation,
    deleteBatchMutation,
  };
};
