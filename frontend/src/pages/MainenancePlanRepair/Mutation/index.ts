import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { MaintenancePlanData } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { CongTy } from "../../../utils/const";

// Maintenance Planning Queries
export const useMaintenancePlanningPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
) => {
  return useQuery({
    queryKey: [
      "maintenancePlanningPage",
      page,
      pageSize,
      searchValue,
      trangThai,
    ],
    queryFn: async () => {
      const res = await api.get("/kehoach-suachua", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMaintenancePlanningMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.post("/kehoach-suachua", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      showSuccessAlert("Tạo kế hoạch sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo kế hoạch sửa chữa thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.put(`/kehoach-suachua/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      showSuccessAlert("Cập nhật kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật kế hoạch bảo trì thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/kehoach-suachua/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      showSuccessAlert("Xóa kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa kế hoạch bảo trì thất bại",
      );
    },
  });
  const createWorkMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.post("/kehoach-congviec", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      // showSuccessAlert("Tạo kế hoạch sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo kế hoạch công việc thất bại",
      );
    },
  });

  const updateWorkMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.put(`/kehoach-congviec/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      // showSuccessAlert("Cập nhật kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật kế hoạch công việc thất bại",
      );
    },
  });

  const deleteWorkMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/kehoach-congviec/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      // showSuccessAlert("Xóa kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa kế hoạch công việc thất bại",
      );
    },
  });

  const createDetailMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.post("/kehoach-chitiet", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      showSuccessAlert("Tạo kế hoạch sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo kế hoạch chi tiết thất bại",
      );
    },
  });

  const updateDetailMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.put(`/kehoach-chitiet/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      // showSuccessAlert("Cập nhật kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật kế hoạch chi tiết thất bại",
      );
    },
  });

  const deleteDetailMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/kehoach-chitiet/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      // showSuccessAlert("Xóa kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Xóa kế hoạch chi tiết thất bại",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
