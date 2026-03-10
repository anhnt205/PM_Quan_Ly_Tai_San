import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import {
  MaintenancePlanAssetItem,
  MaintenancePlanData,
  MaintenancePlanWorkItem,
} from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { Action, CongTy } from "../../../utils/const";

// Maintenance Planning Queries
export const useMaintenancePlanningPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: string,
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

  const handleUpdate = (
    response: MaintenancePlanData,
    variables: MaintenancePlanData,
  ) => {
    if (variables.chiTiets && variables.chiTiets?.length > 0) {
      const createChiTiet = variables.chiTiets.filter(
        (item: any) => item.action === Action.CREATE,
      );
      const deleteChiTiet = variables.chiTiets.filter(
        (item: any) => item.action === Action.DELETE && item.id,
      );
      const updateChiTiet = variables.chiTiets.filter(
        (item: any) => item.action === Action.UPDATE && item.id,
      );
      if (createChiTiet.length > 0) {
        createDetailManyMutation.mutate(
          createChiTiet.map((item: any) => ({
            ...item,
            idKeHoach: response.id,
          })),
        );
      }
      if (deleteChiTiet.length > 0) {
        deleteDetailManyMutation.mutate(
          deleteChiTiet.map((item: any) => item.id),
        );
      }
      if (updateChiTiet.length > 0) {
        updateDetailManyMutation.mutate(
          updateChiTiet.map((item: any) => ({
            ...item,
            idKeHoach: response.id,
          })),
        );
      }
    }
    if (variables.congViecs && variables.congViecs?.length > 0) {
      const createCongViec = variables.congViecs.filter(
        (item: any) => item.action === Action.CREATE,
      );
      const deleteCongViec = variables.congViecs.filter(
        (item: any) => item.action === Action.DELETE && item.id,
      );
      const updateCongViec = variables.congViecs.filter(
        (item: any) => item.action === Action.UPDATE && item.id,
      );
      if (createCongViec.length > 0) {
        createWorkManyMutation.mutate(
          createCongViec.map((item: any) => ({
            ...item,
            idKeHoach: response.id,
          })),
        );
      }
      if (deleteCongViec.length > 0) {
        deleteWorkManyMutation.mutate(
          deleteCongViec.map((item: any) => item.id),
        );
      }
      if (updateCongViec.length > 0) {
        updateWorkManyMutation.mutate(
          updateCongViec.map((item: any) => ({
            ...item,
            idKeHoach: response.id,
          })),
        );
      }
    }
  };

  // api kehoach
  const createMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.post("/kehoach-suachua", data);
      return res.data;
    },
    onSuccess: async (response, variables) => {
      await handleUpdate(response, variables);
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningPage"],
      });
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
    onSuccess: async (response, variables) => {
      await handleUpdate(response, variables);
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
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.delete(`/kehoach-suachua/${data.id}`);
      return res.data;
    },
    onSuccess: (response, variables) => {
      if (variables.chiTiets && variables.chiTiets?.length > 0) {
        deleteDetailManyMutation.mutate(
          variables.chiTiets.map((item: any) => item.id),
        );
      }
      if (variables?.congViecs && variables.congViecs?.length > 0) {
        deleteWorkManyMutation.mutate(
          variables?.congViecs.map((item: any) => item.id),
        );
      }
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

  // api ke hoach cong viec
  const createWorkMutation = useMutation({
    mutationFn: async (data: MaintenancePlanWorkItem) => {
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
  const createWorkManyMutation = useMutation({
    mutationFn: async (data: MaintenancePlanWorkItem[]) => {
      const res = await api.post("/kehoach-congviec/bulk-create", data);
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
    mutationFn: async (data: MaintenancePlanWorkItem) => {
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

  const updateWorkManyMutation = useMutation({
    mutationFn: async (data: MaintenancePlanWorkItem[]) => {
      const res = await api.put(`/kehoach-congviec/bulk-update`, data);
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

  const deleteWorkManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/kehoach-congviec/bulk-delete`, {
        data: ids,
      });
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

  // api ke hoach chi tiet
  const createDetailMutation = useMutation({
    mutationFn: async (data: MaintenancePlanWorkItem) => {
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

  const createDetailManyMutation = useMutation({
    mutationFn: async (data: MaintenancePlanAssetItem[]) => {
      const res = await api.post("/kehoach-chitiet/bulk-create", data);
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
    mutationFn: async (data: MaintenancePlanAssetItem) => {
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
  const updateDetailManyMutation = useMutation({
    mutationFn: async (data: MaintenancePlanAssetItem[]) => {
      const res = await api.put(`/kehoach-chitiet/bulk-update`, data);
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

  const deleteDetailManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/kehoach-chitiet/bulk-delete`, {
        data: ids,
      });
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

  const getPlanningDetailMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/kehoach-chitiet/kehoach/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      console.log("Lấy chi tiết kế hoạch sửa chữa thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Lấy chi tiết kế hoạch sửa chữa thất bại",
      );
      return null;
    },
  });

  const updateStatusPlanMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(
        `/kehoach-suachua/${id}/trang-thai`,
        {},
        {
          params: {
            trangThai: status,
          },
        },
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      console.log("Cập nhật trạng thái kế hoạch sửa chữa thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật trạng thái kế hoạch sửa chữa thất bại",
      );
      return null;
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    getPlanningDetailMutation,
    updateStatusPlanMutation,
  };
};
