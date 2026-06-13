import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import api from "../../../config/api.config";
import { listNguoiKy } from "../config";
import socketService from "../../../services/socketService";
import { MessageTypeFunctions } from "../../../utils/const";
import { SignaturesData } from "../../AssetTransfer/types";

import {
  InspectionRecordData,
  InspectionRecordDetailData,
  MaintenancePlanData,
  PlanSigner,
  VehicleInspectionRecordData,
  VehicleInspectionRecordDetailData,
} from "../types";
import { Action, CongTy } from "../../../utils/const";
import {
  IncidenData,
  MaintenanceRepairData,
  DanhGiaVatTuData,
  IncidentInspectionData,
} from "../../Maintenance/types";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import {
  AcceptanceTestAdapter,
  IncidentAdapter,
  IncidentInspectionAdapter,
  InspectionAdapter,
  MaterialAssessmentAdapter,
  RepairAdapter,
} from "../../Maintenance/Adapter";

export const useMaintenancePlanningPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  nhomTaiSan?: string,
  idTaiSan?: string,
  enabled = true,
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
      isSign,
      dateFrom,
      dateTo,
      nhomTaiSan,
      idTaiSan,
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
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
          nhomTaiSan: nhomTaiSan,
          idTaiSan: idTaiSan,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenancePlanningGroupedQuery = (
  idCongTy: string,
  trangThai?: number,
  search?: string,
  userid?: string,
  idDonViGiao?: string,
  dateFrom?: string,
  dateTo?: string,
  nhomTaiSan?: string,
) => {
  return useQuery({
    queryKey: [
      "maintenancePlanningGrouped",
      idCongTy,
      trangThai,
      search,
      userid,
      idDonViGiao,
      dateFrom,
      dateTo,
      nhomTaiSan,
    ],
    queryFn: async () => {
      const res = await api.get("/kehoach-suachua/grouped-by-year", {
        params: {
          idCongTy,
          trangThai,
          search,
          userid,
          idDonViGiao,
          dateFrom,
          dateTo,
          nhomTaiSan,
        },
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
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
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

    // if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
    updateSignerMutation.mutate({
      idTaiLieu: planId,
      data: (variables.nguoiKyList || []).map((item) => ({
        ...item,
        idTaiLieu: planId,
      })),
    });
    // }
    queryClient.invalidateQueries({ queryKey: ["maintenancePlanningPage"] });
    queryClient.invalidateQueries({
      queryKey: ["maintenancePlanningGrouped"],
    });
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
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
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
      isSign,
      dateFrom,
      dateTo,
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
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

// Hook lấy chi tiết Tài Sản theo Kế Hoạch
export const useMaintenanceIncidentDetailByIncidentQuery = (
  idSuCo: string | undefined,
) => {
  return useQuery({
    queryKey: ["incidentDetailByIncident", idSuCo],
    queryFn: async () => {
      const res = await api.get(`/suco-thietbi-chitiet/by-suco/${idSuCo}`);
      return res.data.data || res.data || [];
    },
    enabled: !!idSuCo,
  });
};

export const useMaintenanceIncidentByPlanQuery = (
  idKeHoach: string | undefined,
) => {
  return useQuery({
    queryKey: ["incidentByPlan", idKeHoach],
    queryFn: async () => {
      const res = await api.get(`/suco-thietbi/by-kehoach/${idKeHoach}`);
      return (res.data.data || res.data || []).map((item: any) =>
        IncidentAdapter(item),
      );
    },
    enabled: !!idKeHoach,
  });
};

export const useMaintenanceIncidenMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
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

    // if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
    updateSignerMutation.mutate({
      idTaiLieu: incidenId,
      data: (variables.nguoiKyList || []).map((item) => ({
        ...item,
        idTaiLieu: incidenId,
      })),
    });
    // }
    queryClient.invalidateQueries({ queryKey: ["incidentPage"] });
    queryClient.invalidateQueries({ queryKey: ["incidentByPlan"] });
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
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningGrouped"],
      });
      queryClient.invalidateQueries({ queryKey: ["incidentByPlan"] });
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
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningGrouped"],
      });
      queryClient.invalidateQueries({ queryKey: ["incidentByPlan"] });
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
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
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
      isSign,
      dateFrom,
      dateTo,
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
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};
export const useMaintenanceRepairByPlanQuery = (idKeHoach?: string) => {
  return useQuery({
    queryKey: ["repairByPlan", idKeHoach],
    queryFn: async () => {
      const res = await api.get(`/suachua/kehoach/${idKeHoach}`);
      return (res.data.data || res.data || []).map((item: any) =>
        RepairAdapter(item),
      );
    },
    placeholderData: (previousData) => previousData,
  });
};
export const useMaintenanceRepairMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
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
  // TÁCH VÀ GỌI CÁC API CON
  const handleUpdate = async (
    response: MaintenanceRepairData | any,
    variables: MaintenanceRepairData,
  ) => {
    const repairId = response?.id || response?.data?.id;
    if (!repairId) return;

    const promises: Promise<any>[] = [];

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
        promises.push(
          createChiTietManyMutation.mutateAsync(
            createItems.map((i: any) => ({ ...i, idSuaChua: repairId })),
          ),
        );
      if (updateItems.length > 0)
        promises.push(
          updateChiTietManyMutation.mutateAsync(
            updateItems.map((i: any) => ({ ...i, idSuaChua: repairId })),
          ),
        );
      if (deleteItems.length > 0)
        promises.push(
          deleteChiTietManyMutation.mutateAsync(
            deleteItems.map((i: any) => i.id),
          ),
        );
    }

    if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
      promises.push(
        updateSignerMutation.mutateAsync({
          idTaiLieu: repairId,
          data: variables.nguoiKyList.map((item) => ({
            ...item,
            idTaiLieu: repairId,
          })),
        }),
      );
    }

    await Promise.all(promises);
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
      await handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["repairPage"] });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningDetailsByMonth"],
      });
      queryClient.invalidateQueries({
        queryKey: ["incidentDetailByIncident"],
      });
      queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
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
      await handleUpdate(response, variables);
      queryClient.invalidateQueries({ queryKey: ["repairPage"] });
      queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningDetailsByMonth"],
      });

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
      queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningDetailsByMonth"],
      });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningDetailsByMonth"],
      });
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
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
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
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/giamdinh-maymoc/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceInspectionByBienBanQuery = (
  idBienBan?: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["inspectionByBienBan", idBienBan],
    queryFn: async () => {
      const res = await api.get(`/giamdinh-maymoc/bienban/${idBienBan}`);
      const data = (res.data.data || res.data || []).map((item: any) =>
        InspectionAdapter(item),
      );
      return data;
    },
    enabled: !!idBienBan && enabled,
  });
};

