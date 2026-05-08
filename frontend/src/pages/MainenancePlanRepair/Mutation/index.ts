import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import {
  InspectionRecordData,
  InspectionRecordDetailData,
  MaintenancePlanData,
  PlanSigner,
} from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import { Action, CongTy } from "../../../utils/const";
import { IncidenData, MaintenanceRepairData, DanhGiaVatTuData } from "../../Maintenance/types";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

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
  trangThai?: number,
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

// kế hoạch chi tiết theo tháng
export const useMaintenancePlanningDetailsByMonthQuery = (
  idKeHoach: string,
  thang: number,
) => {
  return useQuery({
    queryKey: ["maintenancePlanningDetailsByMonth", idKeHoach, thang],
    queryFn: async () => {
      const res = await api.get(
        `kehoachsuachua-chitiet-taisan/kehoach/${idKeHoach}/thang/${thang}`,
      );
      return res.data.data || res.data || [];
    },
    enabled: !!idKeHoach && !!thang,
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

export const useMaintenancePlanningMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const { user } = useSelector((state: any) => state.user);

  // --- API TÀI SẢN ---
  const createTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.post(
          "/kehoachsuachua-chitiet-taisan/batch-insert",
          data.map((i) => ({
            ...i,
            nguoiTao: user?.taiKhoan?.tenDangNhap,
            ngayTao: now,
          })),
        )
      ).data;
    },
  });

  const updateTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/kehoachsuachua-chitiet-taisan/batch-update`,
          data.map((i) => ({
            ...i,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
            ngayCapNhat: now,
          })),
        )
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
      return (
        await api.post("/kehoach-suachua", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
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
      return (
        await api.put(`/kehoach-suachua/${data.id}`, {
          ...data,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          ngayCapNhat: now,
        })
      ).data;
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
      const res = await api.put(
        `/kehoach-suachua/batch`,
        data.map((i) => ({
          ...i,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          ngayCapNhat: now,
        })),
      );
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
    updateManyMutation,
  };
};

// sự cố thiết bị

export const useMaintenanceIncidentPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
) => {
  return useQuery({
    queryKey: [
      "incidentPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
    ],
    queryFn: async () => {
      const res = await api.get("/suco-thietbi/paged", {
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

export const useMaintenanceIncidentByPlanQuery = (
  idKeHoach: string | undefined,
) => {
  return useQuery({
    queryKey: ["incidentByPlan", idKeHoach],
    queryFn: async () => {
      const res = await api.get(`/suco-thietbi/by-kehoach/${idKeHoach}`);
      return res.data.data || res.data || [];
    },
    enabled: !!idKeHoach,
  });
};

export const useMaintenanceIncidenMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const { user } = useSelector((state: any) => state.user);

  // --- API TÀI SẢN ---
  const createTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.post(
          "/suco-thietbi-chitiet/batch",
          data.map((i) => ({
            ...i,
            nguoiTao: user?.taiKhoan?.tenDangNhap,
            ngayTao: now,
          })),
        )
      ).data;
    },
  });

  const updateTaiSanManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/suco-thietbi-chitiet/batch`,
          data.map((i) => ({
            ...i,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
            ngayCapNhat: now,
          })),
        )
      ).data;
    },
  });

  const deleteTaiSanManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (
        await api.delete(`/suco-thietbi-chitiet/batch`, {
          data: ids,
        })
      ).data;
    },
  });

  // TÁCH VÀ GỌI CÁC API CON
  const handleUpdate = (
    response: IncidenData | any,
    variables: IncidenData,
  ) => {
    const incidenId = response?.id || response?.data?.id;
    if (!incidenId) return;

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
          createTS.map((i: any) => ({ ...i, idSuCo: incidenId })),
        );
      if (updateTS.length > 0)
        updateTaiSanManyMutation.mutate(
          updateTS.map((i: any) => ({ ...i, idSuCo: incidenId })),
        );
      if (deleteTS.length > 0)
        deleteTaiSanManyMutation.mutate(deleteTS.map((i: any) => i.id));
    }
    console.log(variables.nguoiKyList);

    if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
      updateSignerMutation.mutate({
        idTaiLieu: incidenId,
        data: variables.nguoiKyList.map((item) => ({
          ...item,
          idTaiLieu: incidenId,
        })),
      });
    }
  };

  // --- API sự cố ---
  const createMutation = useMutation({
    mutationFn: async (data: IncidenData) => {
      return (
        await api.post("/suco-thietbi", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["incidentPage"] });
      showSuccessAlert("Tạo sự cố thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Tạo sự cố thất bại");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: IncidenData) => {
      return (
        await api.put(`/suco-thietbi/${data.id}`, {
          ...data,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          ngayCapNhat: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["incidentPage"] });

      showSuccessAlert("Cập nhật sự cố thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật sự cố thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: IncidenData[]) => {
      const res = await api.put(
        `/suco-thietbi/batch`,
        data.map((i) => ({
          ...i,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          ngayCapNhat: now,
        })),
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["incidentPage"] });
      console.log("Sửa sự cố thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message || error.message || "Sửa sự cố thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: IncidenData) => {
      return (await api.delete(`/suco-thietbi/${data.id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidentPage"] });
      showSuccessAlert("Xóa sự cố thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Xóa sự cố thất bại");
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
        queryKey: ["incidentPage"],
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
      queryClient.invalidateQueries({ queryKey: ["incidentPage"] });

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
    updateManyMutation,
  };
};

// sửa chữa

export const useMaintenanceRepairPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
) => {
  return useQuery({
    queryKey: [
      "repairPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
    ],
    queryFn: async () => {
      const res = await api.get("/suachua/paged", {
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
export const useMaintenanceRepairByPlanQuery = (idKeHoach?: string) => {
  return useQuery({
    queryKey: ["repairByPlan", idKeHoach],
    queryFn: async () => {
      const res = await api.get(`/suachua/kehoach/${idKeHoach}`);
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
export const useMaintenanceRepairMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const { user } = useSelector((state: any) => state.user);

  // --- API CHI TIẾT ---
  const createChiTietManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.post(
          "/suachua-chitiet/batch",
          data.map((i: any) => ({
            ...i,
            nguoiTao: user?.taiKhoan?.tenDangNhap,
            ngayTao: now,
          })),
        )
      ).data;
    },
  });

  const updateChiTietManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/suachua-chitiet/batch`,
          data.map((i: any) => ({
            ...i,
            ngayCapNhat: now,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          })),
        )
      ).data;
    },
  });

  const deleteChiTietManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (
        await api.delete(`/suachua-chitiet/batch`, {
          data: ids,
        })
      ).data;
    },
  });

  // TÁCH VÀ GỌI CÁC API CON
  const handleUpdate = (
    response: MaintenanceRepairData | any,
    variables: MaintenanceRepairData,
  ) => {
    const repairId = response?.id || response?.data?.id;
    if (!repairId) return;

    // XỬ LÝ CHI TIẾT
    if (variables.danhSachTaiSan && variables.danhSachTaiSan.length > 0) {
      const details = variables.danhSachTaiSan;
      const createItems = details.filter(
        (i: any) => i.action === Action.CREATE || !i.id,
      );
      const updateItems = details.filter(
        (i: any) => i.action === Action.UPDATE && i.id,
      );
      const deleteItems = details.filter(
        (i: any) => i.action === Action.DELETE && i.id,
      );

      if (createItems.length > 0)
        createChiTietManyMutation.mutate(
          createItems.map((i: any) => ({ ...i, idSuaChua: repairId })),
        );
      if (updateItems.length > 0)
        updateChiTietManyMutation.mutate(
          updateItems.map((i: any) => ({ ...i, idSuaChua: repairId })),
        );
      if (deleteItems.length > 0)
        deleteChiTietManyMutation.mutate(deleteItems.map((i: any) => i.id));
    }

    if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
      updateSignerMutation.mutate({
        idTaiLieu: repairId,
        data: variables.nguoiKyList.map((item) => ({
          ...item,
          idTaiLieu: repairId,
        })),
      });
    }
  };

  // --- API SỬA CHỮA ---
  const createMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairData) => {
      return (
        await api.post("/suachua", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["repairPage"] });
      showSuccessAlert("Tạo giấy đề nghị sửa chữa thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo giấy đề nghị sửa chữa thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairData) => {
      return (
        await api.put(`/suachua/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["repairPage"] });

      showSuccessAlert("Cập nhật giấy đề nghị thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật giấy đề nghị thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairData[]) => {
      const res = await api.put(
        `/suachua/batch`,
        data.map((i) => ({
          ...i,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })),
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ["repairPage"] });
      console.log("Sửa giấy đề nghị thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Sửa giấy đề nghị thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: MaintenanceRepairData) => {
      return (await api.delete(`/suachua/${data.id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairPage"] });
      showSuccessAlert("Xóa giấy đề nghị thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Xóa giấy đề nghị thất bại",
      );
    },
  });

  // người kí
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
        queryKey: ["repairPage"],
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

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateManyMutation,
    updateSignerMutation,
  };
};

