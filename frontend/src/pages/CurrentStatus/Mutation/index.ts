import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { CurrentStatusType } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useCurrentStatusMutation = (
  page: number,
  pageSize: number,
  searchValue: string
) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: CurrentStatusType) => {
      const res = await api.post("/hientrangkythuat", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentStatus"] });
      showSuccessAlert("Tạo hiện trạng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo hiện trạng thất bại"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CurrentStatusType) => {
      const res = await api.put(`/hientrangkythuat/${data.id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentStatus"] });
      showSuccessAlert("Sửa hiện trạng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Sửa hiện trạng thất bại"
      );
    },
  });
  const deleteOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/hientrangkythuat/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentStatus"] });
      showSuccessAlert("Xóa hiện trạng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa hiện trạng thất bại"
      );
    },
  });
  const deleteManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/hientrangkythuat/batch`, { data: ids });
      return res.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentStatus"] });
      showSuccessAlert(data || "Xóa hiện trạng thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa hiện trạng thất bại"
      );
    },
  });

  const { data = { items: [], totalItems: 0 }, isLoading } = useQuery({
    queryKey: ["currentStatus", page, pageSize, searchValue], // Key để cache dữ liệu
    queryFn: async () => {
      const res = await api.get("/hientrangkythuat/paged", {
        params: {
          page: page,
          size: pageSize,
          search: searchValue,
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
    currentStatus: data,
    isLoading,
  };
};
