import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { MaintenancePlanData, MaintenancePlanWorkItem } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { Action, CongTy } from "../../../utils/const";

export const useMaintenancePlanningPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: string,
  idDonViGiao?: string,
) => {
  return useQuery({
    queryKey: [
      "maintenancePlanningPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
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

// Hook lấy chi tiết Tài Sản theo Kế Hoạch
export const useChiTietTaiSanByKeHoachQuery = (
  idKeHoach: string | undefined,
) => {
  return useQuery({
    queryKey: ["chiTietTaiSan", idKeHoach],
    queryFn: async () => {
      const res = await api.get(
        `/kehoachsuachua-chitiet-taisan/kehoach/${idKeHoach}`,
      );
      return res.data;
    },
    enabled: !!idKeHoach,
  });
};

// Hook lấy chi tiết CCDC theo Kế Hoạch
export const useVatTuTieuHaoByKeHoachQuery = (
  idKeHoach: string | undefined,
) => {
  return useQuery({
    queryKey: ["vatTuTieuHao", idKeHoach],
    queryFn: async () => {
      const res = await api.get(
        `/kehoachsuachua-vattu-tieuhao/kehoach/${idKeHoach}`,
      );
      return res.data;
    },
    enabled: !!idKeHoach,
  });
};

// Thêm vào file API định nghĩa hook
export const useWorkItemsByPlanQuery = (idKeHoach: string | undefined) => {
  return useQuery({
    queryKey: ["work-items-by-plan", idKeHoach],
    queryFn: async () => {
      if (!idKeHoach) return [];
      const response = await api.get(`/kehoach-congviec/kehoach/${idKeHoach}`);
      return response.data;
    },
    enabled: !!idKeHoach, // Chỉ chạy khi có idKeHoach
  });
};

export const useMaintenancePlanningMutation = () => {
  const queryClient = useQueryClient();

  // TÁCH VÀ GỌI CÁC API CON
  const handleUpdate = (
    response: MaintenancePlanData | any,
    variables: MaintenancePlanData,
  ) => {
    const planId = response?.id || response?.data?.id;

    if (!planId) return;

    // XỬ LÝ CHI TIẾT TÀI SẢN & CCDC (Tách ra từ mảng chiTiets chung)
    if (variables.chiTiets && variables.chiTiets.length > 0) {
      const taiSans = variables.chiTiets.filter((item: any) => item.idTaiSan);
      const ccdcs = variables.chiTiets.filter((item: any) => item.idCCDC);

      // --- Xử lý cho bảng TÀI SẢN ---
      if (taiSans.length > 0) {
        const createTS = taiSans.filter(
          (i: any) => i.action === Action.CREATE || !i.id,
        );
        const updateTS = taiSans.filter(
          (i: any) => i.action === Action.UPDATE && i.id,
        );
        const deleteTS = taiSans.filter(
          (i: any) => i.action === Action.DELETE && i.id,
        );

        if (createTS.length > 0)
          createTaiSanManyMutation.mutate(
            createTS.map((i: any) => ({ ...i, idKeHoachSuaChua: planId })),
          );
        if (updateTS.length > 0)
          updateTaiSanManyMutation.mutate(
            updateTS.map((i: any) => ({ ...i, idKeHoachSuaChua: planId })),
          );
        if (deleteTS.length > 0)
          deleteTaiSanManyMutation.mutate(deleteTS.map((i: any) => i.id));
      }

      // --- Xử lý cho bảng VẬT TƯ (CCDC) ---
      if (ccdcs.length > 0) {
        const createCC = ccdcs.filter(
          (i: any) => i.action === Action.CREATE || !i.id,
        );
        const updateCC = ccdcs.filter(
          (i: any) => i.action === Action.UPDATE && i.id,
        );
        const deleteCC = ccdcs.filter(
          (i: any) => i.action === Action.DELETE && i.id,
        );

        // Lưu ý: Map tenCCDC từ giao diện vào trường tenVatTu của Backend
        if (createCC.length > 0)
          createCCDCManyMutation.mutate(
            createCC.map((i: any) => ({
              ...i,
              idKeHoachSuaChua: planId,
              tenVatTu: i.tenCCDC || i.tenVatTu,
            })),
          );
        if (updateCC.length > 0)
          updateCCDCManyMutation.mutate(
            updateCC.map((i: any) => ({
              ...i,
              idKeHoachSuaChua: planId,
              tenVatTu: i.tenCCDC || i.tenVatTu,
            })),
          );
        if (deleteCC.length > 0)
          deleteCCDCManyMutation.mutate(deleteCC.map((i: any) => i.id));
      }
    }

    // XỬ LÝ CÔNG VIỆC
    if (variables.congViecs && variables.congViecs.length > 0) {
      const createCongViec = variables.congViecs.filter(
        (i: any) => i.action === Action.CREATE || !i.id,
      );
      const updateCongViec = variables.congViecs.filter(
        (i: any) => i.action === Action.UPDATE && i.id,
      );
      const deleteCongViec = variables.congViecs.filter(
        (i: any) => i.action === Action.DELETE && i.id,
      );

      if (createCongViec.length > 0)
        createWorkManyMutation.mutate(
          createCongViec.map((i: any) => ({ ...i, idKeHoach: planId })),
        );
      if (updateCongViec.length > 0)
        updateWorkManyMutation.mutate(
          updateCongViec.map((i: any) => ({ ...i, idKeHoach: planId })),
        );
      if (deleteCongViec.length > 0)
        deleteWorkManyMutation.mutate(deleteCongViec.map((i: any) => i.id));
    }
  };

  // --- API KẾ HOẠCH ---
  const createMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.post("/kehoach-suachua", data);
      return res.data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      showSuccessAlert("Tạo kế hoạch sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo kế hoạch sửa chữa thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.put(`/kehoach-suachua/${data.id}`, data);
      return res.data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      showSuccessAlert("Cập nhật kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật kế hoạch bảo trì thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      const res = await api.delete(`/kehoach-suachua/${data.id}`);
      return res.data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      showSuccessAlert("Xóa kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Xóa kế hoạch bảo trì thất bại",
      );
    },
  });

  // --- API CÔNG VIỆC ---
  const createWorkManyMutation = useMutation({
    mutationFn: async (data: MaintenancePlanWorkItem[]) => {
      const res = await api.post("/kehoach-congviec/bulk-create", data);
      return res.data;
    },
  });

  const updateWorkManyMutation = useMutation({
    mutationFn: async (data: MaintenancePlanWorkItem[]) => {
      const res = await api.put(`/kehoach-congviec/bulk-update`, data);
      return res.data;
    },
  });

  const deleteWorkManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(`/kehoach-congviec/bulk-delete`, {
        data: ids,
      });
      return res.data;
    },
  });

  // --- API TÀI SẢN ---
  const createTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.post(
        "/kehoachsuachua-chitiet-taisan/batch-insert",
        data,
      );
      return res.data;
    },
  });

  const updateTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.put(
        `/kehoachsuachua-chitiet-taisan/batch-update`,
        data,
      );
      return res.data;
    },
  });

  const deleteTaiSanManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(
        `/kehoachsuachua-chitiet-taisan/batch-delete`,
        { data: ids },
      );
      return res.data;
    },
  });

  // --- API CCDC ---
  const createCCDCManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.post(
        "/kehoachsuachua-vattu-tieuhao/batch-insert",
        data,
      );
      return res.data;
    },
  });

  const updateCCDCManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.put(
        `/kehoachsuachua-vattu-tieuhao/batch-update`,
        data,
      );
      return res.data;
    },
  });

  const deleteCCDCManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete(
        `/kehoachsuachua-vattu-tieuhao/batch-delete`,
        { data: ids },
      );
      return res.data;
    },
  });

  // --- KHÁC ---
  const updateStatusPlanMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(
        `/kehoach-suachua/${id}/trang-thai`,
        {},
        { params: { trangThai: status } },
      );
      return res.data;
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusPlanMutation,
  };
};