// --- GIÁM ĐỊNH ---

export const useMaintenanceInspectionPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
) => {
  return useQuery({
    queryKey: [
      "inspectionPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
    ],
    queryFn: async () => {
      const res = await api.get("/giamdinh/paged", {
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
export const useMaintenanceInspectionByRepairQuery = (idSuaChua?: string) => {
  return useQuery({
    queryKey: ["inspectionByRepair", idSuaChua],
    queryFn: async () => {
      const res = await api.get(`/giamdinh/suachua/${idSuaChua}`);
      return res.data.data || res.data;
    },
    enabled: !!idSuaChua,
  });
};

export const useMaintenanceInspectionMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const { user } = useSelector((state: any) => state.user);

  // --- API CHI TIẾT ---
  const createChiTietManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.post(
          "/giamdinh-chitiet/batch",
          data.map((i: any) => ({
            ...i,
            nguoiTao: user?.taiKhoan?.tenDangNhap,
            ngayTao: now,
          })),
        )
      ).data;
    },
  });

  const updateChiTietManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/giamdinh-chitiet/batch`,
          data.map((i: any) => ({
            ...i,
            ngayCapNhat: now,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          })),
        )
      ).data;
    },
  });

  const deleteChiTietManyMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (await api.delete(`/giamdinh-chitiet/batch`, { data: ids })).data;
    },
  });

  const handleUpdate = (
    response: InspectionRecordData | any,
    variables: InspectionRecordData,
  ) => {
    const giamDinhId = response?.id || response?.data?.id;
    if (!giamDinhId) return;

    if (variables.danhSachChiTiet && variables.danhSachChiTiet.length > 0) {
      const details = variables.danhSachChiTiet;
      const createItems = details.filter(
        (i: any) => i.action === Action.CREATE || !i.id,
      );
      const updateItems = details.filter(
        (i: any) => i.action === Action.UPDATE && i.id,
      );
      const deleteItems = details.filter(
        (i: any) => i.action === Action.DELETE && i.id,
      );

      if (createItems.length > 0)
        createChiTietManyMutation.mutate(
          createItems.map((i: any) => ({ ...i, idGiamDinh: giamDinhId })),
        );
      if (updateItems.length > 0)
        updateChiTietManyMutation.mutate(
          updateItems.map((i: any) => ({ ...i, idGiamDinh: giamDinhId })),
        );
      if (deleteItems.length > 0)
        deleteChiTietManyMutation.mutate(deleteItems.map((i: any) => i.id));
    }

    if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
      updateSignerMutation.mutate({
        idTaiLieu: giamDinhId,
        data: variables.nguoiKyList.map((item) => ({
          ...item,
          idTaiLieu: giamDinhId,
        })),
      });
    }
  };

  const updateSignerMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      data,
    }: {
      idTaiLieu: string;
      data: any[];
    }) => {
      const res = await api.put(`/chuky/nguoi-ky/update/${idTaiLieu}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
    },
  });

  const deleteSignerMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/chuky/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InspectionRecordData) => {
      return (
        await api.post("/giamdinh", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
      showSuccessAlert("Tạo biên bản giám định thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo biên bản giám định thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InspectionRecordData) => {
      return (
        await api.put(`/giamdinh/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
      showSuccessAlert("Cập nhật biên bản giám định thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật biên bản giám định thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/giamdinh/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
      showSuccessAlert("Xóa biên bản giám định thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Xóa biên bản giám định thất bại",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      return (
        await api.post(`/giamdinh/capnhattrangthai?id=${id}&userId=${userId}`)
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
      showSuccessAlert("Cập nhật trạng thái thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.post(`/giamdinh/huy?id=${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
      showSuccessAlert("Hủy biên bản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Hủy biên bản thất bại");
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: InspectionRecordData[]) => {
      return (
        await api.put(
          `/giamdinh/batch`,
          data.map((i) => ({
            ...i,
            ngayCapNhat: now,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          })),
        )
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
      showSuccessAlert("Cập nhật danh sách thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật danh sách thất bại",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
    cancelMutation,
    updateManyMutation,
  };
};

// --- nghiệm thu ---

export const useMaintenanceAcceptanceTestPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
) => {
  return useQuery({
    queryKey: [
      "acceptanceTestPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
    ],
    queryFn: async () => {
      const res = await api.get("/nghiemthu/paged", {
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

export const useMaintenanceAcceptanceByInspectionQuery = (idGiamDinh?: string) => {
  return useQuery({
    queryKey: ["acceptanceByInspection", idGiamDinh],
    queryFn: async () => {
      const res = await api.get(`/nghiemthu/giamdinh/${idGiamDinh}`);
      return res.data.data || res.data;
    },
    enabled: !!idGiamDinh,
  });
};

export const useMaintenanceAcceptanceTestMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const { user } = useSelector((state: any) => state.user);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["acceptanceTestPage"] });
    queryClient.invalidateQueries({ queryKey: ["acceptanceTestByGiamDinh"] });
  };

  // --- Tài sản trong biên bản ---
  const batchInsertTaiSanMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (await api.post("/nghiemthu-taisan/taisan/batch", data)).data;
    },
  });

  const deleteTaiSanMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/nghiemthu-taisan/taisan/${id}`)).data;
    },
  });

  // --- Vật tư trong từng tài sản ---
  const batchInsertVatTuMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (await api.post("/nghiemthu-taisan/vattu/batch", data)).data;
    },
  });

  const deleteVatTuBatchMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (
        await api.delete("/nghiemthu-taisan/vattu/batch", { data: ids })
      ).data;
    },
  });

  // --- Xử lý sub-records sau khi tạo/cập nhật biên bản ---
  const handleSubRecords = (nghiemThuId: string, variables: any) => {
    // Xử lý danh sách tài sản
    if (variables.danhSachTaiSan && variables.danhSachTaiSan.length > 0) {
      const createTs = variables.danhSachTaiSan.filter(
        (i: any) => i.action === Action.CREATE || !i.id,
      );
      const deleteTs = variables.danhSachTaiSan.filter(
        (i: any) => i.action === Action.DELETE && i.id,
      );

      if (createTs.length > 0) {
        batchInsertTaiSanMutation.mutate(
          createTs.map((i: any) => ({ ...i, idBienBan: nghiemThuId })),
        );

        // Thu thập tất cả vật tư từ các tài sản mới
        const allVatTu = createTs.reduce((acc: any[], ts: any) => {
          if (ts.danhSachVatTu && ts.danhSachVatTu.length > 0) {
            const mappedVatTu = ts.danhSachVatTu.map((vt: any) => ({
              ...vt,
              idBienBanTaiSan: ts.id,
            }));
            return [...acc, ...mappedVatTu];
          }
          return acc;
        }, []);

        if (allVatTu.length > 0) {
          batchInsertVatTuMutation.mutate(allVatTu);
        }
      }
      if (deleteTs.length > 0) {
        deleteTs.forEach((ts: any) => deleteTaiSanMutation.mutate(ts.id));
      }
    }

    // Xử lý người ký
    if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
      updateSignerMutation.mutate({
        idTaiLieu: nghiemThuId,
        data: variables.nguoiKyList.map((item: any) => ({
          ...item,
          idTaiLieu: nghiemThuId,
        })),
      });
    }
  };

  const updateSignerMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      data,
    }: {
      idTaiLieu: string;
      data: any[];
    }) => {
      const res = await api.put(`/chuky/nguoi-ky/update/${idTaiLieu}`, data);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.post("/nghiemthu", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      const nghiemThuId = response?.data?.id || response?.id;
      if (nghiemThuId) handleSubRecords(nghiemThuId, variables);
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
      showSuccessAlert("Tạo biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo biên bản nghiệm thu thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.put(`/nghiemthu/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      const nghiemThuId = response?.data?.id || response?.id || variables?.id;
      if (nghiemThuId) handleSubRecords(nghiemThuId, variables);
      invalidate();
      queryClient.invalidateQueries({
        queryKey: ["inspectionByRepair"],
      });
      showSuccessAlert("Cập nhật biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Cập nhật biên bản nghiệm thu thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/nghiemthu/${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Xóa biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Xóa biên bản nghiệm thu thất bại",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      return (
        await api.post(`/nghiemthu/capnhattrangthai?id=${id}&userId=${userId}`)
      ).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Cập nhật trạng thái thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.post(`/nghiemthu/huy?id=${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Hủy biên bản nghiệm thu thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Hủy biên bản nghiệm thu thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/nghiemthu/batch`,
          data.map((i) => ({
            ...i,
            ngayCapNhat: now,
            nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          })),
        )
      ).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Cập nhật danh sách thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật danh sách thất bại",
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
    cancelMutation,
    updateManyMutation,
    batchInsertTaiSanMutation,
    batchInsertVatTuMutation,
    deleteVatTuBatchMutation,
  };
};

// đánh giá vật tư thu hồi

export const useMaintenanceMaterialAssessmentPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  userid?: string,
) => {
  return useQuery({
    queryKey: [
      "materialAssessmentPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      userid,
    ],
    queryFn: async () => {
      const res = await api.get("/danhgia-vattu/paged", {
        params: {
          page: page,
          size: pageSize,
          idcongty: CongTy.CT001,
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

export const useMaintenanceMaterialAssessmentByInspectionQuery = (
  idNghiemThu?: string,
) => {
  return useQuery({
    queryKey: ["materialAssessmentByInspection", idNghiemThu],
    queryFn: async () => {
      const res = await api.get(`/danhgia-vattu/nghiemthu/${idNghiemThu}`);
      return res.data.data || res.data;
    },
    enabled: !!idNghiemThu,
  });
};
export const useMaintenanceMaterialAssessmentMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD");
  const { user } = useSelector((state: any) => state.user);

  const createMutation = useMutation({
    mutationFn: async (data: DanhGiaVatTuData) => {
      return (
        await api.post("/danhgia-vattu", {
          ...data,
          idCongTy: CongTy.CT001,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      const id = response?.id || response?.data?.id;
      if (id && variables.nguoiKyList && variables.nguoiKyList.length > 0) {
        await api.put(`/chuky/nguoi-ky/update/${id}`, variables.nguoiKyList);
      }
      queryClient.invalidateQueries({ queryKey: ["materialAssessmentPage"] });
      queryClient.invalidateQueries({ queryKey: ["acceptanceByInspection"] });
      showSuccessAlert("Tạo biên bản đánh giá vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo biên bản đánh giá vật tư thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: DanhGiaVatTuData) => {
      return (
        await api.put(`/danhgia-vattu/${data.id}`, {
          ...data,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          ngayCapNhat: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      const id = variables.id;
      if (id && variables.nguoiKyList && variables.nguoiKyList.length > 0) {
        await api.put(`/chuky/nguoi-ky/update/${id}`, variables.nguoiKyList);
      }
      queryClient.invalidateQueries({ queryKey: ["materialAssessmentPage"] });
      showSuccessAlert("Cập nhật biên bản đánh giá vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật biên bản đánh giá vật tư thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/danhgia-vattu/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materialAssessmentPage"] });
      showSuccessAlert("Xóa biên bản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Xóa biên bản thất bại");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.post(`/danhgia-vattu/huy?id=${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materialAssessmentPage"] });
      showSuccessAlert("Hủy biên bản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Hủy biên bản thất bại");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    cancelMutation,
  };
};
