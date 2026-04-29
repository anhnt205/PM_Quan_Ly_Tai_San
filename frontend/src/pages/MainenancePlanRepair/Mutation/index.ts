import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { MaintenancePlanData, PlanSigner } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { Action, CongTy } from "../../../utils/const";

export const useMaintenancePlanningPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
) => {
  return useQuery({
    queryKey: [
      "maintenancePlanningPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
    ],
    queryFn: async () => {
      const res = await api.get("/kehoach-suachua/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMaintenancePlanningGroupedQuery = (
  idCongTy: string,
  trangThai?: string,
  search?: string,
  userid?: string,
) => {
  return useQuery({
    queryKey: [
      "maintenancePlanningGrouped",
      idCongTy,
      trangThai,
      search,
      userid,
    ],
    queryFn: async () => {
      const res = await api.get("/kehoach-suachua/grouped-by-year", {
        params: { idCongTy, trangThai, search, userid },
      });
      return res.data;
    },
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

  // --- API TÀI SẢN ---
  const createTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.post("/kehoachsuachua-chitiet-taisan/batch-insert", data)
      ).data;
    },
  });

  const updateTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(`/kehoachsuachua-chitiet-taisan/batch-update`, data)
      ).data;
    },
  });

  const deleteTaiSanManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (
        await api.delete(`/kehoachsuachua-chitiet-taisan/batch-delete`, {
          data: ids,
        })
      ).data;
    },
  });

  // TÁCH VÀ GỌI CÁC API CON
  const handleUpdate = (
    response: MaintenancePlanData | any,
    variables: MaintenancePlanData,
  ) => {
    const planId = response?.id || response?.data?.id;
    if (!planId) return;

    // XỬ LÝ CHI TIẾT TÀI SẢN
    if (variables.danhSachTaiSan && variables.danhSachTaiSan.length > 0) {
      const taiSans = variables.danhSachTaiSan;
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
    console.log(variables.nguoiKyList);

    if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
      updateSignerMutation.mutate({
        idTaiLieu: planId,
        data: variables.nguoiKyList.map((item) => ({
          ...item,
          idTaiLieu: planId,
        })),
      });
    }
  };

  // --- API KẾ HOẠCH ---
  const createMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      return (await api.post("/kehoach-suachua", data)).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningGrouped"],
      });
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
      return (await api.put(`/kehoach-suachua/${data.id}`, data)).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningGrouped"],
      });
      showSuccessAlert("Cập nhật kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật kế hoạch bảo trì thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData[]) => {
      const res = await api.put(`/kehoach-suachua/batch`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningGrouped"],
      });
      console.log("Sửa kế hoạch thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa kế hoạch thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: MaintenancePlanData) => {
      return (await api.delete(`/kehoach-suachua/${data.id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningGrouped"],
      });
      showSuccessAlert("Xóa kế hoạch bảo trì thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Xóa kế hoạch bảo trì thất bại",
      );
    },
  });

  const updateStatusPlanMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return (
        await api.patch(
          `/kehoach-suachua/${id}/trang-thai`,
          {},
          { params: { trangThai: status } },
        )
      ).data;
    },
  });

  // người kí\
  const updateSignerMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      data,
    }: {
      idTaiLieu: string;
      data: PlanSigner[];
    }) => {
      const res = await api.put(`/chuky/nguoi-ky/update/${idTaiLieu}`, data);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningPage"],
      });

      console.log("Cập nhật người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật người ký thất bại",
      );
    },
  });
  const deleteSignerMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/chuky/${id}`);
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });

      console.log("Xóa người ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Xóa người ký thất bại",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusPlanMutation,
    updateManyMutation,
  };
};
