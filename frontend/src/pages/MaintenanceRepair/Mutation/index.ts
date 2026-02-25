import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { MaintenanceRepairData } from "../types";
import { MaintenancePlanData } from "../types/planning";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

export const useMaintenanceRepairPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  loai?: number,
  trangThai?: number,
) => {
  return useQuery({
    queryKey: [
      "maintenanceRepairPage",
      page,
      pageSize,
      searchValue,
      loai,
      trangThai,
    ],
    queryFn: async () => {
      const res = await api.get("/sua_chua_bao_duong/paged", {
        params: {
          page: page,
          size: pageSize,
          search: searchValue,
          loai: loai,
          trangThai: trangThai,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMaintenanceRepairAllQuery = () => {
  return useQuery({
    queryKey: ["maintenanceRepairAll"],
    queryFn: async () => {
      const res = await api.get("/sua_chua_bao_duong", {
        params: {
          idcongty: "ct001",
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

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
      const res = await api.get("/maintenance_planning/paged", {
        params: {
          page: page,
          size: pageSize,
          search: searchValue,
          trangThai: trangThai,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMaintenancePlanningAllQuery = () => {
  return useQuery({
    queryKey: ["maintenancePlanningAll"],
    queryFn: async () => {
      const res = await api.get("/maintenance_planning", {
        params: {
          idcongty: "ct001",
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
      const res = await api.post("/maintenance_planning", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningAll"] });
      showSuccessAlert("Tạo kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          error.message ||
          "Tạo kế hoạch bảo trì thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.put(`/maintenance_planning/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningAll"] });
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
      const res = await api.delete(`/maintenance_planning/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningAll"] });
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

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