export const useMaintenanceInspectionMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const { user } = useSelector((state: any) => state.user);

  // --- API CHI TIẾT ---
  const createChiTietManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.post(
          "/giamdinh-maymoc-chitiet/batch",
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
          `/giamdinh-maymoc-chitiet/batch`,
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
      return (await api.delete(`/giamdinh-maymoc-chitiet/batch`, { data: ids }))
        .data;
    },
  });

  // --- API VẬT TƯ THEO TÀI SẢN ---
  const batchInsertVatTuMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (await api.post("/giamdinh-maymoc-chitiet/vattu/batch", data))
        .data;
    },
  });

  const deleteVatTuBatchMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return (
        await api.delete("/giamdinh-maymoc-chitiet/vattu/batch", { data: ids })
      ).data;
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

      // 1. Tạo mới tài sản chi tiết
      if (createItems.length > 0) {
        createChiTietManyMutation.mutate(
          createItems.map((i: any) => ({ ...i, idGiamDinhMayMoc: giamDinhId })),
        );

        // Thu thập tất cả vật tư của tài sản mới để lưu
        const newVatTu = createItems.reduce((acc: any[], item: any) => {
          if (item.danhSachVatTu && item.danhSachVatTu.length > 0) {
            const mapped = item.danhSachVatTu.map((vt: any) => ({
              ...vt,
              idChiTietGiamDinhMayMoc: item.id,
            }));
            return [...acc, ...mapped];
          }
          return acc;
        }, []);

        if (newVatTu.length > 0) {
          batchInsertVatTuMutation.mutate(newVatTu);
        }
      }

      // 2. Cập nhật tài sản chi tiết cũ
      if (updateItems.length > 0) {
        updateChiTietManyMutation.mutate(
          updateItems.map((i: any) => ({ ...i, idGiamDinhMayMoc: giamDinhId })),
        );

        // Xử lý lưu/sửa/xóa danh sách vật tư lồng bên dưới từng tài sản cũ
        updateItems.forEach((item: any) => {
          if (item.danhSachVatTu && item.danhSachVatTu.length > 0) {
            const vtCreate = item.danhSachVatTu.filter(
              (v: any) => v.action === Action.CREATE || !v.id,
            );
            const vtUpdate = item.danhSachVatTu.filter(
              (v: any) => v.action === Action.UPDATE && v.id,
            );
            const vtDelete = item.danhSachVatTu.filter(
              (v: any) => v.action === Action.DELETE && v.id,
            );

            if (vtCreate.length > 0) {
              batchInsertVatTuMutation.mutate(
                vtCreate.map((v: any) => ({
                  ...v,
                  idChiTietGiamDinhMayMoc: item.id,
                })),
              );
            }
            if (vtUpdate.length > 0) {
              vtUpdate.forEach((v: any) => {
                api
                  .put(`/giamdinh-maymoc-chitiet/vattu/${v.id}`, v)
                  .catch(console.error);
              });
            }
            if (vtDelete.length > 0) {
              deleteVatTuBatchMutation.mutate(vtDelete.map((v: any) => v.id));
            }
          }
        });
      }

      // 3. Xóa tài sản chi tiết
      if (deleteItems.length > 0) {
        deleteChiTietManyMutation.mutate(deleteItems.map((i: any) => i.id));
      }
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
        await api.post("/giamdinh-maymoc", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id) {
        handleUpdate(response, variables);
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["incidentDetailByIncident"],
        });
        queryClient.invalidateQueries({
          queryKey: ["incidentDetailByIncident"],
        });
        queryClient.invalidateQueries({
          queryKey: ["maintenancePlanningDetailsByMonth"],
        });

        showSuccessAlert("Tạo biên bản giám định thành công");
      } else {
        showErrorAlert(response.message || "Tạo biên bản giám định thất bại");
      }
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
        await api.put(`/giamdinh-maymoc/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id) {
        handleUpdate(response, variables);
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        showSuccessAlert("Cập nhật biên bản giám định thành công");
      } else {
        showErrorAlert(
          response.message || "Cập nhật biên bản giám định thất bại",
        );
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật biên bản giám định thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/giamdinh-maymoc/${id}`)).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id) {
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        showSuccessAlert("Xóa biên bản giám định thành công");
      } else {
        showErrorAlert(res.message || "Xóa biên bản giám định thất bại");
      }
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
        await api.post(
          `/giamdinh-maymoc/capnhattrangthai?id=${id}&userId=${userId}`,
        )
      ).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        showSuccessAlert("Cập nhật trạng thái thành công");
      } else {
        showErrorAlert(res.message || "Cập nhật trạng thái thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.post(`/giamdinh-maymoc/huy?id=${id}`)).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        showSuccessAlert("Hủy biên bản thành công");
      } else {
        showErrorAlert(res.message || "Hủy biên bản thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Hủy biên bản thất bại");
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: InspectionRecordData[]) => {
      return (
        await api.put(
          `/giamdinh-maymoc/batch`,
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

// --- GIÁM ĐỊNH PHƯƠNG TIỆN ---

export const useMaintenanceVehicleInspectionPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "vehicleInspectionPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/giamdinh-phuongtien/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceVehicleInspectionByBienBanQuery = (
  idBienBan?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["vehicleInspectionByBienBan", idBienBan],
    queryFn: async () => {
      const res = await api.get(`/giamdinh-phuongtien/bienban/${idBienBan}`);
      return (res.data.data || res.data || []).map((item: any) =>
        InspectionAdapter(item),
      );
    },
    enabled: !!idBienBan && enabled,
  });
};

export const useMaintenanceVehicleInspectionMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const { user } = useSelector((state: any) => state.user);

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
      queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VehicleInspectionRecordData) => {
      return (
        await api.post("/giamdinh-phuongtien", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id || response.data?.id) {
        const id = response.id || response.data?.id;
        if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
          updateSignerMutation.mutate({
            idTaiLieu: id,
            data: variables.nguoiKyList.map((item) => ({
              ...item,
              idTaiLieu: id,
            })),
          });
        }
        queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["vehicleInspectionByBienBan"],
        });
        queryClient.invalidateQueries({
          queryKey: ["incidentDetailByIncident"],
        });
        queryClient.invalidateQueries({
          queryKey: ["maintenancePlanningDetailsByMonth"],
        });
        showSuccessAlert("Tạo biên bản giám định phương tiện thành công");
      } else {
        showErrorAlert(
          response.message || "Tạo biên bản giám định phương tiện thất bại",
        );
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Tạo biên bản giám định phương tiện thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: VehicleInspectionRecordData) => {
      return (
        await api.put(`/giamdinh-phuongtien/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id || response.data?.id) {
        const id = response.id || response.data?.id;
        if (variables.nguoiKyList && variables.nguoiKyList.length > 0) {
          updateSignerMutation.mutate({
            idTaiLieu: id,
            data: variables.nguoiKyList.map((item) => ({
              ...item,
              idTaiLieu: id,
            })),
          });
        }
        queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["vehicleInspectionByBienBan"],
        });
        showSuccessAlert("Cập nhật biên bản giám định phương tiện thành công");
      } else {
        showErrorAlert(
          response.message ||
            "Cập nhật biên bản giám định phương tiện thất bại",
        );
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Cập nhật biên bản giám định phương tiện thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/giamdinh-phuongtien/${id}`)).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["vehicleInspectionByBienBan"],
        });
        queryClient.invalidateQueries({
          queryKey: ["incidentDetailByIncident"],
        });
        queryClient.invalidateQueries({
          queryKey: ["maintenancePlanningDetailsByMonth"],
        });
        showSuccessAlert("Xóa biên bản giám định phương tiện thành công");
      } else {
        showErrorAlert(
          res.message || "Xóa biên bản giám định phương tiện thất bại",
        );
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Xóa biên bản giám định phương tiện thất bại",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      return (
        await api.post(
          `/giamdinh-phuongtien/capnhattrangthai?id=${id}&userId=${userId}`,
        )
      ).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
        showSuccessAlert("Cập nhật trạng thái thành công");
      } else {
        showErrorAlert(res.message || "Cập nhật trạng thái thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.post(`/giamdinh-phuongtien/huy?id=${id}`)).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res.id || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
        showSuccessAlert("Hủy biên bản thành công");
      } else {
        showErrorAlert(res.message || "Hủy biên bản thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Hủy biên bản thất bại");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
    cancelMutation,
  };
};

