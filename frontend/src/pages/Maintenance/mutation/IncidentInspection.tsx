// --- KIỂM TRA SỰ CỐ ---

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorAlert, showSuccessAlert } from "../../../components/Alert";
import api from "../../../config/api.config";
import { IncidentInspectionData } from "../types";
import { CongTy } from "../../../utils/const";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { IncidentInspectionAdapter } from "../Adapter";

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
        queryClient.invalidateQueries({ queryKey: ["incidentDetailByIncident"] });
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