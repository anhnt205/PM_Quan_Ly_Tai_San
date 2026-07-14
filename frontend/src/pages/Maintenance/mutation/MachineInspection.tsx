
// --- GIÁM ĐỊNH Máy Móc ---

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Action, CongTy } from "../../../utils/const";
import api from "../../../config/api.config";
import { InspectionAdapter } from "../Adapter";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { InspectionRecordData } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

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
  idTaiSan?: string,
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
      idTaiSan,
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
          idTaiSan: idTaiSan,
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
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
        queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
        queryClient.invalidateQueries({
          queryKey: ["incidentInspectionBySuCo"],
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
        queryClient.invalidateQueries({ queryKey: ["inspectionByRepair"] });
        queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
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
        queryClient.invalidateQueries({ queryKey: ["inspectionByBienBan"] });
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