// --- nghiệm thu máy móc ---

export const useMaintenanceAcceptanceTestPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "nghiemThuMayMocPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/nghiemthu-maymoc/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceAcceptanceByBienPhapQuery = (
  idBienPhap?: string,
) => {
  return useQuery({
    queryKey: ["nghiemThuMayMocByBienPhap", idBienPhap],
    queryFn: async () => {
      const res = await api.get(
        `/nghiemthu-maymoc/bienphap-maymoc/${idBienPhap}`,
      );
      return (res.data.data || res.data).map((item: any) =>
        AcceptanceTestAdapter(item),
      );
    },
    enabled: !!idBienPhap,
  });
};

export const useMaintenanceAcceptanceTestMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const { user } = useSelector((state: any) => state.user);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["nghiemThuMayMocPage"] });
    queryClient.invalidateQueries({ queryKey: ["nghiemThuMayMocByBienPhap"] });
    queryClient.invalidateQueries({
      queryKey: ["bienPhapMayMocByGiamDinh"],
    });
    queryClient.invalidateQueries({
      queryKey: ["incidentDetailByIncident"],
    });
    queryClient.invalidateQueries({
      queryKey: ["maintenancePlanningDetailsByMonth"],
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.post("/nghiemthu-maymoc", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();

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
        await api.put(`/nghiemthu-maymoc/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();
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
      return (await api.delete(`/nghiemthu-maymoc/${id}`)).data;
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
        await api.post(
          `/nghiemthu-maymoc/capnhattrangthai?id=${id}&userId=${userId}`,
        )
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
      return (await api.post(`/nghiemthu-maymoc/huy?id=${id}`)).data;
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
          `/nghiemthu-maymoc/batch`,
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
  };
};

// --- nghiệm thu phương tiện ---

export const useMaintenanceAcceptanceTestVehiclePageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "nghiemThuPhuongTienPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/nghiemthu-phuongtien/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceAcceptanceVehicleByBienPhapQuery = (
  idBienPhap?: string,
) => {
  return useQuery({
    queryKey: ["nghiemThuPhuongTienByBienPhap", idBienPhap],
    queryFn: async () => {
      const res = await api.get(
        `/nghiemthu-phuongtien/bienphap-phuongtien/${idBienPhap}`,
      );
      return (res.data.data || res.data).map((item: any) =>
        AcceptanceTestAdapter(item),
      );
    },
    enabled: !!idBienPhap,
  });
};

export const useMaintenanceAcceptanceTestVehicleMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const { user } = useSelector((state: any) => state.user);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["nghiemThuPhuongTienPage"] });
    queryClient.invalidateQueries({
      queryKey: ["nghiemThuPhuongTienByBienPhap"],
    });
    queryClient.invalidateQueries({
      queryKey: ["bienPhapPhuongTienByGiamDinh"],
    });
    queryClient.invalidateQueries({
      queryKey: ["incidentDetailByIncident"],
    });
    queryClient.invalidateQueries({
      queryKey: ["maintenancePlanningDetailsByMonth"],
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.post("/nghiemthu-phuongtien", {
          ...data,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: now,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();
      showSuccessAlert("Tạo biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Tạo biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return (
        await api.put(`/nghiemthu-phuongtien/${data.id}`, {
          ...data,
          ngayCapNhat: now,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
        })
      ).data;
    },
    onSuccess: async () => {
      invalidate();
      showSuccessAlert("Cập nhật biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Cập nhật biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/nghiemthu-phuongtien/${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Xóa biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Xóa biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      return (
        await api.post(
          `/nghiemthu-phuongtien/capnhattrangthai?id=${id}&userId=${userId}`,
        )
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
      return (await api.post(`/nghiemthu-phuongtien/huy?id=${id}`)).data;
    },
    onSuccess: () => {
      invalidate();
      showSuccessAlert("Hủy biên bản nghiệm thu phương tiện thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Hủy biên bản nghiệm thu phương tiện thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      return (
        await api.put(
          `/nghiemthu-phuongtien/batch`,
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
  };
};

// đánh giá vật tư thu hồi

export const useMaintenanceMaterialAssessmentPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "materialAssessmentPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      userid,
      isSign,
      dateFrom,
      dateTo,
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
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceMaterialAssessmentByInspectionQuery = (
  idNghiemThu?: string,
) => {
  return useQuery({
    queryKey: ["materialAssessmentByInspection", idNghiemThu],
    queryFn: async () => {
      const res = await api.get(`/danhgia-vattu/nghiemthu/${idNghiemThu}`);
      return (res.data.data || res.data || []).map((item: any) =>
        MaterialAssessmentAdapter(item),
      );
    },
    enabled: !!idNghiemThu,
  });
};
export const useMaintenanceMaterialAssessmentMutation = () => {
  const queryClient = useQueryClient();
  const now = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
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
      queryClient.invalidateQueries({
        queryKey: ["nghiemThuMayMocByBienPhap"],
      });
      queryClient.invalidateQueries({
        queryKey: ["nghiemThuPhuongTienByBienPhap"],
      });

      queryClient.invalidateQueries({
        queryKey: ["materialAssessmentByInspection"],
      });
      queryClient.invalidateQueries({
        queryKey: ["incidentDetailByIncident"],
      });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningDetailsByMonth"],
      });
      showSuccessAlert("Tạo biên bản đánh giá vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Tạo biên bản đánh giá vật tư thất bại",
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
      queryClient.invalidateQueries({
        queryKey: ["nghiemThuMayMocByBienPhap"],
      });
      queryClient.invalidateQueries({
        queryKey: ["nghiemThuPhuongTienByBienPhap"],
      });
      queryClient.invalidateQueries({
        queryKey: ["materialAssessmentByInspection"],
      });
      showSuccessAlert("Cập nhật biên bản đánh giá vật tư thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Cập nhật biên bản đánh giá vật tư thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/danhgia-vattu/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materialAssessmentPage"] });
      queryClient.invalidateQueries({
        queryKey: ["nghiemThuMayMocByBienPhap"],
      });
      queryClient.invalidateQueries({
        queryKey: ["nghiemThuPhuongTienByBienPhap"],
      });
      queryClient.invalidateQueries({
        queryKey: ["materialAssessmentByInspection"],
      });
      queryClient.invalidateQueries({
        queryKey: ["incidentDetailByIncident"],
      });
      queryClient.invalidateQueries({
        queryKey: ["maintenancePlanningDetailsByMonth"],
      });
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

// --- KIỂM TRA SỰ CỐ ---

export const useMaintenanceIncidentInspectionPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  idDonViGiao?: string,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "incidentInspectionPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      idDonViGiao,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/kiemtra-suco/page", {
        params: {
          page: page,
          pageSize: pageSize,
          idCongTy: CongTy.CT001,
          searchValue: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceIncidentInspectionBySuCoQuery = (
  idSuCo?: string,
) => {
  return useQuery({
    queryKey: ["incidentInspectionBySuCo", idSuCo],
    queryFn: async () => {
      const res = await api.get(`/kiemtra-suco/suco/${idSuCo}`);
      return (res.data.data || res.data || []).map((item: any) =>
        IncidentInspectionAdapter(item),
      );
    },
    enabled: !!idSuCo,
  });
};

export const useMaintenanceIncidentInspectionMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: any) => state.user);

  const createMutation = useMutation({
    mutationFn: async (data: IncidentInspectionData) => {
      return (
        await api.post("/kiemtra-suco", {
          ...data,
          idCongTy: CongTy.CT001,
          nguoiTao: user?.taiKhoan?.tenDangNhap,
          ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id) {
        const id = response?.id || response?.data?.id;
        if (id && variables.nguoiKyList && variables.nguoiKyList.length > 0) {
          await api.put(
            `/chuky/nguoi-ky/update/${id}`,
            variables.nguoiKyList.map((item) => ({
              ...item,
              idTaiLieu: id,
            })),
          );
        }
        queryClient.invalidateQueries({ queryKey: ["incidentInspectionPage"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["incidentDetailByIncident"],
        });
        showSuccessAlert("Tạo biên bản kiểm tra sự cố thành công");
      } else {
        showErrorAlert(
          response.message || "Tạo biên bản kiểm tra sự cố thất bại",
        );
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || "Tạo biên bản kiểm tra sự cố thất bại",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: IncidentInspectionData) => {
      return (
        await api.put(`/kiemtra-suco/${data.id}`, {
          ...data,
          nguoiCapNhat: user?.taiKhoan?.tenDangNhap,
          ngayCapNhat: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        })
      ).data;
    },
    onSuccess: async (response, variables) => {
      if (response.success || response.id) {
        const id = variables.id;
        if (id && variables.nguoiKyList && variables.nguoiKyList.length > 0) {
          await api.put(`/chuky/nguoi-ky/update/${id}`, variables.nguoiKyList);
        }
        queryClient.invalidateQueries({ queryKey: ["incidentInspectionPage"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        showSuccessAlert("Cập nhật biên bản kiểm tra sự cố thành công");
      } else {
        showErrorAlert(
          response.message || "Cập nhật biên bản kiểm tra sự cố thất bại",
        );
      }
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Cập nhật biên bản kiểm tra sự cố thất bại",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/kiemtra-suco/${id}`)).data;
    },
    onSuccess: (res: any) => {
      if (res.success || res > 0) {
        queryClient.invalidateQueries({ queryKey: ["incidentInspectionPage"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
        });
        showSuccessAlert("Xóa biên bản thành công");
      } else {
        showErrorAlert(res.message || "Xóa biên bản thất bại");
      }
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Xóa biên bản thất bại");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

export const useMaintenanceProcessPagedQuery = (
  page?: number,
  pageSize?: number,
  idTaiSan?: string,
  dateFrom?: string,
  dateTo?: string,
  nhomTaiSan?: string,
) => {
  return useQuery({
    queryKey: [
      "maintenanceProcessPaged",
      page,
      pageSize,
      idTaiSan,
      dateFrom,
      dateTo,
      nhomTaiSan,
    ],
    queryFn: async () => {
      const res = await api.get("/quy-trinh/paged", {
        params: {
          page: page,
          pageSize: pageSize,
          idTaiSan: idTaiSan,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useMaintenanceMaterialConsumptionQuery = (
  idTaiSan?: string,
  dateFrom?: string,
  dateTo?: string,
  nhomTaiSan?: string,
) => {
  return useQuery({
    queryKey: [
      "maintenanceMaterialConsumption",
      idTaiSan,
      dateFrom,
      dateTo,
      nhomTaiSan,
    ],
    queryFn: async () => {
      const res = await api.get("/quy-trinh/material-consumption", {
        params: {
          idTaiSan: idTaiSan,
          dateFrom: dateFrom,
          dateTo: dateTo,
          nhomTaiSan: nhomTaiSan,
        },
      });
      return res.data.data || res.data || [];
    },
    enabled: !!idTaiSan && !!nhomTaiSan,
  });
};

export const useGetTaiSanByIdQuery = (id: string | undefined, nam?: number) => {
  return useQuery({
    queryKey: ["taiSanById", id, nam],
    queryFn: async () => {
      const res = await api.get(`/taisan/${id}`, {
        params: { nam },
      });
      return res.data.data || res.data;
    },
    enabled: !!id,
  });
};

// biện pháp sửa chữa máy móc
export const useMaintenanceBienPhapMayMocPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "bienPhapMayMocPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/bienphap-maymoc/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

// biện pháp sửa chữa phương tiện
export const useMaintenanceBienPhapPhuongTienPageQuery = (
  page?: number,
  pageSize?: number,
  searchValue?: string,
  trangThai?: number,
  userid?: string,
  isSign?: boolean,
  dateFrom?: string,
  dateTo?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "bienPhapPhuongTienPage",
      page,
      pageSize,
      searchValue,
      trangThai,
      userid,
      isSign,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const res = await api.get("/bienphap-phuongtien/paged", {
        params: {
          page: page,
          size: pageSize,
          idCongTy: CongTy.CT001,
          search: searchValue,
          trangThai: trangThai,
          userid: userid,
          isSign: isSign,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      });
      return res.data.data || res.data;
    },
    placeholderData: (previousData) => previousData,
    enabled,
  });
};

export const useMaintenanceMutation = (
  key: string,
  apiUri: string,
  activeTab?: number,
) => {
  const queryClient = useQueryClient();

  // ky tai lieu
  const signMutation = useMutation({
    mutationFn: async ({
      SignaturesData,
      asset,
    }: {
      SignaturesData: SignaturesData[];
      asset: any;
    }) => {
      const res = await api.post("/chuky", SignaturesData);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      data.SignaturesData.forEach((item) => {
        signStatusMutation.mutate({
          idTaiLieu: item.idTaiLieu,
          userId: item.idNguoiKy,
        });
      });
      console.log("data", data.asset);
      const list = await listNguoiKy(
        Array.isArray(data.asset) ? data.asset : [data.asset],
      );
      socketService.send({
        type:
          activeTab === 0
            ? MessageTypeFunctions.PLAN
            : activeTab === 1
              ? MessageTypeFunctions.REPAIR
              : activeTab === 2
                ? MessageTypeFunctions.INSPECTION
                : activeTab === 3
                  ? MessageTypeFunctions.MEASURE
                  : activeTab === 4
                    ? MessageTypeFunctions.ACCEPTANCE_TEST
                    : activeTab === 5
                      ? MessageTypeFunctions.MATERIAL
                      : activeTab === 6
                        ? MessageTypeFunctions.INCIDENT
                        : activeTab === 7
                          ? MessageTypeFunctions.INCIDENT_INSPECTION
                          : "",
        recieve: list,
      });
      showSuccessAlert("Ký thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Ký thất bại",
      );
    },
  });

  // cap nhat trang thai ky
  // ky tai lieu
  const signStatusMutation = useMutation({
    mutationFn: async ({
      idTaiLieu,
      userId,
    }: {
      idTaiLieu: string;
      userId: string;
    }) => {
      const res = await api.post(
        `/${apiUri}/capnhattrangthai?id=${idTaiLieu}&userId=${userId}`,
      );
      return res.data;
    },
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: [key] });

      console.log("Cập nhật trạng thái ký thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật trạng thái ký thất bại",
      );
    },
  });

  const updateManyMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await api.put(`/${apiUri}/batch`, data);
      return res.data;
    },
    onSuccess: async (response, data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      const list = await listNguoiKy(data);
      socketService.send({
        type:
          activeTab === 0
            ? MessageTypeFunctions.PLAN
            : activeTab === 1
              ? MessageTypeFunctions.REPAIR
              : activeTab === 2
                ? MessageTypeFunctions.INSPECTION
                : activeTab === 3
                  ? MessageTypeFunctions.ACCEPTANCE_TEST
                  : activeTab === 4
                    ? MessageTypeFunctions.MATERIAL
                    : activeTab === 5
                      ? MessageTypeFunctions.INCIDENT
                      : activeTab === 6
                        ? MessageTypeFunctions.ACCEPTANCE_TEST
                        : "",
        recieve: list,
      });
      console.log("Trình duyệt thành công");
    },
    onError: (error: any) => {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Trình duyệt thất bại",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await api.post(`/${apiUri}/huy?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      showSuccessAlert("Từ chối biên bản thành công");
    },
    onError: (error: any) => {
      showErrorAlert(
        error.response?.data?.message || error.message || "Từ chối thất bại",
      );
    },
  });
  const saveNoteMutation = useMutation({
    mutationFn: async ({
      id,
      ghiChuBienBan,
    }: {
      id: string;
      ghiChuBienBan: string;
    }) => {
      const res = await api.patch(`/${apiUri}/${id}/ghi-chu`, { ghiChuBienBan });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (error: any) => {
      showErrorAlert(error.response?.data?.message || "Lưu ghi chú thất bại");
    },
  });
  return {
    signMutation,
    updateManyMutation,
    cancelMutation,
    saveNoteMutation,
  };
};
