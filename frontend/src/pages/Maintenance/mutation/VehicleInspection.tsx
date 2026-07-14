// --- GIÁM ĐỊNH PHƯƠNG TIỆN ---

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/api.config";
import { CongTy } from "../../../utils/const";
import { InspectionAdapter } from "../Adapter";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { VehicleInspectionRecordData } from "../types";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";

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
  idTaiSan?: string,
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
      idTaiSan,
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
          idTaiSan: idTaiSan,
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

        queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
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
        queryClient.invalidateQueries({ queryKey: ["vehicleInspectionPage"] });
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
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
        queryClient.invalidateQueries({ queryKey: ["repairByPlan"] });
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
